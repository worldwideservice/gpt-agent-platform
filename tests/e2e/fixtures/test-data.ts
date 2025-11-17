/**
 * Test Data Fixtures
 * Reusable test data for E2E tests
 */

export const testUsers = {
  admin: {
    email: 'admin@test.local',
    password: 'TestPassword123!',
    name: 'Test Admin',
    role: 'admin',
  },
  user: {
    email: 'user@test.local',
    password: 'TestPassword123!',
    name: 'Test User',
    role: 'user',
  },
  agent: {
    email: 'agent@test.local',
    password: 'TestPassword123!',
    name: 'Test Agent User',
    role: 'user',
  },
}

export const testOrganization = {
  name: 'Test Organization',
  slug: 'test-org',
  domain: 'test.local',
}

export const testAgent = {
  name: 'Test AI Agent',
  description: 'AI agent for testing purposes',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: 'You are a helpful AI assistant for testing.',
  status: 'active',
}

export const testDocument = {
  title: 'Test Document',
  description: 'Document for testing knowledge base',
  category: 'test',
  tags: ['test', 'e2e'],
  content: 'This is a test document for E2E testing. It contains sample content.',
}

export const testExperiment = {
  name: 'Test A/B Experiment',
  description: 'Testing GPT-4 vs GPT-3.5',
  hypothesis: 'GPT-4 will have higher conversion rate',
  trafficPercentage: 50,
  controlVariant: {
    name: 'Control',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  },
  testVariant: {
    name: 'Test',
    model: 'gpt-4-turbo',
    temperature: 0.7,
  },
  primaryMetric: 'conversion_rate',
}

export const apiEndpoints = {
  auth: {
    login: '/api/auth/signin',
    logout: '/api/auth/signout',
    register: '/api/auth/signup',
  },
  agents: {
    list: '/api/agents',
    create: '/api/agents',
    get: (id: string) => `/api/agents/${id}`,
    update: (id: string) => `/api/agents/${id}`,
    delete: (id: string) => `/api/agents/${id}`,
  },
  documents: {
    list: '/api/documents',
    upload: '/api/documents/upload',
    search: '/api/documents/search',
    get: (id: string) => `/api/documents/${id}`,
    delete: (id: string) => `/api/documents/${id}`,
  },
  experiments: {
    list: '/api/experiments',
    create: '/api/experiments',
    get: (id: string) => `/api/experiments/${id}`,
    assign: (id: string) => `/api/experiments/${id}/assign`,
    track: (id: string) => `/api/experiments/${id}/track`,
  },
  analytics: {
    dashboard: '/api/analytics/dashboard',
    timeseries: '/api/analytics/timeseries',
    export: '/api/analytics/export',
  },
}

export const testMessages = {
  welcome: 'Welcome to GPT Agent Platform',
  loginSuccess: 'Successfully logged in',
  logoutSuccess: 'Successfully logged out',
  agentCreated: 'Agent created successfully',
  agentUpdated: 'Agent updated successfully',
  agentDeleted: 'Agent deleted successfully',
  documentUploaded: 'Document uploaded successfully',
  experimentCreated: 'Experiment created successfully',
  errorGeneric: 'Something went wrong',
  errorUnauthorized: 'Unauthorized',
  errorNotFound: 'Not found',
}

/**
 * Generate random test data
 */
export function generateRandomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.local`
}

export function generateRandomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, length + 2)
}

export function generateRandomAgent() {
  return {
    ...testAgent,
    name: `Test Agent ${generateRandomString(5)}`,
  }
}

export function generateRandomDocument() {
  return {
    ...testDocument,
    title: `Test Document ${generateRandomString(5)}`,
  }
}
