import { logger } from '@/lib/utils/logger'

// Analytics utility for tracking events and metrics

interface AnalyticsEvent {
 event: string
 category?: string
 action?: string
 label?: string
 value?: number
 userId?: string
 sessionId?: string
}

class Analytics {
 private sessionId: string
 private userId?: string

 constructor() {
 // Generate session ID
 this.sessionId = this.generateSessionId()

 // Try to get user ID from localStorage or generate anonymous ID
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      this.userId = window.localStorage.getItem('user_id') || this.generateAnonymousId()
      window.localStorage.setItem('user_id', this.userId)
    }
 }

 private generateSessionId(): string {
 return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
 }

 private generateAnonymousId(): string {
 return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
 }

 setUserId(userId: string) {
 this.userId = userId
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem('user_id', userId)
    }
  }

 async track(event: AnalyticsEvent) {
 try {
 const payload = {
 ...event,
 userId: this.userId,
 sessionId: this.sessionId,
 timestamp: Date.now(),
 }

 const response = await fetch('/api/analytics', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify(payload),
 })

 if (!response.ok) {
 logger.error('Failed to track analytics event:', response.statusText)
 }
 } catch (error) {
 logger.error('Analytics tracking error:', error)
 }
 }

 // Convenience methods for common events
 trackPageView(page: string) {
 this.track({
 event: 'page_view',
 category: 'navigation',
 action: 'view',
 label: page,
 })
 }

 trackUserAction(action: string, label?: string, value?: number) {
 this.track({
 event: 'user_action',
 category: 'interaction',
 action,
 label,
 value,
 })
 }

 trackError(error: string, context?: string) {
 this.track({
 event: 'error',
 category: 'error',
 action: 'occurred',
 label: error,
 value: 1, // Count as 1 occurrence
 })
 }

 trackPerformance(metric: string, value: number) {
 this.track({
 event: 'performance',
 category: 'web_vitals',
 action: 'measure',
 label: metric,
 value,
 })
 }
}

// Create singleton instance
export const analytics = new Analytics()

// Export convenience function for compatibility
export const trackEvent = (event: AnalyticsEvent) => analytics.track(event)

// Export types
export type { AnalyticsEvent }
