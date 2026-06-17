const fs = require('fs');
const path = require('path');

const fixes = [
  // ProfessionalBatchPanels.vue
  ['鐐逛綅', '点位'],
  ['瀹夎浣嶇疆', '安装位置'],
  ['椋庨櫓', '风险'],
  // CultivationAdvancedPanels.vue
  ['闃舵鑷姩鍒ゅ畾閫昏緫', '阶段自动判定逻辑'],
  ['鐢熼暱鍘嬪姏鎸囨暟', '生长压力指数'],
  ['缃俊搴︼細', '置信度：'],
  ['璇勫垎', '评分'],
  ['閲囨敹', '采收'],
  ['鐗瑰緛', '特征'],
  ['鑺傜偣', '节点'],
  ['缁煎悎杩愯澶╂暟銆佺幆澧冭瘎鍒嗐€佸舰鎬佽褰曞拰闃舵鍚堣', '综合运行天数、环境评分、形态记录和阶段合规'],
  ['閿佸畾锛', '锁定：'],
  ['渚嬪锛', '例外：'],
  ['鎹細', '证据：'],
  ['閫氳繃', '通过'],
  ['鏆傜紦', '暂缓'],
  ['缁撴灉锛', '结果：'],
  ['鍚堟牸', '合格'],
  // EngineeringDeliveryPanels.vue
  ['鎸囨爣', '指标'],
  ['缁撴灉', '结果'],
  ['SLA / 杩愯淇濇殰', 'SLA / 运行保障'],
  ['鎺ュ彛鏂囨。椤甸潰', '接口文档页面'],
  ['绯荤粺甯姪 / 浣跨敤鎵嬪唽', '系统帮助 / 使用手册'],
  ['寮傚父婕旂粌妯″紡', '异常演练模式'],
  ['鏉冮檺瀹¤鏃ュ織', '权限审计日志'],
  ['缂佺喍绔撮幖婊呭偍', '全局检索'],
  ['鏉堟挸鍙嗘导鐘冲妳閸ｃ劎绱崣鏋偓浣哄仯娴ｅ秴鎮曠粔鑸烽于偓浣瑰Г鐠€锔衡偓浣镐紣閸楁洏鈧焦澹掑▎掳鈧讣OP閵嗕焦濮ょ悰', '输入关键词搜索种植批次、报警、工艺页面'],
  ['閻滄澘婧€闁劎璁插〒鍛ekk礋', '部署检查清单'],
  ['缃洵绮洪懛顏咁梾', '自检列表'],
  ['绯荤粺浜や粯楠屾敹娓呭崟', '系统交付验收清单'],
  ['妤犲本鏁规い', '类别'],
  ['椤甸潰鏉冮檺鐭╅樀', '页面权限矩阵'],
  ['妞ょ敻娼伴懠鍐ㄦ淳', '允许访问页面'],
  ['鏉冮檺', '权限'],
  ['閰嶇疆妯℃澘', '配置模板'],
  ['濮瑰洦濮ゆ径褍鐫嗛懘姘拱', '汇报脚本模型'],
  ['娑撴艾濮熷ù浣衡柤濞夋娊浜鹃崶', '流程泳道视图'],
  ['鏍藉煿鎿嶄綔璁板綍妯℃澘', '栽培操作记录模板'],
  ['鐢熺墿瀹夊叏璁板綍', '生物安全记录'],
  // Also fix broken template syntax found in EngineeringDeliveryPanels.vue
  ['闂冭顢ｉ敍姝縶 item.blocker }', '{ item.blocker }'],
  // Fix view name navigation labels
  ['鐠哄疇娴嗛敍姝縶 navItems.find((nav) => nav.key === item.view)?.label ?? item.view }}', '{{ navItems.find((nav) => nav.key === item.view)?.label ?? item.view }}'],
];

const files = [
  'frontend/src/components/ProfessionalBatchPanels.vue',
  'frontend/src/components/CultivationAdvancedPanels.vue',
  'frontend/src/components/EngineeringDeliveryPanels.vue',
  'frontend/src/components/OverviewWorkspace.vue',
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skip (not found): ${file}`);
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
    console.log(`Fixed ${changeCount} patterns in ${file}`);
  } else {
    console.log(`No changes in ${file}`);
  }
}

console.log('Done!');
