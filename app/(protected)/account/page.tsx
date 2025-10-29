'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'

const AccountPage = () => {
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Настройки аккаунта</h1>
        <p className="text-sm text-slate-500">Управление поведением AI-агентов и уведомлениями</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Общие</h2>
        <p className="mt-1 text-sm text-slate-500">
          Если включить, агенты перестанут отвечать, как только человек отправит сообщение в этом чате.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Toggle
            checked={stopOnHumanReply}
            onChange={setStopOnHumanReply}
            label="Останавливать агентов ИИ при ответе человека"
            description="Агенты автоматически отключаются после сообщения менеджера."
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="mt-6 gap-2 text-sm">
          {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
        </Button>
      </section>
    </div>
  )
}

export default AccountPage

