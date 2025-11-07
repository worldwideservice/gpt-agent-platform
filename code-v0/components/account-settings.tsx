"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AccountSettings() {
  const [stopAgentsOnHumanReply, setStopAgentsOnHumanReply] = useState(false)

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-semibold text-gray-900">Настройки аккаунта</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-medium text-gray-900">Общие</h2>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="stop-agents" className="block text-sm font-medium text-gray-900">
                Останавливать агентов ИИ при ответе человека
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Если включено, агенты ИИ перестанут отвечать в этом чате после того, как человек отправит сообщение.
              </p>
            </div>

            <button
              id="stop-agents"
              type="button"
              role="switch"
              aria-checked={stopAgentsOnHumanReply}
              onClick={() => setStopAgentsOnHumanReply(!stopAgentsOnHumanReply)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                stopAgentsOnHumanReply ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  stopAgentsOnHumanReply ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Сохранить изменения</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
