import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
  }

  type Question {
    id: ID!
    title: String!
    description: String!
    difficulty: Difficulty!
    language: Language!
    category: String!
    tags: [String!]!
    starterCode: String!
    testCases: [TestCase!]!
    createdAt: String!
  }

  type TestCase {
    id: ID!
    input: String!
    output: String!
    isHidden: Boolean!
  }

  type Submission {
    id: ID!
    user: User!
    question: Question!
    code: String!
    language: Language!
    status: SubmissionStatus!
    executionTime: Int
    memoryUsage: Int
    output: String
    error: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum Language {
    JAVA
    PYTHON
    JAVASCRIPT
  }

  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }

  enum SubmissionStatus {
    PENDING
    RUNNING
    ACCEPTED
    WRONG_ANSWER
    COMPILATION_ERROR
    RUNTIME_ERROR
    TIME_LIMIT_EXCEEDED
  }

  type Query {
    # Auth
    me: User

    # Questions
    questions(language: Language, difficulty: Difficulty, category: String): [Question!]!
    question(id: ID!): Question
    
    # Submissions
    mySubmissions(questionId: ID): [Submission!]!
    submission(id: ID!): Submission
  }

  type Mutation {
    # Auth
    register(email: String!, username: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Submissions
    submitCode(
      questionId: ID!
      code: String!
      language: Language!
    ): Submission!
  }
`;
