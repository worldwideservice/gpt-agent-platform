/**
 * Analytics tracking examples for common events
 */

import { trackEvent } from '@/lib/analytics'

export function trackLogin(userId: string) {
  trackEvent('user_login', { userId })
}

export function trackSignup(userId: string, method: string) {
  trackEvent('user_signup', { userId, method })
}

export function trackAgentCreated(userId: string, agentId: string) {
  trackEvent('agent_created', { userId, agentId })
}

export function trackCrmSynced(userId: string, crmType: string) {
  trackEvent('crm_synced', { userId, crmType })
}

export function trackIntegrationConnected(userId: string, integrationType: string) {
  trackEvent('integration_connected', { userId, integrationType })
}

export function trackChatStarted(userId: string, agentId: string) {
  trackEvent('chat_started', { userId, agentId })
}

export function trackMessageSent(userId: string, agentId: string, messageType: string) {
  trackEvent('message_sent', { userId, agentId, messageType })
}
