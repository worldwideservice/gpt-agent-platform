import type { CRMConfig } from '@/types/crm'

export const kommoConfig: CRMConfig = {
  id: 'kommo',
  name: 'Kommo CRM',
  logo: '/logos/kommo.svg',
  description: 'Популярная CRM система для управления продажами и клиентами',
  authType: 'oauth2',
  baseUrl: 'https://kommo.com/api/v4',
  scopes: [
    'crm:read',
    'crm:write',
    'leads:read',
    'leads:write',
    'contacts:read',
    'contacts:write',
    'companies:read',
    'companies:write',
    'tasks:read',
    'tasks:write'
  ],
  fields: [
    {
      universalField: 'id',
      crmField: 'id',
      required: true,
      type: 'string'
    },
    {
      universalField: 'name',
      crmField: 'name',
      required: true,
      type: 'string'
    },
    {
      universalField: 'email',
      crmField: 'email',
      required: false,
      type: 'string'
    },
    {
      universalField: 'phone',
      crmField: 'phone',
      required: false,
      type: 'string'
    },
    {
      universalField: 'company',
      crmField: 'company',
      required: false,
      type: 'string'
    },
    {
      universalField: 'value',
      crmField: 'price',
      required: false,
      type: 'number'
    },
    {
      universalField: 'currency',
      crmField: 'currency',
      required: false,
      type: 'string'
    },
    {
      universalField: 'createdAt',
      crmField: 'created_at',
      required: true,
      type: 'date'
    },
    {
      universalField: 'updatedAt',
      crmField: 'updated_at',
      required: true,
      type: 'date'
    }
  ]
}

// OAuth настройки для Kommo
export const kommoOAuthConfig = {
  clientId: process.env.KOMMO_CLIENT_ID || '',
  clientSecret: process.env.KOMMO_CLIENT_SECRET || '',
  redirectUri: process.env.KOMMO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_API_URL}/api/crm/kommo/callback`,
  authUrl: 'https://kommo.com/oauth',
  tokenUrl: 'https://kommo.com/oauth/token',
  scope: 'crm:read crm:write leads:read leads:write contacts:read contacts:write companies:read companies:write tasks:read tasks:write'
}
