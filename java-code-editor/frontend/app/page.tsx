'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/language-select');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{'</>'}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CodeEditor</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Code, Compile, and Learn
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Anywhere, Anytime
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            A powerful online code editor supporting Java, Python, and JavaScript.
            Practice coding problems, test your solutions, and improve your skills.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Start Coding Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multi-Language Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Write and execute code in Java, Python, and JavaScript with full Maven support for Java projects.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Practice Problems</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access a curated collection of coding problems with varying difficulty levels to sharpen your skills.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure Execution</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your code runs in isolated Docker containers with resource limits for safe and secure execution.
            </p>
          </div>
        </div>

        {/* Languages */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Supported Languages
          </h2>
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">J</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Java</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Py</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Python</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">JS</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">JavaScript</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
