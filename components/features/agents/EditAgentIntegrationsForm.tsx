'use client'

import { CheckCircle2, ExternalLink } from 'lucide-react'

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Switch,
} from '@/components/ui'

export function EditAgentIntegrationsForm() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Доступные интеграции</CardTitle>
                    <CardDescription>
                        Подключите внешние сервисы для расширения возможностей агента.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {/* Kommo Integration */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                                K
                            </div>
                            <div>
                                <h4 className="font-medium flex items-center gap-2">
                                    Kommo CRM
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Подключено
                                    </span>
                                </h4>
                                <p className="text-sm text-gray-500">Синхронизация сделок, контактов и сообщений.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                Настройки <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                            <Switch checked={true} />
                        </div>
                    </div>

                    {/* Google Calendar */}
                    <div className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border rounded-lg flex items-center justify-center">
                                <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="GCal" className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-medium">Google Calendar</h4>
                                <p className="text-sm text-gray-500">Запись клиентов на встречи (Скоро).</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" disabled>
                                Подключить
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
