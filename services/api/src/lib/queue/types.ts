export type KommoWebhookJob = {
  provider: 'kommo'
  orgId: string
  payload: unknown
}

export type CrmSyncPipelinesJob = {
  provider: 'kommo' | 'hubspot' | 'bitrix24' | 'salesforce'
  orgId: string
  connectionId: string
  baseDomain?: string
}

export type LegacyKommoSyncPipelinesJob = {
  provider: 'kommo'
  orgId: string
  baseDomain: string
  connectionId?: string
}

export type KommoSendMessageJob = {
  provider: 'kommo'
  orgId: string
  dealId: string
  channel: 'email' | 'chat'
  message: {
    subject?: string
    body: string
    attachments?: Array<{ url: string; name: string }>
  }
}

export type JobPayload =
  | ({ type: 'kommo:webhook' } & KommoWebhookJob)
  | ({ type: 'crm:sync-pipelines' } & CrmSyncPipelinesJob)
  | ({ type: 'kommo:sync-pipelines' } & LegacyKommoSyncPipelinesJob)
  | ({ type: 'kommo:send-message' } & KommoSendMessageJob)
