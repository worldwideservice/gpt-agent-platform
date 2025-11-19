'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Slider,
} from '@/components/ui'
import type { Agent } from '@/types'

interface EditAgentAdvancedFormProps {
    agent: Agent
    tenantId: string
}

export function EditAgentAdvancedForm({ agent }: EditAgentAdvancedFormProps) {
    const t = useTranslations('manage.agents.form')
    const [temperature, setTemperature] = useState(agent.temperature || 0.7)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Настройки ИИ</CardTitle>
                    <CardDescription>
                        Тонкая настройка поведения модели и параметров генерации.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Модель</label>
                            <Select defaultValue={agent.model || 'gpt-4o-mini'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                                    <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Макс. токенов</label>
                            <Input type="number" defaultValue={agent.maxTokens || 2000} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Креативность (Temperature)</label>
                            <span className="text-sm text-gray-500">{temperature}</span>
                        </div>
                        <Slider
                            value={[temperature]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={(val) => setTemperature(val[0])}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Точный (0.0)</span>
                            <span>Сбалансированный (0.5)</span>
                            <span>Креативный (1.0)</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Задержка ответа (сек)</label>
                        <Input type="number" placeholder="0" className="max-w-[100px]" />
                        <p className="text-xs text-gray-500">
                            Имитация набора текста человеком.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button>Сохранить настройки</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
