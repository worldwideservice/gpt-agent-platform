const fs = require('fs').promises;
const path = require('path');

async function generateSummary() {
  const outputDir = path.join(__dirname, '..');
  const summary = {
    timestamp: new Date().toISOString(),
    extracted: {
      jsFiles: 0,
      cssFiles: 0,
      htmlFiles: 0,
      jsonFiles: 0,
      totalSize: 0
    },
    structure: {}
  };
  
  async function scanDir(dir, prefix = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    summary.structure[prefix || 'root'] = {
      files: [],
      dirs: []
    };
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        summary.structure[prefix || 'root'].dirs.push(entry.name);
        await scanDir(fullPath, relPath);
      } else {
        const stats = await fs.stat(fullPath);
        summary.structure[prefix || 'root'].files.push({
          name: entry.name,
          size: stats.size,
          ext: path.extname(entry.name)
        });
        
        summary.extracted.totalSize += stats.size;
        
        if (entry.name.endsWith('.js')) summary.extracted.jsFiles++;
        if (entry.name.endsWith('.css')) summary.extracted.cssFiles++;
        if (entry.name.endsWith('.html')) summary.extracted.htmlFiles++;
        if (entry.name.endsWith('.json')) summary.extracted.jsonFiles++;
      }
    }
  }
  
  await scanDir(outputDir);
  
  // Сохраняем summary
  await fs.writeFile(
    path.join(outputDir, 'extraction-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log('📊 Extraction Summary:');
  console.log(`  JS files: ${summary.extracted.jsFiles}`);
  console.log(`  CSS files: ${summary.extracted.cssFiles}`);
  console.log(`  HTML files: ${summary.extracted.htmlFiles}`);
  console.log(`  JSON files: ${summary.extracted.jsonFiles}`);
  console.log(`  Total size: ${(summary.extracted.totalSize / 1024 / 1024).toFixed(2)} MB`);
}

generateSummary().catch(console.error);

