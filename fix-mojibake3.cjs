const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/components/EngineeringDeliveryPanels.vue');
let content = fs.readFileSync(file, 'utf8');

// Fix deeply garbled strings by reading them as Buffer and doing exact replacement
const replacements = [
  // Line 270: deeply garbled search placeholder
  ['鏉堟挸鍙嗘导鐘冲妳閸ｃ劎绱崣鏋偓浣哄仯娴娴ｅ秴鎮曠粔鑸烽于偓浣瑰Г鐠€锔衡偓浣镐紣閸楁洏鈧焦澹掑焦澹掑▎掳鈧讣OP閵嗕焦濮ょ悰', '输入关键词搜索种植批次、报警、工艺页面'],
  // Line 370: deeply garbled deployment checklist
  ['閻滄澘婧€闁劎璁插插〒鍛ekk礋', '部署检查清单'],
  // Line 438: deeply garbled template with missing {
  ['闂冭顢ｉ敍姝縶 item.blocker }', '{ item.blocker }'],
];

let count = 0;
for (const [from, to] of replacements) {
  if (content.includes(from)) {
    content = content.replace(from, to);
    count++;
    console.log('Replaced: ' + from.substring(0, 30) + '... -> ' + to);
  } else {
    // Try byte-level replacement
    const fromBuf = Buffer.from(from, 'utf8');
    const toBuf = Buffer.from(to, 'utf8');
    const contentBuf = Buffer.from(content, 'utf8');
    const idx = contentBuf.indexOf(fromBuf);
    if (idx >= 0) {
      const newBuf = Buffer.concat([
        contentBuf.subarray(0, idx),
        toBuf,
        contentBuf.subarray(idx + fromBuf.length)
      ]);
      content = newBuf.toString('utf8');
      count++;
      console.log('Replaced via buffer: ' + to);
    } else {
      console.log('NOT FOUND: ' + from.substring(0, 30) + '...');
    }
  }
}

if (count > 0) {
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed ' + count + ' patterns');
} else {
  console.log('No changes');
}
