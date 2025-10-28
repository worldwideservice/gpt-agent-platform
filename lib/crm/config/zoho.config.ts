import type { CRMConfig } from '@/types/crm'

export const zohoConfig: CRMConfig = {
  id: 'zoho',
  name: 'Zoho CRM',
  logo: '/logos/zoho.svg',
  description: 'Комплексная CRM платформа от Zoho. Включает управление продажами, маркетинг и аналитику.',
  authType: 'oauth2',
  baseUrl: 'https://www.zohoapis.com/crm/v2',
  scopes: [
    'ZohoCRM.modules.ALL',
    'ZohoCRM.users.ALL',
    'ZohoCRM.settings.ALL',
    'ZohoCRM.org.ALL'
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
      crmField: 'Deal_Name',
      required: true,
      type: 'string'
    },
    {
      universalField: 'email',
      crmField: 'Email',
      required: false,
      type: 'string'
    },
    {
      universalField: 'phone',
      crmField: 'Phone',
      required: false,
      type: 'string'
    },
    {
      universalField: 'company',
      crmField: 'Account_Name',
      required: false,
      type: 'string'
    },
    {
      universalField: 'value',
      crmField: 'Amount',
      required: false,
      type: 'number'
    },
    {
      universalField: 'currency',
      crmField: 'Currency',
      required: false,
      type: 'string'
    },
    {
      universalField: 'createdAt',
      crmField: 'Created_Time',
      required: true,
      type: 'date'
    },
    {
      universalField: 'updatedAt',
      crmField: 'Modified_Time',
      required: true,
      type: 'date'
    }
  ]
}

// OAuth настройки для Zoho
export const zohoOAuthConfig = {
  clientId: process.env.ZOHO_CLIENT_ID || '',
  clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
  redirectUri: process.env.ZOHO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_API_URL}/api/crm/zoho/callback`,
  authUrl: 'https://accounts.zoho.com/oauth/v2/auth',
  tokenUrl: 'https://accounts.zoho.com/oauth/v2/token',
  scope: 'ZohoCRM.modules.ALL ZohoCRM.users.ALL ZohoCRM.settings.ALL ZohoCRM.org.ALL'
}
