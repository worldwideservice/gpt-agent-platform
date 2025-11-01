const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'components');

async function analyzeHTMLFiles() {
  console.log('🔍 Analyzing HTML files...\n');
  
  const htmlDir = path.join(DATA_DIR, 'html');
  const files = await fs.readdir(htmlDir);
  
  const components = {
    forms: [],
    buttons: [],
    inputs: [],
    selects: [],
    textareas: [],
    switches: [],
    tabs: [],
    cards: [],
    tables: [],
    modals: []
  };
  
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    
    console.log(`  Analyzing ${file}...`);
    const content = await fs.readFile(path.join(htmlDir, file), 'utf8');
    const $ = cheerio.load(content);
    
    // Формы
    $('form').each((i, el) => {
      const $form = $(el);
      components.forms.push({
        file,
        action: $form.attr('action'),
        method: $form.attr('method'),
        id: $form.attr('id'),
        className: $form.attr('class'),
        fields: $form.find('input, select, textarea').length
      });
    });
    
    // Кнопки
    $('button, [role="button"], .fi-btn').each((i, el) => {
      const $btn = $(el);
      components.buttons.push({
        file,
        text: $btn.text().trim().substring(0, 50),
        className: $btn.attr('class'),
        wireClick: $btn.attr('wire:click'),
        onclick: $btn.attr('onclick'),
        type: $btn.attr('type')
      });
    });
    
    // Инпуты
    $('input, textarea, select').each((i, el) => {
      const $input = $(el);
      components.inputs.push({
        file,
        type: $input.attr('type') || $input.prop('tagName').toLowerCase(),
        id: $input.attr('id'),
        name: $input.attr('name'),
        className: $input.attr('class'),
        placeholder: $input.attr('placeholder'),
        wireModel: $input.attr('wire:model') || $input.attr('wire:model.defer')
      });
    });
    
    // Переключатели
    $('[role="switch"], .fi-checkbox-input').each((i, el) => {
      const $switch = $(el);
      components.switches.push({
        file,
        id: $switch.attr('id'),
        className: $switch.attr('class'),
        checked: $switch.attr('checked') !== undefined,
        wireModel: $switch.attr('wire:model')
      });
    });
    
    // Вкладки
    $('[role="tablist"], [role="tab"]').each((i, el) => {
      const $tab = $(el);
      components.tabs.push({
        file,
        role: $tab.attr('role'),
        className: $tab.attr('class'),
        text: $tab.text().trim().substring(0, 50)
      });
    });
    
    // Карточки
    $('.fi-section, .fi-wi-stats-overview-stat, [class*="card"]').each((i, el) => {
      const $card = $(el);
      components.cards.push({
        file,
        className: $card.attr('class'),
        text: $card.text().trim().substring(0, 100)
      });
    });
    
    // Таблицы
    $('table').each((i, el) => {
      const $table = $(el);
      const rows = $table.find('tr').length;
      const cols = $table.find('tr').first().find('th, td').length;
      components.tables.push({
        file,
        className: $table.attr('class'),
        rows,
        cols
      });
    });
  }
  
  // Сохраняем анализ
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'components-analysis.json'),
    JSON.stringify(components, null, 2)
  );
  
  console.log('\n✅ Analysis complete!');
  console.log(`📊 Found:`);
  console.log(`  - Forms: ${components.forms.length}`);
  console.log(`  - Buttons: ${components.buttons.length}`);
  console.log(`  - Inputs: ${components.inputs.length}`);
  console.log(`  - Switches: ${components.switches.length}`);
  console.log(`  - Tabs: ${components.tabs.length}`);
  console.log(`  - Cards: ${components.cards.length}`);
  console.log(`  - Tables: ${components.tables.length}`);
}

analyzeHTMLFiles().catch(console.error);

