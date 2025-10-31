import { gql } from 'graphql-tag'

// GraphQL Schema Definition
export const typeDefs = gql`
  # User types
  type User {
    id: ID!
    email: String!
    name: String
    image: String
    tier: UserTier!
    subscription: Subscription
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Subscription {
    id: ID!
    planId: ID!
    status: SubscriptionStatus!
    currentPeriodStart: DateTime!
    currentPeriodEnd: DateTime!
    cancelAtPeriodEnd: Boolean!
    stripeSubscriptionId: String
  }

  enum UserTier {
    FREE
    PREMIUM
    VIP
  }

  enum SubscriptionStatus {
    ACTIVE
    CANCELED
    PAST_DUE
    INCOMPLETE
  }

  # Agent types
  type Agent {
    id: ID!
    name: String!
    description: String
    model: String!
    status: AgentStatus!
    organizationId: String
    settings: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum AgentStatus {
    ACTIVE
    INACTIVE
    TRAINING
    ERROR
  }

  # Knowledge Base types
  type KnowledgeCategory {
    id: ID!
    name: String!
    description: String
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type KnowledgeArticle {
    id: ID!
    title: String!
    content: String!
    categoryId: ID!
    category: KnowledgeCategory
    isPublished: Boolean!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Job types
  type Job {
    id: ID!
    type: String!
    status: JobStatus!
    progress: JobProgress
    result: JSON
    error: String
    duration: Int
    createdAt: DateTime!
    startedAt: DateTime
    completedAt: DateTime
    failedAt: DateTime
  }

  type JobProgress {
    current: Int!
    total: Int!
    message: String!
  }

  enum JobStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  # Analytics types
  type AnalyticsData {
    totalRequests: Int!
    totalTokens: Int!
    activeAgents: Int!
    responseTime: Float!
    userEngagement: Float!
  }

  # Common types
  scalar DateTime
  scalar JSON
  scalar Upload

  # Input types
  input CreateAgentInput {
    name: String!
    description: String
    model: String!
    settings: JSON
  }

  input UpdateAgentInput {
    name: String
    description: String
    model: String
    status: AgentStatus
    settings: JSON
  }

  input CreateKnowledgeCategoryInput {
    name: String!
    description: String
    sortOrder: Int
  }

  input CreateKnowledgeArticleInput {
    title: String!
    content: String!
    categoryId: ID!
    isPublished: Boolean
    sortOrder: Int
  }

  input UpdateKnowledgeArticleInput {
    title: String
    content: String
    categoryId: ID
    isPublished: Boolean
    sortOrder: Int
  }

  input JobInput {
    type: String!
    payload: JSON!
  }

  # Queries
  type Query {
    # User queries
    me: User!
    users(limit: Int = 50, offset: Int = 0): [User!]!
    user(id: ID!): User

    # Agent queries
    agents(limit: Int = 50, offset: Int = 0): [Agent!]!
    agent(id: ID!): Agent

    # Knowledge base queries
    knowledgeCategories: [KnowledgeCategory!]!
    knowledgeArticles(categoryId: ID, limit: Int = 50, offset: Int = 0): [KnowledgeArticle!]!
    knowledgeArticle(id: ID!): KnowledgeArticle

    # Job queries
    jobs(limit: Int = 20, offset: Int = 0): [Job!]!
    job(id: ID!): Job

    # Analytics queries
    analytics(dateRange: DateRangeInput): AnalyticsData!

    # Health check
    health: String!
  }

  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  # Mutations
  type Mutation {
    # Agent mutations
    createAgent(input: CreateAgentInput!): Agent!
    updateAgent(id: ID!, input: UpdateAgentInput!): Agent!
    deleteAgent(id: ID!): Boolean!

    # Knowledge base mutations
    createKnowledgeCategory(input: CreateKnowledgeCategoryInput!): KnowledgeCategory!
    updateKnowledgeCategory(id: ID!, input: CreateKnowledgeCategoryInput!): KnowledgeCategory!
    deleteKnowledgeCategory(id: ID!): Boolean!

    createKnowledgeArticle(input: CreateKnowledgeArticleInput!): KnowledgeArticle!
    updateKnowledgeArticle(id: ID!, input: UpdateKnowledgeArticleInput!): KnowledgeArticle!
    deleteKnowledgeArticle(id: ID!): Boolean!

    # Job mutations
    createJob(input: JobInput!): Job!

    # File upload
    uploadFile(file: Upload!, category: String): String!
  }

  # Subscriptions (for real-time updates)
  type Subscription {
    jobUpdated(jobId: ID!): Job!
    agentStatusChanged(agentId: ID!): Agent!
  }
`
