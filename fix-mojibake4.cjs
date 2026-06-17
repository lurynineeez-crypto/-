const fs = require('fs');
const path = require('path');

// Read the file as raw buffer
const filePath = path.join(__dirname, 'frontend/src/components/EngineeringDeliveryPanels.vue');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf8');
const lines = content.split('\n');

// Known line numbers (0-indexed) that need fixing and their replacement content
const lineFixes = {
  // Line 270 (0-indexed: 269): garbled search placeholder
  269: '      <div class="global-search-box">输入关键词搜索种植批次、报警、工艺页面</div>',
  // Line 370 (0-indexed: 369): garbled deployment checklist title
  369: '        <h2>部署检查清单</h2>',
  // Line 438 (0-indexed: 437): garbled template with missing {
  437: '          <p>{{ item.blocker }}</p>',
};

let fixCount = 0;
for (const [lineNum, newContent] of Object.entries(lineFixes)) {
  const idx = parseInt(lineNum);
  const oldLine = lines[idx];
  if (oldLine !== undefined) {
    console.log(`Line ${idx + 1}:`);
    console.log(`  OLD: ${oldLine.trim()}`);
    console.log(`  NEW: ${newContent.trim()}`);
    lines[idx] = newContent;
    fixCount++;
  }
}

if (fixCount > 0) {
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`\nFixed ${fixCount} lines`);
} else {
  console.log('No changes');
}
