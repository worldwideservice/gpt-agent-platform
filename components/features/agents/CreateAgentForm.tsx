'use client'

import { useState } from 'react'
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
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
} from '@/components/ui'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

interface CreateAgentFormProps {
    tenantId: string
}

const createAgentSchema = z.object({
    name: z.string().min(2, 'Название должно быть не менее 2 символов'),
})

type CreateAgentFormValues = z.infer<typeof createAgentSchema>

export function CreateAgentForm({ tenantId }: CreateAgentFormProps) {
    const router = useRouter()
    const t = useTranslations('manage.agents.form')
    const { data: session } = useSession()
    const [error, setError] = useState<string | null>(null)

    const form = useForm<CreateAgentFormValues>({
        resolver: zodResolver(createAgentSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async (values: CreateAgentFormValues) => {
        setError(null)

        try {
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    status: 'draft', // Default to draft
                    model: 'gpt-4o-mini', // Default model, can be changed in settings
                    temperature: 0.7,
                    maxTokens: 2000,
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(payload.error || t('messages.error'))
            }

            const result = await response.json()

            // Track agent creation
            if (result.agent) {
                try {
                    const user = session?.user as any
                    trackAgentCreated({
                        id: result.agent.id,
                        name: values.name,
                        model: 'gpt-4o-mini',
                        organizationId: user?.organizationId || tenantId,
                        userId: user?.id || 'unknown',
                        hasInstructions: false,
                        hasKnowledge: false,
                    })
                } catch (analyticsError) {
                    // Silent fail
                }

                // Redirect to edit page
                router.push(`/manage/${tenantId}/ai-agents/${result.agent.id}/edit`)
                router.refresh()
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : t('messages.error')
            setError(message)
        }
    }

    const isSubmitting = form.formState.isSubmitting

    return (
        <Card className="max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>{t('title.create')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('fields.name.label')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('fields.name.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <p className="text-sm text-rose-500">
                                {error}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            {t('actions.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('actions.saving') : t('actions.create')}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
