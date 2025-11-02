// Скрипт для извлечения HTML/CSS структуры из Kwid
// Используется через Playwright MCP

const extractPageStructure = async (page) => {
  // Получаем полный HTML
  const html = await page.content();
  
  // Получаем computed styles для всех элементов
  const styles = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const stylesMap = {};
    
    elements.forEach((el, index) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      stylesMap[`element-${index}`] = {
        tag: el.tagName,
        classes: Array.from(el.classList),
        id: el.id,
        styles: {
          display: computed.display,
          position: computed.position,
          width: computed.width,
          height: computed.height,
          margin: computed.margin,
          padding: computed.padding,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          border: computed.border,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
        },
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        }
      };
    });
    
    return stylesMap;
  });
  
  return { html, styles };
};

module.exports = { extractPageStructure };
