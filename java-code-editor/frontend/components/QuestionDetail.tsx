'use client';

import { useState } from 'react';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
}

interface QuestionDetailProps {
  question: Question | null;
  onClose: () => void;
}

export default function QuestionDetail({ question, onClose }: QuestionDetailProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!question) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'HARD':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Current Problem
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 max-h-64 overflow-y-auto">
          {/* Title and Difficulty */}
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
              {question.title}
            </h4>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {question.category}
            </span>
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {question.description}
            </div>
          </div>

          {/* Hint */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 Tip:</strong> The complete problem statement is also available as comments at the top of your code editor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
