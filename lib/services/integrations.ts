import { z } from 'zod'
import { logger } from '@/lib/utils'

import { getCrmConnectionData } from '@/lib/repositories/crm-connection'

const overviewSchema = z
  .object({
    provider: z.string().min(1).default('kommo'),
  })
  .optional()

const assertOrganizationId = (organizationId: string) => {
  if (!organizationId || typeof organizationId !== 'string') {
    throw new Error('Требуется идентификатор организации')
  }
}

export interface IntegrationOverview {
  provider: string
  connected: boolean
  connection: Awaited<ReturnType<typeof getCrmConnectionData>>['connection']
  credentials: Awaited<ReturnType<typeof getCrmConnectionData>>['credentials']
}

export const getIntegrationOverview = async (
  organizationId: string,
  options?: unknown,
): Promise<IntegrationOverview> => {
  assertOrganizationId(organizationId)

  const parsed = overviewSchema.parse(options)
  const provider = parsed?.provider ?? 'kommo'

  try {
    const data = await getCrmConnectionData(organizationId, provider)

    return {
      provider,
      connected: Boolean(data.connection?.access_token),
      connection: data.connection,
      credentials: data.credentials,
    }
  } catch (error) {
    logger.error('IntegrationsService.getIntegrationOverview failed', error instanceof Error ? error : new Error(String(error)), { organizationId, provider })
    throw new Error('Не удалось загрузить данные интеграции')
  }
}

export const IntegrationsService = {
  getIntegrationOverview,
}

export type IntegrationsService = typeof IntegrationsService
