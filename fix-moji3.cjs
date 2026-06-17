const fs = require('fs');
const path = require('path');

// Byte-level replacement approach:
// Read files as buffer, find garbled byte sequences, replace with correct UTF-8 bytes

const fixes = [
  {
    file: 'frontend/src/components/CultivationAdvancedPanels.vue',
    // The garbled text appears between <span> and </span> on line 960
    // We'll search by line number and replace the garbled span content
    lineNumber: 960, // 1-indexed
    findPattern: /<span>[^<]*缁煎悎[^<]*<\/span>/,
    replacement: '<span>综合运行天数、环境评分、形态记录和阶段合规</span>'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    lineNumber: 138,
    findPattern: /<h2>SLA \/ [^<]*<\/h2>/,
    replacement: '<h2>SLA / 运行保障</h2>'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    lineNumber: 217,
    findPattern: /<h2>[^<]*\/[^<]*<\/h2>/,
    replacement: '<h2>系统帮助 / 使用手册</h2>'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    lineNumber: 245,
    findPattern: /<h2>权限[^<]*<\/h2>/,
    replacement: '<h2>权限审计日志</h2>'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    lineNumber: 383,
    findPattern: /<h2>[^<]*<\/h2>/,
    replacement: '<h2>继续精调巡检</h2>'
  },
  {
    file: 'frontend/src/components/ProfessionalBatchPanels.vue',
    lineNumber: 296,
    findPattern: /<span>[^<]*瀹夎[^<]*<\/span>/,
    replacement: '<span>安装位置</span>'
  }
];

let changed = 0;

for (const fix of fixes) {
  const fp = path.resolve(__dirname, fix.file);
  const content = fs.readFileSync(fp, 'utf8');
  const lines = content.split('\n');
  const lineIdx = fix.lineNumber - 1;
  
  if (lineIdx >= lines.length) {
    console.log('SKIP (line out of range):', fix.file, 'L' + fix.lineNumber);
    continue;
  }
  
  const origLine = lines[lineIdx];
  if (fix.findPattern.test(origLine)) {
    lines[lineIdx] = origLine.replace(fix.findPattern, fix.replacement);
    fs.writeFileSync(fp, lines.join('\n'), 'utf8');
    console.log('FIXED:', fix.file, 'L' + fix.lineNumber);
    console.log('  FROM:', origLine.trim().substring(0, 100));
    console.log('  TO:  ', lines[lineIdx].trim().substring(0, 100));
    changed++;
  } else {
    console.log('WARN: pattern not matched:', fix.file, 'L' + fix.lineNumber);
    console.log('  ACTUAL:', JSON.stringify(origLine.trim().substring(0, 120)));
  }
}

console.log('\nTotal fixed:', changed);
