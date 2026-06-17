/**
 * 修复已知乱码：将 GBK→UTF8 双重编码的乱码替换为正确中文
 */
const fs = require('fs');
const path = require('path');

const replacements = [
  // CultivationAdvancedPanels.vue
  {
    file: 'frontend/src/components/CultivationAdvancedPanels.vue',
    garbled: '缁煎悎杩愯澶╂暟銆佺幆澧冭瘎鍒嗐€佸舰鎬佽褰曞拰',
    fixed: '综合运行天数、环境评分、形态记录和'
  },
  // EngineeringDeliveryPanels.vue
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    garbled: '瀹¤鏃ュ織',
    fixed: '审计日志'
  },
  // ProfessionalBatchPanels.vue
  {
    file: 'frontend/src/components/ProfessionalBatchPanels.vue',
    garbled: '瀹夎浣嶇疆',
    fixed: '安装位置'
  }
];

let changed = 0;
for (const r of replacements) {
  const fp = path.resolve(__dirname, r.file);
  if (!fs.existsSync(fp)) { console.log('SKIP (not found):', r.file); continue; }
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes(r.garbled)) {
    content = content.replace(r.garbled, r.fixed);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('FIXED:', r.file, '→', r.fixed);
    changed++;
  } else {
    // Try to find the garbled text by scanning byte-by-byte
    console.log('WARN: exact garbled not found in', r.file, '- searching broader patterns...');
    // Search for partial patterns
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('缁煎') || line.includes('瀹¤') || line.includes('瀹夎')) {
        console.log('  Found at line', i + 1, ':', line.trim().substring(0, 120));
      }
    });
  }
}

// Also scan for any remaining mojibake patterns in frontend/src and backend/src
const scanDir = (dir, exts) => {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { scanDir(full, exts); continue; }
    if (!exts.some(ext => e.name.endsWith(ext))) continue;
    const content = fs.readFileSync(full, 'utf8');
    // Common mojibake: chars like 缁/瀹/銆/鍒/褰/鎬 etc are typical GBK-misread-as-UTF8
    const mojibakePattern = /[缁瀹銆鍒褰鎬悎杩愯褰鎬悎杩愯澶╂暟佺幆澧冭瘎嗐€舰鎬佽鏃ュ織夎浣嶇疆]/;
    if (mojibakePattern.test(content)) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (mojibakePattern.test(line)) {
          console.log('MOJIBAKE?', full + ':' + (i+1) + ':', line.trim().substring(0, 120));
        }
      });
    }
  }
};

console.log('\n--- Scanning for remaining mojibake ---');
scanDir(path.resolve(__dirname, 'frontend/src'), ['.vue', '.ts', '.js', '.cjs']);
scanDir(path.resolve(__dirname, 'backend/src'), ['.ts', '.js', '.cjs']);

console.log('\nDone. Fixed:', changed, 'files.');
