// Feature flags configuration
export interface FeatureFlag {
 key: string
 name: string
 description: string
 enabled: boolean
 rolloutPercentage?: number // 0-100, for gradual rollout
 conditions?: {
 userId?: string[]
 orgId?: string[]
 environment?: string[]
 }
}

// Default feature flags
export const defaultFeatureFlags: FeatureFlag[] = [
 {
 key: 'advanced-ai-models',
 name: 'Расширенные AI модели',
 description: 'Доступ к премиум AI моделям с улучшенной производительностью',
 enabled: false,
 rolloutPercentage: 10, // Only 10% of users
 },
 {
 key: 'real-time-chat',
 name: 'Real-time чат',
 description: 'Мгновенные ответы без задержек',
 enabled: true,
 },
 {
 key: 'advanced-analytics',
 name: 'Расширенная аналитика',
 description: 'Детальные отчеты и метрики использования',
 enabled: false,
 rolloutPercentage: 25,
 },
 {
 key: 'bulk-operations',
 name: 'Массовые операции',
 description: 'Импорт/экспорт данных в bulk',
 enabled: true,
 },
 {
 key: 'api-rate-limits',
 name: 'API Rate Limits',
 description: 'Расширенные лимиты для API запросов',
 enabled: false,
 conditions: {
 orgId: ['premium-org-1', 'premium-org-2'], // Only for specific orgs
 },
 },
 {
 key: 'beta-features',
 name: 'Бета функции',
 description: 'Экспериментальные функции для тестирования',
 enabled: false,
 conditions: {
 environment: ['development', 'staging'],
 },
 },
]

// Feature flags store (in production, this would come from database/config service)
let featureFlags = [...defaultFeatureFlags]

// Feature flags management
export class FeatureFlagsManager {
 private static instance: FeatureFlagsManager
 private flags: Map<string, FeatureFlag> = new Map()

 private constructor() {
 this.loadFlags()
 }

 static getInstance(): FeatureFlagsManager {
 if (!FeatureFlagsManager.instance) {
 FeatureFlagsManager.instance = new FeatureFlagsManager()
 }
 return FeatureFlagsManager.instance
 }

 private loadFlags() {
 featureFlags.forEach(flag => {
 this.flags.set(flag.key, flag)
 })
 }

 // Check if feature is enabled for user/context
 isEnabled(
 flagKey: string,
 context: {
 userId?: string
 orgId?: string
 environment?: string
 } = {}
 ): boolean {
 const flag = this.flags.get(flagKey)
 if (!flag) return false

 // Check basic enabled flag
 if (!flag.enabled) return false

 // Check rollout percentage
 if (flag.rolloutPercentage !== undefined) {
 if (!context.userId) return false

 // Simple hash-based rollout (deterministic based on userId)
 const hash = this.simpleHash(context.userId)
 const percentage = (hash % 100 + 100) % 100 // Ensure positive

 if (percentage >= flag.rolloutPercentage) {
 return false
 }
 }

 // Check conditions
 if (flag.conditions) {
 // Check environment
 if (flag.conditions.environment && context.environment) {
 if (!flag.conditions.environment.includes(context.environment)) {
 return false
 }
 }

 // Check orgId
 if (flag.conditions.orgId && context.orgId) {
 if (!flag.conditions.orgId.includes(context.orgId)) {
 return false
 }
 }

 // Check userId
 if (flag.conditions.userId && context.userId) {
 if (!flag.conditions.userId.includes(context.userId)) {
 return false
 }
 }
 }

 return true
 }

 // Get all flags
 getAllFlags(): FeatureFlag[] {
 return Array.from(this.flags.values())
 }

 // Get flag by key
 getFlag(key: string): FeatureFlag | undefined {
 return this.flags.get(key)
 }

 // Update flag (admin functionality)
 updateFlag(key: string, updates: Partial<FeatureFlag>): boolean {
 const flag = this.flags.get(key)
 if (!flag) return false

 this.flags.set(key, { ...flag, ...updates })
 return true
 }

 // Enable/disable flag
 setEnabled(key: string, enabled: boolean): boolean {
 return this.updateFlag(key, { enabled })
 }

 // Simple hash function for rollout percentage
 private simpleHash(str: string): number {
 let hash = 0
 for (let i = 0; i < str.length; i++) {
 const char = str.charCodeAt(i)
 hash = ((hash << 5) - hash) + char
 hash = hash & hash // Convert to 32-bit integer
 }
 return hash
 }

 // Add new flag
 addFlag(flag: FeatureFlag): boolean {
 if (this.flags.has(flag.key)) return false
 this.flags.set(flag.key, flag)
 return true
 }

 // Remove flag
 removeFlag(key: string): boolean {
 return this.flags.delete(key)
 }
}

// Global instance
export const featureFlagsManager = FeatureFlagsManager.getInstance()

// Convenience functions
export const isFeatureEnabled = (
 flagKey: string,
 context?: { userId?: string; orgId?: string; environment?: string }
): boolean => {
 return featureFlagsManager.isEnabled(flagKey, context)
}

// React hook for feature flags
export const useFeatureFlag = (
 flagKey: string,
 context?: { userId?: string; orgId?: string; environment?: string }
): boolean => {
 // In a real app, this would use useState/useEffect to subscribe to flag changes
 return featureFlagsManager.isEnabled(flagKey, context)
}

// Higher-order component for feature flags
export const withFeatureFlag = <P extends object>(
 flagKey: string,
 FallbackComponent?: React.ComponentType<P>
) => {
 return (WrappedComponent: React.ComponentType<P>) => {
 const FeatureFlaggedComponent = (props: P & { userId?: string; orgId?: string; environment?: string }) => {
 const { userId, orgId, environment, ...restProps } = props

 const enabled = featureFlagsManager.isEnabled(flagKey, {
 userId,
 orgId,
 environment: environment || process.env.NODE_ENV,
 })

 if (!enabled) {
 return FallbackComponent ? <FallbackComponent {...(restProps as P)} /> : null
 }

 return <WrappedComponent {...(restProps as P)} />
 }

 FeatureFlaggedComponent.displayName = `withFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name || 'Component'}, ${flagKey})`

 return FeatureFlaggedComponent
 }
}

// Admin functions (should be protected by authentication)
export const getAllFeatureFlags = () => featureFlagsManager.getAllFlags()
export const updateFeatureFlag = (key: string, updates: Partial<FeatureFlag>) =>
 featureFlagsManager.updateFlag(key, updates)
export const enableFeatureFlag = (key: string) => featureFlagsManager.setEnabled(key, true)
export const disableFeatureFlag = (key: string) => featureFlagsManager.setEnabled(key, false)

// Feature flag constants (for type safety)
export const FEATURE_FLAGS = {
 ADVANCED_AI_MODELS: 'advanced-ai-models',
 REAL_TIME_CHAT: 'real-time-chat',
 ADVANCED_ANALYTICS: 'advanced-analytics',
 BULK_OPERATIONS: 'bulk-operations',
 API_RATE_LIMITS: 'api-rate-limits',
 BETA_FEATURES: 'beta-features',
} as const
