<script setup lang="ts">
import { Activity, CheckCircle2, FileText, Layers, MapPinned, ShieldAlert } from 'lucide-vue-next';
import type { ViewKey } from '../types';
import type { ConnectionState } from '../data/demo-fallback';

defineProps<{
  activeView: 'reports' | 'acceptance' | 'audit' | 'presentation';
  unifiedMetrics: {
    batch: string;
    stage: string;
    envScore: number;
    envLevel: string;
    maxRisk: string;
    nextAction: string;
    pendingCount: number;
    alarmCount: number;
  };
  displayAlarms: any[];
  displaySensors: any[];
  cult: any;
  admin: any;
  eng: any;
  connectionState: ConnectionState;
}>();

const emit = defineEmits<{
  navigate: [view: ViewKey];
  preview: [report: { name: string; type: string; status: string; content: string }];
}>();

const reportFiles = [
  { name: '运行日报 2026-06-14', type: '日报', status: '已生成', time: '2026-06-14 23:59', owner: '系统自动', content: '今日环境达标率 92%，在线率 100%。下层湿度触发预警 1 次，已形成复核动作。设备均来自既有硬件清单，未新增点位。' },
  { name: '运行周报 第24周', type: '周报', status: '已生成', time: '2026-06-14 08:00', owner: '系统自动', content: '本周环境达标率均值 91.5%，报警 8 次，均进入闭环或处理中。建议继续关注新风响应效率和下层湿度扩散。' },
  { name: '子实体形成期阶段报告', type: '阶段报告', status: '已生成', time: '2026-06-15 00:01', owner: '种植负责人', content: '阶段内温湿度整体稳定，CO2 回落速度存在短时偏慢。光照均匀度满足当前阶段要求。' },
  { name: '批次 JE-202606-001 复盘报告', type: '批次复盘', status: '待生成', time: '采收后', owner: '种植负责人', content: '' },
  { name: '交付验收报告', type: '验收报告', status: '待复核', time: '2026-06-15', owner: '管理者', content: '原型覆盖 68 个既有硬件点位，包含三维舱体预留、报警闭环、批次追溯、报告交付和种植员演示视图。' },
  { name: '报警汇总报告 2026-06', type: '月报', status: '已生成', time: '2026-06-14 23:59', owner: '系统自动', content: '本月报警以湿度和 CO2 预警为主，均未触发重大安全事件。' }
];

const traceChain = [
  { node: '入舱', time: '2026-06-08', owner: '种植员', evidence: '菌包批次档案 + 入舱登记', status: '已完成' },
  { node: '现蕾', time: '2026-06-13', owner: '种植员', evidence: '形态记录 + 阶段达标率', status: '处理中' },
  { node: '子实体形成', time: '2026-06-16', owner: '种植员', evidence: '温湿度 / CO2 / 光照达标报告', status: '待处理' },
  { node: '采收', time: '2026-06-26~06-28', owner: '种植员', evidence: '采收分级 + 层架产量', status: '关注' },
  { node: '清舱', time: '采收后', owner: '运维员', evidence: '清舱消毒 + 门磁 / 安全记录', status: '待处理' },
  { node: '复盘', time: '清舱后', owner: '管理者', evidence: '批次报告 + 下批优化建议', status: '待处理' }
];

const acceptanceList = [
  { item: '前端原型', standard: '68 点位 + 5 组导航 + 页面隔离', result: '已完成', owner: '开发团队', status: '通过' },
  { item: '三维模型预留', standard: 'GLTFLoader 已预留', result: '已完成', owner: '前端', status: '通过' },
  { item: '点位台账', standard: '68 个点位已录入', result: '等待现场复核', owner: '系统原型', status: '待复核' },
  { item: '报警闭环', standard: '事件到工单再到复核', result: '链路已预留', owner: '前端 / 后端', status: '通过' },
  { item: '批次追溯', standard: '入舱到复盘证据链', result: '6 节点完整', owner: '前端', status: '通过' },
  { item: '报表导出', standard: '预留 PDF / Excel 入口', result: '待接数据库', owner: '前端', status: '待接入' },
  { item: '种植员演示视图', standard: '默认只展示演示主线入口', result: '原型完成', owner: '前端', status: '待接入' }
];

const auditRows = [
  { operator: '管理员', time: '2026-06-14 09:20', before: '湿度下限 85%', after: '湿度下限 86%', reason: '子实体期下层湿度波动偏大', auditStatus: '已记录' },
  { operator: '种植主管', time: '2026-06-13 16:10', before: 'CO2 预警 2000ppm', after: 'CO2 预警 1900ppm', reason: '提前触发新风联动观察', auditStatus: '已记录' }
];

const demoScriptSteps = [
  { step: 1, what: '看总览状态', page: '运营总览', target: 'overview' as ViewKey, evidence: '环境评分、批次、风险、下一步动作' },
  { step: 2, what: '看三维点位', page: '三维舱体', target: 'cabin' as ViewKey, evidence: '68 个既有硬件点位按层架分布' },
  { step: 3, what: '看报警闭环', page: '报警处置', target: 'alarms' as ViewKey, evidence: '报警详情、处理、复核、闭环' },
  { step: 4, what: '看批次追溯', page: '批次总览', target: 'batch' as ViewKey, evidence: '入舱到采收再到复盘' },
  { step: 5, what: '看报告交付', page: '报告文件', target: 'reports' as ViewKey, evidence: '日报、周报、验收、审计记录' }
];

function handlePreview(file: typeof reportFiles[0]) {
  if (file.status !== '已生成' || !file.content) return;
  emit('preview', { name: file.name, type: file.type, status: file.status, content: file.content });
}
</script>

<template>
  <div class="report-center focused-workbench">
    <article class="report-section report-hero">
      <div class="section-title">
        <Activity :size="18" />
        <div>
          <h2>交付包状态</h2>
          <p>种植员演示只保留报告文件、验收材料、审计追溯和汇报演示。</p>
        </div>
      </div>
      <div class="summary-grid">
        <div class="summary-item"><span>当前批次</span><strong>{{ unifiedMetrics.batch }}</strong></div>
        <div class="summary-item"><span>当前阶段</span><strong>{{ unifiedMetrics.stage }}</strong></div>
        <div class="summary-item"><span>环境评分</span><strong>{{ unifiedMetrics.envScore }}</strong></div>
        <div class="summary-item"><span>待处理报警</span><strong>{{ unifiedMetrics.pendingCount }}</strong></div>
        <div class="summary-item"><span>硬件点位</span><strong>{{ displaySensors.length }} 个</strong></div>
        <div class="summary-item"><span>主要风险</span><strong class="text-warn">{{ unifiedMetrics.maxRisk }}</strong></div>
      </div>
    </article>

    <article v-if="activeView === 'reports'" class="report-section">
      <div class="section-title"><FileText :size="18" /><h2>报告文件</h2></div>
      <div class="report-table">
        <div class="rtable-head">
          <span>报告名称</span><span>类型</span><span>状态</span><span>生成时间</span><span>负责人</span><span>操作</span>
        </div>
        <div v-for="file in reportFiles" :key="file.name" class="rtable-row">
          <strong>{{ file.name }}</strong>
          <span>{{ file.type }}</span>
          <strong :class="file.status === '已生成' ? 'text-good' : 'text-warn'">{{ file.status }}</strong>
          <span>{{ file.time }}</span>
          <span>{{ file.owner }}</span>
          <div class="rtable-actions">
            <button type="button" class="btn-sm" :disabled="file.status !== '已生成' || !file.content" @click="handlePreview(file)">预览</button>
            <button type="button" class="btn-sm" :disabled="file.status !== '已生成'" @click="$emit('navigate', 'reports')">导出</button>
          </div>
        </div>
      </div>
    </article>

    <article v-else-if="activeView === 'acceptance'" class="report-section">
      <div class="section-title"><CheckCircle2 :size="18" /><h2>验收材料</h2></div>
      <div class="report-table">
        <div class="rtable-head five-col">
          <span>验收项</span><span>验收标准</span><span>当前结果</span><span>责任人</span><span>状态</span>
        </div>
        <div v-for="item in acceptanceList" :key="item.item" class="rtable-row five-col">
          <strong>{{ item.item }}</strong>
          <span>{{ item.standard }}</span>
          <span>{{ item.result }}</span>
          <span>{{ item.owner }}</span>
          <strong :class="item.status === '通过' ? 'text-good' : 'text-warn'">{{ item.status }}</strong>
        </div>
      </div>
    </article>

    <template v-else-if="activeView === 'audit'">
      <article class="report-section">
        <div class="section-title"><Layers :size="18" /><h2>批次追溯链</h2></div>
        <div class="trace-flow">
          <div v-for="(node, i) in traceChain" :key="node.node" class="trace-node">
            <div class="trace-dot">{{ i + 1 }}</div>
            <strong>{{ node.node }}</strong>
            <span>{{ node.time }}</span>
            <small>{{ node.owner }} · {{ node.evidence }}</small>
            <em>{{ node.status }}</em>
          </div>
        </div>
      </article>

      <article class="report-section">
        <div class="section-title"><ShieldAlert :size="18" /><h2>审计与阈值变更</h2></div>
        <div class="report-table">
          <div class="rtable-head six-col">
            <span>修改人</span><span>修改时间</span><span>修改前</span><span>修改后</span><span>原因</span><span>审计状态</span>
          </div>
          <div v-for="row in auditRows" :key="row.time" class="rtable-row six-col">
            <span>{{ row.operator }}</span>
            <span>{{ row.time }}</span>
            <span>{{ row.before }}</span>
            <strong>{{ row.after }}</strong>
            <span>{{ row.reason }}</span>
            <strong class="text-ok">{{ row.auditStatus }}</strong>
          </div>
        </div>
      </article>
    </template>

    <article v-else class="report-section">
      <div class="section-title"><MapPinned :size="18" /><h2>汇报演示脚本</h2></div>
      <div class="demo-script-table">
        <div class="rtable-head four-col">
          <span>步骤</span><span>讲什么</span><span>对应页面</span><span>关键证据</span>
        </div>
        <div v-for="step in demoScriptSteps" :key="step.step" class="rtable-row four-col clickable" @click="emit('navigate', step.target)">
          <strong>{{ step.step }}</strong>
          <span>{{ step.what }}</span>
          <button type="button" class="btn-sm">{{ step.page }}</button>
          <small>{{ step.evidence }}</small>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.report-center { display: flex; flex-direction: column; gap: 12px; padding: 0 0 12px; }
.report-section { padding: 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); box-shadow: var(--shadow-card); }
.section-title { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.section-title h2 { font-size: 15px; margin: 0; }
.section-title p { margin: 3px 0 0; color: var(--muted); font-size: 12px; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
.summary-item { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; min-height: 72px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-alt); }
.summary-item span { font-size: 11px; color: var(--muted); }
.summary-item strong { color: var(--fg); font-size: 18px; line-height: 1.2; }
.text-good { color: var(--success); }
.text-ok { color: var(--info); }
.text-warn { color: var(--warning); }
.report-table { display: grid; gap: 6px; overflow-x: auto; }
.rtable-head,
.rtable-row { display: grid; grid-template-columns: 2fr .8fr .8fr 1.2fr .9fr 1fr; gap: 8px; min-width: 860px; padding: 8px 12px; border-radius: 8px; align-items: center; }
.rtable-head { background: color-mix(in oklch, var(--fg) 7%, var(--surface-alt)); color: var(--muted); font-size: 12px; font-weight: 700; }
.rtable-row { min-height: 42px; background: var(--surface-alt); font-size: 13px; transition: background .15s ease, box-shadow .15s ease; }
.rtable-row:hover { background: var(--hover); box-shadow: 0 5px 14px color-mix(in oklch, var(--fg) 5%, transparent); }
.rtable-row.five-col,
.rtable-head.five-col { grid-template-columns: 1.1fr 1.6fr 1.2fr .9fr .8fr; }
.rtable-row.six-col,
.rtable-head.six-col { grid-template-columns: .8fr 1.1fr 1.1fr 1.1fr 1.7fr .8fr; }
.rtable-row.four-col,
.rtable-head.four-col { grid-template-columns: .5fr 1.5fr 1fr 2fr; }
.rtable-row span,
.rtable-row small { color: var(--muted); line-height: 1.45; }
.rtable-row > strong:not(:first-child),
.trace-node em { display: inline-flex; align-items: center; justify-content: center; width: fit-content; min-height: 24px; padding: 0 9px; border-radius: 999px; background: var(--primary-soft); color: var(--primary-strong); font-size: 12px; font-weight: 750; line-height: 1; font-style: normal; }
.rtable-actions { display: flex; gap: 6px; }
.btn-sm { min-height: 26px; padding: 0 9px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: var(--primary-strong); font-size: 11px; font-weight: 700; cursor: pointer; }
.btn-sm:disabled { opacity: .45; cursor: not-allowed; }
.btn-sm:not(:disabled):hover { background: var(--primary); color: var(--surface); }
.trace-flow { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0 2px; }
.trace-node { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; min-width: 136px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-alt); }
.trace-dot { width: 24px; height: 24px; border-radius: 6px; background: var(--primary); color: var(--surface); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.trace-node strong { font-size: 13px; }
.trace-node span,
.trace-node small { font-size: 11px; color: var(--muted); }
.rtable-row.clickable { cursor: pointer; }
@media (max-width: 768px) {
  .summary-grid { grid-template-columns: 1fr; }
  .rtable-head { display: none; }
  .rtable-row,
  .rtable-row.five-col,
  .rtable-row.six-col,
  .rtable-row.four-col { grid-template-columns: 1fr; min-width: 0; padding: 12px; }
  .trace-flow { flex-direction: column; }
  .trace-node { min-width: 0; }
}
</style>
