/**
 * 修复已知乱码：按行内容精确替换
 */
const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'frontend/src/components/CultivationAdvancedPanels.vue',
    // L960: <span>缁煎悎杩愯澶╂暟銆佺幆澧冭瘎鍒嗐€佸舰鎬佽褰曞拰阶段鍚堣</span>
    find: /缁煎悎杩愯澶╂暟銆佺幆澧冭瘎鍒嗐€佸舰鎬佽褰曞拰阶段/g,
    replace: '综合运行天数、环境评分、形态记录和阶段'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    // L138: SLA / 杩愯淇濋殰
    find: /杩愯淇濋殰/g,
    replace: '运行保障'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    // L217: 绯荤粺甯姪 / 浣跨敤鎵嬪唽
    find: /绯荤粺甯姪 \/ 浣跨敤鎵嬪唽/g,
    replace: '系统帮助 / 使用手册'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    // L245: 权限瀹¤鏃ュ織
    find: /瀹¤鏃ュ織/g,
    replace: '审计日志'
  },
  {
    file: 'frontend/src/components/EngineeringDeliveryPanels.vue',
    // L383: 缁崵绮洪懛顏咁梾
    find: /缁崵绮洪懛顏咁梾/g,
    replace: '继续精调巡检'
  },
  {
    file: 'frontend/src/components/ProfessionalBatchPanels.vue',
    // L296: 瀹夎浣嶇疆
    find: /瀹夎浣嶇疆/g,
    replace: '安装位置'
  }
];

let changed = 0;
for (const r of fixes) {
  const fp = path.resolve(__dirname, r.file);
  if (!fs.existsSync(fp)) { console.log('SKIP:', r.file); continue; }
  let content = fs.readFileSync(fp, 'utf8');
  if (r.find.test(content)) {
    content = content.replace(r.find, r.replace);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('FIXED:', r.file, '→', r.replace);
    changed++;
  } else {
    console.log('WARN: pattern not found in', r.file);
  }
}

console.log('\nTotal fixed:', changed);
