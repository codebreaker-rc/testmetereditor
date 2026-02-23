'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const languages = [
  {
    id: 'java',
    name: 'Java',
    icon: 'J',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    description: 'Object-oriented programming with Maven support',
    features: ['Maven Projects', 'JUnit Testing', '@Test Annotations'],
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'Py',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: 'Simple, powerful, and versatile scripting',
    features: ['Easy Syntax', 'Data Processing', 'Algorithms'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Dynamic web programming language',
    features: ['ES6+ Features', 'Async/Await', 'DOM Manipulation'],
  },
];

export default function LanguageSelectPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLanguageSelect = (languageId: string) => {
    router.push(`/editor/${languageId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{'</>'}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CodeEditor</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, <span className="font-semibold">{user?.username}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Language
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Select a programming language to start coding
            </p>
          </div>

          {/* Language Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left group"
              >
                <div className={`w-20 h-20 ${lang.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className={`text-4xl font-bold ${lang.textColor}`}>
                    {lang.icon}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {lang.name}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {lang.description}
                </p>

                <div className="space-y-2">
                  {lang.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className={`mt-6 inline-flex items-center text-sm font-semibold bg-gradient-to-r ${lang.color} bg-clip-text text-transparent`}>
                  Start Coding
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">6+</div>
              <div className="text-gray-600 dark:text-gray-400">Practice Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">3</div>
              <div className="text-gray-600 dark:text-gray-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
