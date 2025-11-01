const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const beautify = require('js-beautify').js;
const https = require('https');
const http = require('http');

const BASE_URL = 'https://aai.widgets.wearekwid.com';
const TENANT_ID = '1000373-worldwideservices';
const TARGET_URL = `${BASE_URL}/manage/${TENANT_ID}`;

const OUTPUT_DIR = path.join(__dirname, '..');
const ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');
const DATA_DIR = path.join(OUTPUT_DIR, 'data');

// Создаем директории если их нет
async function ensureDirs() {
  const dirs = [
    ASSETS_DIR,
    path.join(ASSETS_DIR, 'js'),
    path.join(ASSETS_DIR, 'css'),
    path.join(ASSETS_DIR, 'images'),
    path.join(ASSETS_DIR, 'fonts'),
    DATA_DIR,
    path.join(DATA_DIR, 'html'),
    path.join(DATA_DIR, 'snapshots'),
    path.join(DATA_DIR, 'network'),
    path.join(DATA_DIR, 'localStorage'),
    path.join(OUTPUT_DIR, 'components'),
    path.join(OUTPUT_DIR, 'analysis')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Сохраняем файл
async function saveFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
  console.log(`✅ Saved: ${filePath}`);
}

// Скачиваем файл
async function downloadFile(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, response.data);
    console.log(`✅ Downloaded: ${url} -> ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error.message);
    return false;
  }
}

// Декомпилируем и сохраняем JS
async function beautifyAndSave(content, filePath) {
  try {
    const beautified = beautify(content, {
      indent_size: 2,
      space_in_empty_paren: true,
      preserve_newlines: true
    });
    await saveFile(filePath, beautified);
  } catch (error) {
    // Если не удалось декомпилировать, сохраняем как есть
    await saveFile(filePath, content);
  }
}

async function extractAll() {
  console.log('🚀 Starting full extraction...\n');
  
  await ensureDirs();
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  // Перехватываем все запросы
  const networkRequests = [];
  const networkResponses = [];
  
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
      resourceType: request.resourceType(),
      timestamp: Date.now()
    });
  });
  
  page.on('response', async response => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    
    networkResponses.push({
      url,
      status: response.status(),
      headers: response.headers(),
      contentType,
      timestamp: Date.now()
    });
    
    // Сохраняем JS файлы
    if (url.includes('.js') && !url.includes('livewire')) {
      try {
        const content = await response.text();
        const fileName = url.split('/').pop().split('?')[0];
        const filePath = path.join(ASSETS_DIR, 'js', fileName || `script-${Date.now()}.js`);
        await beautifyAndSave(content, filePath);
      } catch (e) {}
    }
    
    // Сохраняем CSS файлы
    if (url.includes('.css')) {
      try {
        const content = await response.text();
        const fileName = url.split('/').pop().split('?')[0];
        const filePath = path.join(ASSETS_DIR, 'css', fileName || `style-${Date.now()}.css`);
        await saveFile(filePath, content);
      } catch (e) {}
    }
  });
  
  // Переходим на страницу
  console.log(`📍 Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Извлекаем все данные со страницы
  console.log('📊 Extracting page data...');
  let pageData;
  try {
    pageData = await page.evaluate(() => {
    const data = {
      url: window.location.href,
      title: document.title,
      html: document.documentElement.outerHTML,
      scripts: [],
      styles: [],
      livewire: {},
      alpine: {},
      localStorage: {},
      sessionStorage: {},
      meta: {},
      computedStyles: {},
      allClasses: new Set(),
      wireComponents: []
    };
    
    // Все скрипты
    document.querySelectorAll('script[src]').forEach(script => {
      data.scripts.push({
        src: script.src,
        async: script.async,
        defer: script.defer,
        type: script.type
      });
    });
    
    // Все стили
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      data.styles.push({
        href: link.href,
        integrity: link.integrity
      });
    });
    
    // Meta теги
    document.querySelectorAll('meta[name], meta[property]').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      if (name) {
        data.meta[name] = meta.getAttribute('content');
      }
    });
    
    // LocalStorage и SessionStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data.localStorage[key] = localStorage.getItem(key);
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        data.sessionStorage[key] = sessionStorage.getItem(key);
      }
    } catch (e) {}
    
    // Livewire компоненты
    if (window.Livewire) {
      try {
        const components = window.Livewire.all();
        data.livewire = {
          version: window.Livewire.version || 'unknown',
          componentsCount: components ? Object.keys(components).length : 0,
          components: components || {}
        };
      } catch (e) {
        data.livewire.error = e.message;
      }
    }
    
    // Alpine.js
    if (window.Alpine) {
      data.alpine = {
        version: window.Alpine.version || 'unknown',
        hasData: typeof window.Alpine.data === 'function',
        hasStore: typeof window.Alpine.store === 'function'
      };
    }
    
    // Все классы
    document.querySelectorAll('*').forEach(el => {
      if (el.className && typeof el.className === 'string') {
        el.className.split(' ').forEach(cls => {
          if (cls) data.allClasses.add(cls);
        });
      }
    });
    
    // Livewire компоненты на странице
    document.querySelectorAll('[wire\\:id]').forEach(el => {
      const wireId = el.getAttribute('wire:id');
      const snapshot = el.getAttribute('wire:snapshot');
      const effects = el.getAttribute('wire:effects');
      
      const component = {
        wireId,
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        html: el.outerHTML.substring(0, 1000)
      };
      
      if (snapshot) {
        try {
          component.snapshot = JSON.parse(snapshot);
        } catch (e) {
          component.snapshotRaw = snapshot;
        }
      }
      
      if (effects) {
        try {
          component.effects = JSON.parse(effects);
        } catch (e) {
          component.effectsRaw = effects;
        }
      }
      
      // Все wire атрибуты
      component.wireAttributes = {};
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('wire:')) {
          component.wireAttributes[attr.name] = attr.value;
        }
      });
      
      // Wire models
      component.wireModels = [];
      el.querySelectorAll('[wire\\:model], [wire\\:model\\.defer], [wire\\:model\\.lazy]').forEach(input => {
        component.wireModels.push({
          model: input.getAttribute('wire:model') || input.getAttribute('wire:model.defer') || input.getAttribute('wire:model.lazy'),
          element: input.tagName,
          id: input.id,
          name: input.name,
          type: input.type || input.tagName.toLowerCase(),
          value: input.value
        });
      });
      
      data.wireComponents.push(component);
    });
    
    // Computed styles для основных элементов
    ['button', 'input', 'select', 'textarea', 'form'].forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        const computed = window.getComputedStyle(el);
        data.computedStyles[selector] = {
          padding: computed.padding,
          margin: computed.margin,
          borderRadius: computed.borderRadius,
          fontSize: computed.fontSize,
          fontFamily: computed.fontFamily,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          border: computed.border
        };
      }
    });
    
    return data;
    });
  } catch (error) {
    console.error('❌ Error extracting page data:', error.message);
    // Получаем HTML напрямую
    const html = await page.content();
    pageData = {
      url: page.url(),
      title: await page.title(),
      html: html,
      allClasses: new Set(),
      wireComponents: [],
      scripts: [],
      styles: [],
      localStorage: {},
      sessionStorage: {},
      meta: {}
    };
  }
  
  // Сохраняем HTML
  await saveFile(
    path.join(DATA_DIR, 'html', 'main-page.html'),
    pageData.html || await page.content()
  );
  
  // Сохраняем все данные
  const pageDataToSave = {
    ...pageData,
    allClasses: pageData.allClasses ? Array.from(pageData.allClasses) : []
  };
  await saveFile(
    path.join(DATA_DIR, 'page-data.json'),
    JSON.stringify(pageDataToSave, null, 2)
  );
  
  // Сохраняем классы
  if (pageData.allClasses && pageData.allClasses.size > 0) {
    await saveFile(
      path.join(DATA_DIR, 'all-classes.json'),
      JSON.stringify(Array.from(pageData.allClasses).sort(), null, 2)
    );
  }
  
  // Сохраняем Livewire компоненты
  await saveFile(
    path.join(DATA_DIR, 'snapshots', 'livewire-components.json'),
    JSON.stringify(pageData.wireComponents, null, 2)
  );
  
  // Сохраняем localStorage
  await saveFile(
    path.join(DATA_DIR, 'localStorage', 'localStorage.json'),
    JSON.stringify(pageData.localStorage, null, 2)
  );
  
  // Сохраняем network requests
  await saveFile(
    path.join(DATA_DIR, 'network', 'requests.json'),
    JSON.stringify(networkRequests, null, 2)
  );
  
  await saveFile(
    path.join(DATA_DIR, 'network', 'responses.json'),
    JSON.stringify(networkResponses, null, 2)
  );
  
  // Скачиваем все JS и CSS файлы
  console.log('\n📥 Downloading all assets...');
  const allAssets = [...pageData.scripts.map(s => s.src), ...pageData.styles.map(s => s.href)];
  
  for (const assetUrl of allAssets) {
    if (assetUrl.startsWith('http')) {
      const fileName = assetUrl.split('/').pop().split('?')[0];
      const ext = fileName.split('.').pop();
      
      if (ext === 'js') {
        await downloadFile(assetUrl, path.join(ASSETS_DIR, 'js', fileName));
      } else if (ext === 'css') {
        await downloadFile(assetUrl, path.join(ASSETS_DIR, 'css', fileName));
      }
    }
  }
  
  // Извлекаем данные со всех страниц
  const pages = [
    { name: 'dashboard', url: `${BASE_URL}/manage/${TENANT_ID}` },
    { name: 'ai-agents', url: `${BASE_URL}/manage/${TENANT_ID}/ai-agents` },
    { name: 'ai-agent-edit', url: `${BASE_URL}/manage/${TENANT_ID}/ai-agents/553/edit` },
    { name: 'test-chat', url: `${BASE_URL}/manage/${TENANT_ID}/test-chat` },
    { name: 'knowledge-categories', url: `${BASE_URL}/manage/${TENANT_ID}/knowledge-categories` },
    { name: 'knowledge-items', url: `${BASE_URL}/manage/${TENANT_ID}/knowledge-items` },
    { name: 'account-settings', url: `${BASE_URL}/manage/${TENANT_ID}/account-settings` },
    { name: 'pricing', url: `${BASE_URL}/manage/${TENANT_ID}/pricing` }
  ];
  
  console.log('\n📄 Extracting all pages...');
  for (const pageInfo of pages) {
    try {
      console.log(`  → ${pageInfo.name}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pageHtml = await page.content();
      await saveFile(
        path.join(DATA_DIR, 'html', `${pageInfo.name}.html`),
        pageHtml
      );
      
      // Извлекаем данные страницы
      const data = await page.evaluate(() => {
        return {
          url: window.location.href,
          title: document.title,
          wireComponents: Array.from(document.querySelectorAll('[wire\\:id]')).map(el => ({
            wireId: el.getAttribute('wire:id'),
            className: el.className,
            snapshot: el.getAttribute('wire:snapshot')
          }))
        };
      });
      
      await saveFile(
        path.join(DATA_DIR, 'snapshots', `${pageInfo.name}-data.json`),
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error(`❌ Failed to extract ${pageInfo.name}:`, error.message);
    }
  }
  
  await browser.close();
  
  console.log('\n✅ Extraction complete!');
  console.log(`📁 Data saved to: ${OUTPUT_DIR}`);
}

extractAll().catch(console.error);

