const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'https://aai.widgets.wearekwid.com';
const TENANT_ID = '1000373-worldwideservices';

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'livewire');

async function extractLivewireComponents() {
  console.log('🔄 Extracting Livewire components...\n');
  
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  // Перехватываем Livewire запросы
  const livewireRequests = [];
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/livewire/update')) {
      try {
        const request = response.request();
        const postData = request.postData();
        const responseData = await response.json().catch(() => null);
        
        livewireRequests.push({
          url,
          method: request.method(),
          postData: postData ? JSON.parse(postData) : null,
          response: responseData,
          timestamp: Date.now()
        });
      } catch (e) {
        console.error('Error capturing Livewire request:', e.message);
      }
    }
  });
  
  const pages = [
    { name: 'dashboard', url: `${BASE_URL}/manage/${TENANT_ID}` },
    { name: 'ai-agents', url: `${BASE_URL}/manage/${TENANT_ID}/ai-agents` },
    { name: 'ai-agent-edit', url: `${BASE_URL}/manage/${TENANT_ID}/ai-agents/553/edit` },
    { name: 'test-chat', url: `${BASE_URL}/manage/${TENANT_ID}/test-chat` }
  ];
  
  for (const pageInfo of pages) {
    try {
      console.log(`  → ${pageInfo.name}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Извлекаем все Livewire компоненты
      const components = await page.evaluate(() => {
        const comps = [];
        
        document.querySelectorAll('[wire\\:id]').forEach(el => {
          const wireId = el.getAttribute('wire:id');
          const snapshot = el.getAttribute('wire:snapshot');
          const effects = el.getAttribute('wire:effects');
          
          let parsedSnapshot = null;
          let parsedEffects = null;
          
          if (snapshot) {
            try {
              parsedSnapshot = JSON.parse(snapshot);
            } catch (e) {}
          }
          
          if (effects) {
            try {
              parsedEffects = JSON.parse(effects);
            } catch (e) {}
          }
          
          // Извлекаем все wire атрибуты
          const wireAttrs = {};
          Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('wire:')) {
              wireAttrs[attr.name] = attr.value;
            }
          });
          
          // Извлекаем wire:model связи
          const wireModels = [];
          el.querySelectorAll('[wire\\:model], [wire\\:model\\.defer], [wire\\:model\\.lazy]').forEach(input => {
            wireModels.push({
              model: input.getAttribute('wire:model') || 
                     input.getAttribute('wire:model.defer') || 
                     input.getAttribute('wire:model.lazy'),
              element: {
                tag: input.tagName,
                id: input.id,
                name: input.name,
                type: input.type || input.tagName.toLowerCase(),
                value: input.value || input.checked
              }
            });
          });
          
          // Извлекаем wire:click действия
          const wireClicks = [];
          el.querySelectorAll('[wire\\:click]').forEach(btn => {
            wireClicks.push({
              action: btn.getAttribute('wire:click'),
              text: btn.textContent.trim().substring(0, 50),
              className: btn.className
            });
          });
          
          comps.push({
            wireId,
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            snapshot: parsedSnapshot,
            effects: parsedEffects,
            wireAttributes: wireAttrs,
            wireModels,
            wireClicks,
            html: el.outerHTML.substring(0, 2000)
          });
        });
        
        // Получаем информацию о Livewire
        let livewireInfo = null;
        if (window.Livewire) {
          try {
            const allComponents = window.Livewire.all();
            livewireInfo = {
              version: window.Livewire.version || 'unknown',
              componentsCount: allComponents ? Object.keys(allComponents).length : 0,
              components: allComponents || {}
            };
          } catch (e) {
            livewireInfo = { error: e.message };
          }
        }
        
        return {
          components: comps,
          livewireInfo,
          url: window.location.href
        };
      });
      
      await fs.writeFile(
        path.join(OUTPUT_DIR, `${pageInfo.name}-components.json`),
        JSON.stringify(components, null, 2)
      );
      
      // Выполняем некоторые действия для захвата Livewire запросов
      if (pageInfo.name === 'ai-agent-edit') {
        // Нажимаем на переключатель
        try {
          await page.click('input[type="checkbox"]', { timeout: 5000 });
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {}
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`❌ Error on ${pageInfo.name}:`, error.message);
    }
  }
  
  // Сохраняем перехваченные запросы
  if (livewireRequests.length > 0) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'livewire-requests.json'),
      JSON.stringify(livewireRequests, null, 2)
    );
  }
  
  await browser.close();
  
  console.log('\n✅ Livewire extraction complete!');
}

extractLivewireComponents().catch(console.error);

