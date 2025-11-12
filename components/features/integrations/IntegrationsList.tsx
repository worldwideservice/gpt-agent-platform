'use client'

import { useMemo, useState, type ComponentType } from 'react'
import { CheckCircle2, PlugZap, Shield, RefreshCcw, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export type IntegrationStatus = 'connected' | 'not_connected' | 'coming_soon'

export interface IntegrationListItem {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  details?: {
    baseDomain?: string | null
    expiresAt?: string | null
    note?: string
  }
}

interface IntegrationsListProps {
  tenantId: string
  items: IntegrationListItem[]
  notice?: string | null
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  kommo: PlugZap,
  slack: Shield,
}

const createDomainSchema = (t: ReturnType<typeof useTranslations<'manage.integrations.kommo'>>) =>
  z.object({
    baseDomain: z
      .string()
      .min(3, { message: t('validation.domain') })
      .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u, { message: t('validation.domain') }),
  })

type DomainFormValues = z.infer<ReturnType<typeof createDomainSchema>>

export function IntegrationsList({ tenantId, items, notice }: IntegrationsListProps) {
  const t = useTranslations('manage.integrations.list')

  return (
    <div className="space-y-4">
      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div>
      )}

      {items.length === 0 && (
        <Card>
          <CardContent className="py-6 text-sm text-gray-500">{t('empty')}</CardContent>
        </Card>
      )}

      {items.map((integration) => (
        <IntegrationCard key={integration.id} tenantId={tenantId} integration={integration} />
      ))}
    </div>
  )
}

function IntegrationCard({ tenantId, integration }: { tenantId: string; integration: IntegrationListItem }) {
  const t = useTranslations('manage.integrations.list')
  const Icon = ICONS[integration.id] ?? Globe

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Icon className="h-5 w-5" />
            <CardTitle>{integration.name}</CardTitle>
          </div>
          <CardDescription>{integration.description}</CardDescription>
          <p className="text-xs text-gray-500">
            {t.rich('workspaceLabel', {
              tenant: (chunk) => <span className="font-mono">{chunk}</span>,
              id: tenantId,
            })}
          </p>
        </div>
        <IntegrationStatusBadge status={integration.status} />
      </CardHeader>
      <CardContent>
        <IntegrationContent integration={integration} />
      </CardContent>
    </Card>
  )
}

function IntegrationContent({ integration }: { integration: IntegrationListItem }) {
  const t = useTranslations('manage.integrations.list')

  if (integration.status === 'connected') {
    return (
      <div className="space-y-2 text-sm">
        <p className="text-emerald-600">{t('connected.description')}</p>
        {integration.details?.baseDomain && (
          <p className="text-gray-500">
            {t('connected.domain')} <span className="font-mono">{integration.details.baseDomain}</span>
          </p>
        )}
        {integration.details?.expiresAt && (
          <p className="text-xs text-gray-500">
            {t('connected.expires', {
              date: new Date(integration.details.expiresAt).toLocaleString(),
            })}
          </p>
        )}
        {integration.details?.note && <p className="text-xs text-gray-500">{integration.details.note}</p>}
      </div>
    )
  }

  if (integration.status === 'coming_soon') {
    return <p className="text-sm text-gray-500">{t('comingSoon')}</p>
  }

  if (integration.id === 'kommo') {
    return <KommoConnectCard defaultDomain={integration.details?.baseDomain} />
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {integration.details?.note ?? t('disconnected.description')}
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          {t('disconnected.actions.docs')}
        </Button>
        <Button size="sm">{t('disconnected.actions.connect')}</Button>
      </div>
    </div>
  )
}

function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const t = useTranslations('manage.integrations.status')

  if (status === 'connected') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {t('connected')}
      </span>
    )
  }

  if (status === 'coming_soon') {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
        <RefreshCcw className="mr-1 h-3 w-3" />
        {t('comingSoon')}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      {t('disconnected')}
    </span>
  )
}

function KommoConnectCard({ defaultDomain }: { defaultDomain?: string | null }) {
  const t = useTranslations('manage.integrations.kommo')
  const schema = useMemo(() => createDomainSchema(t), [t])
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      baseDomain: defaultDomain ?? '',
    },
  })

  const onSubmit = async (values: DomainFormValues) => {
    setStatusMessage(null)
    try {
      const response = await fetch('/api/integrations/kommo/oauth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || t('messages.error'))
      }
      setStatusMessage(t('messages.redirect'))
      window.location.href = payload.authUrl
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messages.error')
      setStatusMessage(message)
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 text-sm">
        <p className="text-gray-600 dark:text-gray-300">{t('description')}</p>
        <FormField
          control={form.control}
          name="baseDomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.domain.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('fields.domain.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {statusMessage && <p className="text-xs text-rose-500">{statusMessage}</p>}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" type="button">
            {t('actions.docs')}
          </Button>
          <Button size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('actions.pending') : t('actions.connect')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
