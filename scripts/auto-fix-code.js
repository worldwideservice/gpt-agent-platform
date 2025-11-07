#!/usr/bin/env node
// Автоматическое исправление ошибок в коде на основе логов

const fs = require('fs');
const path = require('path');

const SCRAPE_LOG_DIR = 'logs/scrape';
const CODE_FILE = 'scripts/kwid-scrape.ts';
const FIX_LOG = '/tmp/auto-fix-code.log';

function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(FIX_LOG, logMessage + '\n');
}

function analyzeLog(scenario, logFile) {
  if (!fs.existsSync(logFile)) {
    return null;
  }

  const content = fs.readFileSync(logFile, 'utf-8');
  const lines = content.split('\n');
  const lastLines = lines.slice(-50).join('\n');

  // Проверяем таймауты
  if (lastLines.match(/timeout.*exceeded|Timeout.*exceeded/i)) {
    const timeoutMatch = lastLines.match(/waiting for (.+?) to be visible|navigating to (.+?)/i);
    return {
      type: 'timeout',
      scenario,
      details: timeoutMatch ? timeoutMatch[1] || timeoutMatch[2] : 'unknown',
    };
  }

  // Проверяем ошибки элементов
  if (lastLines.match(/locator.*not found|element.*not found/i)) {
    const locatorMatch = lastLines.match(/locator\(['"](.+?)['"]\)/i);
    return {
      type: 'locator',
      scenario,
      details: locatorMatch ? locatorMatch[1] : 'unknown',
    };
  }

  return null;
}

function fixTimeoutInCode(scenario, error) {
  log(`🔧 Исправляю таймаут в ${scenario}...`);
  
  // Читаем код
  let code = fs.readFileSync(CODE_FILE, 'utf-8');
  
  // Ищем сценарий
  const scenarioRegex = new RegExp(`'${scenario.replace(/:/g, '\\:')}':\\s*async\\s*\\(session\\)\\s*=>\\s*\\{([^}]+)\\}`, 's');
  const match = code.match(scenarioRegex);
  
  if (!match) {
    log(`⚠️  Не найден сценарий ${scenario} в коде`);
    return false;
  }
  
  let scenarioCode = match[1];
  const originalCode = scenarioCode;
  
  // Исправляем waitForLoadState на domcontentloaded
  scenarioCode = scenarioCode.replace(/waitForLoadState\(['"]networkidle['"]\)/g, "waitForLoadState('domcontentloaded')");
  
  // Добавляем паузу после gotoRelative если её нет
  if (!scenarioCode.includes('waitForTimeout(2000)') && !scenarioCode.includes('waitForTimeout(3000)')) {
    scenarioCode = scenarioCode.replace(
      /gotoRelative\([^)]+\)/,
      (match) => `${match}\n    await session.page.waitForTimeout(2000)`
    );
  }
  
  // Увеличиваем таймауты в waitFor
  scenarioCode = scenarioCode.replace(
    /waitFor\(\{\s*state:\s*['"]visible['"]\s*\}\)/g,
    "waitFor({ state: 'visible', timeout: 10000 })"
  );
  
  if (scenarioCode !== originalCode) {
    code = code.replace(scenarioRegex, `'${scenario.replace(/:/g, '\\:')}': async (session) => {${scenarioCode}}`);
    fs.writeFileSync(CODE_FILE, code, 'utf-8');
    log(`✅ Исправлен ${scenario}`);
    return true;
  }
  
  log(`ℹ️  ${scenario} уже исправлен`);
  return false;
}

function fixScenario(scenario, logFile) {
  if (!fs.existsSync(logFile)) {
    log(`⚠️  Лог файл не найден: ${logFile}`);
    return false;
  }
  
  const error = analyzeLog(scenario, logFile);
  
  if (!error) {
    log(`ℹ️  Ошибка не обнаружена в ${scenario}`);
    return false;
  }
  
  log(`⚠️  Обнаружена ошибка в ${scenario}: ${error.type}`);
  
  if (error.type === 'timeout') {
    return fixTimeoutInCode(scenario, error);
  }
  
  return false;
}

function main() {
  // Если переданы аргументы - исправляем конкретный сценарий
  const args = process.argv.slice(2);
  
  if (args.length >= 2) {
    const scenario = args[0];
    const logFile = args[1];
    
    log(`🔍 Анализирую ошибку в ${scenario}...`);
    const fixed = fixScenario(scenario, logFile);
    
    if (fixed) {
      log(`✅ Исправлен ${scenario}`);
      process.exit(0);
    } else {
      log(`ℹ️  ${scenario} не требует исправлений или уже исправлен`);
      process.exit(1);
    }
  }
  
  // Иначе - анализируем все логи (старый режим)
  log('🔍 Запускаю автоматическое исправление ошибок в коде...');
  
  if (!fs.existsSync(SCRAPE_LOG_DIR)) {
    log('⚠️  Папка логов не найдена');
    return;
  }
  
  const logs = fs.readdirSync(SCRAPE_LOG_DIR)
    .filter(f => f.endsWith('.log'))
    .map(f => ({
      scenario: f.replace('.log', ''),
      logFile: path.join(SCRAPE_LOG_DIR, f),
    }));
  
  let fixed = 0;
  
  for (const { scenario, logFile } of logs) {
    const error = analyzeLog(scenario, logFile);
    
    if (error) {
      log(`⚠️  Обнаружена ошибка в ${scenario}: ${error.type}`);
      
      if (error.type === 'timeout') {
        if (fixTimeoutInCode(scenario, error)) {
          fixed++;
        }
      }
    }
  }
  
  if (fixed > 0) {
    log(`✅ Исправлено ${fixed} сценариев`);
  } else {
    log('ℹ️  Все ошибки уже исправлены в коде');
  }
}

if (require.main === module) {
  main();
}

