/**
 * Notification System
 *
 * Централизованная система уведомлений с поддержкой multi-tenancy
 */

// Core functions
export {
  createNotification,
  createBulkNotifications,
  NotificationTemplates,
} from './create-notification'

// Integration examples (reference)
export {
  notifyOnNewLead,
  notifyOnLeadAssigned,
  notifyOnLeadStatusChange,
  notifyOnNewMessage,
  notifyOnIntegrationError,
  notifySystemAlert,
} from './integration-examples'

// Re-export types from validation schemas
export type {
  CreateNotificationInput,
  NotificationType,
} from '@/lib/validation/schemas/notification'
