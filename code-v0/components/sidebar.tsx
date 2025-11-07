"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  HomeIcon,
  GridIcon,
  MessageSquareIcon,
  FolderIcon,
  BookOpenIcon,
  HelpCircleIcon,
  SettingsIcon,
  DollarSignIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "./icons"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  href?: string
  onClick?: () => void
}

function SidebarItem({ icon, label, active, href, onClick }: SidebarItemProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  )

  const className = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100",
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )
}

interface SidebarSectionProps {
  title: string
  children?: React.ReactNode
  defaultOpen?: boolean
}

function SidebarSection({ title, children, defaultOpen = false }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
      </button>
      {isOpen && children && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  )
}

interface SidebarProps {
  activePage?: string
}

export function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="w-[280px] border-r border-gray-200 bg-white p-4 overflow-y-auto">
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-xs font-bold text-white">
          WS
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">World Wide Services</div>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </div>

      <div className="space-y-1 mb-6">
        <SidebarItem
          icon={<HomeIcon className="h-4 w-4" />}
          label="Инфопанель"
          href="/dashboard"
          active={activePage === "dashboard"}
        />
      </div>

      <SidebarSection title="Агенты ИИ" defaultOpen={true}>
        <SidebarItem
          icon={<GridIcon className="h-4 w-4" />}
          label="Агенты ИИ"
          href="/agents"
          active={activePage === "agents"}
        />
        <SidebarItem
          icon={<MessageSquareIcon className="h-4 w-4" />}
          label="Тестовый чат"
          href="/"
          active={activePage === "chat"}
        />
      </SidebarSection>

      <SidebarSection title="База знаний" defaultOpen={true}>
        <SidebarItem
          icon={<FolderIcon className="h-4 w-4" />}
          label="Категории"
          href="/categories"
          active={activePage === "categories"}
        />
        <SidebarItem
          icon={<BookOpenIcon className="h-4 w-4" />}
          label="Статьи"
          href="/articles"
          active={activePage === "articles"}
        />
      </SidebarSection>

      <SidebarSection title="Поддержка" defaultOpen={true}>
        <SidebarItem
          icon={<HelpCircleIcon className="h-4 w-4" />}
          label="Начало работы"
          href="/getting-started"
          active={activePage === "getting-started"}
        />
      </SidebarSection>

      <SidebarSection title="Аккаунт" defaultOpen={true}>
        <SidebarItem
          icon={<SettingsIcon className="h-4 w-4" />}
          label="Настройки аккаунта"
          href="/settings"
          active={activePage === "settings"}
        />
        <SidebarItem
          icon={<DollarSignIcon className="h-4 w-4" />}
          label="Тарифные планы"
          href="/pricing"
          active={activePage === "pricing"}
        />
      </SidebarSection>

      <SidebarSection title="Что нового" />
    </aside>
  )
}
