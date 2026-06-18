<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { Component } from 'vue';
import {
  Activity,
  Bell,
  Clock3,
  Cloud,
  Cpu,
  Database,
  Droplets,
  Fan,
  Leaf,
  MapPinned,
  Radio,
  Server,
  ShieldAlert,
  Sun,
  Target,
  Thermometer
} from 'lucide-vue-next';
import type { AlarmEvent, DashboardSummary, RoleKey, SceneMode, SensorPoint, SensorType, ViewKey } from '../types';
import type { NavItem, sceneModes, typeOptions } from '../data/navigation';
import TwinCommandFooter from './TwinCommandFooter.vue';
import TwinSystemTopBar from './TwinSystemTopBar.vue';

const CabinScene = defineAsyncComponent(() => import('./CabinScene.vue'));

type TypeOption = (typeof typeOptions)[number];
type SceneOption = (typeof sceneModes)[number];
interface GroupedNavItem {
  name: string;
  items: NavItem[];
}

interface HeaderCard {
  icon?: Component;
  label: string;
  value: string;
  tone?: string;
}

const props = defineProps<{
  activeRole: RoleKey;
  activeLayer: string;
  activeType: SensorType | 'all';
  alarmTimeline: AlarmEvent[];
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
  leftHeaderCards?: HeaderCard[];
  rightHeaderCards?: HeaderCard[];
  footerStatusModules: HeaderCard[];
  footerActions: Array<{ label: string; view: ViewKey }>;
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
  riskSensorId: 'TH-L2-006',
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

const environmentSnapshot = [
  { icon: Thermometer, label: '温度', value: '21.3', unit: '°C', target: '18-22°C', status: '正常' },
  { icon: Droplets, label: '湿度', value: '84.9', unit: '%RH', target: '≥85%RH', status: '偏低', warn: true },
  { icon: Cloud, label: 'CO₂', value: '812', unit: 'ppm', target: '1500-2000 ppm', status: '观察' },
  { icon: Sun, label: '光照', value: '12.6', unit: 'klx', target: '500-1000 lx', status: '补光中' }
];

const batchOverviewCards = [
  { label: '阶段放行', value: '观察后再放行', detail: '湿度连续稳定后再提交放行', tone: 'warn' },
  { label: '采收窗口', value: '06-22 ~ 06-24', detail: '距窗口约 6 天，需保持形态稳定', tone: 'normal' },
  { label: '成熟度指数', value: '88%', detail: '运行天数、环境评分、形态记录综合', tone: 'normal' },
  { label: '下一动作', value: '17:30 复核', detail: '确认下层湿度与 CO₂ 回落曲线', tone: 'warn' }
];

const systemStatusCards = [
  { icon: Fan, label: '环境控制', value: '稳定', detail: '温湿度、CO₂、通风联动正常', tone: 'normal' },
  { icon: Cpu, label: '边缘计算', value: '在线', detail: '滤波、校准、异常检测运行中', tone: 'normal' },
  { icon: ShieldAlert, label: '安全防护', value: '正常', detail: '气体、烟雾、水浸、电气无报警', tone: 'normal' },
  { icon: Database, label: '数据留存', value: '同步中', detail: '本地与云端数据持续写入', tone: 'normal' }
];

const sensorCallouts = [
  { className: 'callout-co2', label: 'CO2-L2', value: 'CO2 812 ppm' },
  { className: 'callout-rh', label: 'RH-L1-001', value: '湿度 87.1%RH' },
  { className: 'callout-ta', label: 'TA-L1-001', value: '温度 21.3°C' },
  { className: 'callout-hum', label: 'HUM-01', value: '加湿器 68%' },
  { className: 'callout-risk', label: 'TH-L2-002', value: '湿度 84.9%RH · 偏低', warn: true }
];

const selectedSensorFields = [
  ['点位编号', commandCenter.riskPointLabel],
  ['所属层级', '环境监测层'],
  ['当前值', '84.9%RH', 'warn'],
  ['目标值', '≥85%RH'],
  ['采样时间', '17:08:12'],
  ['状态', '临界关注', 'warn']
];

const fallbackLeftHeaderCards = computed(() => [
  { icon: Leaf, label: '当前批次', value: props.unifiedMetrics.batch },
  { icon: Target, label: '当前阶段', value: props.unifiedMetrics.stage },
  { icon: ShieldAlert, label: '环境评分', value: String(props.unifiedMetrics.envScore), tone: 'score' }
]);

const fallbackRightHeaderCards = computed(() => [
  { icon: Activity, label: '在线点位', value: `${props.displaySensors.length} / ${props.displaySensors.length}` },
  { icon: Bell, label: '待处理报警', value: String(props.unifiedMetrics.pendingCount), tone: 'warn' },
  { icon: Clock3, label: '时间', value: commandCenter.time },
  { icon: Radio, label: '班次', value: commandCenter.shift }
]);

const resolvedLeftHeaderCards = computed(() => props.leftHeaderCards?.length ? props.leftHeaderCards : fallbackLeftHeaderCards.value);
const resolvedRightHeaderCards = computed(() => props.rightHeaderCards?.length ? props.rightHeaderCards : fallbackRightHeaderCards.value);

const activeRiskSensor = computed(() =>
  props.displaySensors.find((sensor) => sensor.id === commandCenter.riskSensorId)
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
  <section class="home3d-shell digital-twin-home command-center-shell twin-shared-command-frame" aria-label="种植员 3D 总控台">
    <TwinSystemTopBar
      title="智能种植方舱数字孪生系统"
      :active-view="activeView"
      :grouped-nav-items="groupedNavItems"
      :left-cards="resolvedLeftHeaderCards"
      :right-cards="resolvedRightHeaderCards"
      @select-view="emit('selectView', $event)"
    />

    <div class="twin-body-grid home3d-grid">
      <aside class="twin-left-column side-panel sensor-network-panel">
        <header class="panel-head">
          <div class="panel-title">
            <Leaf :size="18" />
            <div>
              <h2>生产判断</h2>
              <p>批次放行、采收窗口与复核动作综合研判。</p>
            </div>
          </div>
        </header>

        <div class="network-layer-list">
          <article v-for="layer in batchOverviewCards" :key="layer.label" :class="['network-layer-card', layer.tone]">
            <div>
              <span>{{ layer.label }}</span>
              <strong>{{ layer.value }}</strong>
            </div>
            <p>{{ layer.detail }}</p>
          </article>
        </div>

        <section class="twin-panel twin-env-panel" aria-label="环境实时数据">
          <header class="panel-head compact">
            <div class="panel-title">
              <Activity :size="18" />
              <div>
                <h2>环境实时数据</h2>
                <p>采样时间 17:08:12 · 环境评分 {{ props.unifiedMetrics.envScore }}</p>
              </div>
            </div>
          </header>
          <div class="env-list">
            <article v-for="row in environmentSnapshot" :key="row.label" :class="['env-row', { warning: row.warn }]">
              <component :is="row.icon" :size="15" />
              <div class="env-copy">
                <strong>{{ row.label }}</strong>
                <span>目标 {{ row.target }}</span>
              </div>
              <div class="env-reading">
                <b>{{ row.value }}</b>
                <small>{{ row.unit }}</small>
                <em>{{ row.status }}</em>
              </div>
            </article>
          </div>
        </section>
      </aside>

      <section class="twin-center-stage center-stage">
        <header class="stage-head">
          <div>
            <h2>方舱三维总览</h2>
          </div>
          <div class="stage-meta">
            <span>系统网络</span>
            <strong>正常</strong>
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
            <span>选中点位信息</span>
          </div>
          <div class="selected-field-grid">
            <article v-for="field in selectedSensorFields" :key="field[0]" :class="{ warning: field[2] === 'warn' }">
              <span>{{ field[0] }}</span>
              <strong>{{ field[1] }}</strong>
            </article>
          </div>
        </div>
      </section>

      <aside class="twin-right-column side-panel system-status-panel">
        <header class="panel-head">
          <div class="panel-title">
            <Server :size="18" />
            <div>
              <h2>系统运行态势</h2>
              <p>设备联动、边缘计算、安全防护与数据留存状态。</p>
            </div>
          </div>
        </header>

        <div class="system-status-list">
          <article v-for="item in systemStatusCards" :key="item.label" class="system-state-card">
            <component :is="item.icon" :size="18" />
            <div class="state-copy">
              <span>{{ item.label }}</span>
              <p>{{ item.detail }}</p>
            </div>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <article class="current-attention-card">
          <div class="attention-head">
            <Droplets :size="20" />
            <span>当前关注</span>
          </div>
          <h3>{{ commandCenter.maxRisk }}</h3>
          <p>下层湿度接近阈值，建议种植员在 {{ commandCenter.nextAction }}。</p>
          <dl>
            <div><dt>点位</dt><dd>{{ commandCenter.riskPointLabel }}</dd></div>
            <div><dt>当前值</dt><dd>{{ commandCenter.humidity }}</dd></div>
            <div><dt>偏差</dt><dd>{{ commandCenter.humidityDeviation }}</dd></div>
            <div><dt>持续</dt><dd>{{ commandCenter.duration }}</dd></div>
          </dl>
          <button type="button" @click="emit('navigate', 'alarms')">进入报警处置</button>
        </article>
      </aside>
    </div>

    <TwinCommandFooter
      :modules="footerStatusModules"
      :actions="footerActions"
      @navigate="emit('navigate', $event)"
    />
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

/* Overview command-screen surface, scoped to the approved home page only. */
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
  --fs-system-title: var(--twin-font-title, 25px);
  --fs-system-subtitle: var(--twin-font-subtitle, 9.5px);
  --fs-panel-title: var(--twin-font-panel-title, 16px);
  --fs-card-title: var(--twin-font-card-title, 15.5px);
  --fs-body: var(--twin-font-body, 12.5px);
  --fs-meta: var(--twin-font-meta, 12px);
  --fs-chip-label: 11px;
  --fs-chip-value: 13.5px;
  --fs-risk-value: var(--twin-font-number-lg, 38px);
  --fs-status-value: var(--twin-font-number-md, 26px);
  --fs-button: 13.5px;
  --twin-type-title: var(--fs-system-title);
  --twin-type-title-compact: var(--twin-font-title-compact, 24px);
  --twin-type-subtitle: var(--fs-system-subtitle);
  --twin-type-subtitle-compact: var(--twin-font-subtitle-compact, 9px);
  --twin-type-panel-title: var(--fs-panel-title);
  --twin-type-panel-title-compact: var(--twin-font-panel-title-compact, 15.5px);
  --twin-type-risk-title: var(--twin-font-risk-title, 18px);
  --twin-type-risk-title-compact: var(--twin-font-risk-title-compact, 16px);
  --twin-type-card-title: var(--fs-card-title);
  --twin-type-body: var(--fs-body);
  --twin-type-meta: var(--fs-meta);
  --twin-type-caption: var(--twin-font-caption, 11.5px);
  --twin-type-micro: var(--twin-font-micro, 11px);
  --twin-type-micro-compact: var(--twin-font-micro-compact, 10px);
  --twin-type-number-lg: var(--fs-risk-value);
  --twin-type-number-lg-compact: var(--twin-font-number-lg-compact, 36px);
  --twin-type-number-md: var(--fs-status-value);
  --twin-type-number-md-compact: var(--twin-font-number-md-compact, 24px);
  --twin-type-number-sm: var(--twin-font-number-sm, 18px);
  --twin-type-number-sm-compact: var(--twin-font-number-sm-compact, 16px);
  --twin-type-system-label: var(--twin-font-system-label, 17px);
  --twin-type-system-label-compact: var(--twin-font-system-label-compact, 15px);
  --twin-line-tight-local: var(--twin-line-tight, 1.2);
  --twin-line-normal-local: var(--twin-line-normal, 1.38);
  --twin-line-readable-local: var(--twin-line-readable, 1.45);
  --panel-gap: 8px;
  --panel-section-gap: 10px;
  --panel-card-gap: 8px;
  --shell-gap: 8px;
  --shell-padding: 10px;
  --header-height: 60px;
  --env-row-height: 38px;
  --stage-head-height: 44px;
  --selected-strip-padding-y: 9px;
  --command-bar-height: 50px;
  --command-button-height: 30px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(1600px, 100%);
  height: min(900px, calc(100dvh - 20px));
  min-height: 700px;
  margin: auto;
  padding: var(--shell-padding);
  gap: var(--shell-gap);
  border-radius: 12px;
  overflow: hidden;
  color: var(--twin-text);
  background:
    radial-gradient(circle at 50% 12%, rgba(0, 245, 178, 0.12), transparent 28%),
    linear-gradient(180deg, #041c16 0%, var(--twin-bg-deep) 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.36);
}

.digital-twin-home::after {
  display: none;
  border: 0;
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
  font-size: var(--twin-type-body);
  font-weight: 700;
}

.twin-header-chip strong {
  color: var(--twin-text);
  font-size: var(--twin-type-card-title);
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
  font-size: var(--twin-type-title);
  line-height: 1.12;
  letter-spacing: 0.18em;
  text-shadow: 0 0 16px rgba(0, 245, 178, 0.5);
}

.twin-header-title p {
  margin-top: 3px;
  color: rgba(0, 245, 178, 0.66);
  font-size: var(--twin-type-subtitle);
  letter-spacing: 0.24em;
  line-height: var(--twin-line-tight-local);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
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
.center-stage {
  border: 1px solid var(--twin-border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  box-shadow: var(--twin-glow), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

.side-panel {
  display: grid;
  align-content: start;
  padding: 10px;
  gap: var(--panel-section-gap);
}

.panel-head {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 58px;
  padding: 6px 0 12px;
  margin: 0;
  border-bottom: 0;
  box-sizing: border-box;
}

.panel-head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background:
    linear-gradient(90deg, transparent 0%, rgba(0, 245, 178, 0.18) 18%, rgba(0, 245, 178, 0.64) 50%, rgba(0, 245, 178, 0.18) 82%, transparent 100%);
  box-shadow: 0 0 10px rgba(0, 245, 178, 0.22);
}

.stage-head {
  margin-bottom: 0;
}

.panel-title {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.panel-title svg {
  margin-top: 0;
  color: var(--twin-green);
  filter: drop-shadow(0 0 8px rgba(0, 245, 178, 0.35));
}

.panel-title h2 {
  margin: 0;
}

.panel-title p,
.chain-title p {
  margin: 5px 0 0;
  font-size: var(--twin-type-meta);
  line-height: var(--twin-line-normal-local);
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
  grid-template-rows: auto auto auto;
  align-content: start;
}

.twin-left-column .twin-env-panel {
  min-height: 0;
}

.panel-title h2,
.center-stage h2 {
  color: var(--twin-text);
  font-size: var(--twin-type-panel-title);
  text-shadow: 0 0 10px rgba(0, 245, 178, 0.42);
}

.panel-title p,
.stage-meta,
.chain-title p {
  color: var(--twin-muted);
}

.twin-panel {
  border-top: 1px solid var(--twin-border-soft);
  padding-top: var(--panel-section-gap);
}

.env-list {
  display: grid;
  gap: var(--panel-card-gap);
}

.env-row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
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
  font-size: var(--twin-type-card-title);
  font-weight: 700;
}

.env-copy span,
.env-reading small {
  color: var(--twin-muted);
  font-size: var(--twin-type-meta);
}

.env-copy span {
  overflow: hidden;
  font-size: var(--twin-type-caption);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.env-reading {
  display: grid;
  grid-template-columns: 52px 32px 38px;
  align-items: baseline;
  gap: 3px;
  font-variant-numeric: tabular-nums;
  justify-content: end;
  min-width: 130px;
}

.env-reading b {
  color: var(--twin-text);
  font-size: var(--twin-type-number-sm);
  line-height: 1;
  text-align: right;
}

.env-reading small {
  text-align: left;
}

.env-row em {
  color: var(--twin-green-soft);
  font-size: var(--twin-type-caption);
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
  display: grid;
  grid-template-rows: var(--stage-head-height) minmax(0, 1fr) auto;
  padding: 0;
  gap: 0;
  min-height: 0;
  overflow: hidden;
}

.stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: var(--stage-head-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--twin-border-soft);
}

.stage-head h2 {
  display: inline-flex;
  align-items: center;
  height: 20px;
  margin: 0;
  line-height: 20px;
  white-space: nowrap;
}

.stage-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  color: rgba(172, 220, 202, 0.58);
  font-size: 11.5px;
  font-weight: 400;
  line-height: 1.25;
  white-space: nowrap;
}

.stage-meta span {
  display: inline-flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
}

.stage-meta span:first-child {
  color: var(--twin-green);
  font-size: 12px;
  font-weight: 650;
}

.stage-meta strong {
  display: inline-grid;
  place-items: center;
  min-height: 20px;
  padding: 0 8px;
  border: 1px solid rgba(0, 245, 178, 0.24);
  border-radius: 999px;
  background: rgba(0, 245, 178, 0.08);
  color: var(--twin-green);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.stage-shell {
  position: relative;
  display: grid;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(rgba(0, 245, 178, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 178, 0.045) 1px, transparent 1px),
    radial-gradient(ellipse at 50% 82%, rgba(0, 245, 178, 0.22), transparent 30%),
    radial-gradient(ellipse at 50% 30%, rgba(0, 245, 178, 0.12), transparent 54%),
    linear-gradient(180deg, rgba(3, 24, 19, 0.96), #020d0b 100%);
  background-size: 28px 28px, 28px 28px, auto, auto, auto;
}

.stage-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 58%, rgba(0, 245, 178, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(0, 245, 178, 0.06), transparent 34%, rgba(0, 0, 0, 0.16));
}

.home3d-scene-frame {
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.home3d-scene-frame :deep(.cabin-scene) {
  min-height: 0;
  height: 100%;
  background: transparent;
}

.home3d-scene-frame :deep(canvas) {
  transform: scale(1.08);
}

.home3d-scene-frame :deep(.scene-label) {
  min-width: 176px;
  border: 1px solid rgba(0, 245, 178, 0.22);
  background:
    radial-gradient(circle at 18% 0%, rgba(0, 245, 178, 0.12), transparent 38%),
    linear-gradient(180deg, rgba(4, 39, 31, 0.9), rgba(2, 20, 17, 0.94));
  box-shadow:
    inset 0 1px 0 rgba(158, 255, 222, 0.08),
    0 12px 28px rgba(0, 10, 8, 0.28);
  color: var(--twin-text);
}

.home3d-scene-frame :deep(.scene-label strong) {
  color: var(--twin-text);
  font-size: 14px;
  line-height: 1.2;
}

.home3d-scene-frame :deep(.scene-label span) {
  color: var(--twin-green);
  font-size: 13px;
  font-weight: 650;
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
  font-size: var(--twin-type-meta);
  font-weight: 900;
}

.twin-sensor-callout strong {
  color: var(--twin-text);
  font-size: var(--twin-type-meta);
  line-height: var(--twin-line-normal-local);
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
  font-size: var(--twin-type-meta);
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
  font-size: var(--twin-type-caption);
}

.selected-field-grid strong {
  color: var(--twin-text);
  font-size: var(--twin-type-meta);
  line-height: var(--twin-line-tight-local);
}

.selected-field-grid .warning strong,
.warning-text,
.danger-text {
  color: var(--twin-amber);
  text-shadow: 0 0 12px rgba(255, 178, 46, 0.46);
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
}

@media (max-height: 860px), (max-width: 1500px) {
  .digital-twin-home {
    --panel-gap: 6px;
    --shell-gap: 5px;
    --shell-padding: 8px;
    --header-height: 48px;
    --env-row-height: 32px;
    --stage-head-height: 34px;
    --selected-strip-padding-y: 5px;
    --command-bar-height: 54px;
    --command-button-height: 24px;
    height: min(900px, calc(100dvh - 20px));
    min-height: 660px;
  }

  .twin-header {
    border-color: rgba(0, 245, 178, 0.32);
  }

  .twin-header-title h1 {
    font-size: var(--twin-type-title-compact);
  }

  .twin-header-title p {
    margin-top: 1px;
    font-size: var(--twin-type-subtitle-compact);
    letter-spacing: 0.18em;
  }

  .twin-header-chip {
    gap: 5px;
    padding: 0 8px;
  }

  .twin-header-chip span {
    font-size: var(--twin-type-meta);
  }

  .twin-header-chip strong {
    font-size: var(--twin-type-body);
  }

  .panel-head {
    padding-bottom: 4px;
  }

  .panel-title h2,
  .center-stage h2 {
    font-size: var(--twin-type-panel-title-compact);
  }

  .panel-title p {
    margin-top: 1px;
    font-size: var(--twin-type-caption);
    line-height: var(--twin-line-tight-local);
  }

  .env-row {
    grid-template-columns: 16px minmax(0, 1fr) auto 34px;
    gap: 6px;
    padding: 4px 8px;
  }

  .env-copy strong {
    font-size: var(--twin-type-body);
  }

  .env-copy span,
  .env-reading small {
    font-size: var(--twin-type-caption);
  }

  .env-reading b {
    font-size: var(--twin-type-number-sm-compact);
  }

  .env-row em {
    font-size: var(--twin-type-micro);
  }

  .stage-head {
    padding: 0 12px;
  }

  .stage-meta {
    font-size: var(--twin-type-micro);
  }

  .twin-selected-strip {
    gap: 5px;
  }

  .strip-title {
    font-size: var(--twin-type-caption);
  }

  .selected-field-grid article {
    padding: 5px 6px;
  }

  .selected-field-grid span {
    font-size: var(--twin-type-micro);
  }

  .selected-field-grid strong {
    font-size: var(--twin-type-caption);
  }

}

/* Overview readability layer: typography only, no layout or data changes. */
.digital-twin-home .overview-focus-stack {
  display: grid;
  gap: var(--panel-section-gap);
}

.digital-twin-home .network-layer-list,
.digital-twin-home .system-status-list {
  display: grid;
  gap: var(--panel-card-gap);
}

.digital-twin-home .network-layer-card,
.digital-twin-home .system-state-card,
.digital-twin-home .current-attention-card {
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(7, 43, 34, 0.76), rgba(3, 24, 20, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(148, 255, 213, 0.04),
    0 10px 24px rgba(0, 8, 7, 0.12);
}

.digital-twin-home .network-layer-card {
  display: grid;
  gap: 6px;
  min-height: 68px;
  padding: 10px 12px;
}

.digital-twin-home .network-layer-card div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.digital-twin-home .network-layer-card span,
.digital-twin-home .system-state-card span,
.digital-twin-home .attention-head span {
  color: var(--twin-text);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
}

.digital-twin-home .network-layer-card strong {
  color: var(--twin-green);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.digital-twin-home .network-layer-card small {
  margin-left: 3px;
  color: rgba(221, 255, 240, 0.74);
  font-size: 12px;
  font-weight: 600;
}

.digital-twin-home .network-layer-card p,
.digital-twin-home .system-state-card p,
.digital-twin-home .current-attention-card p {
  margin: 0;
  color: rgba(190, 226, 210, 0.78);
  font-size: 12px;
  line-height: 1.35;
}

.digital-twin-home .network-layer-card.warn {
  border-color: rgba(255, 178, 46, 0.34);
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 178, 46, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(45, 31, 11, 0.78), rgba(3, 24, 20, 0.92));
}

.digital-twin-home .network-layer-card.warn strong {
  color: var(--twin-amber);
}

.digital-twin-home .system-state-card {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 68px;
  padding: 10px 12px;
}

.digital-twin-home .state-copy {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.digital-twin-home .system-state-card svg {
  justify-self: center;
  color: var(--twin-green);
  margin-top: 0;
}

.digital-twin-home .system-state-card strong {
  display: grid;
  place-items: center;
  min-width: 54px;
  min-height: 36px;
  margin: 0;
  padding: 0 9px;
  border: 1px solid rgba(0, 245, 178, 0.22);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 0%, rgba(0, 245, 178, 0.14), transparent 55%),
    rgba(0, 245, 178, 0.07);
  color: var(--twin-green);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
  white-space: nowrap;
}

.digital-twin-home .current-attention-card {
  display: grid;
  gap: 7px;
  align-self: start;
  align-content: start;
  min-height: 0;
  padding: 11px 12px;
  border-color: rgba(255, 178, 46, 0.42);
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 178, 46, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(62, 38, 11, 0.8), rgba(15, 18, 13, 0.96));
}

.digital-twin-home .attention-head {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  color: var(--twin-amber);
}

.digital-twin-home .attention-head svg {
  justify-self: center;
  transform: translateY(-0.5px);
}

.digital-twin-home .current-attention-card h3 {
  margin: 0;
  color: #ffe0a1;
  font-size: 18px;
  font-weight: 750;
  line-height: 1.2;
}

.digital-twin-home .current-attention-card p {
  color: rgba(255, 231, 190, 0.86);
  line-height: 1.3;
}

.digital-twin-home .current-attention-card dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 9px;
  margin: 0;
}

.digital-twin-home .current-attention-card dt,
.digital-twin-home .current-attention-card dd {
  margin: 0;
  font-size: 12px;
  line-height: 1.25;
}

.digital-twin-home .current-attention-card dt {
  color: rgba(255, 224, 174, 0.66);
}

.digital-twin-home .current-attention-card dd {
  color: #fff6e7;
  font-size: 13.5px;
  font-weight: 700;
}

.digital-twin-home .current-attention-card button {
  min-height: 28px;
  margin-top: 3px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.digital-twin-home .current-attention-card button {
  border-color: rgba(255, 178, 46, 0.5);
  background: linear-gradient(90deg, #ffbf38, #ff9f18);
  color: #1d1003;
}

.digital-twin-home .focus-action-card {
  grid-template-columns: 48px minmax(0, 1fr) auto;
  min-height: 86px;
  border-color: rgba(255, 178, 46, 0.5);
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 178, 46, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(7, 44, 35, 0.88), rgba(4, 26, 21, 0.96));
}

.digital-twin-home .focus-label {
  color: var(--twin-amber);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;
}

.digital-twin-home .panel-title h2,
.digital-twin-home .center-stage h2 {
  font-size: var(--fs-panel-title);
  font-weight: 700;
  line-height: 1.22;
}

.digital-twin-home .panel-title p {
  font-size: var(--fs-meta);
  font-weight: 400;
  line-height: 1.4;
}

.digital-twin-home .stage-meta {
  color: rgba(172, 220, 202, 0.58);
  font-size: 11.5px;
  font-weight: 400;
  line-height: 1.25;
}

.digital-twin-home .stage-meta span:first-child {
  color: var(--twin-green);
  font-size: 12px;
  font-weight: 650;
}

.digital-twin-home .stage-meta strong {
  color: var(--twin-green);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.digital-twin-home .env-copy strong {
  font-size: 12px;
  font-weight: 650;
  line-height: 1.3;
}

.digital-twin-home .env-copy span,
.digital-twin-home .env-reading small,
.digital-twin-home .env-row em {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.25;
}

.digital-twin-home .env-copy span {
  font-size: 10.5px;
  white-space: nowrap;
}

.digital-twin-home .env-reading b {
  font-size: 21px;
  font-weight: 700;
  line-height: 1.1;
}

.digital-twin-home .env-row.warning .env-reading b {
  font-size: 23px;
}

.digital-twin-home .twin-sensor-callout span,
.digital-twin-home .twin-sensor-callout strong {
  font-size: 13px;
  font-weight: 650;
  line-height: 1.25;
}

.digital-twin-home .twin-sensor-callout.warning span,
.digital-twin-home .twin-sensor-callout.warning strong {
  font-size: 13.5px;
}

.digital-twin-home .strip-title {
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.14em;
}

.digital-twin-home .selected-field-grid span {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
}

.digital-twin-home .selected-field-grid strong {
  font-size: 13.5px;
  font-weight: 650;
  line-height: 1.25;
}

.digital-twin-home .selected-field-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.digital-twin-home .selected-field-grid .warning strong,
.digital-twin-home .warning-text,
.digital-twin-home .danger-text {
  font-size: 14px;
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

  .env-row {
    grid-template-columns: 1fr;
  }

  .stage-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .selected-field-grid {
    grid-template-columns: 1fr;
  }
}
</style>


