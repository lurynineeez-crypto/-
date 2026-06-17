const fs = require('fs');
const path = require('path');

// Fix remaining mojibake in CultivationAdvancedPanels.vue
const filePath = path.join(__dirname, 'frontend/src/components/CultivationAdvancedPanels.vue');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Lines with remaining mojibake (0-indexed)
const lineFixes = {
  // Line 363 (0-indexed 362): garbled "阶段自动判定逻辑"
  362: '          <h2>阶段自动判定逻辑</h2>',
  // Line 1146 (0-indexed 1145): garbled "例外：...；证据：..."
  1145: '            <p>例外：{{ item.exception }}；证据：{{ item.evidence }}</p>',
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
