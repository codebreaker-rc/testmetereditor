'use client';

import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';

const QUESTIONS_QUERY = gql`
  query Questions($language: Language, $difficulty: Difficulty) {
    questions(language: $language, difficulty: $difficulty) {
      id
      title
      description
      difficulty
      category
      tags
      starterCode
    }
  }
`;

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
  starterCode: string;
}

interface QuestionsListProps {
  language: string;
  onQuestionSelect: (question: Question) => void;
}

export default function QuestionsList({ language, onQuestionSelect }: QuestionsListProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const { data, loading, error } = useQuery(QUESTIONS_QUERY, {
    variables: {
      language: language.toUpperCase(),
      difficulty: selectedDifficulty,
    },
  });

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question.id);
    onQuestionSelect(question);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'MEDIUM':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'HARD':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="text-red-600 dark:text-red-400">
          <p className="font-semibold mb-2">Error loading questions</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const questions: Question[] = data?.questions || [];

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Problems
        </h2>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDifficulty(null)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedDifficulty === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedDifficulty('EASY')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedDifficulty === 'EASY'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setSelectedDifficulty('MEDIUM')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedDifficulty === 'MEDIUM'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSelectedDifficulty('HARD')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedDifficulty === 'HARD'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Hard
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto">
        {questions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No questions available for {language}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  selectedQuestion === question.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {question.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                      question.difficulty
                    )}`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {question.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {question.category}
                  </span>
                  {question.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {questions.length} problem{questions.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
}
