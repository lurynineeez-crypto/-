const fs = require('fs');
const path = require('path');

const fixes = [
  // CultivationAdvancedPanels.vue remaining
  ['闃舵鑷姩姩鍒ゅ畾閫昏緫', '阶段自动判定逻辑'],
  ['渚嬪锛', '例外：'],
  ['锛涜瘉鎹細', '；证据：'],
  // EngineeringDeliveryPanels.vue remaining
  ['鏉堟挸鍙嗘导鐘冲妳閸ｃ劎绱崣鏋偓浣哄仯娴ｅ秴鎮曠粔鑸烽于偓浣瑰Г鐠€锔衡偓浣镐紣閸楁洏鈧焦澹掑焦澹掑▎掳鈧讣OP閵嗕焦濮ょ悰', '输入关键词搜索种植批次、报警、工艺页面'],
  ['閻滄澘婧€闁劎璁插〒鍛ekk礋', '部署检查清单'],
  ['闂冭顢ｉ敍姝縶 item.blocker }', '{ item.blocker }'],
  // Fix possible double-stored patterns
  ['闃舵', '阶段'],
  ['鐢熼暱鍘嬪姏', '生长压力'],
];

const files = [
  'frontend/src/components/CultivationAdvancedPanels.vue',
  'frontend/src/components/EngineeringDeliveryPanels.vue',
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log('Skip (not found): ' + file);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changeCount = 0;
  for (const [from, to] of fixes) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      changeCount++;
    }
  }
  if (changeCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed ' + changeCount + ' patterns in ' + file);
  } else {
    console.log('No changes in ' + file);
  }
}
console.log('Done!');
