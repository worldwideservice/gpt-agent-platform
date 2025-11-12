'use client'

import { useState } from 'react'
import { Bell, Search, UserCircle2 } from 'lucide-react'

import { Button, Input } from '@/components/ui'
import { useTenant } from '@/components/providers/TenantProvider'

export function ManageHeader() {
  const [query, setQuery] = useState('')
  const { tenantId, organizationName } = useTenant()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur dark:bg-gray-950/70">
      <div className="hidden flex-1 items-center gap-3 lg:flex">
        <div className="relative w-96">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по агентам, сделкам, статьям"
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-rose-500" />
        </Button>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <span className="text-xs uppercase text-gray-500">Workspace</span>
          <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
            {organizationName ?? tenantId}
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <UserCircle2 className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}
