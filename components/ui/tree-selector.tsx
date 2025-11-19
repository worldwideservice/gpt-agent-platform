'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Checkbox } from './checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

export interface TreeNode {
  value: string
  label: string
  children?: TreeNode[]
}

export interface TreeSelectorProps {
  /**
   * Tree data structure
   */
  tree: TreeNode[]
  /**
   * Selected node values
   */
  selected: string[]
  /**
   * Callback when selection changes
   */
  onChange: (selected: string[]) => void
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Search placeholder
   */
  searchPlaceholder?: string
  /**
   * Empty state text
   */
  emptyText?: string
  /**
   * Allow multiple selection
   */
  multiple?: boolean
  /**
   * Disable the selector
   */
  disabled?: boolean
}

export function TreeSelector({
  tree,
  selected,
  onChange,
  placeholder = 'Выбрать категории...',
  searchPlaceholder = 'Поиск...',
  emptyText = 'Категории не найдены',
  multiple = true,
  disabled = false,
}: TreeSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set())

  const toggleNode = (nodeValue: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeValue)) {
        next.delete(nodeValue)
      } else {
        next.add(nodeValue)
      }
      return next
    })
  }

  const toggleSelection = (nodeValue: string) => {
    if (multiple) {
      const newSelected = selected.includes(nodeValue)
        ? selected.filter((v) => v !== nodeValue)
        : [...selected, nodeValue]
      onChange(newSelected)
    } else {
      onChange([nodeValue])
      setOpen(false)
    }
  }

  const renderTree = (nodes: TreeNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.has(node.value)
      const isSelected = selected.includes(node.value)
      const hasChildren = node.children && node.children.length > 0

      return (
        <div key={node.value}>
          <CommandItem
            value={node.value}
            onSelect={() => toggleSelection(node.value)}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              level > 0 && `ml-${level * 4}`
            )}
          >
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(node.value)
                }}
                className="flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            {multiple ? (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleSelection(node.value)}
                className="flex-shrink-0"
              />
            ) : (
              <Check
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isSelected ? 'opacity-100' : 'opacity-0'
                )}
              />
            )}
            <span className="flex-1">{node.label}</span>
          </CommandItem>
          {hasChildren && isExpanded && (
            <div className="ml-4">{renderTree(node.children!, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  const selectedLabels = React.useMemo(() => {
    const findLabels = (nodes: TreeNode[]): string[] => {
      const labels: string[] = []
      for (const node of nodes) {
        if (selected.includes(node.value)) {
          labels.push(node.label)
        }
        if (node.children) {
          labels.push(...findLabels(node.children))
        }
      }
      return labels
    }
    return findLabels(tree)
  }, [selected, tree])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabels.length > 0 ? (
            <span className="truncate">
              {selectedLabels.slice(0, 2).join(', ')}
              {selectedLabels.length > 2 && ` +${selectedLabels.length - 2}`}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>{renderTree(tree)}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
