<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import {
  Activity,
  Bell,
  CheckCircle2,
  Clock3,
  Cloud,
  Droplets,
  FileText,
  Leaf,
  ListChecks,
  MapPinned,
  Radio,
  ShieldAlert,
  Siren,
  Sun,
  Target
} from 'lucide-vue-next';
import type { DashboardSummary, RoleKey, SceneMode, SensorPoint, SensorType, ViewKey } from '../types';
import type { NavItem, sceneModes, typeOptions } from '../data/navigation';

const CabinScene = defineAsyncComponent(() => import('./CabinScene.vue'));

type TypeOption = (typeof typeOptions)[number];
type SceneOption = (typeof sceneModes)[number];
interface GroupedNavItem {
  name: string;
  items: NavItem[];
}

const props = defineProps<{
  activeRole: RoleKey;
  activeLayer: string;
  activeType: SensorType | 'all';
  alarmTimeline: any[];
  displaySensors: SensorPoint[];
  filteredSensors: SensorPoint[];
  layerOptionItems: Array<{ value: string; label: string }>;
  sceneMode: SceneMode;
  sceneModes: SceneOption[];
  selectedSensor: SensorPoint | null;
  summary: DashboardSummary;
  typeOptions: TypeOption[];
  activeView?: ViewKey;
  groupedNavItems?: GroupedNavItem[];
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
}>();

const emit = defineEmits<{
  navigate: [view: ViewKey];
  selectSensor: [sensor: SensorPoint];
  updateActiveLayer: [layer: string];
  updateActiveType: [type: SensorType | 'all'];
  updateSceneMode: [mode: SceneMode];
  selectView: [view: ViewKey];
}>();

const AUX_KEYS: ViewKey[] = [
  'screen',
  'calendar',
  'recipe',
  'closure',
  'biosecurity',
  'experience',
  'quality',
  'professional',
  'security',
  'settings',
  'search',
  'explain',
  'display',
  'governance',
  'drill',
  'delivery'
];
const CORE_LIMIT = 6;
function isAuxItem(key: ViewKey): boolean {
  return AUX_KEYS.includes(key);
}
function primaryItems(items: NavItem[]): NavItem[] {
  const core = items.filter((item) => !isAuxItem(item.key)).slice(0, CORE_LIMIT);
  return core.length ? core : items.slice(0, CORE_LIMIT);
}
function overflowItems(items: NavItem[]): NavItem[] {
  const visible = new Set(primaryItems(items).map((item) => item.key));
  return items.filter((item) => !visible.has(item.key));
}
function isActiveGroup(group: GroupedNavItem) {
  return group.items.some((item) => item.key === props.activeView);
}

const commandCenter = {
  batch: 'JE-202606-001',
  stage: '子实体生长期',
  envScore: 91,
  onlinePoints: 68,
  totalPoints: 68,
  pendingAlarms: 6,
  time: '2026-06-16 17:08',
  shift: '晚班',
  maxRisk: '下层湿度偏低',
  riskPointLabel: 'TH-L2-002',
  riskPointActualId: 'TH-L2-006',
  humidity: '84.9%RH',
  humidityTarget: '≥85%RH',
  humidityDeviation: '-0.1%RH',
  duration: '38 分钟',
  nextAction: '17:30 前现场复核并记录',
  currentStage: '处理',
  nextStep: '提交复核',
  owner: '晚班种植员',
  reviewer: '班组长',
  pointStatus: {
    normal: 62,
    warning: 6,
    alarm: 0,
    offline: 0,
    online: 68
  }
};

const todayTasks = [
  {
    priority: 'P1',
    title: '复核下层湿度点位 TH-L2-002',
    target: 'TH-L2-002',
    due: '17:30',
    status: '待处理',
    action: '立即复核',
    tone: 'p1'
  },
  {
    priority: 'P2',
    title: '检查新风后 CO2 回落曲线',
    target: 'CO2-L2',
    due: '18:30',
    status: '待处理',
    action: '去处理',
    tone: 'p2'
  },
  {
    priority: 'P3',
    title: '完成晚班交接留痕',
    target: 'JE-202606-001',
    due: '19:00',
    status: '待处理',
    action: '记录',
    tone: 'p3'
  }
];

const envRows = [
  { icon: Activity, label: '温度', value: '21.3', unit: '°C', target: '18-22°C', status: '正常' },
  { icon: Droplets, label: '湿度', value: '84.9', unit: '%RH', target: '≥85%RH', status: '偏低', warn: true },
  { icon: Cloud, label: 'CO₂', value: '812', unit: 'ppm', target: '1500-2000 ppm', status: '观察' },
  { icon: Sun, label: '光照', value: '12.6', unit: 'klx', target: '500-1000 lx', status: '补光中' }
];

const sensorCallouts = [
  { className: 'callout-co2', label: 'CO2-L2', value: 'CO2 812 ppm' },
  { className: 'callout-rh', label: 'RH-L1-001', value: '湿度 87.1%RH' },
  { className: 'callout-ta', label: 'TA-L1-001', value: '温度 21.3°C' },
  { className: 'callout-hum', label: 'HUM-01', value: '加湿器 68%' },
  { className: 'callout-risk', label: 'TH-L2-002', value: '湿度 84.9%RH · 偏低', warn: true }
];

const selectedSensorFields = [
  ['点位编号', 'TH-L2-002'],
  ['点位名称', '下层湿度点'],
  ['所属区域', '下层栽培区 L2'],
  ['当前值', '84.9%RH', 'warn'],
  ['目标值', '≥85%RH'],
  ['偏差', '-0.1%RH', 'warn'],
  ['持续时长', '38 分钟'],
  ['数据更新', '17:08:12'],
  ['状态', '湿度偏低', 'warn'],
  ['参与联动', '加湿 / 新风 / 报警']
];

const nextActionItems = [
  '17:30 前复核 TH-L2-002',
  '检查 HUM-01 水位和雾化流量',
  '复查新风后 CO2 回落曲线'
];

const alarmChain = [
  { step: '报警', text: '已识别异常点位', state: 'done' },
  { step: '分派', text: '已分派种植员复核', state: 'done' },
  { step: '处理', text: '现场处理并记录', state: 'active' },
  { step: '复核', text: '班组长待复核', state: 'pending' },
  { step: '关闭', text: '完成后进入追溯', state: 'pending' }
];

const leftHeaderCards = computed(() => [
  { icon: Leaf, label: '当前批次', value: commandCenter.batch },
  { icon: Target, label: '当前阶段', value: commandCenter.stage },
  { icon: ShieldAlert, label: '环境评分', value: String(commandCenter.envScore), tone: 'score' }
]);

const rightHeaderCards = computed(() => [
  { icon: Activity, label: '在线点位', value: `${commandCenter.onlinePoints} / ${commandCenter.totalPoints}` },
  { icon: Bell, label: '待处理报警', value: String(commandCenter.pendingAlarms), tone: 'warn' },
  { icon: Clock3, label: '时间', value: commandCenter.time },
  { icon: Radio, label: '班次', value: commandCenter.shift }
]);

const activeRiskSensor = computed(() =>
  props.displaySensors.find((sensor) => sensor.id === commandCenter.riskPointActualId)
  ?? props.displaySensors.find((sensor) => sensor.reading.secondaryValue === 84.9)
  ?? props.selectedSensor
  ?? props.displaySensors[0]
  ?? null
);

const highlightedSensors = computed(() => {
  const sensor = activeRiskSensor.value;
  if (!sensor) return props.filteredSensors;
  const exists = props.filteredSensors.some((item) => item.id === sensor.id);
  return exists ? props.filteredSensors : [sensor, ...props.filteredSensors];
});

</script>

<template>
  <section class="home3d-shell digital-twin-home command-center-shell" aria-label="种植员 3D 总控台">
    <header class="twin-header">
      <div class="twin-header-chips left">
        <article v-for="item in leftHeaderCards" :key="item.label" :class="['twin-header-chip', item.tone]">
          <component :is="item.icon" :size="16" />
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>

      <div class="twin-header-title">
        <h1>智能种植方舱数字孪生系统</h1>
        <p>INTELLIGENT CULTIVATION CABIN · DIGITAL TWIN SYSTEM</p>
      </div>

      <div class="twin-header-chips right">
        <article v-for="item in rightHeaderCards" :key="item.label" :class="['twin-header-chip', item.tone]">
          <component :is="item.icon" :size="16" />
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
    </header>

    <nav v-if="groupedNavItems?.length" class="twin-primary-nav" aria-label="系统模块">
      <button
        v-for="(group, index) in groupedNavItems"
        :key="group.name"
        type="button"
        :class="{ active: isActiveGroup(group) }"
        @click="emit('selectView', group.items[0].key)"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ group.name }}</strong>
      </button>
    </nav>

    <nav
      v-for="group in groupedNavItems"
      v-show="isActiveGroup(group)"
      :key="group.name"
      class="twin-sub-nav"
      aria-label="总览视图"
    >
      <button
        v-for="item in primaryItems(group.items)"
        :key="item.key"
        type="button"
        :class="{ active: activeView === item.key, 'aux-item': isAuxItem(item.key) }"
        @click="emit('selectView', item.key)"
      >
        {{ item.label }}
      </button>
      <details v-if="overflowItems(group.items).length" class="twin-more-tools">
        <summary>更多工具</summary>
        <div>
          <button
            v-for="item in overflowItems(group.items)"
            :key="item.key"
            type="button"
            :class="{ active: activeView === item.key, 'aux-item': isAuxItem(item.key) }"
            @click="emit('selectView', item.key)"
          >
            {{ item.label }}
          </button>
        </div>
      </details>
    </nav>

    <div class="twin-body-grid home3d-grid">
      <aside class="twin-left-column side-panel task-panel">
        <header class="panel-head">
          <div class="panel-title">
            <CheckCircle2 :size="18" />
            <div>
              <h2>今日任务</h2>
              <p>核心目标：稳湿、控 CO2、保持补光。</p>
            </div>
          </div>
        </header>

        <div class="task-list">
          <article v-for="task in todayTasks" :key="task.priority" :class="['task-card', task.tone]">
            <div class="task-priority">{{ task.priority }}</div>
            <div class="task-copy">
              <strong>{{ task.title }}</strong>
              <div class="task-meta">
                <span>{{ task.target }}</span>
                <span>截止 {{ task.due }}</span>
                <span>{{ task.status }}</span>
              </div>
            </div>
            <button type="button" @click="emit('navigate', task.priority === 'P1' ? 'alarms' : 'workflow')">
              {{ task.action }}
            </button>
          </article>
        </div>

        <section class="twin-panel twin-env-panel" aria-label="环境实时数据">
          <header class="panel-head compact">
            <div class="panel-title">
              <Activity :size="18" />
              <div>
                <h2>环境实时数据</h2>
                <p>采样时间 17:08:12 · 环境评分 91</p>
              </div>
            </div>
          </header>
          <div class="env-list">
            <article v-for="row in envRows" :key="row.label" :class="['env-row', { warning: row.warn }]">
              <component :is="row.icon" :size="15" />
              <div class="env-copy">
                <strong>{{ row.label }}</strong>
                <span>目标 {{ row.target }}</span>
              </div>
              <div class="env-reading">
                <b>{{ row.value }}</b>
                <small>{{ row.unit }}</small>
              </div>
              <em>{{ row.status }}</em>
            </article>
          </div>
        </section>
      </aside>

      <section class="twin-center-stage center-stage">
        <header class="stage-head">
          <div>
            <p class="eyebrow">DIGITAL TWIN COMMAND STAGE</p>
            <h2>方舱三维总览</h2>
          </div>
          <div class="stage-meta">
            <span>SYSTEM ONLINE</span>
            <span>点位总数 {{ commandCenter.onlinePoints }} / {{ commandCenter.totalPoints }}</span>
            <span>数据更新 17:08:12</span>
          </div>
        </header>

        <div class="stage-shell">
          <div class="stage-grid"></div>
          <div class="stage-ring stage-ring-a"></div>
          <div class="stage-ring stage-ring-b"></div>

          <div
            v-for="callout in sensorCallouts"
            :key="callout.label"
            :class="['twin-sensor-callout', callout.className, { warning: callout.warn }]"
          >
            <span>{{ callout.label }}</span>
            <strong>{{ callout.value }}</strong>
          </div>

          <div class="home3d-scene-frame">
            <CabinScene
              :sensors="highlightedSensors"
              :selected-id="activeRiskSensor?.id"
              :view-mode="sceneMode"
              @select="emit('selectSensor', $event)"
            />
          </div>
        </div>

        <div class="twin-selected-strip">
          <div class="strip-title">
            <MapPinned :size="16" />
            <span>选中点位信息 · SELECTED SENSOR</span>
          </div>
          <div class="selected-field-grid">
            <article v-for="field in selectedSensorFields" :key="field[0]" :class="{ warning: field[2] === 'warn' }">
              <span>{{ field[0] }}</span>
              <strong>{{ field[1] }}</strong>
            </article>
          </div>
        </div>
      </section>

      <aside class="twin-right-column side-panel risk-panel">
        <header class="panel-head">
          <div class="panel-title">
            <ShieldAlert :size="18" />
            <div>
              <h2>最大风险</h2>
              <p>回答为什么、影响什么、谁处理、何时复核。</p>
            </div>
          </div>
        </header>

        <article class="twin-risk-card">
          <div class="risk-icon-wrap">
            <Droplets :size="22" />
            <span>最大风险</span>
          </div>
          <h3>{{ commandCenter.maxRisk }}</h3>
          <div class="risk-main-value">
            <strong>84.9</strong>
            <span>%RH</span>
          </div>
          <p class="risk-impact">可能影响子实体分化与层间一致性，建议优先复核下层湿度点。</p>
          <dl>
            <div><dt>当前值</dt><dd>{{ commandCenter.humidity }}</dd></div>
            <div><dt>目标值</dt><dd>{{ commandCenter.humidityTarget }}</dd></div>
            <div><dt>点位</dt><dd>{{ commandCenter.riskPointLabel }}</dd></div>
            <div><dt>偏差</dt><dd>{{ commandCenter.humidityDeviation }}</dd></div>
            <div><dt>持续</dt><dd>{{ commandCenter.duration }}</dd></div>
            <div><dt>建议操作</dt><dd>{{ commandCenter.nextAction }}</dd></div>
            <div><dt>风险等级</dt><dd class="danger-text">高风险</dd></div>
            <div><dt>责任人</dt><dd>{{ commandCenter.owner }}</dd></div>
            <div><dt>复核人</dt><dd>{{ commandCenter.reviewer }}</dd></div>
          </dl>
          <button type="button" @click="emit('navigate', 'alarms')">进入报警处置</button>
        </article>

        <section class="next-action-list">
          <strong>下一步动作</strong>
          <span v-for="item in nextActionItems" :key="item">{{ item }}</span>
        </section>

        <div class="twin-workflow alarm-chain">
          <div class="panel-title chain-title">
            <ListChecks :size="18" />
            <div>
              <h2>报警处理流程</h2>
              <p>报警 → 分派 → 处理 → 复核 → 关闭</p>
            </div>
          </div>

          <div class="chain-track">
            <article v-for="item in alarmChain" :key="item.step" :class="['chain-node', item.state]">
              <div class="chain-dot"></div>
              <strong>{{ item.step }}</strong>
              <span>{{ item.text }}</span>
            </article>
          </div>

          <div class="chain-footnote">
            <span>当前步骤：{{ commandCenter.currentStage }} · 下一步：{{ commandCenter.nextStep }}</span>
            <p>请按流程执行处理操作并记录，完成后进入复核环节。</p>
            <small>责任人：{{ commandCenter.owner }} · 复核人：{{ commandCenter.reviewer }} · 复核时限：17:30 后 10 分钟内</small>
          </div>
        </div>
      </aside>
    </div>

    <footer class="twin-command-bar">
      <div class="system-normal">
        <span></span>
        <div>
          <small>SYSTEM</small>
          <strong>NORMAL</strong>
        </div>
      </div>
      <div class="status-modules" aria-label="点位状态统计">
        <article class="twin-status-module normal"><CheckCircle2 :size="20" /><span>正常</span><strong>{{ commandCenter.pointStatus.normal }}</strong></article>
        <article class="twin-status-module warning"><ShieldAlert :size="20" /><span>预警</span><strong>{{ commandCenter.pointStatus.warning }}</strong></article>
        <article class="twin-status-module alarm"><Siren :size="20" /><span>报警</span><strong>{{ commandCenter.pointStatus.alarm }}</strong></article>
        <article class="twin-status-module offline"><Cloud :size="20" /><span>离线</span><strong>{{ commandCenter.pointStatus.offline }}</strong></article>
        <article class="twin-status-module online"><Radio :size="20" /><span>在线点位</span><strong>{{ commandCenter.pointStatus.online }}</strong></article>
      </div>
      <nav class="quick-actions" aria-label="首页快捷入口">
        <button type="button" class="twin-quick-action" @click="emit('navigate', 'cabin')">三维巡检</button>
        <button type="button" class="twin-quick-action" @click="emit('navigate', 'workflow')">今日作业</button>
        <button type="button" class="twin-quick-action" @click="emit('navigate', 'alarms')">报警处置</button>
        <button type="button" class="twin-quick-action" @click="emit('navigate', 'batch')">批次状态</button>
        <button type="button" class="twin-quick-action" @click="emit('navigate', 'reports')">报告查看</button>
      </nav>
    </footer>
  </section>
</template>

<style scoped>
.home3d-shell {
  position: relative;
  z-index: 1;
}

.digital-twin-home {
  --cc-bg-top: rgba(6, 28, 22, 0.98);
  --cc-bg-bottom: rgba(3, 18, 15, 0.98);
  --cc-panel: linear-gradient(180deg, rgba(8, 39, 31, 0.86), rgba(5, 23, 19, 0.92));
  --cc-panel-soft: linear-gradient(180deg, rgba(9, 43, 34, 0.78), rgba(7, 28, 23, 0.9));
  --cc-border: rgba(110, 232, 186, 0.18);
  --cc-border-strong: rgba(132, 255, 211, 0.28);
  --cc-glow: rgba(73, 209, 160, 0.18);
  --cc-highlight-line: linear-gradient(90deg, transparent, rgba(129, 248, 204, 0.82), transparent);
  --cc-shadow-panel: 0 16px 36px rgba(2, 11, 9, 0.24);
  --cc-text: #effff7;
  --cc-muted: rgba(170, 218, 195, 0.72);
  --cc-ok: #8ef6ca;
  --cc-warn: #ffbb63;
  --cc-danger: #ff8375;
  position: relative;
  display: grid;
  gap: 14px;
  width: min(1640px, 100%);
  margin: 8px auto 0;
  padding: 14px;
  border-radius: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 14%, rgba(90, 255, 196, 0.12), transparent 24%),
    radial-gradient(circle at 50% 72%, rgba(45, 196, 135, 0.08), transparent 20%),
    linear-gradient(180deg, var(--cc-bg-top), var(--cc-bg-bottom));
  box-shadow:
    inset 0 0 0 1px rgba(98, 226, 178, 0.12),
    0 24px 48px rgba(4, 18, 14, 0.35);
}

.digital-twin-home::before,
.digital-twin-home::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.digital-twin-home::before {
  background:
    linear-gradient(rgba(95, 227, 176, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(95, 227, 176, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 86%);
}

.digital-twin-home::after {
  border: 1px solid rgba(108, 236, 187, 0.16);
  border-radius: 22px;
}

.command-center-shell {
  box-shadow:
    inset 0 0 0 1px rgba(98, 226, 178, 0.08),
    inset 0 30px 80px rgba(0, 0, 0, 0.14),
    0 28px 56px rgba(4, 18, 14, 0.34);
}

.twin-header {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr) minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.twin-header-side {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.header-chip,
.twin-header-title,
.side-panel,
.center-stage,
.home3d-bottom {
  position: relative;
  z-index: 1;
  border: 1px solid var(--cc-border);
  background: var(--cc-panel);
  box-shadow:
    inset 0 1px 0 rgba(158, 255, 215, 0.05),
    inset 0 -24px 40px rgba(1, 8, 7, 0.12),
    0 0 24px var(--cc-glow),
    var(--cc-shadow-panel);
}

.header-chip {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 60px;
  padding: 8px 12px;
  border-radius: 14px;
}

.header-chip svg {
  color: rgba(113, 233, 189, 0.78);
}

.header-chip span {
  color: rgba(167, 221, 197, 0.7);
  font-size: 12px;
  font-weight: 600;
}

.header-chip strong {
  color: var(--cc-text);
  font-size: 15px;
  font-weight: 800;
  text-align: right;
}

.header-chip.warn strong,
.header-chip.warn svg {
  color: #ffb44d;
}

.header-chip.score strong {
  color: #96ffd0;
}

.twin-header-title {
  min-height: 72px;
  padding: 12px 18px 10px;
  border-radius: 18px;
  text-align: center;
  overflow: hidden;
}

.twin-header-title::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(121, 249, 201, 0.92), transparent);
  box-shadow: 0 0 22px rgba(100, 238, 187, 0.58);
}

.twin-header-title h1 {
  margin: 0;
  color: #f3fff9;
  font-size: 28px;
  line-height: 1.08;
  font-weight: 900;
}

.twin-header-title p {
  margin: 6px 0 0;
  color: rgba(145, 226, 192, 0.56);
  font-size: 11px;
  letter-spacing: 0.14em;
}

.home3d-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(290px, 0.78fr) minmax(640px, 1.68fr) minmax(300px, 0.82fr);
  gap: 14px;
  align-items: stretch;
}

.side-panel,
.center-stage {
  border-radius: 18px;
  min-width: 0;
}

.side-panel {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 16px;
  overflow: hidden;
}

.task-panel,
.risk-panel {
  grid-auto-rows: min-content;
}

.panel-head,
.panel-title,
.chain-title {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.panel-head {
  position: relative;
  padding-bottom: 10px;
}

.panel-head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(110, 232, 186, 0.32), transparent 82%);
}

.side-panel::before,
.center-stage::before,
.home3d-bottom::before {
  content: "";
  position: absolute;
  top: 0;
  left: 18px;
  right: 18px;
  height: 1px;
  background: var(--cc-highlight-line);
  opacity: 0.8;
  pointer-events: none;
}

.panel-title svg,
.selected-point-bar svg {
  flex: 0 0 auto;
  color: #7cf4c2;
}

.panel-title h2,
.center-stage h2 {
  margin: 0;
  color: #f2fff8;
  font-size: 17px;
  font-weight: 800;
}

.panel-title p,
.chain-footnote p,
.chain-title p {
  margin: 3px 0 0;
  color: rgba(161, 205, 185, 0.64);
  font-size: 12px;
  line-height: 1.5;
}

.task-list {
  display: grid;
  gap: 8px;
}

.task-card {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 13px;
  border: 1px solid rgba(94, 196, 156, 0.14);
  border-radius: 14px;
  background: var(--cc-panel-soft);
  box-shadow:
    inset 0 0 0 1px rgba(145, 255, 213, 0.025),
    0 10px 18px rgba(3, 12, 10, 0.08);
  position: relative;
}

.task-card button {
  align-self: center;
  justify-self: end;
}

.task-card.p1 {
  border-color: rgba(255, 158, 79, 0.28);
  box-shadow:
    inset 2px 0 0 rgba(255, 177, 92, 0.82),
    0 10px 18px rgba(3, 12, 10, 0.08);
}

.task-card.p2 {
  border-color: rgba(255, 190, 93, 0.2);
  box-shadow:
    inset 2px 0 0 rgba(255, 190, 93, 0.52),
    0 10px 18px rgba(3, 12, 10, 0.08);
}

.task-card.p3 {
  border-color: rgba(82, 226, 170, 0.16);
  box-shadow:
    inset 2px 0 0 rgba(82, 226, 170, 0.42),
    0 10px 18px rgba(3, 12, 10, 0.08);
}

.task-priority {
  display: grid;
  place-items: center;
  min-height: 34px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(105, 223, 180, 0.18);
  background: rgba(11, 59, 44, 0.76);
  color: #95ffd1;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  align-self: start;
}

.task-card.p1 .task-priority {
  border-color: rgba(255, 171, 88, 0.34);
  background: rgba(88, 53, 16, 0.95);
  color: #ffca77;
}

.task-card.p2 .task-priority {
  border-color: rgba(255, 199, 110, 0.24);
  background: rgba(62, 51, 20, 0.92);
  color: #ffd78f;
}

.task-card.p3 .task-priority {
  background: rgba(11, 59, 44, 0.9);
}

.task-copy {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.task-copy strong {
  color: #f7fff9;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 800;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.task-meta span,
.task-copy small {
  color: rgba(172, 211, 194, 0.76);
  font-size: 11px;
}

.task-summary-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.task-summary-card {
  display: grid;
  gap: 3px;
  min-height: 74px;
  padding: 10px 12px;
  border: 1px solid rgba(98, 214, 174, 0.14);
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(10, 43, 35, 0.84), rgba(6, 26, 22, 0.92));
  box-shadow: inset 0 1px 0 rgba(152, 255, 214, 0.04);
}

.task-summary-card span {
  color: rgba(166, 219, 194, 0.72);
  font-size: 11px;
}

.task-summary-card strong {
  color: #effff7;
  font-size: 26px;
  line-height: 1;
  font-weight: 850;
}

.task-card button,
.next-action-card button,
.risk-card button,
.home3d-actions button {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(118, 231, 187, 0.24);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(11, 58, 44, 0.94), rgba(8, 39, 31, 0.96));
  color: #dffff4;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.task-card button:hover,
.next-action-card button:hover,
.risk-card button:hover,
.home3d-actions button:hover {
  border-color: rgba(138, 255, 212, 0.48);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(18, 92, 67, 0.22);
}

.next-action-card {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid rgba(93, 214, 177, 0.14);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(9, 42, 33, 0.9), rgba(7, 30, 24, 0.96)),
    rgba(8, 35, 28, 0.76);
}

.next-action-card span {
  color: rgba(166, 219, 194, 0.74);
  font-size: 12px;
}

.next-action-card strong {
  color: #f1fff8;
  font-size: 15px;
  line-height: 1.45;
}

.center-stage {
  display: grid;
  grid-template-rows: auto minmax(600px, 68vh) auto auto;
  gap: 12px;
  padding: 15px;
  overflow: hidden;
  min-height: 100%;
}

.stage-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #87f5c5;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.stage-badge {
  display: grid;
  justify-items: end;
  gap: 4px;
  min-width: 124px;
  padding: 10px 12px;
  border: 1px solid rgba(108, 230, 184, 0.2);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(9, 42, 34, 0.9), rgba(5, 26, 20, 0.96));
  box-shadow: inset 0 1px 0 rgba(151, 255, 215, 0.04);
}

.stage-badge span,
.stage-mini-card span,
.selected-point-bar span,
.risk-icon-wrap span,
.risk-card dt,
.status-card span {
  color: rgba(170, 218, 195, 0.72);
  font-size: 12px;
}

.stage-badge strong,
.stage-mini-card strong,
.selected-point-bar strong,
.status-card strong {
  color: #f5fff9;
  font-weight: 800;
}

.stage-shell {
  position: relative;
  min-height: 600px;
  border: 1px solid rgba(114, 234, 189, 0.22);
  border-radius: 20px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 68%, rgba(76, 255, 177, 0.12), transparent 22%),
    radial-gradient(circle at 50% 100%, rgba(61, 189, 139, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(6, 26, 21, 0.96), rgba(4, 18, 15, 0.98));
  box-shadow:
    inset 0 0 32px rgba(36, 154, 111, 0.12),
    inset 0 -80px 120px rgba(9, 31, 24, 0.7),
    inset 0 50px 80px rgba(2, 10, 8, 0.28),
    0 18px 32px rgba(2, 10, 8, 0.22);
}

.stage-grid,
.stage-ring {
  position: absolute;
  pointer-events: none;
}

.stage-grid {
  inset: 0;
  background:
    linear-gradient(rgba(109, 231, 183, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(109, 231, 183, 0.05) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.95) 36%, transparent 92%);
}

.stage-ring {
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 1px solid rgba(108, 233, 187, 0.24);
}

.stage-ring-a {
  width: 74%;
  height: 22%;
  box-shadow: 0 0 28px rgba(77, 242, 182, 0.16);
}

.stage-ring-b {
  width: 58%;
  height: 15%;
  bottom: 11%;
  border-color: rgba(104, 224, 178, 0.18);
}

.home3d-scene-frame {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 50% 88%, rgba(77, 229, 175, 0.1), transparent 18%),
    linear-gradient(180deg, rgba(8, 24, 20, 0.08), transparent 18%, rgba(3, 12, 10, 0.22));
}

.home3d-scene-frame :deep(.cabin-scene) {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: transparent;
}

.home3d-scene-frame :deep(canvas) {
  transform: scale(1.12);
  transform-origin: center center;
  filter: drop-shadow(0 18px 28px rgba(9, 30, 22, 0.45));
  background: transparent !important;
}

.stage-callout {
  position: absolute;
  z-index: 2;
  display: grid;
  gap: 4px;
  min-width: 132px;
  padding: 10px 12px 9px;
  border: 1px solid rgba(108, 231, 186, 0.32);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(8, 39, 31, 0.94), rgba(6, 28, 23, 0.96));
  box-shadow: 0 12px 24px rgba(5, 16, 13, 0.28);
  backdrop-filter: blur(10px);
}

.stage-callout span {
  color: rgba(168, 220, 196, 0.72);
  font-size: 12px;
}

.stage-callout strong {
  color: #effff7;
  font-size: 15px;
  font-weight: 800;
}

.stage-callout.warning {
  border-color: rgba(255, 174, 87, 0.46);
  box-shadow: 0 0 22px rgba(255, 169, 69, 0.18);
}

.stage-callout.warning strong {
  color: #ffb960;
}

.stage-callout.ok strong {
  color: #8ef9cb;
}

.callout-top-left {
  top: 24px;
  left: 24px;
}

.callout-top-right {
  top: 40px;
  right: 40px;
}

.callout-right {
  right: 46px;
  top: 48%;
}

.stage-badge-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stage-mini-card {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid rgba(104, 224, 179, 0.16);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(10, 37, 30, 0.88), rgba(6, 24, 20, 0.94));
  box-shadow: inset 0 1px 0 rgba(154, 255, 216, 0.04);
}

.stage-mini-card.warning {
  border-color: rgba(255, 178, 82, 0.28);
}

.stage-mini-card.warning strong,
.warning-text {
  color: #ffb85d;
}

.stage-mini-card.ok strong {
  color: #8dffd0;
}

.selected-point-bar {
  display: grid;
  grid-template-columns: auto repeat(4, minmax(0, 1fr));
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid rgba(110, 230, 185, 0.2);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(8, 42, 33, 0.88), rgba(5, 28, 22, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(152, 255, 214, 0.04),
    0 10px 22px rgba(2, 10, 8, 0.12);
}

.selected-point-bar > div {
  display: grid;
  gap: 4px;
}

.risk-card {
  display: grid;
  gap: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 179, 77, 0.32);
  border-radius: 16px;
  background:
    radial-gradient(circle at 72% 22%, rgba(255, 174, 80, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(51, 31, 11, 0.92), rgba(25, 16, 8, 0.98));
  box-shadow:
    inset 0 0 0 1px rgba(255, 194, 113, 0.08),
    inset 0 1px 0 rgba(255, 224, 167, 0.08),
    0 0 26px rgba(255, 162, 64, 0.1);
}

.risk-icon-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.risk-icon-wrap svg {
  color: #ffbb63;
}

.risk-card h3 {
  margin: 0;
  color: #ffcf8d;
  font-size: 16px;
  font-weight: 800;
}

.risk-main-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.risk-main-value strong {
  color: #ffb04f;
  font-size: 42px;
  line-height: 0.96;
  font-weight: 900;
}

.risk-main-value span {
  color: #ffc77a;
  font-size: 18px;
  font-weight: 700;
}

.risk-card dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.risk-card dl div {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 10px;
}

.risk-card dd {
  margin: 0;
  color: #fff8ef;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 700;
}

.risk-card button {
  background: linear-gradient(180deg, rgba(171, 100, 27, 0.96), rgba(116, 63, 15, 0.98));
  border-color: rgba(255, 194, 116, 0.32);
  color: #fff7ec;
  box-shadow: 0 10px 24px rgba(120, 67, 18, 0.2);
}

.alarm-chain {
  display: grid;
  gap: 10px;
  padding: 13px;
  border: 1px solid rgba(96, 219, 174, 0.16);
  border-radius: 14px;
  background: rgba(7, 30, 24, 0.8);
  box-shadow: inset 0 1px 0 rgba(152, 255, 214, 0.04);
}

.chain-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  position: relative;
}

.chain-track::before {
  content: "";
  position: absolute;
  left: 6%;
  right: 6%;
  top: 25px;
  height: 1px;
  background: linear-gradient(90deg, rgba(94, 182, 148, 0.18), rgba(94, 182, 148, 0.34), rgba(94, 182, 148, 0.18));
  pointer-events: none;
}

.chain-node {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 5px;
  padding: 11px 8px 9px;
  border: 1px solid rgba(93, 180, 147, 0.14);
  border-radius: 12px;
  background: rgba(8, 34, 27, 0.76);
  text-align: center;
}

.chain-node::after {
  content: "";
  position: absolute;
  top: 23px;
  left: calc(100% - 4px);
  width: 12px;
  height: 1px;
  background: rgba(100, 181, 150, 0.26);
}

.chain-node:last-child::after {
  display: none;
}

.chain-dot {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(96, 214, 171, 0.24);
  background: rgba(10, 43, 34, 0.9);
  box-shadow: inset 0 0 10px rgba(83, 198, 160, 0.08);
}

.chain-node strong {
  color: #f2fff8;
  font-size: 12px;
  font-weight: 800;
}

.chain-node span {
  color: rgba(165, 209, 189, 0.72);
  font-size: 11px;
  line-height: 1.45;
}

.chain-node.done .chain-dot {
  border-color: rgba(108, 240, 185, 0.38);
  background: rgba(12, 85, 59, 0.92);
  box-shadow: 0 0 16px rgba(78, 221, 167, 0.18);
}

.chain-node.done strong {
  color: #94ffd0;
}

.chain-node.active {
  border-color: rgba(255, 184, 94, 0.36);
  background: rgba(49, 31, 11, 0.78);
}

.chain-node.active .chain-dot {
  border-color: rgba(255, 182, 93, 0.52);
  background: rgba(103, 63, 17, 0.96);
  box-shadow: 0 0 18px rgba(255, 173, 74, 0.32);
}

.chain-node.active strong {
  color: #ffc879;
}

.chain-node.pending {
  opacity: 0.72;
}

.chain-footnote {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(8, 39, 31, 0.72);
}

.chain-footnote span {
  color: #eafef4;
  font-size: 13px;
  font-weight: 800;
}

.home3d-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(420px, 0.9fr);
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(9, 36, 29, 0.94), rgba(6, 24, 20, 0.96)),
    rgba(7, 30, 24, 0.9);
}

.command-group {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.command-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px;
}

.command-group-head span {
  color: rgba(151, 225, 191, 0.58);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.command-group-head strong {
  color: rgba(232, 255, 244, 0.88);
  font-size: 11px;
  font-weight: 800;
}

.point-status-strip,
.home3d-actions {
  display: grid;
  gap: 10px;
}

.point-status-strip {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.home3d-actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
}

.status-card {
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid rgba(109, 227, 183, 0.15);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(8, 40, 32, 0.84), rgba(6, 26, 21, 0.94));
  min-height: 88px;
  align-content: center;
  box-shadow:
    inset 0 1px 0 rgba(150, 255, 214, 0.04),
    0 10px 20px rgba(2, 10, 8, 0.1);
}

.status-card strong {
  font-size: 30px;
  line-height: 1;
}

.status-card.normal strong,
.status-card.online strong {
  color: #8df7cb;
}

.status-card.warning {
  border-color: rgba(255, 184, 96, 0.26);
}

.status-card.warning strong {
  color: #ffbe63;
}

.status-card.alarm {
  border-color: rgba(255, 124, 124, 0.22);
}

.status-card.alarm strong {
  color: #ff7f75;
}

.status-card.offline strong {
  color: rgba(192, 203, 198, 0.72);
}

.home3d-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 42px;
  width: 100%;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(10, 49, 39, 0.96), rgba(7, 31, 25, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(149, 255, 213, 0.04),
    0 10px 20px rgba(2, 10, 8, 0.1);
}

@media (max-width: 1380px) {
  .twin-header {
    grid-template-columns: 1fr;
  }

  .twin-header-side {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .home3d-grid,
  .home3d-bottom {
    grid-template-columns: 1fr;
  }

  .center-stage {
    grid-template-rows: auto minmax(500px, 58vh) auto auto;
  }

  .stage-shell,
  .home3d-scene-frame :deep(.cabin-scene) {
    min-height: 500px;
  }

  .chain-track {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .point-status-strip,
  .home3d-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .twin-header-side,
  .stage-badge-row {
    grid-template-columns: 1fr;
  }

  .selected-point-bar {
    grid-template-columns: 1fr 1fr;
  }

  .selected-point-bar svg {
    display: none;
  }
}

@media (max-width: 768px) {
  .digital-twin-home {
    padding: 12px;
    border-radius: 18px;
  }

  .header-chip,
  .task-card {
    grid-template-columns: auto 1fr;
  }

  .header-chip strong,
  .task-card button {
    grid-column: 2;
    justify-self: start;
    text-align: left;
  }

  .center-stage {
    grid-template-rows: auto minmax(400px, 52vh) auto auto;
  }

  .stage-shell,
  .home3d-scene-frame :deep(.cabin-scene) {
    min-height: 400px;
  }

  .selected-point-bar {
    grid-template-columns: 1fr;
  }

  .chain-track {
    grid-template-columns: 1fr;
  }

  .point-status-strip,
  .home3d-actions {
    grid-template-columns: 1fr 1fr;
  }

  .task-summary-strip {
    grid-template-columns: 1fr;
  }

  .chain-node::after,
  .stage-callout {
    display: none;
  }
}

/* Lovable command-screen migration layer, scoped to the overview home only. */
.digital-twin-home {
  --twin-bg-deep: #020f0c;
  --twin-bg-panel: rgba(4, 29, 23, 0.9);
  --twin-border: rgba(0, 245, 178, 0.42);
  --twin-border-soft: rgba(0, 245, 178, 0.18);
  --twin-green: #00f5b2;
  --twin-green-soft: rgba(0, 245, 178, 0.68);
  --twin-amber: #ffb22e;
  --twin-red: #ff5c4d;
  --twin-cyan: #34d7ff;
  --twin-text: #ecfff8;
  --twin-muted: rgba(172, 220, 202, 0.68);
  --twin-glow: 0 0 26px rgba(0, 245, 178, 0.2);
  --twin-amber-glow: 0 0 26px rgba(255, 178, 46, 0.28);
  --panel-gap: 8px;
  --shell-gap: 7px;
  --shell-padding: 10px;
  --header-height: 54px;
  --primary-nav-height: 24px;
  --sub-nav-height: 24px;
  --task-card-padding-y: 7px;
  --task-card-min-height: 64px;
  --env-row-height: 38px;
  --stage-head-height: 44px;
  --selected-strip-padding-y: 9px;
  --command-bar-height: 62px;
  --command-button-height: 30px;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  width: min(1600px, 100%);
  height: min(900px, calc(100vh - 18px));
  min-height: 700px;
  margin: 0 auto;
  padding: var(--shell-padding);
  gap: var(--shell-gap);
  border-radius: 12px;
  overflow: hidden;
  color: var(--twin-text);
  background:
    radial-gradient(circle at 50% 12%, rgba(0, 245, 178, 0.12), transparent 28%),
    linear-gradient(180deg, #041c16 0%, var(--twin-bg-deep) 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 245, 178, 0.16), 0 30px 70px rgba(0, 0, 0, 0.36);
}

.digital-twin-home::after {
  border-color: rgba(0, 245, 178, 0.28);
  border-radius: 12px;
}

.twin-header {
  display: grid;
  grid-template-columns: minmax(390px, 1fr) minmax(420px, 0.9fr) minmax(520px, 1.18fr);
  min-height: var(--header-height);
  gap: 0;
  padding: 0 14px;
  border: 1px solid var(--twin-border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 37, 29, 0.96), rgba(2, 17, 14, 0.98));
  box-shadow: var(--twin-glow), inset 0 1px 0 rgba(167, 255, 220, 0.1);
}

.twin-header::before,
.twin-command-bar::before,
.center-stage::before,
.side-panel::before {
  background: linear-gradient(90deg, transparent, rgba(0, 245, 178, 0.9), transparent);
}

.twin-header-chips {
  display: flex;
  align-items: center;
  min-width: 0;
}

.twin-header-chips.right {
  justify-content: flex-end;
}

.twin-header-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: calc(var(--header-height) - 22px);
  padding: 0 12px;
  border-right: 1px solid rgba(0, 245, 178, 0.15);
  white-space: nowrap;
}

.twin-header-chip:last-child {
  border-right: 0;
}

.twin-header-chip svg {
  color: var(--twin-green);
}

.twin-header-chip span {
  color: var(--twin-muted);
  font-size: 12px;
  font-weight: 700;
}

.twin-header-chip strong {
  color: var(--twin-text);
  font-size: 13px;
  font-weight: 900;
}

.twin-header-chip.warn strong,
.twin-header-chip.warn svg {
  color: var(--twin-amber);
  text-shadow: 0 0 12px rgba(255, 178, 46, 0.52);
}

.twin-header-chip.score strong {
  color: var(--twin-green);
  text-shadow: 0 0 12px rgba(0, 245, 178, 0.62);
}

.twin-header-title {
  min-height: auto;
  padding: 5px 16px;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.twin-header-title h1 {
  font-size: clamp(19px, 1.35vw, 24px);
  line-height: 1.12;
  letter-spacing: 0.18em;
  text-shadow: 0 0 16px rgba(0, 245, 178, 0.5);
}

.twin-header-title p {
  margin-top: 3px;
  color: rgba(0, 245, 178, 0.66);
  font-size: 9px;
  letter-spacing: 0.24em;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.twin-primary-nav,
.twin-sub-nav {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: var(--primary-nav-height);
  overflow: visible;
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(3, 24, 20, 0.72), rgba(2, 14, 12, 0.86));
  box-shadow: inset 0 1px 0 rgba(152, 255, 214, 0.04);
}

.twin-primary-nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.twin-primary-nav button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: var(--primary-nav-height);
  padding: 1px 10px;
  border: 0;
  border-right: 1px solid rgba(0, 245, 178, 0.08);
  border-bottom: 1px solid transparent;
  background: transparent;
  color: rgba(172, 220, 202, 0.42);
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.twin-primary-nav button:last-child {
  border-right: 0;
}

.twin-primary-nav button.active {
  color: var(--twin-text);
}

.twin-primary-nav button.active::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -1px;
  height: 1px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--twin-green), transparent);
  box-shadow: 0 0 12px rgba(0, 245, 178, 0.48);
}

.twin-primary-nav button span {
  display: grid;
  place-items: center;
  width: 20px;
  height: 17px;
  border-radius: 5px;
  background: rgba(12, 52, 40, 0.72);
  color: rgba(172, 222, 198, 0.62);
  font-size: 10px;
}

.twin-primary-nav button.active span {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.86), rgba(31, 136, 96, 0.92));
  color: #032119;
}

.twin-sub-nav {
  align-items: center;
  gap: 5px;
  min-height: var(--sub-nav-height);
  padding: 1px 8px;
}

.twin-sub-nav button,
.twin-more-tools summary {
  display: inline-flex;
  align-items: center;
  min-height: calc(var(--sub-nav-height) - 6px);
  padding: 0 9px;
  border: 1px solid rgba(0, 245, 178, 0.2);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(8, 38, 31, 0.88), rgba(5, 23, 19, 0.92));
  color: rgba(224, 255, 240, 0.74);
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
}

.twin-sub-nav button.active {
  border-color: rgba(0, 245, 178, 0.48);
  background: linear-gradient(180deg, rgba(36, 157, 112, 0.78), rgba(13, 86, 62, 0.9));
  color: #032119;
}

.twin-more-tools {
  position: relative;
}

.twin-more-tools summary {
  list-style: none;
}

.twin-more-tools summary::-webkit-details-marker {
  display: none;
}

.twin-more-tools > div {
  position: absolute;
  top: 27px;
  left: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: min(520px, calc(100vw - 48px));
  padding: 8px;
  border: 1px solid rgba(0, 245, 178, 0.2);
  border-radius: 8px;
  background: rgba(3, 24, 20, 0.98);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.twin-body-grid,
.home3d-grid {
  display: grid;
  grid-template-columns: 320px minmax(620px, 1fr) 340px;
  gap: var(--panel-gap);
  min-height: 0;
  overflow: hidden;
  align-items: stretch;
}

.side-panel,
.center-stage,
.twin-command-bar {
  border: 1px solid var(--twin-border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  box-shadow: var(--twin-glow), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

.side-panel {
  padding: 10px;
  gap: var(--panel-gap);
}

.panel-head {
  padding-bottom: 6px;
}

.panel-title p,
.chain-title p {
  font-size: 11px;
  line-height: 1.3;
}

.twin-left-column,
.twin-center-stage,
.twin-right-column {
  min-height: 0;
  overflow: hidden;
}

.twin-left-column {
  grid-template-rows: auto auto minmax(0, 1fr);
  align-content: start;
}

.twin-right-column {
  grid-template-rows: auto auto auto minmax(0, 1fr);
  align-content: start;
}

.twin-left-column .twin-env-panel,
.twin-right-column .twin-workflow {
  min-height: 0;
}

.panel-title h2,
.center-stage h2 {
  color: var(--twin-text);
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 245, 178, 0.42);
}

.panel-title p,
.stage-meta,
.chain-title p {
  color: var(--twin-muted);
}

.task-card {
  grid-template-columns: 48px minmax(0, 1fr) auto;
  min-height: var(--task-card-min-height);
  padding: var(--task-card-padding-y) 10px;
  border-color: rgba(0, 245, 178, 0.28);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(6, 44, 35, 0.82), rgba(4, 26, 21, 0.94));
}

.task-priority {
  min-height: 42px;
  border-radius: 6px;
  border: 0;
  background: linear-gradient(180deg, #15ffc0, #09ad83);
  color: #021610;
  box-shadow: 0 0 18px rgba(0, 245, 178, 0.42);
}

.task-card.p1 .task-priority,
.task-card.p2 .task-priority {
  background: linear-gradient(180deg, #15ffc0, #09ad83);
  color: #021610;
}

.task-card.p3 {
  opacity: 1;
}

.task-card.p3 .task-priority {
  background: linear-gradient(180deg, rgba(21, 255, 192, 0.78), rgba(9, 173, 131, 0.74));
  color: #032119;
  box-shadow: 0 0 14px rgba(0, 245, 178, 0.22);
}

.task-copy strong {
  display: block;
  color: var(--twin-text);
  font-size: 13px;
  line-height: 1.35;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.task-meta span {
  color: var(--twin-muted);
  font-size: 11px;
}

.task-meta span:last-child {
  color: var(--twin-amber);
}

.task-card button,
.twin-risk-card button,
.twin-quick-action {
  border-radius: 6px;
  border-color: rgba(0, 245, 178, 0.5);
  background: rgba(2, 30, 23, 0.86);
  color: #baffea;
  box-shadow: inset 0 0 0 1px rgba(0, 245, 178, 0.08);
}

.task-card button:hover,
.twin-risk-card button:hover,
.twin-quick-action:hover {
  border-color: var(--twin-green);
  background: rgba(0, 245, 178, 0.14);
}

.twin-panel {
  border-top: 1px solid var(--twin-border-soft);
  padding-top: 12px;
}

.env-list {
  display: grid;
  gap: 8px;
}

.env-row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto 38px;
  align-items: center;
  gap: 8px;
  min-height: var(--env-row-height);
  padding: 5px 10px;
  border-bottom: 1px solid rgba(0, 245, 178, 0.12);
  background: rgba(2, 28, 22, 0.38);
}

.env-row svg {
  color: var(--twin-green);
}

.env-copy {
  display: grid;
  gap: 3px;
}

.env-copy strong {
  color: var(--twin-text);
  font-size: 13px;
}

.env-copy span,
.env-reading small {
  color: var(--twin-muted);
  font-size: 11px;
}

.env-reading {
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-variant-numeric: tabular-nums;
}

.env-reading b {
  color: var(--twin-text);
  font-size: 19px;
  line-height: 1;
}

.env-row em {
  color: var(--twin-green-soft);
  font-size: 10px;
  font-style: normal;
  text-align: right;
}

.env-row.warning {
  border-color: rgba(255, 178, 46, 0.3);
  background: linear-gradient(90deg, rgba(255, 178, 46, 0.08), rgba(2, 28, 22, 0.4));
}

.env-row.warning svg,
.env-row.warning .env-reading b,
.env-row.warning em {
  color: var(--twin-amber);
  text-shadow: 0 0 12px rgba(255, 178, 46, 0.52);
}

.center-stage {
  grid-template-rows: var(--stage-head-height) minmax(0, 1fr) auto;
  padding: 0;
  gap: 0;
  min-height: 0;
}

.stage-head {
  align-items: center;
  min-height: var(--stage-head-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--twin-border-soft);
}

.stage-head .eyebrow {
  display: inline;
  margin-left: 12px;
  color: rgba(0, 245, 178, 0.56);
  font-size: 10px;
}

.stage-head h2 {
  display: inline;
}

.stage-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  white-space: nowrap;
}

.stage-meta span:first-child {
  color: var(--twin-green);
}

.stage-shell {
  min-height: 0;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 50% 82%, rgba(0, 245, 178, 0.22), transparent 30%),
    radial-gradient(ellipse at 50% 30%, rgba(0, 245, 178, 0.12), transparent 54%),
    linear-gradient(180deg, rgba(3, 24, 19, 0.96), #020d0b 100%);
}

.home3d-scene-frame :deep(.cabin-scene) {
  min-height: 0;
  height: 100%;
}

.home3d-scene-frame :deep(canvas) {
  transform: scale(1.08);
}

.twin-sensor-callout {
  position: absolute;
  z-index: 3;
  display: grid;
  gap: 3px;
  min-width: 106px;
  padding: 9px 11px;
  border: 1px solid var(--twin-green);
  border-radius: 6px;
  background: rgba(3, 29, 23, 0.86);
  box-shadow: 0 0 18px rgba(0, 245, 178, 0.24);
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.twin-sensor-callout span {
  color: var(--twin-green);
  font-size: 11px;
  font-weight: 900;
}

.twin-sensor-callout strong {
  color: var(--twin-text);
  font-size: 11px;
  line-height: 1.35;
}

.twin-sensor-callout.warning {
  border-color: var(--twin-amber);
  background: rgba(58, 34, 8, 0.84);
  box-shadow: var(--twin-amber-glow);
}

.twin-sensor-callout.warning span,
.twin-sensor-callout.warning strong {
  color: var(--twin-amber);
}

.callout-co2 { left: 20%; top: 10%; }
.callout-rh { right: 16%; top: 12%; }
.callout-ta { left: 8%; bottom: 20%; }
.callout-hum { right: 12%; bottom: 18%; }
.callout-risk { right: 3%; top: 46%; min-width: 132px; }

.twin-selected-strip {
  display: grid;
  gap: 9px;
  padding: var(--selected-strip-padding-y) 14px;
  border-top: 1px solid var(--twin-border-soft);
  background: rgba(2, 18, 15, 0.88);
}

.strip-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--twin-green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.selected-field-grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(76px, 1fr));
  border: 1px solid rgba(0, 245, 178, 0.28);
  border-radius: 6px;
  overflow: hidden;
}

.selected-field-grid article {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding: 6px 8px;
  border-right: 1px solid rgba(0, 245, 178, 0.16);
  background: rgba(5, 40, 32, 0.58);
}

.selected-field-grid article:last-child {
  border-right: 0;
}

.selected-field-grid span {
  color: var(--twin-muted);
  font-size: 10px;
}

.selected-field-grid strong {
  color: var(--twin-text);
  font-size: 11px;
  line-height: 1.25;
}

.selected-field-grid .warning strong,
.warning-text,
.danger-text {
  color: var(--twin-amber);
  text-shadow: 0 0 12px rgba(255, 178, 46, 0.46);
}

.twin-risk-card {
  display: grid;
  gap: 4px;
  padding: 9px;
  border: 1px solid rgba(255, 178, 46, 0.66);
  border-radius: 8px;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 178, 46, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(78, 42, 8, 0.86), rgba(18, 10, 4, 0.96));
  box-shadow: var(--twin-amber-glow), inset 0 0 28px rgba(255, 178, 46, 0.12);
}

.risk-icon-wrap span,
.twin-risk-card h3,
.risk-main-value span {
  color: #ffe0a1;
}

.twin-risk-card h3 {
  font-size: 18px;
}

.risk-main-value strong {
  color: var(--twin-amber);
  font-size: 28px;
  text-shadow: 0 0 16px rgba(255, 178, 46, 0.62);
}

.risk-impact {
  margin: 0;
  color: rgba(255, 231, 190, 0.86);
  font-size: 11px;
  line-height: 1.25;
}

.twin-risk-card dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 3px 6px;
  margin: 0;
}

.twin-risk-card dl div {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  padding-bottom: 3px;
  border-bottom: 1px solid rgba(255, 178, 46, 0.16);
}

.twin-risk-card dt,
.twin-risk-card dd {
  margin: 0;
  font-size: 10px;
}

.twin-risk-card dt {
  color: rgba(255, 224, 174, 0.66);
}

.twin-risk-card dd {
  color: #fff6e7;
  font-weight: 800;
  text-align: left;
}

.twin-risk-card button {
  min-height: 28px;
  border-color: rgba(255, 178, 46, 0.5);
  background: linear-gradient(90deg, #ffbf38, #ff9f18);
  color: #1d1003;
}

.next-action-list {
  display: none;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--twin-border-soft);
  border-radius: 8px;
  background: rgba(4, 31, 25, 0.72);
}

.next-action-list strong {
  color: var(--twin-green);
  font-size: 13px;
}

.next-action-list span {
  color: var(--twin-text);
  font-size: 12px;
  line-height: 1.4;
}

.twin-workflow {
  padding: 12px;
  border-color: var(--twin-border-soft);
  border-radius: 8px;
  background: rgba(4, 31, 25, 0.7);
}

.chain-track {
  gap: 4px;
}

.chain-node {
  border-radius: 8px;
  gap: 2px;
  padding: 6px 4px 5px;
  background: rgba(3, 28, 22, 0.76);
}

.chain-node .chain-dot {
  width: 20px;
  height: 20px;
}

.chain-node strong {
  font-size: 10px;
}

.chain-node span {
  font-size: 9px;
  line-height: 1.15;
}

.chain-node.active {
  border-color: rgba(255, 178, 46, 0.5);
  background: rgba(67, 41, 10, 0.76);
}

.chain-footnote {
  padding: 6px 8px;
  border: 1px solid rgba(255, 178, 46, 0.24);
  background: rgba(52, 32, 8, 0.52);
}

.chain-footnote small {
  display: block;
  margin-top: 2px;
  color: rgba(255, 231, 190, 0.72);
  font-size: 10px;
}

.chain-footnote span {
  font-size: 11px;
}

.chain-footnote p {
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.25;
}

.twin-command-bar {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 150px minmax(560px, 1fr) auto;
  align-items: center;
  gap: 18px;
  min-height: var(--command-bar-height);
  padding: 6px 16px;
}

.system-normal {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 16px;
  border-right: 1px solid rgba(0, 245, 178, 0.22);
}

.system-normal > span {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--twin-green);
  box-shadow: 0 0 14px rgba(0, 245, 178, 0.75);
}

.system-normal small,
.twin-status-module span {
  color: var(--twin-muted);
  font-size: 10px;
  letter-spacing: 0.22em;
}

.system-normal strong {
  color: var(--twin-green);
  font-size: 17px;
  letter-spacing: 0.2em;
  text-shadow: 0 0 14px rgba(0, 245, 178, 0.65);
}

.status-modules {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
}

.twin-status-module {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 2px 10px;
  min-height: 54px;
  padding: 0 12px;
  border-right: 1px solid rgba(0, 245, 178, 0.16);
}

.twin-status-module svg {
  grid-row: span 2;
}

.twin-status-module strong {
  font-size: 24px;
  line-height: 1;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}

.twin-status-module.normal,
.twin-status-module.online {
  color: var(--twin-green);
}

.twin-status-module.warning {
  color: var(--twin-amber);
}

.twin-status-module.alarm {
  color: var(--twin-red);
}

.twin-status-module.offline {
  color: rgba(166, 188, 180, 0.58);
}

.quick-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.twin-quick-action {
  min-height: var(--command-button-height);
  padding: 0 12px;
  white-space: nowrap;
  cursor: pointer;
}

@media (max-width: 1380px) {
  .twin-header {
    grid-template-columns: 1fr;
    padding: 10px 12px;
  }

  .twin-header-chips,
  .twin-header-chips.right {
    justify-content: center;
    flex-wrap: wrap;
  }

  .quick-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-height: 860px), (max-width: 1500px) {
  .digital-twin-home {
    --panel-gap: 6px;
    --shell-gap: 5px;
    --shell-padding: 8px;
    --header-height: 48px;
    --primary-nav-height: 21px;
    --sub-nav-height: 21px;
    --task-card-padding-y: 4px;
    --task-card-min-height: 54px;
    --env-row-height: 32px;
    --stage-head-height: 34px;
    --selected-strip-padding-y: 5px;
    --command-bar-height: 54px;
    --command-button-height: 24px;
    height: min(900px, calc(100vh - 12px));
    min-height: 660px;
  }

  .twin-header {
    border-color: rgba(0, 245, 178, 0.32);
  }

  .twin-header-title h1 {
    font-size: 19px;
  }

  .twin-header-title p {
    margin-top: 1px;
    font-size: 8px;
    letter-spacing: 0.18em;
  }

  .twin-header-chip {
    gap: 5px;
    padding: 0 8px;
  }

  .twin-header-chip span {
    font-size: 11px;
  }

  .twin-header-chip strong {
    font-size: 12px;
  }

  .twin-primary-nav button {
    padding: 0 9px;
    font-size: 10px;
  }

  .twin-primary-nav button span {
    width: 18px;
    height: 15px;
    font-size: 9px;
  }

  .twin-primary-nav button.active::after {
    left: 12px;
    right: 12px;
    height: 1px;
  }

  .twin-sub-nav button,
  .twin-more-tools summary {
    padding: 0 7px;
    font-size: 10px;
  }

  .panel-head {
    padding-bottom: 4px;
  }

  .panel-title h2,
  .center-stage h2 {
    font-size: 15px;
  }

  .panel-title p,
  .chain-title p {
    margin-top: 1px;
    font-size: 10px;
    line-height: 1.2;
  }

  .task-card {
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 8px;
  }

  .task-priority {
    min-height: 38px;
    font-size: 13px;
  }

  .task-copy strong {
    font-size: 12px;
    line-height: 1.22;
  }

  .task-meta {
    gap: 5px 8px;
  }

  .task-meta span {
    font-size: 10px;
  }

  .task-card button,
  .twin-risk-card button,
  .twin-quick-action {
    font-size: 11px;
  }

  .env-row {
    grid-template-columns: 16px minmax(0, 1fr) auto 34px;
    gap: 6px;
    padding: 4px 8px;
  }

  .env-copy strong {
    font-size: 12px;
  }

  .env-copy span,
  .env-reading small {
    font-size: 10px;
  }

  .env-reading b {
    font-size: 17px;
  }

  .env-row em {
    font-size: 9px;
  }

  .stage-head {
    padding: 0 12px;
  }

  .stage-head .eyebrow,
  .stage-meta {
    font-size: 9px;
  }

  .twin-selected-strip {
    gap: 5px;
  }

  .strip-title {
    font-size: 10px;
  }

  .selected-field-grid article {
    padding: 5px 6px;
  }

  .selected-field-grid span {
    font-size: 9px;
  }

  .selected-field-grid strong {
    font-size: 10px;
  }

  .twin-risk-card {
    padding: 8px;
  }

  .twin-risk-card h3 {
    font-size: 16px;
  }

  .risk-main-value strong {
    font-size: 26px;
  }

  .risk-impact {
    font-size: 10px;
    line-height: 1.18;
  }

  .twin-risk-card dt,
  .twin-risk-card dd {
    font-size: 9px;
  }

  .chain-node {
    padding: 5px 3px 4px;
  }

  .chain-node .chain-dot {
    width: 18px;
    height: 18px;
  }

  .chain-node strong {
    font-size: 9px;
  }

  .chain-node span {
    font-size: 8px;
  }

  .chain-footnote {
    padding: 5px 7px;
  }

  .chain-footnote span {
    font-size: 10px;
  }

  .chain-footnote p,
  .chain-footnote small {
    font-size: 9px;
    line-height: 1.18;
  }

  .system-normal strong {
    font-size: 15px;
  }

  .twin-status-module {
    min-height: 46px;
  }

  .twin-status-module strong {
    font-size: 22px;
  }

  .twin-status-module span,
  .system-normal small {
    font-size: 9px;
  }
}

@media (max-width: 1100px) {
  .digital-twin-home {
    height: auto;
    min-height: 0;
    overflow: visible;
  }

  .twin-body-grid,
  .home3d-grid {
    grid-template-columns: 1fr;
  }

  .selected-field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .center-stage {
    grid-template-rows: auto minmax(460px, 55vh) auto;
  }

  .stage-shell,
  .home3d-scene-frame :deep(.cabin-scene) {
    min-height: 460px;
  }
}

@media (max-width: 720px) {
  :global(.app-shell.overview-mode) {
    overflow-x: hidden;
  }

  .digital-twin-home {
    width: 100%;
    max-width: calc(100vw - 24px);
    overflow-x: hidden;
  }

  .twin-header {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .twin-header-chip {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 4px 8px;
    width: 100%;
    justify-content: stretch;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 245, 178, 0.12);
    white-space: normal;
  }

  .twin-header-chip strong {
    grid-column: 2;
    overflow-wrap: anywhere;
    text-align: left;
  }

  .env-row,
  .twin-risk-card dl div,
  .twin-status-module {
    grid-template-columns: 1fr;
  }

  .task-card {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .task-card button {
    grid-column: 2;
    justify-self: start;
  }

  .stage-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .selected-field-grid,
  .status-modules {
    grid-template-columns: 1fr;
  }
}
</style>
