'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';
import QuestionsList from '@/components/QuestionsList';
import QuestionDetail from '@/components/QuestionDetail';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
  starterCode: string;
}

export default function EditorPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const language = params.lang as string;

  const [showQuestions, setShowQuestions] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [codeWithQuestion, setCodeWithQuestion] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    
    // Format question as comment and prepend to starter code
    const questionComment = formatQuestionAsComment(question, language);
    const codeWithComment = questionComment + '\n\n' + question.starterCode;
    setCodeWithQuestion(codeWithComment);
  };

  const formatQuestionAsComment = (question: Question, lang: string): string => {
    const commentStart = lang === 'python' ? '#' : lang === 'javascript' ? '//' : '//';
    const separator = commentStart + '='.repeat(70);
    
    const lines = [
      separator,
      `${commentStart}`,
      `${commentStart} PROBLEM: ${question.title}`,
      `${commentStart}`,
      separator,
      `${commentStart}`,
      `${commentStart} Difficulty: ${question.difficulty}`,
      `${commentStart} Category: ${question.category}`,
      `${commentStart} Tags: ${question.tags.join(', ')}`,
      `${commentStart}`,
      separator,
      `${commentStart}`,
      `${commentStart} DESCRIPTION:`,
      `${commentStart}`,
    ];
    
    // Split description into lines and wrap long lines for better readability
    const descriptionLines = question.description.split('\n');
    descriptionLines.forEach(line => {
      if (line.trim() === '') {
        lines.push(`${commentStart}`);
      } else {
        // Wrap long lines at 70 characters
        const words = line.trim().split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + ' ' + word).length > 68) {
            if (currentLine) {
              lines.push(`${commentStart} ${currentLine}`);
              currentLine = word;
            } else {
              lines.push(`${commentStart} ${word}`);
            }
          } else {
            currentLine = currentLine ? currentLine + ' ' + word : word;
          }
        });
        
        if (currentLine) {
          lines.push(`${commentStart} ${currentLine}`);
        }
      }
    });
    
    lines.push(`${commentStart}`);
    lines.push(separator);
    lines.push(`${commentStart}`);
    lines.push(`${commentStart} YOUR SOLUTION BELOW:`);
    lines.push(`${commentStart}`);
    lines.push(separator);
    
    return lines.join('\n');
  };

  const getLanguageDisplayName = (lang: string): string => {
    const names: Record<string, string> = {
      java: 'Java',
      python: 'Python',
      javascript: 'JavaScript',
    };
    return names[lang] || lang;
  };

  if (!isAuthenticated) {
    return null;
  }

  // Validate language
  if (!['java', 'python', 'javascript'].includes(language)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Language
          </h1>
          <button
            onClick={() => router.push('/language-select')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Back to Language Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/language-select')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{'</>'}</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {getLanguageDisplayName(language)} Editor
            </span>
          </div>
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="ml-4 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {showQuestions ? 'Hide' : 'Show'} Problems
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {selectedQuestion && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current: <span className="font-semibold text-gray-900 dark:text-white">{selectedQuestion.title}</span>
            </div>
          )}
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{user?.username}</span>
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Question Detail Panel */}
        {selectedQuestion && (
          <QuestionDetail
            question={selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
          />
        )}

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Questions Sidebar */}
          {showQuestions && (
            <div className="w-80 flex-shrink-0">
              <QuestionsList
                language={language}
                onQuestionSelect={handleQuestionSelect}
              />
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor 
              initialCode={codeWithQuestion}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
