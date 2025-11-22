/**
 * Product Analytics Events
 * Centralized event tracking for Segment and PostHog
 */

import posthog from 'posthog-js'
import { logger } from '@/lib/utils/logger'

declare global {
  interface Window {
    __SEGMENT_ANALYTICS__?: any
    __POSTHOG_INITIALIZED__?: boolean
  }
}

export interface UserTraits {
  email?: string
  name?: string
  organizationId?: string
  organizationName?: string
  plan?: string
  createdAt?: string
  role?: string
}

export interface EventProperties {
  [key: string]: any
}

/**
 * Identify user across analytics platforms
 */
export function identifyUser(userId: string, traits: UserTraits = {}): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Segment identify
    if (window.__SEGMENT_ANALYTICS__) {
      window.__SEGMENT_ANALYTICS__.then((analytics: any) => {
        analytics.identify(userId, traits)
      }).catch((error: Error) => {
        logger.error('Segment identify failed', error, { userId })
      })
    }

    // PostHog identify
    if (window.__POSTHOG_INITIALIZED__) {
      posthog.identify(userId, traits)
    }

    logger.debug('User identified', { userId, traits })
  } catch (error) {
    logger.error('Analytics identify error', error, { userId })
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties: EventProperties = {}): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Segment track
    if (window.__SEGMENT_ANALYTICS__) {
      window.__SEGMENT_ANALYTICS__.then((analytics: any) => {
        analytics.track(eventName, properties)
      }).catch((error: Error) => {
        logger.error('Segment track failed', error, { eventName })
      })
    }

    // PostHog capture
    if (window.__POSTHOG_INITIALIZED__) {
      posthog.capture(eventName, properties)
    }

    logger.debug('Event tracked', { eventName, properties })
  } catch (error) {
    logger.error('Analytics track error', error, { eventName })
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUser(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Segment reset
    if (window.__SEGMENT_ANALYTICS__) {
      window.__SEGMENT_ANALYTICS__.then((analytics: any) => {
        analytics.reset()
      })
    }

    // PostHog reset
    if (window.__POSTHOG_INITIALIZED__) {
      posthog.reset()
    }

    logger.debug('User reset (logged out)')
  } catch (error) {
    logger.error('Analytics reset error', error)
  }
}

// ====================================
// Common Events
// ====================================

export const AnalyticsEvents = {
  // Authentication
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_COMPLETED: 'login_completed',
  LOGOUT_COMPLETED: 'logout_completed',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Agents
  AGENT_CREATED: 'agent_created',
  AGENT_UPDATED: 'agent_updated',
  AGENT_DELETED: 'agent_deleted',
  AGENT_ACTIVATED: 'agent_activated',
  AGENT_DEACTIVATED: 'agent_deactivated',

  // Knowledge Base
  KNOWLEDGE_CATEGORY_CREATED: 'knowledge_category_created',
  KNOWLEDGE_ARTICLE_CREATED: 'knowledge_article_created',
  KNOWLEDGE_ARTICLE_UPDATED: 'knowledge_article_updated',

  // Chat
  CHAT_STARTED: 'chat_started',
  MESSAGE_SENT: 'message_sent',
  CHAT_COMPLETED: 'chat_completed',

  // Automation
  RULE_CREATED: 'automation_rule_created',
  RULE_ACTIVATED: 'automation_rule_activated',
  SEQUENCE_CREATED: 'sequence_created',
  SEQUENCE_ACTIVATED: 'sequence_activated',

  // Integrations
  INTEGRATION_CONNECTED: 'integration_connected',
  INTEGRATION_DISCONNECTED: 'integration_disconnected',
  CRM_SYNCED: 'crm_synced',

  // Billing
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PAYMENT_COMPLETED: 'payment_completed',

  // Settings
  SETTINGS_UPDATED: 'settings_updated',
  TEAM_MEMBER_INVITED: 'team_member_invited',
} as const

// Type for event names
export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]
