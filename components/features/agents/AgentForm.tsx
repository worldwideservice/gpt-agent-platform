'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from 'next-auth/react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Agent } from '@/types'
import { trackAgentCreated } from '@/lib/analytics/examples'

interface AgentFormProps {
  tenantId: string
  agent?: Agent
}

const STATUS_OPTIONS = ['draft', 'active', 'inactive'] as const

type AgentFormValues = {
  name: string
  status: (typeof STATUS_OPTIONS)[number]
  model: string
  instructions?: string | null
  temperature: number
  maxTokens: number
}

export function AgentForm({ agent, tenantId }: AgentFormProps) {
  const router = useRouter()
  const t = useTranslations('manage.agents.form')
  const { data: session } = useSession()
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, { message: t('validation.name') }),
        status: z.enum(STATUS_OPTIONS, { invalid_type_error: t('validation.status') }),
        model: z.string().min(3, { message: t('validation.model') }),
        instructions: z
          .string()
          .max(2000, { message: t('validation.instructions') })
          .optional()
          .or(z.literal('')),
        temperature: z
          .coerce
          .number({ invalid_type_error: t('validation.temperatureRange') })
          .min(0, { message: t('validation.temperatureRange') })
          .max(2, { message: t('validation.temperatureRange') }),
        maxTokens: z
          .coerce
          .number({ invalid_type_error: t('validation.maxTokens') })
          .min(128, { message: t('validation.maxTokens') })
          .max(8000, { message: t('validation.maxTokens') }),
      }),
    [t],
  )

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: agent?.name ?? '',
      status: agent?.status ?? 'draft',
      model: agent?.model ?? '',
      instructions: agent?.instructions ?? '',
      temperature: agent?.temperature ?? 0.7,
      maxTokens: agent?.maxTokens ?? 2048,
    },
  })

  const onSubmit = async (values: AgentFormValues) => {
    setStatusMessage(null)

    try {
      const endpoint = agent ? `/api/agents/${agent.id}` : '/api/agents'
      const method = agent ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          status: values.status,
          model: values.model,
          instructions: values.instructions ?? '',
          temperature: values.temperature,
          maxTokens: values.maxTokens,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(payload.error || t('messages.error'))
      }

      const result = await response.json()

      // Track agent creation (only for new agents, not updates)
      if (!agent && result.agent) {
        try {
          const user = session?.user as any
          trackAgentCreated({
            id: result.agent.id,
            name: values.name,
            model: values.model,
            organizationId: user?.organizationId || tenantId,
            userId: user?.id || 'unknown',
            hasInstructions: !!values.instructions,
            hasKnowledge: false, // Knowledge base is added separately
          })
        } catch (analyticsError) {
          console.warn('[AgentForm] Analytics tracking failed:', analyticsError)
        }
      }

      router.refresh()
      form.reset({
        name: agent ? values.name : '',
        status: values.status,
        model: agent ? values.model : '',
        instructions: agent ? values.instructions ?? '' : '',
        temperature: values.temperature,
        maxTokens: values.maxTokens,
      })
      setStatusMessage({ type: 'success', text: agent ? t('messages.updated') : t('messages.created') })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messages.error')
      setStatusMessage({ type: 'error', text: message })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{agent ? t('title.edit') : t('title.create')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('fields.name.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fields.status.label')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('fields.status.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {t(`fields.status.options.${option}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fields.model.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('fields.model.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fields.temperature.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={2}
                        step="0.1"
                        value={Number.isFinite(field.value) ? field.value : 0}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormDescription>{t('fields.temperature.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fields.maxTokens.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={128}
                        max={8000}
                        value={Number.isFinite(field.value) ? field.value : 0}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormDescription>{t('fields.maxTokens.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.instructions.label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder={t('fields.instructions.placeholder')}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>{t('fields.instructions.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {statusMessage && (
              <p
                className={`text-sm ${
                  statusMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('actions.saving') : agent ? t('actions.update') : t('actions.create')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
