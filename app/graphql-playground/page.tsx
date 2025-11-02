'use client'

import { useEffect, useState } from 'react'
import { KwidButton, KwidTextarea, KwidTabs, KwidTabsContent } from '@/components/kwid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Badge } from '@/components/ui/shadcn/badge'
import { Loader2, Play, Code, FileText } from 'lucide-react'

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function GraphQLPlayground() {
  const [query, setQuery] = useState(`# Welcome to GraphQL Playground
# Try some queries:

query GetMyProfile {
  me {
    id
    email
    name
    tier
    subscription {
      status
      currentPeriodEnd
    }
  }
}

query GetAgents {
  agents(limit: 5) {
    id
    name
    description
    status
    model
  }
}

query GetKnowledgeBase {
  knowledgeCategories {
    id
    name
    description
  }
  knowledgeArticles(limit: 3) {
    id
    title
    category {
      name
    }
    isPublished
  }
}

query GetAnalytics {
  analytics(dateRange: {
    start: "2024-01-01T00:00:00Z"
    end: "2024-12-31T23:59:59Z"
  }) {
    totalRequests
    totalTokens
    activeAgents
    responseTime
    userEngagement
  }
}`)

  const [variables, setVariables] = useState('{}')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const executeQuery = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: JSON.parse(variables),
        }),
      })

      const data = await response.json()

      if (data.errors) {
        setError(JSON.stringify(data.errors, null, 2))
        setResult('')
      } else {
        setResult(JSON.stringify(data.data, null, 2))
        setError('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = {
    profile: `query GetMyProfile {
  me {
    id
    email
    name
    tier
    subscription {
      status
      currentPeriodEnd
    }
  }
}`,
    agents: `query GetAgents {
  agents(limit: 10) {
    id
    name
    description
    status
    model
    createdAt
  }
}`,
    knowledge: `query GetKnowledgeBase {
  knowledgeCategories {
    id
    name
    description
  }
  knowledgeArticles(limit: 5) {
    id
    title
    content
    category {
      name
    }
    isPublished
    createdAt
  }
}`,
    jobs: `query GetJobs {
  jobs(limit: 10) {
    id
    type
    status
    progress {
      current
      total
      message
    }
    result
    error
    duration
    createdAt
  }
}`,
    analytics: `query GetAnalytics {
  analytics(dateRange: {
    start: "2024-01-01T00:00:00Z"
    end: "2024-12-31T23:59:59Z"
  }) {
    totalRequests
    totalTokens
    activeAgents
    responseTime
    userEngagement
  }
}`,
    createAgent: `mutation CreateAgent {
  createAgent(input: {
    name: "Test Agent"
    description: "A test agent created via GraphQL"
    model: "gpt-4"
  }) {
    id
    name
    description
    status
    createdAt
  }
}`,
    createArticle: `mutation CreateArticle {
  createKnowledgeArticle(input: {
    title: "Test Article"
    content: "This is a test article created via GraphQL API"
    categoryId: "getting-started"
    isPublished: false
  }) {
    id
    title
    content
    isPublished
    createdAt
  }
}`,
  }

  const loadSampleQuery = (key: string) => {
    setQuery(sampleQueries[key as keyof typeof sampleQueries])
    setVariables('{}')
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">GraphQL Playground</h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Test and explore the GraphQL API for GPT Agent Platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sample Queries Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample Queries</CardTitle>
              <CardDescription>
                Click to load predefined queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <KwidButton
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleQuery('profile')}
                  className="justify-start gap-2"
                >
                  <FileText className="w-4 h-4" />
                  My Profile
                </KwidButton>
                <KwidButton
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleQuery('agents')}
                  className="justify-start gap-2"
                >
                  <Code className="w-4 h-4" />
                  Agents
                </KwidButton>
                <KwidButton
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleQuery('knowledge')}
                  className="justify-start gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Knowledge Base
                </KwidButton>
                <KwidButton
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleQuery('jobs')}
                  className="justify-start gap-2"
                >
                  <Code className="w-4 h-4" />
                  Background Jobs
                </KwidButton>
                <KwidButton
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleQuery('analytics')}
                  className="justify-start gap-2"
                >
                  <Code className="w-4 h-4" />
                  Analytics
                </KwidButton>
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2 dark:text-gray-400">Mutations:</p>
                  <KwidButton
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleQuery('createAgent')}
                    className="justify-start w-full"
                  >
                    Create Agent
                  </KwidButton>
                  <KwidButton
                    variant="outline"
                    size="sm"
                    onClick={() => loadSampleQuery('createArticle')}
                    className="justify-start w-full mt-1"
                  >
                    Create Article
                  </KwidButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Query Interface */}
        <div className="lg:col-span-3 space-y-6">
          <KwidTabs defaultValue="query" className="w-full" tabs={[
            { value: 'query', label: 'Query' },
            { value: 'variables', label: 'Variables' },
            { value: 'result', label: 'Result' },
          ]}>
            <KwidTabsContent value="query" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>GraphQL Query</CardTitle>
                    <KwidButton onClick={executeQuery} disabled={loading} variant="primary" className="gap-2">
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Execute
                    </KwidButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <KwidTextarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your GraphQL query here..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </KwidTabsContent>

            <KwidTabsContent value="variables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Query Variables (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <KwidTextarea
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                    placeholder='{}'
                    className="min-h-[200px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </KwidTabsContent>

            <KwidTabsContent value="result" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Query Result</CardTitle>
                    {result && (
                      <Badge variant="secondary">
                        Success
                      </Badge>
                    )}
                    {error && (
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                      <pre className="text-red-800 dark:text-red-200 text-sm whitespace-pre-wrap">
                        {error}
                      </pre>
                    </div>
                  )}
                  {result && (
                    <KwidTextarea
                      value={result}
                      readOnly
                      className="min-h-[300px] font-mono text-sm bg-green-50 dark:bg-green-900/20"
                    />
                  )}
                  {!result && !error && (
                    <div className="text-center text-muted-foreground py-8 dark:text-gray-400">
                      Execute a query to see results here
                    </div>
                  )}
                </CardContent>
              </Card>
            </KwidTabsContent>
          </KwidTabs>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Available at <code className="bg-muted px-1 py-0.5 rounded text-sm">/api/graphql</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-muted-foreground">
                    All requests require authentication. The API uses your current session.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rate Limiting</h4>
                  <p className="text-muted-foreground">
                    API requests are rate limited based on your subscription tier.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Supported Operations</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Query users, agents, knowledge base, jobs, analytics</li>
                    <li>• Create, update, delete agents and knowledge content</li>
                    <li>• Submit background jobs for processing</li>
                    <li>• Upload files with metadata</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
