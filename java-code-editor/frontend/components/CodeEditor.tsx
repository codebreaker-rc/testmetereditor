'use client';

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from './ThemeProvider';
import { 
  Play, 
  Download, 
  Copy, 
  Sun, 
  Moon, 
  Trash2,
  Clock,
  MemoryStick,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { JAVA_TEMPLATES, ProjectType } from '@/lib/templates';

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  compilationError?: string;
  executionTime?: number;
  memoryUsage?: number;
  timestamp: string;
}

export default function CodeEditor() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(JAVA_TEMPLATES['Hello World'].code);
  const [pom, setPom] = useState(JAVA_TEMPLATES['Hello World'].pom || '');
  const [projectType, setProjectType] = useState<ProjectType>('standard');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('Hello World');
  const [activeTab, setActiveTab] = useState<'code' | 'pom'>('code');
  const editorRef = useRef<any>(null);
  const pomEditorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const executeCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setOutput('Compiling and executing...\n');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          input,
          projectType,
          pom: projectType === 'maven' ? pom : undefined,
        }),
      });

      const result = await response.json();

      const executionResult: ExecutionResult = {
        success: result.success,
        output: result.output,
        error: result.error,
        compilationError: result.compilationError,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        timestamp: new Date().toISOString(),
      };

      setExecutionHistory(prev => [executionResult, ...prev.slice(0, 9)]);

      if (result.success) {
        let outputText = '=== Execution Successful ===\n\n';
        outputText += `Output:\n${result.output || '(no output)'}\n\n`;
        outputText += `⏱️  Execution Time: ${result.executionTime}ms\n`;
        outputText += `💾 Memory Usage: ${result.memoryUsage}KB\n`;
        setOutput(outputText);
        toast.success('Code executed successfully!');
      } else {
        let errorText = '=== Execution Failed ===\n\n';
        if (result.compilationError) {
          errorText += `Compilation Error:\n${result.compilationError}\n`;
        }
        if (result.error) {
          errorText += `Runtime Error:\n${result.error}\n`;
        }
        setOutput(errorText);
        toast.error('Execution failed. Check console for details.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`=== Network Error ===\n\n${errorMessage}\n\nMake sure the backend server is running.`);
      toast.error('Failed to connect to execution server');
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = JAVA_TEMPLATES[templateName as keyof typeof JAVA_TEMPLATES];
    setCode(template.code);
    setPom(template.pom || '');
    setProjectType(template.type);
    setOutput('');
    toast.success(`Loaded template: ${templateName}`);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Output copied to clipboard!');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Main.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const clearOutput = () => {
    setOutput('');
    toast.success('Output cleared');
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted!');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Java Code Editor & Compiler
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Secure, containerized Java execution environment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Type:
              </label>
              <select
                value={projectType}
                onChange={(e) => {
                  const newType = e.target.value as ProjectType;
                  setProjectType(newType);
                  const firstTemplate = Object.entries(JAVA_TEMPLATES).find(([_, t]) => t.type === newType)?.[0];
                  if (firstTemplate) loadTemplate(firstTemplate);
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard Java</option>
                <option value="maven">Maven Project</option>
              </select>
            </div>
            <select
              value={selectedTemplate}
              onChange={(e) => loadTemplate(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(JAVA_TEMPLATES)
                .filter(([_, template]) => template.type === projectType)
                .map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
          {/* Tab Header for Maven Projects */}
          {projectType === 'maven' && (
            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Main.java
              </button>
              <button
                onClick={() => setActiveTab('pom')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pom'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                pom.xml
              </button>
            </div>
          )}
          
          {/* Editor Header - Only show for standard Java or when code tab is active */}
          {(projectType === 'standard' || activeTab === 'code') && (
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {projectType === 'maven' ? 'src/main/java/com/example/Main.java' : 'Main.java'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={formatCode}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Format
                </button>
                <button
                  onClick={downloadCode}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Download code"
                >
                  <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          )}
          
          {/* pom.xml Header - Only show when pom tab is active */}
          {projectType === 'maven' && activeTab === 'pom' && (
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                pom.xml
              </span>
            </div>
          )}
          
          {/* Code Editor */}
          {(projectType === 'standard' || activeTab === 'code') && (
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>
          )}
          
          {/* pom.xml Editor */}
          {projectType === 'maven' && activeTab === 'pom' && (
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="xml"
                value={pom}
                onChange={(value) => setPom(value || '')}
                onMount={(editor) => { pomEditorRef.current = editor; }}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>
          )}
        </div>

        {/* Right Panel - Input & Output */}
        <div className="w-[500px] flex flex-col bg-white dark:bg-gray-800">
          {/* Input Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Input (STDIN)
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program..."
              className="w-full h-32 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Control Buttons */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-2">
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Compile & Run
                </>
              )}
            </button>
            <button
              onClick={clearOutput}
              className="p-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              title="Clear output"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Console Output
              </span>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy output"
              >
                <Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm">
              <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
            </div>
          </div>

          {/* Execution History */}
          {executionHistory.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Execution History
                </span>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {executionHistory.map((exec, idx) => (
                  <div key={idx} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exec.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(exec.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {exec.success && (
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exec.executionTime}ms
                          </span>
                          <span className="flex items-center gap-1">
                            <MemoryStick className="w-3 h-3" />
                            {exec.memoryUsage}KB
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
