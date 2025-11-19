'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Zap } from 'lucide-react'

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Textarea,
} from '@/components/ui'

interface Trigger {
    id: string
    name: string
    isActive: boolean
    condition: string
    actionType: string
    actionValue?: string
}

// Mock data
const MOCK_TRIGGERS: Trigger[] = [
    {
        id: '1',
        name: 'Клиент хочет купить',
        isActive: true,
        condition: 'Клиент явно выразил намерение совершить покупку или просит счет',
        actionType: 'change_stage',
        actionValue: 'negotiation',
    },
]

const ACTION_TYPES = [
    { value: 'change_stage', label: 'Сменить этап сделки' },
    { value: 'create_task', label: 'Создать задачу' },
    { value: 'notify_manager', label: 'Уведомить менеджера' },
    { value: 'stop_bot', label: 'Остановить бота' },
]

export function EditAgentTriggersForm() {
    const [triggers, setTriggers] = useState<Trigger[]>(MOCK_TRIGGERS)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // New trigger form state
    const [newTrigger, setNewTrigger] = useState<Partial<Trigger>>({
        isActive: true,
        actionType: 'change_stage',
    })

    const handleSaveTrigger = () => {
        if (!newTrigger.name || !newTrigger.condition) return

        const trigger: Trigger = {
            id: Math.random().toString(36).substr(2, 9),
            name: newTrigger.name,
            isActive: newTrigger.isActive ?? true,
            condition: newTrigger.condition,
            actionType: newTrigger.actionType ?? 'change_stage',
            actionValue: newTrigger.actionValue,
        }

        setTriggers([...triggers, trigger])
        setIsDialogOpen(false)
        setNewTrigger({ isActive: true, actionType: 'change_stage' })
    }

    const handleDeleteTrigger = (id: string) => {
        setTriggers(triggers.filter(t => t.id !== id))
    }

    const toggleTriggerActive = (id: string) => {
        setTriggers(triggers.map(t =>
            t.id === id ? { ...t, isActive: !t.isActive } : t
        ))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Триггеры</CardTitle>
                        <CardDescription>
                            Настройте действия, которые агент должен выполнить при определенных условиях в диалоге.
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Создать триггер
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Новый триггер</DialogTitle>
                                <DialogDescription>
                                    Опишите условие на естественном языке и выберите действие.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Название</label>
                                    <Input
                                        id="name"
                                        value={newTrigger.name || ''}
                                        onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                                        placeholder="Например: Клиент готов купить"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="condition" className="text-sm font-medium">Условие (Промпт)</label>
                                    <Textarea
                                        id="condition"
                                        value={newTrigger.condition || ''}
                                        onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
                                        placeholder="Если клиент спрашивает про способы оплаты или просит выставить счет..."
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="action" className="text-sm font-medium">Действие</label>
                                    <Select
                                        value={newTrigger.actionType}
                                        onValueChange={(val) => setNewTrigger({ ...newTrigger, actionType: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ACTION_TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                                <Button onClick={handleSaveTrigger}>Сохранить</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {triggers.length === 0 ? (
                        <div className="text-center py-12 border border-dashed rounded-lg text-gray-500">
                            <Zap className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p>Нет активных триггеров</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {triggers.map((trigger) => (
                                <div
                                    key={trigger.id}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-950"
                                >
                                    <div className="flex items-center gap-4">
                                        <Switch
                                            checked={trigger.isActive}
                                            onCheckedChange={() => toggleTriggerActive(trigger.id)}
                                        />
                                        <div>
                                            <h4 className="font-medium">{trigger.name}</h4>
                                            <p className="text-sm text-gray-500 max-w-md truncate">
                                                {trigger.condition}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                                            {ACTION_TYPES.find(t => t.value === trigger.actionType)?.label}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-rose-500"
                                            onClick={() => handleDeleteTrigger(trigger.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
