'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, Building2 } from 'lucide-react'

import { useTenant } from '@/components/providers/TenantProvider'
import { Button } from '@/components/ui/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/utils/logger'

type Workspace = {
  id: string
  name: string
  slug: string
  role: string
}

export function WorkspaceSelector() {
  const router = useRouter()
  const { tenantId } = useTenant()
  const [open, setOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/workspaces')
        const data = await response.json()

        if (data.success) {
          setWorkspaces(data.workspaces)
          logger.debug('[WorkspaceSelector] Fetched workspaces', {
            count: data.workspaces.length,
          })
        } else {
          logger.error('[WorkspaceSelector] Failed to fetch workspaces', {
            error: data.error,
          })
        }
      } catch (error) {
        logger.error('[WorkspaceSelector] Error fetching workspaces', error as Error)
      } finally {
        setLoading(false)
      }
    }

    void fetchWorkspaces()
  }, [])

  const currentWorkspace = workspaces.find((ws) => ws.id === tenantId)

  const handleSelectWorkspace = (workspaceId: string) => {
    if (workspaceId === tenantId) {
      setOpen(false)
      return
    }

    // Save to localStorage
    localStorage.setItem('lastSelectedWorkspace', workspaceId)

    // Navigate to the new workspace
    router.push(`/manage/${workspaceId}/dashboard`)
    setOpen(false)
  }

  // Show search input only if more than 5 workspaces
  const showSearch = workspaces.length > 5

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select workspace"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {loading ? 'Loading...' : currentWorkspace?.name ?? 'Select workspace'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          {showSearch && (
            <CommandInput placeholder="Search workspaces..." className="h-9" />
          )}
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Your Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={workspace.name}
                  onSelect={() => handleSelectWorkspace(workspace.id)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <Building2 className="h-4 w-4 shrink-0 text-gray-500" />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{workspace.name}</p>
                      <p className="truncate text-xs text-gray-500">{workspace.slug}</p>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4 shrink-0',
                      workspace.id === tenantId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
