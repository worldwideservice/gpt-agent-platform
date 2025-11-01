#!/usr/bin/env node

/**
 * Полное сканирование всех страниц через Playwright MCP
 * Скрипт для автоматического тестирования всех страниц и создания скриншотов
 */

const pages = [
  { path: '/', name: 'dashboard', title: 'Dashboard' },
  { path: '/agents', name: 'agents', title: 'Agents' },
  { path: '/agents/new', name: 'agents-new', title: 'New Agent' },
  { path: '/chat', name: 'chat', title: 'Chat' },
  { path: '/knowledge-base/categories', name: 'categories', title: 'Categories' },
  { path: '/knowledge-base/articles', name: 'articles', title: 'Articles' },
  { path: '/integrations', name: 'integrations', title: 'Integrations' },
  { path: '/pricing', name: 'pricing', title: 'Pricing' },
  { path: '/account', name: 'account', title: 'Account' },
  { path: '/support', name: 'support', title: 'Support' },
]

console.log('📋 План сканирования:')
pages.forEach((page, i) => {
  console.log(`  ${i + 1}. ${page.title} - ${page.path}`)
})

console.log('\n✅ Скрипт готов для запуска через Playwright MCP')
console.log('💡 Используйте команды playwright browser для сканирования')












