'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RefreshCw, Plus, Trash2 } from 'lucide-react'

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Switch,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
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

interface EditAgentLeadsContactsFormProps {
    agent: Agent
    tenantId: string
}

// Mock data for CRM fields - in real app this comes from API
const CRM_FIELDS = [
    { id: 'budget', label: 'Бюджет', type: 'number' },
    { id: 'status', label: 'Статус сделки', type: 'select' },
    { id: 'client_name', label: 'Имя клиента', type: 'string' },
    { id: 'phone', label: 'Телефон', type: 'string' },
    { id: 'email', label: 'Email', type: 'string' },
    { id: 'city', label: 'Город', type: 'string' },
]

const leadsContactsSchema = z.object({
    readFields: z.array(z.string()),
    writeRules: z.array(
        z.object({
            fieldId: z.string(),
            condition: z.string().min(1, 'Условие обязательно'),
            overwrite: z.boolean(),
        })
    ),
})

type LeadsContactsFormValues = z.infer<typeof leadsContactsSchema>

export function EditAgentLeadsContactsForm({ agent, tenantId }: EditAgentLeadsContactsFormProps) {
    const router = useRouter()
    const t = useTranslations('manage.agents.form')
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const form = useForm<LeadsContactsFormValues>({
        resolver: zodResolver(leadsContactsSchema),
        defaultValues: {
            readFields: [], // TODO: Load from agent config
            writeRules: [], // TODO: Load from agent config
        },
    })

    const onSubmit = async (values: LeadsContactsFormValues) => {
        setStatusMessage(null)
        // TODO: Implement API save
        console.log('Saving Leads & Contacts:', values)
        setStatusMessage({ type: 'success', text: 'Настройки сохранены (Mock)' })
    }

    const isSubmitting = form.formState.isSubmitting
    const writeRules = form.watch('writeRules')

    const addWriteRule = () => {
        const currentRules = form.getValues('writeRules')
        form.setValue('writeRules', [
            ...currentRules,
            { fieldId: '', condition: '', overwrite: false },
        ])
    }

    const removeWriteRule = (index: number) => {
        const currentRules = form.getValues('writeRules')
        form.setValue(
            'writeRules',
            currentRules.filter((_, i) => i !== index)
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Сделки и контакты</CardTitle>
                    <CardDescription>
                        Настройте доступ агента к данным CRM и правила их обновления.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* READ ACCESS SECTION */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Чтение данных (Read Access)</h3>
                                    <Button variant="outline" size="sm" type="button">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Синхронизировать настройки CRM
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Выберите поля сделки и контакта, которые агент может видеть и использовать в диалоге.
                                </p>

                                <FormField
                                    control={form.control}
                                    name="readFields"
                                    render={() => (
                                        <FormItem>
                                            <div className="grid gap-2 md:grid-cols-3">
                                                {CRM_FIELDS.map((field) => (
                                                    <FormField
                                                        key={field.id}
                                                        control={form.control}
                                                        name="readFields"
                                                        render={({ field: checkField }) => {
                                                            return (
                                                                <FormItem
                                                                    key={field.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                                                >
                                                                    <FormControl>
                                                                        <Switch
                                                                            checked={checkField.value?.includes(field.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? checkField.onChange([...checkField.value, field.id])
                                                                                    : checkField.onChange(
                                                                                        checkField.value?.filter(
                                                                                            (value) => value !== field.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none">
                                                                        <FormLabel>
                                                                            {field.label}
                                                                        </FormLabel>
                                                                    </div>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="border-t my-6" />

                            {/* WRITE ACCESS SECTION */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Запись данных (Write Access)</h3>
                                    <Button onClick={addWriteRule} type="button" variant="secondary" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Добавить правило
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Настройте правила, по которым агент будет обновлять поля в CRM на основе диалога.
                                </p>

                                {writeRules.length === 0 && (
                                    <div className="text-center py-8 border border-dashed rounded-lg text-gray-500">
                                        Нет правил записи. Агент не будет изменять данные в CRM.
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {writeRules.map((_, index) => (
                                        <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                            <FormField
                                                control={form.control}
                                                name={`writeRules.${index}.fieldId`}
                                                render={({ field }) => (
                                                    <FormItem className="w-1/4">
                                                        <FormLabel className="text-xs">Поле CRM</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Выберите поле" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {CRM_FIELDS.map((f) => (
                                                                    <SelectItem key={f.id} value={f.id}>
                                                                        {f.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`writeRules.${index}.condition`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-xs">Условие (Инструкция для AI)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Например: Если клиент назвал свой бюджет..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`writeRules.${index}.overwrite`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col items-center space-y-2 pt-2">
                                                        <FormLabel className="text-xs">Перезаписать</FormLabel>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mt-6 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                                onClick={() => removeWriteRule(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
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
