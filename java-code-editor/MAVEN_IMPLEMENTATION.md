# Maven Support Implementation

## ✅ Completed

### Backend (100% Complete)
1. **Updated `backend/src/server.ts`**
   - Modified `/api/execute` endpoint to accept `projectType` and `pom` parameters
   - Routes Maven projects to Maven-specific execution

2. **Updated `backend/src/executor.ts`**
   - Added `executeInDockerMaven()` function for Maven project compilation and execution
   - Uses `maven:3.9-eclipse-temurin-17-alpine` Docker image
   - Supports custom dependencies via pom.xml
   - Handles Maven compilation errors and runtime errors
   - Executes with same security constraints (no network, memory limits, timeout)

3. **Docker Image**
   - Pulled `maven:3.9-eclipse-temurin-17-alpine` image successfully

### Frontend Templates (100% Complete)
1. **Updated `frontend/lib/templates.ts`**
   - Changed template structure from `string` to `Template` interface
   - Added `ProjectType` type: `'standard' | 'maven'`
   - Each template now has: `{ type, code, pom? }`
   - Added 2 Maven templates:
     - **Maven - Hello World**: Basic Maven project
     - **Maven - JSON Processing**: Uses Gson library for JSON parsing

### Frontend Component (Partially Complete - 60%)
1. **Updated `frontend/components/CodeEditor.tsx`**
   - Added state for `projectType`, `pom`, and `pomEditorRef`
   - Updated `loadTemplate()` to handle new template structure
   - Updated `executeCode()` to send `projectType` and `pom` to backend
   - ✅ Backend integration complete
   - ❌ UI not yet updated (see below)

## 🚧 Remaining Work

### Frontend UI Updates Needed

You need to add the following to `frontend/components/CodeEditor.tsx`:

1. **Project Type Selector** (add in header section around line 164)
```tsx
<div className="flex items-center gap-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Project Type:
  </label>
  <select
    value={projectType}
    onChange={(e) => setProjectType(e.target.value as ProjectType)}
    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="standard">Standard Java</option>
    <option value="maven">Maven Project</option>
  </select>
</div>
```

2. **pom.xml Editor Tab** (add alongside code editor around line 220)
```tsx
{projectType === 'maven' && (
  <div className="flex-1 flex flex-col">
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500">
        Main.java
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        pom.xml
      </button>
    </div>
    <Editor
      height="100%"
      language="xml"
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      value={pom}
      onChange={(value) => setPom(value || '')}
      onMount={(editor) => { pomEditorRef.current = editor; }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  </div>
)}
```

3. **Filter Templates by Project Type** (update template selector around line 167)
```tsx
<select
  value={selectedTemplate}
  onChange={(e) => loadTemplate(e.target.value)}
  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>
  {Object.entries(JAVA_TEMPLATES)
    .filter(([_, template]) => template.type === projectType)
    .map(([name]) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
</select>
```

## 🎯 How It Works

### Standard Java Projects
- User writes Java code in `Main.java`
- Backend compiles with `javac` and runs with `java`
- Uses `eclipse-temurin:17-jdk-alpine` image

### Maven Projects
1. User selects "Maven Project" from project type dropdown
2. User writes Java code with package declaration: `package com.example;`
3. User can edit `pom.xml` to add dependencies
4. Backend creates Maven project structure:
   ```
   /tmp/project/
   ├── pom.xml
   └── src/main/java/com/example/Main.java
   ```
5. Compiles with: `mvn -q compile`
6. Runs with: `mvn -q exec:java -Dexec.mainClass="com.example.Main"`

## 📦 Available Maven Templates

### 1. Maven - Hello World
Simple Maven project with no dependencies

### 2. Maven - JSON Processing
Demonstrates using external library (Gson) for JSON parsing
- Dependency: `com.google.code.gson:gson:2.10.1`
- Shows how to add and use Maven dependencies

## 🔧 Next Steps

1. Update the CodeEditor UI to add the project type selector
2. Add tabbed interface for Main.java and pom.xml editors (Maven only)
3. Rebuild frontend: `docker-compose up -d --build frontend`
4. Test Maven execution with both templates
5. Optionally add more Maven templates (Spring Boot, JUnit tests, etc.)

## 🚀 Testing

Once UI is complete, test with:
1. Select "Maven Project"
2. Choose "Maven - JSON Processing" template
3. Click "Compile & Run"
4. Should see JSON output with Gson formatting

Expected output:
```
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
```
