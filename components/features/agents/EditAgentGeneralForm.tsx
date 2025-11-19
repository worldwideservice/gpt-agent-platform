'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Switch,
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

interface EditAgentGeneralFormProps {
    agent: Agent
    tenantId: string
}

const generalSchema = z.object({
    name: z.string().min(2, 'Название должно быть не менее 2 символов'),
    isActive: z.boolean(),
    instructions: z.string().max(2000, 'Максимум 2000 символов').optional().or(z.literal('')),
    checkBeforeSending: z.boolean().default(false),
})

type GeneralFormValues = z.infer<typeof generalSchema>

export function EditAgentGeneralForm({ agent, tenantId }: EditAgentGeneralFormProps) {
    const router = useRouter()
    const t = useTranslations('manage.agents.form')
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const form = useForm<GeneralFormValues>({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            name: agent.name,
            isActive: agent.status === 'active',
            instructions: agent.instructions ?? '',
            checkBeforeSending: false, // TODO: Add this field to Agent type/DB if missing
        },
    })

    const onSubmit = async (values: GeneralFormValues) => {
        setStatusMessage(null)

        try {
            const response = await fetch(`/api/agents/${agent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    status: values.isActive ? 'active' : 'inactive',
                    instructions: values.instructions,
                    // checkBeforeSending: values.checkBeforeSending // TODO: Implement backend support
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(payload.error || t('messages.error'))
            }

            router.refresh()
            setStatusMessage({ type: 'success', text: t('messages.updated') })
        } catch (error) {
            const message = error instanceof Error ? error.message : t('messages.error')
            setStatusMessage({ type: 'error', text: message })
        }
    }

    const isSubmitting = form.formState.isSubmitting

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Профиль агента</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Введите название агента" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Активно</FormLabel>
                                            <FormDescription>
                                                Включение/выключение агента
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instructions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Инструкции для агента *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={6}
                                                placeholder="Опишите роль и тональность агента"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Начальные инструкции по тону, стилю и ответам вашего агента.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="border-t pt-6">
                                <h3 className="mb-4 text-lg font-medium">Взаимодействие</h3>
                                <FormField
                                    control={form.control}
                                    name="checkBeforeSending"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Проверять перед отправкой</FormLabel>
                                                <FormDescription>
                                                    Сообщения не будут отправляться автоматически. Они появятся в поле ввода для проверки.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {statusMessage && (
                                <p
                                    className={`text-sm ${statusMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                                        }`}
                                >
                                    {statusMessage.text}
                                </p>
                            )}

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Отмена
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
