#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const SEED_DIR = path.join(__dirname, '../../supabase')

// Sample data for seeding
const sampleData = {
  knowledgeCategories: [
    {
      id: 'getting-started',
      name: 'Начало работы',
      description: 'Базовые инструкции по использованию платформы',
      sort_order: 1,
    },
    {
      id: 'ai-agents',
      name: 'AI Агенты',
      description: 'Настройка и управление ИИ-агентами',
      sort_order: 2,
    },
    {
      id: 'crm-integration',
      name: 'CRM Интеграция',
      description: 'Подключение и настройка CRM систем',
      sort_order: 3,
    },
    {
      id: 'knowledge-base',
      name: 'База знаний',
      description: 'Управление базой знаний и документами',
      sort_order: 4,
    },
    {
      id: 'analytics',
      name: 'Аналитика',
      description: 'Отчеты и аналитика использования',
      sort_order: 5,
    },
  ],

  knowledgeArticles: [
    {
      id: 'welcome',
      category_id: 'getting-started',
      title: 'Добро пожаловать в GPT Agent Platform',
      content: `# Добро пожаловать!

GPT Agent Platform - это комплексная платформа для обучения и управления AI-агентами.

## Основные возможности:

- 🤖 **AI Агенты**: Создание и настройка интеллектуальных агентов
- 📚 **База знаний**: Загрузка и управление документацией
- 🔗 **CRM Интеграция**: Подключение к популярным CRM системам
- 📊 **Аналитика**: Детальная статистика использования
- ⚙️ **Автоматизация**: Правила и последовательности действий

## Быстрый старт:

1. Создайте своего первого AI-агента
2. Загрузите документацию в базу знаний
3. Настройте интеграцию с CRM
4. Начните автоматизацию процессов

Удачи в использовании платформы! 🚀`,
      is_published: true,
      sort_order: 1,
    },
    {
      id: 'create-agent',
      category_id: 'ai-agents',
      title: 'Создание AI-агента',
      content: `# Создание AI-агента

## Шаг 1: Основная информация

При создании агента укажите:
- **Название**: Описательное имя агента
- **Описание**: Для чего предназначен агент
- **Модель**: Выберите подходящую AI-модель

## Шаг 2: База знаний

Загрузите документы, которые агент будет использовать:
- PDF файлы
- Документы Word
- Текстовые файлы
- Веб-страницы

## Шаг 3: Настройка поведения

Определите, как агент должен отвечать:
- **Тон общения**: Формальный, дружелюбный, профессиональный
- **Стиль ответов**: Краткие или подробные
- **Ограничения**: Темы, которые агент не должен затрагивать

## Шаг 4: Тестирование

Протестируйте агента в чате перед запуском в работу.`,
      is_published: true,
      sort_order: 1,
    },
  ],

  emailTemplates: [
    {
      id: 'welcome-email',
      name: 'Приветственное письмо',
      subject: 'Добро пожаловать в GPT Agent Platform!',
      content: `Здравствуйте, {{name}}!

Спасибо за регистрацию в GPT Agent Platform!

Ваша учетная запись создана и готова к использованию.

Для начала работы:
1. Войдите в систему: {{login_url}}
2. Создайте своего первого AI-агента
3. Загрузите документацию в базу знаний

Если у вас возникнут вопросы, обращайтесь в поддержку: {{support_email}}

С уважением,
Команда GPT Agent Platform`,
      variables: ['name', 'login_url', 'support_email'],
    },
    {
      id: 'password-reset',
      name: 'Восстановление пароля',
      subject: 'Восстановление пароля',
      content: `Здравствуйте!

Вы запросили восстановление пароля для аккаунта {{email}}.

Для сброса пароля перейдите по ссылке: {{reset_url}}

Ссылка действительна в течение 24 часов.

Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.

С уважением,
Команда GPT Agent Platform`,
      variables: ['email', 'reset_url'],
    },
  ],

  plans: [
    {
      id: 'free',
      name: 'Бесплатный',
      description: 'Идеально для тестирования',
      tier: 'free',
      price: 0,
      currency: 'RUB',
      interval: 'month',
      features: JSON.stringify([
        'До 3 AI агентов',
        'До 1 базы знаний',
        '50 API запросов в минуту',
        'Базовая поддержка',
      ]),
      max_agents: 3,
      max_knowledge_bases: 1,
      max_monthly_requests: 10000,
      max_storage_gb: 1,
      support_level: 'basic',
      is_active: true,
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Для растущего бизнеса',
      tier: 'premium',
      price: 2990,
      currency: 'RUB',
      interval: 'month',
      features: JSON.stringify([
        'До 20 AI агентов',
        'До 10 баз знаний',
        '200 API запросов в минуту',
        'Приоритетная поддержка',
        'Расширенная аналитика',
      ]),
      max_agents: 20,
      max_knowledge_bases: 10,
      max_monthly_requests: 100000,
      max_storage_gb: 10,
      support_level: 'priority',
      is_popular: true,
      is_active: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Максимальные возможности',
      tier: 'vip',
      price: 9990,
      currency: 'RUB',
      interval: 'month',
      features: JSON.stringify([
        'Неограниченное количество AI агентов',
        'Неограниченное количество баз знаний',
        '1000 API запросов в минуту',
        'Выделенная поддержка 24/7',
        'Персональный менеджер',
      ]),
      max_agents: -1,
      max_knowledge_bases: -1,
      max_monthly_requests: 1000000,
      max_storage_gb: 100,
      support_level: 'dedicated',
      is_active: true,
    },
  ],
}

async function seedKnowledgeBase() {
  console.log('🌱 Seeding knowledge base...')

  try {
    // Insert categories
    const { data: categories, error: catError } = await supabase
      .from('knowledge_categories')
      .upsert(sampleData.knowledgeCategories, { onConflict: 'id' })
      .select()

    if (catError) throw catError
    console.log(`✅ Inserted ${categories.length} knowledge categories`)

    // Insert articles
    const { data: articles, error: artError } = await supabase
      .from('knowledge_articles')
      .upsert(sampleData.knowledgeArticles, { onConflict: 'id' })
      .select()

    if (artError) throw artError
    console.log(`✅ Inserted ${articles.length} knowledge articles`)

    // Record seeding
    await supabase
      .from('seed_data')
      .upsert([
        { id: 'knowledge_categories', table_name: 'knowledge_categories', record_count: categories.length },
        { id: 'knowledge_articles', table_name: 'knowledge_articles', record_count: articles.length },
      ], { onConflict: 'id' })

  } catch (error) {
    console.error('Failed to seed knowledge base:', error)
    throw error
  }
}

async function seedEmailTemplates() {
  console.log('📧 Seeding email templates...')

  try {
    const { data: templates, error } = await supabase
      .from('email_templates')
      .upsert(sampleData.emailTemplates, { onConflict: 'id' })
      .select()

    if (error) throw error
    console.log(`✅ Inserted ${templates.length} email templates`)

    // Record seeding
    await supabase
      .from('seed_data')
      .upsert({ id: 'email_templates', table_name: 'email_templates', record_count: templates.length }, { onConflict: 'id' })

  } catch (error) {
    console.error('Failed to seed email templates:', error)
    throw error
  }
}

async function seedPlans() {
  console.log('💰 Seeding subscription plans...')

  try {
    const { data: plans, error } = await supabase
      .from('plans')
      .upsert(sampleData.plans, { onConflict: 'id' })
      .select()

    if (error) throw error
    console.log(`✅ Inserted ${plans.length} subscription plans`)

    // Record seeding
    await supabase
      .from('seed_data')
      .upsert({ id: 'plans', table_name: 'plans', record_count: plans.length }, { onConflict: 'id' })

  } catch (error) {
    console.error('Failed to seed plans:', error)
    throw error
  }
}

async function runSeeding() {
  try {
    console.log('🚀 Starting database seeding...')

    await seedKnowledgeBase()
    await seedEmailTemplates()
    await seedPlans()

    console.log('✅ Seeding complete!')

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

async function resetData() {
  try {
    console.log('🗑️  Resetting seed data...')

    // Delete in reverse order to maintain foreign key constraints
    await supabase.from('knowledge_articles').delete().neq('id', '')
    await supabase.from('knowledge_categories').delete().neq('id', '')
    await supabase.from('email_templates').delete().neq('id', '')
    await supabase.from('plans').delete().neq('id', '')

    // Clear seed tracking
    await supabase.from('seed_data').delete().neq('id', '')

    console.log('✅ Data reset complete!')

  } catch (error) {
    console.error('Failed to reset data:', error)
    process.exit(1)
  }
}

async function showStatus() {
  try {
    console.log('📊 Seed Data Status\n')

    const { data: seedRecords, error } = await supabase
      .from('seed_data')
      .select('*')
      .order('seeded_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch seed status:', error)
      return
    }

    if (seedRecords.length === 0) {
      console.log('No seed data found. Run seeding first.')
      return
    }

    seedRecords.forEach(record => {
      console.log(`${record.table_name}: ${record.record_count} records (seeded: ${new Date(record.seeded_at).toLocaleString()})`)
    })

  } catch (error) {
    console.error('Failed to get seed status:', error)
    process.exit(1)
  }
}

// CLI interface
const command = process.argv[2]

switch (command) {
  case 'run':
  case 'seed':
    runSeeding()
    break
  case 'reset':
    resetData()
    break
  case 'status':
    showStatus()
    break
  case 'knowledge':
    seedKnowledgeBase()
    break
  case 'emails':
    seedEmailTemplates()
    break
  case 'plans':
    seedPlans()
    break
  default:
    console.log('Usage:')
    console.log('  node seed.js run      - Run all seeding scripts')
    console.log('  node seed.js reset    - Reset all seed data')
    console.log('  node seed.js status   - Show seeding status')
    console.log('  node seed.js knowledge - Seed knowledge base only')
    console.log('  node seed.js emails   - Seed email templates only')
    console.log('  node seed.js plans    - Seed subscription plans only')
    process.exit(1)
}
