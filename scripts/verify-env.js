#!/usr/bin/env node

/**
 * Скрипт для проверки переменных окружения
 * Запускайте перед деплоем: node scripts/verify-env.js
 */

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'OPENROUTER_API_KEY'
];

const optionalVars = [
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS'
];

console.log('🔍 Проверка переменных окружения...\n');

let allGood = true;
let missingRequired = [];
let missingOptional = [];

// Проверяем обязательные переменные
console.log('📋 ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`❌ ${varName}: НЕ НАЙДЕНА`);
    missingRequired.push(varName);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: НАСТРОЕНА`);
  }
});

console.log('\n📋 ОПЦИОНАЛЬНЫЕ ПЕРЕМЕННЫЕ:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`⚠️  ${varName}: НЕ НАСТРОЕНА`);
    missingOptional.push(varName);
  } else {
    console.log(`✅ ${varName}: НАСТРОЕНА`);
  }
});

// Дополнительные проверки
console.log('\n🔍 ДОПОЛНИТЕЛЬНЫЕ ПРОВЕРКИ:');

// Проверка NEXTAUTH_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (nextAuthSecret && nextAuthSecret.length < 32) {
  console.log('⚠️  NEXTAUTH_SECRET: ДЛИНА МЕНЬШЕ 32 СИМВОЛОВ (НЕБЕЗОПАСНО)');
  allGood = false;
} else if (nextAuthSecret) {
  console.log('✅ NEXTAUTH_SECRET: ДОСТАТОЧНАЯ ДЛИНА');
}

// Проверка SUPABASE_URL
const supabaseUrl = process.env.SUPABASE_URL;
if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
  console.log('⚠️  SUPABASE_URL: НЕ ПОХОЖ НА ВАЛИДНЫЙ SUPABASE URL');
} else if (supabaseUrl) {
  console.log('✅ SUPABASE_URL: ВАЛИДНЫЙ SUPABASE URL');
}

// Проверка UPSTASH_REDIS_REST_URL
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
if (redisUrl && !redisUrl.includes('upstash.io')) {
  console.log('⚠️  UPSTASH_REDIS_REST_URL: НЕ ПОХОЖ НА ВАЛИДНЫЙ UPSTASH URL');
} else if (redisUrl) {
  console.log('✅ UPSTASH_REDIS_REST_URL: ВАЛИДНЫЙ UPSTASH URL');
}

// Проверка OPENROUTER_API_KEY
const openRouterKey = process.env.OPENROUTER_API_KEY;
if (openRouterKey && !openRouterKey.startsWith('sk-or-v1-')) {
  console.log('⚠️  OPENROUTER_API_KEY: НЕ ПОХОЖ НА ВАЛИДНЫЙ OPENROUTER КЛЮЧ');
} else if (openRouterKey) {
  console.log('✅ OPENROUTER_API_KEY: ВАЛИДНЫЙ OPENROUTER КЛЮЧ');
}

console.log('\n' + '='.repeat(50));

// ИТОГИ
if (allGood && missingRequired.length === 0) {
  console.log('🎉 ВСЕ ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ НАСТРОЕНЫ!');
  console.log('🚀 ГОТОВ К ДЕПЛОЮ!');
} else {
  console.log('❌ ПРОБЛЕМЫ С КОНФИГУРАЦИЕЙ:');
  if (missingRequired.length > 0) {
    console.log(`\n❌ ОТСУТСТВУЮТ ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ:`);
    missingRequired.forEach(varName => console.log(`   - ${varName}`));
  }
  console.log('\n🔧 ИСПРАВЬТЕ ПРОБЛЕМЫ ПЕРЕД ДЕПЛОЕМ!');
}

if (missingOptional.length > 0) {
  console.log(`\n⚠️  НЕ НАСТРОЕНЫ ОПЦИОНАЛЬНЫЕ ПЕРЕМЕННЫЕ (${missingOptional.length}):`);
  missingOptional.forEach(varName => console.log(`   - ${varName}`));
}

console.log('\n📖 ПОДРОБНЫЕ ИНСТРУКЦИИ: СМОТРИТЕ DEPLOYMENT.md');
console.log('🔗 ПРИМЕР КОНФИГУРАЦИИ: СМОТРИТЕ env.example');

process.exit(allGood && missingRequired.length === 0 ? 0 : 1);
