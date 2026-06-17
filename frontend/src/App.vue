<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Activity, Box, FileText, MapPinned, ShieldAlert, Wrench } from 'lucide-vue-next';
import { api, connectTelemetry } from './api';
import AppPrimaryNav from './components/AppPrimaryNav.vue';
import Home3DCommandCenter from './components/Home3DCommandCenter.vue';
import OverviewWorkspace from './components/OverviewWorkspace.vue';
import ProfessionalBatchPanels from './components/ProfessionalBatchPanels.vue';
import OpsWorkbenchPanels from './components/OpsWorkbenchPanels.vue';
import { navGroups, navItems, roleViews, sceneModes, typeOptions } from './data/navigation';
import type { NavGroup } from './data/navigation';
import { buildEnvironmentCards, calibrationComparisons, deriveEnvironmentScore, deriveStabilityRisks, deriveBatchMetrics, derivePointConfigRows } from './data/integrated-workbench';
import type { AlarmEvent, DashboardSummary, RoleKey, SceneMode, SensorPoint, SensorType, TelemetryPayload, ViewKey } from './types';
import { useCultivationData } from './composables/useCultivationData';
import { useUserSystemData } from './composables/useUserSystemData';
import { useEngineeringData } from './composables/useEngineeringData';
import { useAdminData } from './composables/useAdminData';
import {
  fallbackSummary, fallbackSensors, fallbackAlarms,
  connectionLabel, connectionPillClass,
  type ConnectionState
} from './data/demo-fallback';

/* ── 异步重型组件 ── */
const CultivationAdvancedPanels = defineAsyncComponent({ loader: () => import('./components/CultivationAdvancedPanels.vue'), loadingComponent: () => null, delay: 0 });
const UserSystemPanels = defineAsyncComponent({ loader: () => import('./components/UserSystemPanels.vue'), loadingComponent: () => null, delay: 0 });
const EngineeringDeliveryPanels = defineAsyncComponent({ loader: () => import('./components/EngineeringDeliveryPanels.vue'), loadingComponent: () => null, delay: 0 });
const AdminSupportPanels = defineAsyncComponent({ loader: () => import('./components/AdminSupportPanels.vue'), loadingComponent: () => null, delay: 0 });
const ReportDeliveryCenter = defineAsyncComponent({ loader: () => import('./components/ReportDeliveryCenter.vue'), loadingComponent: () => null, delay: 0 });

/* ── 响应式状态 ── */
const realtimeSummary = ref<DashboardSummary | null>(null);
const realtimeSensors = ref<SensorPoint[]>([]);
const realtimeAlarms = ref<AlarmEvent[]>([]);
const selectedSensor = ref<SensorPoint | null>(null);
const activeType = ref<SensorType | 'all'>('all');
const activeLayer = ref('all');
const activeView = ref<ViewKey>('overview');
const activeRole = ref<RoleKey>('grower');
const sceneMode = ref<SceneMode>('points');
const demoScenario = ref('normal');
const connectionState = ref<ConnectionState>('connecting');
const taskFilter = ref('all');
const simplifiedMode = ref<string>('standard');
let disconnect: (() => void) | undefined;
const emptyList: any[] = [];

/* ── 报警详情抽屉 ── */
const alarmDetailOpen = ref(false);
const selectedAlarm = ref<AlarmEvent | null>(null);
function openAlarmDetail(alarm: AlarmEvent) {
  selectedAlarm.value = alarm;
  alarmDetailOpen.value = true;
}
function closeAlarmDetail() { alarmDetailOpen.value = false; selectedAlarm.value = null; }
function handleAlarmAction(action: '处理' | '复核' | '闭环') {
  if (!selectedAlarm.value) return;
  const a = selectedAlarm.value;
  if (action === '处理') { a.handled = false; }
  if (action === '复核') { /* 模拟复核 */ }
  if (action === '闭环') { a.handled = true; }
  alarmDetailOpen.value = false;
  selectedAlarm.value = null;
}

/* ── 报告预览抽屉 ── */
const reportPreviewOpen = ref(false);
const previewReport = ref<{ name: string; type: string; status: string; content: string } | null>(null);
function openReportPreview(report: { name: string; type: string; status: string; content: string }) {
  previewReport.value = report;
  reportPreviewOpen.value = true;
}
function closeReportPreview() { reportPreviewOpen.value = false; previewReport.value = null; }

/* ── Toast 通知 ── */
const toasts = ref<Array<{ id: number; msg: string; type: string }>>([]);
let toastId = 0;
function showToast(msg: string, type = 'info') {
  const id = ++toastId;
  toasts.value.push({ id, msg, type });
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
}

/* ── 兜底 display 数据 ── */
const displaySummary = computed(() => realtimeSummary.value ?? fallbackSummary);
const displaySensors = computed(() => realtimeSensors.value.length > 0 ? realtimeSensors.value : fallbackSensors);
const displayAlarms = computed(() => realtimeAlarms.value.length > 0 ? realtimeAlarms.value : fallbackAlarms);

/* ── 派生状态 ── */
const statusCounts = computed(() => displaySensors.value.reduce((acc, s) => { acc[s.reading.status] += 1; return acc; }, { normal: 0, warning: 0, alarm: 0, offline: 0 }));

/* ── 组合式数据 ── */
const cult = reactive(useCultivationData(displaySummary, displaySensors, statusCounts));
const userSys = reactive(useUserSystemData());
const eng = reactive(useEngineeringData());
const admin = reactive(useAdminData());

const roleNavOrder: Record<RoleKey, string[]> = {
  grower: ['总览', '今日作业', '种植批次', '运维处置', '报告交付'],
  operator: ['总览', '运维处置', '今日作业', '种植批次', '报告交付'],
  manager: ['总览', '种植批次', '报告交付', '运维处置', '今日作业'],
  visitor: ['总览', '报告交付', '种植批次', '运维处置', '今日作业']
};

const roleNavGroups = computed<NavGroup[]>(() => {
  const order = roleNavOrder[activeRole.value];
  const groups = order
    .map(name => navGroups.find(group => group.name === name))
    .filter(Boolean) as NavGroup[];
  const used = new Set(groups.map(group => group.name));
  return [...groups, ...navGroups.filter(group => !used.has(group.name))];
});

/* ── 当前所在分区 ── */
const activeSection = computed(() => {
  const group = roleNavGroups.value.find(g => g.items.includes(activeView.value))
    ?? navGroups.find(g => g.items.includes(activeView.value));
  return group?.name ?? '总览';
});

/* ── 导航 ── */
const groupedNavItems = computed(() =>
  roleNavGroups.value.map(g => ({ ...g, items: g.items.map(k => navItems.find(n => n.key === k)).filter(Boolean) as Array<{ key: ViewKey; label: string }> }))
);
const activeNavItem = computed(() => navItems.find(n => n.key === activeView.value));
const activeRoleView = computed(() => roleViews.find(role => role.key === activeRole.value) ?? roleViews[0]);
const shellTitle = computed(() => ({
  grower: '种植员工作台',
  operator: '运维处置工作台',
  manager: '管理者驾驶舱',
  visitor: '甲方演示看板'
}[activeRole.value]));
const shellEyebrow = computed(() => ({
  grower: '今日方舱作业',
  operator: '设备与点位运维',
  manager: '生产管理总览',
  visitor: '交付演示模式'
}[activeRole.value]));

/* ── 子视图计算 ── */
const overviewView = computed(() => activeView.value as 'overview' | 'cabin' | 'screen' | 'brain');
const opsWorkbenchView = computed(() => activeView.value as 'environment' | 'control' | 'alarms' | 'maintenance');
const professionalView = computed(() => activeView.value as 'professional' | 'decision');
const cultivationView = computed(() => activeView.value as any);
const userSystemView = computed(() => activeView.value as any);
const engineeringView = computed(() => activeView.value as any);
const adminView = computed(() => activeView.value as any);
const isEnvironmentOpsView = computed(() => ['environment', 'control'].includes(activeView.value));
const isProfessionalOpsView = computed(() => ['professional', 'decision'].includes(activeView.value));
const isAlarmOpsView = computed(() => activeView.value === 'alarms');
const isPointOpsView = computed(() => activeView.value === 'point');
const isReportCenterView = computed(() => ['reports', 'acceptance', 'audit', 'presentation'].includes(activeView.value));
const reportCenterView = computed(() => activeView.value as 'reports' | 'acceptance' | 'audit' | 'presentation');
const isEngineeringDeliveryView = computed(() => ['engineering', 'integration'].includes(activeView.value));
const isAdminDeliveryView = computed(() => ['trace', 'history', 'config', 'governance', 'security', 'settings', 'demo', 'search', 'explain', 'display'].includes(activeView.value));
const isOverviewHome = computed(() => activeSection.value === '总览' && activeView.value === 'overview');

/* ── 过滤与选项 ── */
const layerOptions = computed(() => ['all', ...Array.from(new Set(displaySensors.value.map(s => s.layer))).sort()]);
const layerOptionItems = computed(() => layerOptions.value.map(l => ({ value: l, label: l === 'all' ? '全部层架' : l })));
const filteredSensors = computed(() => displaySensors.value.filter(s => (activeType.value === 'all' || s.type === activeType.value) && (activeLayer.value === 'all' || s.layer === activeLayer.value)));
const importantSensors = computed(() => displaySensors.value.slice(0, 8));
const sensorHealthRows = computed(() => displaySensors.value.slice(0, 8).map((s, i) => ({ id: s.id, name: s.name, position: s.layer, score: 95 - i * 2, risk: i === 0 ? '稳定' : '关注' })));
const sensorTypeRows = computed(() =>
  typeOptions
    .filter(item => item.value !== 'all')
    .map(item => {
      const rows = displaySensors.value.filter(sensor => sensor.type === item.value);
      const abnormal = rows.filter(sensor => sensor.reading.status !== 'normal').length;
      return {
        key: item.value,
        label: item.label,
        total: rows.length,
        abnormal,
        status: abnormal > 0 ? '关注' : '正常'
      };
    })
);
const cultivationNavItems = computed(() => navGroups.find(g => g.name === '种植批次')?.items.map(k => navItems.find(n => n.key === k)).filter(Boolean) as Array<{ key: ViewKey; label: string }> ?? []);
const engineeringNavItems = computed(() => navItems.filter(n => eng.engineeringNavKeys.includes(n.key)));
const adminNavItems = computed(() => navItems.filter(n => eng.adminNavKeys.includes(n.key)));

const selectedPointProfile = computed(() => {
  const s = selectedSensor.value ?? displaySensors.value[0];
  if (!s) return null;
  return { sensor: s, threshold: '按规则模板', maintenance: '正常', alarms: 0, trust: '高', neighbor: s.layer + '邻近点位' };
});

const filteredTaskPreview = computed(() => {
  const all = [
    { name: '确认 CO2 预警（CO2-TOP-001）', level: 'P1', status: '待处理' },
    { name: '检查加湿水位（HUM-01）', level: 'P2', status: '待处理' },
    { name: '复核下层 TH-L2-002 湿度', level: 'P2', status: '处理中' },
    { name: '新风效率复测并关闭工单', level: 'P3', status: '待处理' }
  ];
  return taskFilter.value === '全部' || taskFilter.value === 'all' ? all : all.filter(t => t.status !== '已闭环');
});

/* ── 统一指标 ── */
const unifiedMetrics = computed(() => {
  const targetRate = displaySummary.value?.targetRate ?? 92;
  const onlineRate = displaySummary.value?.onlineRate ?? 100;
  const alarmCount = statusCounts.value.alarm + statusCounts.value.warning;
  const envScore = deriveEnvironmentScore(targetRate, onlineRate, alarmCount);
  const pendingAlarms = displayAlarms.value.filter(a => !a.handled).length;
  return {
    batch: cult.batchProfile.id,
    stage: displaySummary.value?.stage ?? '子实体生长期',
    envScore: envScore.score,
    envLevel: envScore.level,
    maxRisk: '下层湿度偏低 84.9%RH',
    nextAction: '17:30 前复核 TH-L2-002',
    pendingCount: pendingAlarms,
    alarmCount
  };
});

const roleTopbarCards = computed(() => {
  const metrics = unifiedMetrics.value;
  if (activeRole.value === 'grower') {
    return [
      { label: '今日任务', value: `${userSys.todayTasks.length} 项` },
      { label: '待复核', value: '3 项' },
      { label: '阶段', value: metrics.stage },
      { label: '风险动作', value: metrics.nextAction },
      { label: '待处理', value: `${metrics.pendingCount} 条` }
    ];
  }
  if (activeRole.value === 'operator') {
    return [
      { label: '报警', value: `${metrics.pendingCount} 条待处理` },
      { label: '点位', value: `${displaySensors.value.length} 个` },
      { label: '维护', value: `${cult.calibrationComparisons.length} 项` },
      { label: '设备', value: `${displaySummary.value.devices.filter(device => device.running).length}/${displaySummary.value.devices.length} 运行` },
      { label: '下一步', value: '先闭环 P1 报警' }
    ];
  }
  if (activeRole.value === 'visitor') {
    return [
      { label: '演示路线', value: `${demoRouteSteps.length} 步` },
      { label: '三维点位', value: `${displaySensors.value.length} 个` },
      { label: '批次', value: metrics.batch },
      { label: '报告', value: '6 份材料' },
      { label: '状态', value: connectionLabel(connectionState.value) }
    ];
  }
  return [
    { label: '评分', value: String(metrics.envScore), tone: metrics.envLevel },
    { label: '批次', value: metrics.batch },
    { label: '阶段', value: metrics.stage },
    { label: '风险', value: metrics.maxRisk },
    { label: '报告', value: '待验收' }
  ];
});

/* ── 演示路线 ── */
const demoRouteSteps = [
  { step: 1, title: '看总览状态', talk: '当前批次运行正常，环境评分稳定，下一关注点在下层湿度', target: 'overview' as ViewKey },
  { step: 2, title: '看三维点位', talk: '68个硬件点位全覆盖', target: 'cabin' as ViewKey },
  { step: 3, title: '看报警闭环', talk: '报警到 SOP 到工单到复盘', target: 'alarms' as ViewKey },
  { step: 4, title: '看批次追溯', talk: '入舱至采收证据链', target: 'batch' as ViewKey },
  { step: 5, title: '看报告交付', talk: '日报+验收+演示脚本', target: 'reports' as ViewKey }
];

/* ── 操作函数 ── */
function applyTelemetry(payload: TelemetryPayload) {
  realtimeSummary.value = payload.summary;
  realtimeSensors.value = payload.sensors;
  realtimeAlarms.value = payload.alarms;
  if (selectedSensor.value) {
    selectedSensor.value = payload.sensors.find(s => s.id === selectedSensor.value?.id) ?? null;
  }
  connectionState.value = 'online';
}
async function loadInitialData() {
  try {
    const [ns, nse, na] = await Promise.all([api.summary(), api.sensors(), api.alarms()]);
    realtimeSummary.value = ns; realtimeSensors.value = nse; realtimeAlarms.value = na;
    selectedSensor.value = nse[0] ?? null;
    connectionState.value = 'online';
  } catch {
    connectionState.value = 'demo';
  }
}
function focusSensor(sensor: SensorPoint) { selectedSensor.value = sensor; activeView.value = 'overview'; }
function selectPointArchive(sensor: SensorPoint) { selectedSensor.value = sensor; }
function focusSensorById(id: string) { const s = displaySensors.value.find(item => item.id === id); if (s) focusSensor(s); }
function switchRole(role: (typeof roleViews)[number]) { activeRole.value = role.key; activeView.value = role.defaultView; }
function runDemoScenario(name: string) { demoScenario.value = name; const t: Record<string, ViewKey> = { normal: 'overview', 'humidity-low': 'brain', 'co2-slow': 'strategy', contamination: 'closure', harvest: 'harvest' }; activeView.value = t[name] ?? 'demo'; }
function setTaskFilterValue(f: typeof taskFilter.value) { taskFilter.value = f; }
function setSimplifiedModeValue(m: string) { simplifiedMode.value = m; }
function layerLabel(l: string) { return l === 'all' ? '全部层架' : l; }
function formatPointValue(sensor: SensorPoint) {
  if (sensor.reading.unit === 'state') {
    return sensor.reading.value > 0 ? '运行' : '正常';
  }
  const secondary = sensor.reading.secondaryValue !== undefined ? ` / ${sensor.reading.secondaryValue}${sensor.reading.secondaryUnit ?? ''}` : '';
  return `${sensor.reading.value}${sensor.reading.unit}${secondary}`;
}
function statusText(status: SensorPoint['reading']['status']) {
  return ({ normal: '正常', warning: '关注', alarm: '报警', offline: '离线' } as const)[status] ?? status;
}

/* ── 生命周期 ── */
onMounted(async () => {
  await loadInitialData();
  const fallbackTimer = setTimeout(() => { if (connectionState.value === 'connecting') connectionState.value = 'demo'; }, 5000);
  try {
    const socket = connectTelemetry(applyTelemetry);
    socket.on('connect', () => { clearTimeout(fallbackTimer); connectionState.value = 'online'; });
    socket.on('disconnect', () => { connectionState.value = 'demo'; });
    disconnect = () => socket.disconnect();
  } catch { clearTimeout(fallbackTimer); connectionState.value = 'demo'; }
});
onUnmounted(() => disconnect?.());
</script>

<template>
  <main :class="['app-shell', { 'overview-mode': isOverviewHome }]">
    <!-- Toast 容器 -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" :class="['toast-item', `toast-${t.type}`]">{{ t.msg }}</div>
    </div>

    <header v-if="!isOverviewHome" class="topbar">
      <div class="topbar-left">
        <p class="eyebrow">{{ shellEyebrow }}</p>
        <h1>{{ shellTitle }}</h1>
      </div>
      <div class="topbar-status">
        <span v-for="item in roleTopbarCards" :key="item.label" class="status-item">
          <b>{{ item.label }}</b>
          <strong v-if="item.label === '评分'" :class="unifiedMetrics.envLevel === '优秀' ? 'text-good' : unifiedMetrics.envLevel === '稳定' ? 'text-ok' : 'text-warn'">{{ item.value }}</strong>
          <template v-else>{{ item.value }}</template>
        </span>
      </div>
      <div class="topbar-actions">
        <details class="role-menu">
          <summary>
            <span>当前角色</span>
            <strong>{{ activeRoleView.label }}</strong>
          </summary>
          <div class="role-menu-popover">
            <button
              v-for="role in roleViews"
              :key="role.key"
              type="button"
              :class="{ active: activeRole === role.key }"
              @click="switchRole(role)"
            >
              <strong>{{ role.label }}</strong>
              <span>{{ role.focus }}</span>
            </button>
          </div>
        </details>
        <span :class="['live-pill', connectionPillClass(connectionState)]">
          <Activity :size="14" />
          {{ connectionLabel(connectionState) }}
        </span>
      </div>
    </header>

    <AppPrimaryNav
      v-if="!isOverviewHome"
      :class="{ 'overview-nav-shell': isOverviewHome }"
      :active-view="activeView"
      :grouped-nav-items="groupedNavItems"
      @select-view="activeView = $event"
    />

    <!-- 总览 -->
    <section v-if="activeSection === '总览'" :class="['section-content', { 'overview-home-section': isOverviewHome }]">
      <Home3DCommandCenter
        v-if="activeView === 'overview'"
        :active-role="activeRole" :active-layer="activeLayer" :active-type="activeType" :alarm-timeline="displayAlarms"
        :display-sensors="displaySensors" :filtered-sensors="filteredSensors" :layer-option-items="layerOptionItems"
        :scene-mode="sceneMode" :scene-modes="sceneModes" :selected-sensor="selectedSensor" :summary="displaySummary"
        :type-options="typeOptions" :active-view="activeView" :grouped-nav-items="groupedNavItems" :unified-metrics="unifiedMetrics" @navigate="activeView = $event"
        @select-view="activeView = $event"
        @select-sensor="selectedSensor = $event" @update-active-layer="activeLayer = $event"
        @update-active-type="activeType = $event" @update-scene-mode="sceneMode = $event"
      />
      <OverviewWorkspace
        v-else
        :active-view="overviewView" :active-layer="activeLayer" :active-type="activeType" :alarm-timeline="displayAlarms"
        :approval-flow-simulation="cult.approvalFlowSimulation" :batch-profile="cult.batchProfile" :control-brain-summary="cult.controlBrainSummary"
        :environment-score="cult.environmentScore" :filtered-sensors="filteredSensors" :important-sensors="importantSensors"
        :layer-option-items="layerOptionItems" :management-qa="cult.managementQa" :scene-mode="sceneMode" :scene-modes="sceneModes"
        :selected-sensor="selectedSensor" :status-counts="statusCounts" :summary="displaySummary" :twin-bus-nodes="cult.twinBusNodes"
        :type-options="typeOptions" @select-sensor="focusSensor" @update-active-layer="activeLayer = $event"
        @update-active-type="activeType = $event" @update-scene-mode="sceneMode = $event"
      />
    </section>

    <!-- 今日作业 -->
    <section v-else-if="activeSection === '今日作业'" class="section-content">
      <UserSystemPanels
        :active-view="userSystemView" :active-role="activeRole" :task-filter="taskFilter" :simplified-mode="simplifiedMode"
        :approval-records="userSys.approvalRecords" :login-roles="userSys.loginRoles" :setting-groups="userSys.settingGroups"
        :alarm-timeline="displayAlarms" :user-todo-summary="userSys.userTodoSummary" :task-filter-options="userSys.taskFilterOptions"
        :filtered-task-preview="filteredTaskPreview" :role-workbench-cards="userSys.roleWorkbenchCards" :status-color-standards="userSys.statusColorStandards"
        :bulk-action-entries="userSys.bulkActionEntries" :note-cards="userSys.noteCards" :export-shortcuts="userSys.exportShortcuts"
        :keyboard-hints="userSys.keyboardHints" :executive-simple-cards="userSys.executiveSimpleCards" :field-simple-cards="userSys.fieldSimpleCards"
        :user-quick-actions="userSys.userQuickActions" :favorite-pages="userSys.favoritePages" :recent-objects="userSys.recentObjects"
        :task-priority-queue="userSys.taskPriorityQueue" :confirmation-cards="userSys.confirmationCards" :onboarding-steps="userSys.onboardingSteps"
        :enhanced-search-categories="userSys.enhancedSearchCategories" :grouped-notifications="userSys.groupedNotifications"
        :user-operation-history="userSys.userOperationHistory" :concept-help-center="userSys.conceptHelpCenter" :page-state-samples="userSys.pageStateSamples"
        :feedback-entries="userSys.feedbackEntries" :weak-network-status="userSys.weakNetworkStatus" :user-preference-items="userSys.userPreferenceItems"
        :terminology-modes="userSys.terminologyModes" :today-tasks="userSys.todayTasks" :inspection-checklist="userSys.inspectionChecklist"
        :inspection-schedule="userSys.inspectionSchedule" :handover-items="userSys.handoverItems" :planting-logs="userSys.plantingLogs"
        :sop-guides="userSys.sopGuides" :stage-checklist="userSys.stageChecklist" :work-orders="userSys.workOrders"
        :demo-scenario="demoScenario" :demo-scenarios="userSys.demoScenarios"
        :set-task-filter="setTaskFilterValue" :set-simplified-mode="setSimplifiedModeValue"
        :navigate-to-view="(v: ViewKey) => activeView = v" :run-demo-scenario="runDemoScenario"
      />
    </section>

    <!-- 种植批次 -->
    <section v-else-if="activeSection === '种植批次'" class="section-content">
      <CultivationAdvancedPanels
        :active-view="cultivationView" :batch-metrics="cult.batchMetrics" :batch-profile="cult.batchProfile"
        :stage-compliance="cult.stageCompliance" :yield-correlation="cult.yieldCorrelation" :growth-stages="cult.growthStages"
        :summary-stage="displaySummary?.stage" :golden-ear-recipes="cult.goldenEarRecipes" :stage-auto-decision="cult.stageAutoDecision"
        :growth-pressure="cult.growthPressureData" :comfort-zones="cult.comfortZonesData" :cultivation-calendar="cult.cultivationCalendar"
        :deviation-durations="cult.deviationDurations" :harvest-prediction="cult.harvestPrediction" :yield-impact="cult.yieldImpact"
        :batch-comparison="cult.batchComparison" :cultivation-operation-templates="cult.cultivationOperationTemplates"
        :cleanout-flow="cult.cleanoutFlow" :biosecurity-records="cult.biosecurityRecords" :cultivation-knowledge="cult.cultivationKnowledge"
        :recipe-versions="cult.recipeVersions" :culture-bag-archives="cult.cultureBagArchives" :contamination-risk-records="cult.contaminationRiskRecords"
        :morphology-records="cult.morphologyRecords" :rack-microclimate-ranking="cult.rackMicroclimateRanking" :bag-loss-metrics="cult.bagLossMetrics"
        :harvest-grades="cult.harvestGrades" :rack-yield-records="cult.rackYieldRecords" :energy-yield-efficiency="cult.energyYieldEfficiency"
        :process-optimization-advice="cult.processOptimizationAdvice" :multi-batch-experience="cult.multiBatchExperience"
        :anomaly-disposal-levels="cult.anomalyDisposalLevels" :isolation-flow="cult.isolationFlow" :dynamic-harvest-window="cult.dynamicHarvestWindow"
        :yield-loss-estimations="cult.yieldLossEstimations" :bag-lifecycle-nodes="cult.bagLifecycleNodes"
        :operation-impact-assessments="cult.operationImpactAssessments" :maturity-index="cult.maturityIndex"
        :rack-review-reports="cult.rackReviewReports" :parameter-deviation-audit="cult.parameterDeviationAudit"
        :review-meeting-cards="cult.reviewMeetingCards" :review-meeting-actions="cult.reviewMeetingActions"
        :process-consistency="cult.processConsistency" :ccp-controls="cult.ccpControls" :cqa-attributes="cult.cqaAttributes"
        :capa-records="cult.capaRecords" :batch-lock-rules="cult.batchLockRules" :quality-rule-library="cult.qualityRuleLibrary"
        :director-dashboard="cult.directorDashboard" :batch-risk-radar="cult.batchRiskRadar" :stage-release-checks="cult.stageReleaseChecks"
        :harvest-precheck="cult.harvestPrecheck" :batch-cost-accounting="cult.batchCostAccounting"
        :environment-yield-contribution="cult.environmentYieldContribution" :reproducibility-score="cult.reproducibilityScore"
        :production-kpis="cult.productionKpis" :sop-deviation-analysis="cult.sopDeviationAnalysis" :evidence-chain-score="cult.evidenceChainScore"
        :responsibility-matrix="cult.responsibilityMatrix" :next-batch-recommendation="cult.nextBatchRecommendation"
        :knowledge-cards="cult.knowledgeCards" :handover-templates="cult.handoverTemplates" :event-rules-center="cult.eventRulesCenter"
        :parameter-sandbox="cult.parameterSandbox" :optimization-modes="cult.optimizationModes" :batch-profile-tags="cult.batchProfileTags"
        :exception-management="cult.exceptionManagement" :benchmark-library="cult.benchmarkLibrary" :nav-items="cultivationNavItems"
        @focus-sensor-by-id="focusSensorById"
      />
    </section>

    <!-- 运维处置 -->
    <section v-else-if="activeSection === '运维处置'" :class="['section-content', `ops-view-${activeView}`]">
      <article class="ops-command-strip">
        <button type="button" :class="{ active: isEnvironmentOpsView }" @click="activeView = 'environment'">
          <Activity :size="18" />
          <span>看环境</span>
          <strong>{{ cult.environmentCards[0]?.primary ?? '稳定' }}</strong>
        </button>
        <button type="button" :class="{ active: isAlarmOpsView }" @click="activeView = 'alarms'">
          <ShieldAlert :size="18" />
          <span>处置报警</span>
          <strong>{{ displayAlarms.filter(a => !a.handled).length }} 条待处理</strong>
        </button>
        <button type="button" :class="{ active: activeView === 'point' }" @click="activeView = 'point'">
          <MapPinned :size="18" />
          <span>查点位</span>
          <strong>{{ displaySensors.length }} 个点位</strong>
        </button>
        <button type="button" :class="{ active: isProfessionalOpsView }" @click="activeView = 'professional'">
          <Box :size="18" />
          <span>看专业判断</span>
          <strong>{{ cult.environmentScore.score }} 分</strong>
        </button>
      </article>
      <OpsWorkbenchPanels
        v-if="isEnvironmentOpsView || isAlarmOpsView"
        :active-view="opsWorkbenchView"
        :environment-cards="cult.environmentCards"
        :control-rules="cult.controlRules"
        :alarm-timeline="displayAlarms"
        :point-config-rows="cult.pointConfigRows"
        :calibration-comparisons="cult.calibrationComparisons"
        :stage-release-checks="cult.stageReleaseChecks"
        :display-sensors="displaySensors"
        :open-alarm="openAlarmDetail"
        :select-sensor="focusSensor"
        :focus-sensor-by-id="focusSensorById"
        :format-point-value="formatPointValue"
        :status-text="statusText"
      />
      <ProfessionalBatchPanels v-if="isProfessionalOpsView" :active-view="professionalView" :alarm-root-causes="cult.alarmRootCauses" :anomaly-chains="emptyList" :crop-growth-status="{ status: '稳定', basis: ['环境评分良好', '风险可控'] }" :environment-score="cult.environmentScore" :equipment-efficiency="cult.equipmentEfficiency" :operation-suggestions="cult.operationSuggestions" :predictive-maintenance="emptyList" :response-curves="emptyList" :risk-index="{ value: 18, level: '低', sources: ['湿度', 'CO2 回落'], action: '持续观察并保持工单入口' }" :sensor-health-rows="sensorHealthRows" :stability-risks="cult.stabilityRisks" :threshold-sensitivity="emptyList" :uniformity="cult.uniformity" @focus-sensor-by-id="focusSensorById" />
      <section v-if="isPointOpsView" class="module-grid point-layout point-archive-workbench">
        <article class="panel-block point-wide">
          <header class="section-title">
            <MapPinned :size="18" />
            <div>
              <h2>需关注点位</h2>
              <p>种植员先看异常、关注、离线和待复核点位；全量档案放在下方作为证据。</p>
            </div>
          </header>
          <div class="attention-sensor-list">
            <button
              v-for="sensor in displaySensors.filter(s => s.reading.status !== 'normal').slice(0, 8)"
              :key="sensor.id"
              type="button"
              @click="selectPointArchive(sensor)"
            >
              <strong>{{ sensor.id }}</strong>
              <span>{{ sensor.name }}</span>
              <small>{{ sensor.layer }} · {{ sensor.installPosition }}</small>
              <em>{{ formatPointValue(sensor) }} · {{ statusText(sensor.reading.status) }}</em>
            </button>
          </div>
        </article>

        <article class="panel-block point-wide">
          <header class="section-title">
            <MapPinned :size="18" />
            <div>
              <h2>点位类型概览</h2>
              <p>保留 68 点位专业感，但种植员默认只从异常点位进入查看。</p>
            </div>
          </header>
          <div class="point-type-strip">
            <button
              v-for="row in sensorTypeRows"
              :key="row.key"
              type="button"
              :class="{ attention: row.abnormal > 0 }"
              @click="activeType = row.key"
            >
              <span>{{ row.label }}</span>
              <strong>{{ row.total }}</strong>
              <small>{{ row.status }}{{ row.abnormal ? ` · ${row.abnormal} 个需关注` : '' }}</small>
            </button>
          </div>
        </article>

        <article class="panel-block">
          <header class="section-title">
            <Activity :size="18" />
            <div>
              <h2>健康度排行</h2>
              <p>按在线稳定、波动合理性、邻近点一致性生成。</p>
            </div>
          </header>
          <div class="mini-table">
            <button v-for="row in sensorHealthRows" :key="row.id" type="button" @click="focusSensorById(row.id)">
              <strong>{{ row.score }}</strong>
              <span>{{ row.name }}</span>
              <em>{{ row.risk }}</em>
            </button>
          </div>
        </article>

        <article v-if="selectedPointProfile" class="panel-block">
          <header class="section-title">
            <ShieldAlert :size="18" />
            <div>
              <h2>当前点位</h2>
              <p>{{ selectedPointProfile.sensor.installPosition }}</p>
            </div>
          </header>
          <div class="point-profile">
            <article>
              <span>点位编号</span>
              <strong>{{ selectedPointProfile.sensor.id }}</strong>
            </article>
            <article>
              <span>当前读数</span>
              <strong>{{ formatPointValue(selectedPointProfile.sensor) }}</strong>
            </article>
            <article>
              <span>运行状态</span>
              <strong>{{ statusText(selectedPointProfile.sensor.reading.status) }}</strong>
            </article>
            <article>
              <span>阈值模板</span>
              <strong>{{ selectedPointProfile.threshold }}</strong>
            </article>
            <article>
              <span>维护状态</span>
              <strong>{{ selectedPointProfile.maintenance }}</strong>
            </article>
            <article>
              <span>邻近对照</span>
              <strong>{{ selectedPointProfile.neighbor }}</strong>
            </article>
          </div>
        </article>

        <article class="panel-block point-wide">
          <header class="section-title">
            <Box :size="18" />
            <div>
              <h2>全部点位档案</h2>
              <p>用于复核和追溯；点击点位查看档案，需要空间定位时再进入三维舱体。</p>
            </div>
          </header>
          <div class="point-filter-bar">
            <select v-model="activeType">
              <option v-for="item in typeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
            <select v-model="activeLayer">
              <option v-for="item in layerOptionItems" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
            <button type="button" @click="activeView = 'cabin'">三维定位</button>
          </div>
          <div class="sensor-list point-sensor-list compact">
            <button
              v-for="sensor in filteredSensors"
              :key="sensor.id"
              type="button"
              :class="{ active: selectedPointProfile?.sensor.id === sensor.id }"
              @click="selectPointArchive(sensor)"
            >
              <strong>{{ sensor.name }}</strong>
              <span>{{ sensor.layer }} · {{ sensor.installPosition }}</span>
              <em>{{ formatPointValue(sensor) }} · {{ statusText(sensor.reading.status) }}</em>
            </button>
          </div>
        </article>
      </section>
    </section>

    <!-- 报告交付：按二级导航渲染对应组件 -->
    <section v-else-if="activeSection === '报告交付'" class="section-content">
      <article class="delivery-command-strip">
        <button type="button" :class="{ active: isReportCenterView }" @click="activeView = 'reports'">
          <FileText :size="18" />
          <span>看报告</span>
          <strong>6 份文件</strong>
        </button>
        <button type="button" :class="{ active: activeView === 'acceptance' }" @click="activeView = 'acceptance'">
          <ShieldAlert :size="18" />
          <span>看验收</span>
          <strong>4 / 7 通过</strong>
        </button>
        <button type="button" :class="{ active: activeView === 'audit' || activeView === 'trace' }" @click="activeView = 'audit'">
          <Activity :size="18" />
          <span>查审计</span>
          <strong>2 条记录</strong>
        </button>
        <button type="button" :class="{ active: activeView === 'presentation' }" @click="activeView = 'presentation'">
          <Box :size="18" />
          <span>汇报演示</span>
          <strong>5 步脚本</strong>
        </button>
      </article>
      <ReportDeliveryCenter
        v-if="isReportCenterView"
        :active-view="reportCenterView"
        :unified-metrics="unifiedMetrics"
        :display-alarms="displayAlarms"
        :display-sensors="displaySensors"
        :cult="cult"
        :admin="admin"
        :eng="eng"
        :connection-state="connectionState"
        @navigate="activeView = $event"
        @preview="openReportPreview"
      />

      <EngineeringDeliveryPanels
        v-else-if="isEngineeringDeliveryView"
        :active-view="engineeringView" :acceptance-metrics="eng.acceptanceMetrics" :sla-statuses="eng.slaStatuses"
        :backup-strategy="eng.backupStrategy" :release-notes="eng.releaseNotes" :data-lineage="eng.dataLineage"
        :api-docs="eng.apiDocsList" :integration-status="eng.integrationStatus" :help-manual="eng.helpManual"
        :drill-scenarios="eng.drillScenarios" :permission-audit-logs="eng.permissionAuditLogs"
        :global-search-results="eng.globalSearchResults" :event-timeline="eng.eventTimeline"
        :selected-point-profile="selectedPointProfile" :rule-explanations="eng.ruleExplanations"
        :demo-scripts="eng.demoScripts" :data-mode-badges="eng.dataModeBadges" :legend-items="eng.legendItems"
        :deployment-checklist="eng.deploymentChecklist" :self-check-items="eng.selfCheckItems"
        :delivery-status="eng.deliveryStatus" :acceptance-checklist="eng.acceptanceChecklist"
        :data-access-status="eng.dataAccessStatus" :source-credibility="eng.sourceCredibility"
        :point-business-mapping="eng.pointBusinessMapping" :page-permission-matrix="eng.pagePermissionMatrix"
        :demo-flow-scenarios="eng.demoFlowScenarios" :process-swimlanes="eng.processSwimlanes"
        :presentation-script="eng.presentationScript" :nav-items="engineeringNavItems"
        :run-demo-scenario="runDemoScenario" @focus-sensor-by-id="focusSensorById"
      />

      <AdminSupportPanels
        v-else-if="isAdminDeliveryView"
        :active-view="adminView" :anomaly-case-library="eng.anomalyCaseLibrary" :api-contracts="eng.apiContracts"
        :compliance-audit="admin.complianceAudit" :data-quality-metrics="cult.dataQualityMetrics"
        :data-trust-rows="cult.dataTrustRows" :export-items="eng.exportItems" :history-queries="admin.historyQueries"
        :management-board="cult.managementBoard" :notification-items="cult.notificationItems"
        :operation-reports="cult.operationReports" :point-config-rows="cult.pointConfigRows"
        :production-trace-chain="eng.productionTraceChain" :report-cards="cult.reportCards"
        :review-report="cult.reviewReport" :role-matrix="eng.roleMatrix"
        :threshold-change-records="admin.thresholdChangeRecords" :threshold-templates="eng.thresholdTemplates"
        @focus-sensor-by-id="focusSensorById"
      />
    </section>

    <!-- 报警详情抽屉 -->
    <Teleport to="body">
      <div v-if="alarmDetailOpen" class="drawer-overlay" @click.self="closeAlarmDetail">
        <aside class="drawer-panel">
          <div class="drawer-header">
            <h3>报警详情</h3>
            <button type="button" class="drawer-close" @click="closeAlarmDetail">×</button>
          </div>
          <div v-if="selectedAlarm" class="drawer-body">
            <dl class="detail-list">
              <dt>报警点位</dt><dd>{{ selectedAlarm.sensorName }}</dd>
              <dt>报警级别</dt><dd :class="selectedAlarm.level === 'warning' ? 'text-warn' : 'text-ok'">{{ selectedAlarm.level === 'warning' ? '预警' : '提示' }}</dd>
              <dt>报警信息</dt><dd>{{ selectedAlarm.message }}</dd>
              <dt>发生时间</dt><dd>{{ new Date(selectedAlarm.createdAt).toLocaleString() }}</dd>
              <dt>闭环状态</dt><dd>{{ selectedAlarm.handled ? '已闭环' : '待处理' }}</dd>
            </dl>
            <div class="detail-section">
              <h4>根因判断</h4>
              <p>{{ selectedAlarm.message.includes('CO2') ? '新风回落偏慢，需要复核新风风机运行状态' : '下层加湿效率偏低，加湿水位需确认' }}</p>
            </div>
            <div class="detail-section">
              <h4>SOP 步骤</h4>
              <ol>
                <li>确认报警点位当前值</li>
                <li>定位异常区域（下层或通风口）</li>
                <li>检查对应设备运行状态</li>
                <li>执行调整并记录结果</li>
                <li>确认数值回归后归档</li>
              </ol>
            </div>
            <div class="detail-section">
              <h4>责任人与复核人</h4>
              <p>责任人：值班种植员　复核人：种植负责人</p>
            </div>
            <div class="drawer-actions">
              <button v-if="!selectedAlarm.handled" type="button" class="btn-action btn-process" @click="handleAlarmAction('处理')">处理</button>
              <button v-if="!selectedAlarm.handled" type="button" class="btn-action btn-review" @click="handleAlarmAction('复核')">复核</button>
              <button type="button" class="btn-action btn-close-action" @click="handleAlarmAction('闭环')">闭环</button>
            </div>
          </div>
        </aside>
      </div>
    </Teleport>

    <!-- 报告预览抽屉 -->
    <Teleport to="body">
      <div v-if="reportPreviewOpen" class="drawer-overlay" @click.self="closeReportPreview">
        <aside class="drawer-panel">
          <div class="drawer-header">
            <h3>报告预览</h3>
            <button type="button" class="drawer-close" @click="closeReportPreview">×</button>
          </div>
          <div v-if="previewReport" class="drawer-body">
            <dl class="detail-list">
              <dt>报告名称</dt><dd>{{ previewReport.name }}</dd>
              <dt>报告类型</dt><dd>{{ previewReport.type }}</dd>
              <dt>生成状态</dt><dd>{{ previewReport.status }}</dd>
            </dl>
            <div class="detail-section">
              <h4>报告摘要</h4>
              <p>{{ previewReport.content }}</p>
            </div>
            <div class="drawer-actions">
              <button type="button" class="btn-action" @click="showToast('已模拟导出 PDF', 'success'); closeReportPreview()">导出 PDF</button>
              <button type="button" class="btn-action" @click="showToast('已模拟导出 Excel', 'success'); closeReportPreview()">导出 Excel</button>
            </div>
          </div>
        </aside>
      </div>
    </Teleport>
  </main>
</template>

<style>
.overview-core { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; padding: 16px; }
.core-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 8px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); text-align: center; }
.core-card span { font-size: 12px; color: var(--muted); }
.core-card strong { font-size: 20px; font-weight: 700; }
.core-card small { font-size: 11px; color: var(--muted); }
.core-card.main-score strong { font-size: 36px; }
.text-good { color: #16a34a; }
.text-ok { color: #2563eb; }
.text-warn { color: #ea580c; }
.entry-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 16px 16px; }
.entry-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); cursor: pointer; transition: all .15s; }
.entry-card:hover { border-color: var(--primary); background: var(--hover); }
.entry-card strong { font-size: 14px; }
.entry-card span { font-size: 12px; color: var(--muted); }
.demo-route-panel { margin: 0 16px 16px; padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
.demo-steps { display: flex; gap: 8px; margin-top: 12px; }
.demo-step { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface-alt); cursor: pointer; text-align: left; transition: all .15s; }
.demo-step:hover { border-color: var(--primary); }
.demo-step strong { font-size: 16px; color: var(--primary); }
.demo-step span { font-size: 13px; font-weight: 600; }
.demo-step small { font-size: 11px; color: var(--muted); }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border); background: var(--surface); }
.topbar-left .eyebrow { font-size: 11px; color: var(--muted); margin: 0; }
.topbar-left h1 { font-size: 16px; margin: 0; }
.topbar-status { display: flex; gap: 16px; font-size: 13px; }
.status-item b { margin-right: 4px; color: var(--muted); font-weight: 500; }
.live-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
.pill-online { background: rgba(22,163,74,.1); color: #16a34a; }
.pill-demo { background: rgba(37,99,235,.1); color: #2563eb; }
.pill-connecting { background: rgba(234,88,12,.1); color: #ea580c; }
.pill-error { background: rgba(220,38,38,.1); color: #dc2626; }
.section-content { flex: 1; overflow-y: auto; }

/* 抽屉 */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.32); z-index: 1000; display: flex; justify-content: flex-end; }
.drawer-panel { width: min(420px, 90vw); background: #fff; box-shadow: -8px 0 24px rgba(0,0,0,.12); overflow-y: auto; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border); }
.drawer-header h3 { margin: 0; font-size: 16px; }
.drawer-close { border: 0; background: 0; font-size: 18px; cursor: pointer; color: var(--muted); }
.drawer-body { padding: 16px; }
.detail-list { display: grid; grid-template-columns: 100px 1fr; gap: 8px 12px; margin: 0 0 16px; }
.detail-list dt { color: var(--muted); font-size: 13px; }
.detail-list dd { margin: 0; font-size: 14px; font-weight: 500; }
.detail-section { margin-bottom: 16px; }
.detail-section h4 { font-size: 14px; margin: 0 0 8px; color: var(--primary); }
.detail-section p { margin: 0; color: #334155; line-height: 1.6; font-size: 14px; }
.detail-section ol { margin: 0; padding-left: 20px; color: #334155; line-height: 1.8; font-size: 14px; }
.drawer-actions { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border); }
.btn-action { padding: 6px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); font-size: 13px; cursor: pointer; transition: all .12s; }
.btn-action:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-process { border-color: #f59e0b; color: #f59e0b; }
.btn-process:hover { background: #f59e0b; color: #fff; }
.btn-review { border-color: #2563eb; color: #2563eb; }
.btn-review:hover { background: #2563eb; color: #fff; }
.btn-close-action { border-color: #10b981; color: #10b981; }
.btn-close-action:hover { background: #10b981; color: #fff; }

/* Toast */
.toast-container { position: fixed; top: 16px; right: 16px; z-index: 2000; display: flex; flex-direction: column; gap: 8px; }
.toast-item { padding: 8px 16px; border-radius: 6px; font-size: 13px; color: #fff; animation: toast-in .25s ease; }
.toast-info { background: #2563eb; }
.toast-success { background: #10b981; }
.toast-warn { background: #f59e0b; }
@keyframes toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

@media (max-width: 768px) {
  .overview-core { grid-template-columns: repeat(3, 1fr); }
  .entry-cards { grid-template-columns: 1fr; }
  .demo-steps { flex-direction: column; }
}

/* Product UI pass: unify the app shell without touching business logic. */
.app-shell {
  min-height: 100vh;
  padding: 18px 22px 28px;
  background:
    radial-gradient(circle at 8% 0%, rgba(15, 118, 110, 0.08), transparent 28%),
    linear-gradient(180deg, var(--bg), var(--bg-soft));
}

.app-shell.overview-mode {
  overflow: hidden;
  padding: 6px 18px 6px;
  background:
    radial-gradient(circle at 50% 0%, rgba(68, 204, 150, 0.14), transparent 22%),
    radial-gradient(circle at 12% 12%, rgba(20, 109, 83, 0.22), transparent 26%),
    linear-gradient(180deg, #031814, #041e18 34%, #031511 100%);
}

.topbar {
  display: grid;
  grid-template-columns: minmax(190px, 0.8fr) minmax(420px, 1.7fr) auto;
  align-items: center;
  gap: 18px;
  width: min(1600px, 100%);
  min-height: 72px;
  margin: 0 auto 12px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: color-mix(in oklch, var(--surface) 94%, transparent);
  box-shadow: var(--shadow-soft);
}

.topbar-left .eyebrow {
  margin: 0 0 4px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
}

.topbar-left h1 {
  margin: 0;
  color: var(--fg);
  font-size: 20px;
  line-height: 1.2;
}

.topbar-status {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.status-item {
  display: grid;
  gap: 2px;
  min-width: 0;
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--surface-alt);
  color: var(--fg);
  font-size: 13px;
  line-height: 1.25;
}

.status-item b {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

.status-item strong {
  font-size: 15px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
}

.live-pill {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-weight: 800;
  white-space: nowrap;
}

.role-menu {
  position: relative;
  z-index: 30;
}

.role-menu summary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  list-style: none;
  white-space: nowrap;
}

.role-menu summary::-webkit-details-marker {
  display: none;
}

.role-menu summary strong {
  color: var(--primary-strong);
  font-size: 13px;
}

.role-menu[open] summary {
  border-color: var(--border-strong);
  background: var(--primary-soft);
}

.role-menu-popover {
  position: absolute;
  top: 42px;
  right: 0;
  display: grid;
  gap: 6px;
  width: 280px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.role-menu-popover button {
  display: grid;
  gap: 3px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--fg);
  text-align: left;
  cursor: pointer;
}

.role-menu-popover button:hover {
  border-color: var(--border);
  background: var(--hover);
}

.role-menu-popover button.active {
  border-color: var(--border-strong);
  background: var(--primary-soft);
}

.role-menu-popover button span {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.pill-online { background: color-mix(in oklch, var(--success) 12%, transparent); color: var(--success); }
.pill-demo { background: color-mix(in oklch, var(--info) 12%, transparent); color: var(--info); }
.pill-connecting { background: color-mix(in oklch, var(--warning) 12%, transparent); color: var(--warning); }
.pill-error { background: color-mix(in oklch, var(--danger) 12%, transparent); color: var(--danger); }

.section-content {
  width: min(1600px, 100%);
  margin: 0 auto;
  overflow: visible;
}

.overview-home-section {
  width: min(1680px, 100%);
}

.overview-nav-shell {
  margin-bottom: 8px;
  border-color: rgba(104, 227, 179, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(4, 25, 20, 0.72), rgba(3, 18, 15, 0.82));
  box-shadow:
    inset 0 1px 0 rgba(156, 255, 213, 0.04),
    0 10px 24px rgba(2, 12, 10, 0.16);
  backdrop-filter: blur(14px);
}

.overview-nav-shell .primary-steps {
  border-bottom-color: rgba(104, 227, 179, 0.1);
  background: rgba(2, 15, 13, 0.42);
}

.overview-nav-shell .primary-steps button {
  position: relative;
  border-right-color: rgba(104, 227, 179, 0.08);
  border-bottom-width: 1px;
  color: rgba(168, 215, 194, 0.48);
  min-height: 34px;
  padding: 5px 12px;
  font-size: 12px;
}

.overview-nav-shell .primary-steps button.active {
  border-bottom-color: rgba(112, 242, 192, 0.9);
  background: rgba(18, 78, 59, 0.12);
  color: #e7fff4;
}

.overview-nav-shell .primary-steps button.active::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #70f2c0, transparent);
  box-shadow: 0 0 12px rgba(112, 242, 192, 0.5);
}

.overview-nav-shell .primary-steps button:hover {
  background: rgba(18, 72, 55, 0.12);
  color: #f2fff8;
}

.overview-nav-shell .step-index {
  background: rgba(12, 52, 40, 0.76);
  color: rgba(172, 222, 198, 0.58);
  width: 22px;
  height: 20px;
  border-radius: 5px;
  font-size: 10px;
}

.overview-nav-shell .primary-steps button.active .step-index {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.82), rgba(31, 136, 96, 0.9));
  color: #032119;
}

.overview-nav-shell .secondary-nav {
  gap: 5px;
  border-bottom-color: rgba(104, 227, 179, 0.08);
  background: rgba(4, 20, 17, 0.52);
  padding: 6px 10px;
}

.overview-nav-shell .secondary-nav button,
.overview-nav-shell .nav-more-tools summary {
  border-color: rgba(104, 227, 179, 0.2);
  background: linear-gradient(180deg, rgba(8, 38, 31, 0.86), rgba(5, 23, 19, 0.9));
  color: rgba(224, 255, 240, 0.76);
  min-height: 26px;
  padding: 0 10px;
  font-size: 11px;
  box-shadow: inset 0 1px 0 rgba(150, 255, 214, 0.03);
}

.overview-nav-shell .secondary-nav button:hover {
  border-color: rgba(128, 255, 211, 0.38);
  background: rgba(16, 66, 52, 0.94);
}

.overview-nav-shell .secondary-nav button.active {
  border-color: rgba(112, 242, 192, 0.46);
  background: linear-gradient(180deg, rgba(36, 157, 112, 0.78), rgba(13, 86, 62, 0.9));
  color: #042119;
}

.overview-nav-shell .secondary-nav button.aux-item,
.overview-nav-shell .nav-more-tools summary {
  color: rgba(176, 213, 196, 0.78);
}

.overview-nav-shell .nav-more-tools > div {
  border-color: rgba(104, 227, 179, 0.18);
  background: rgba(7, 31, 25, 0.98);
}

.app-shell.overview-mode .overview-nav-shell.primary-nav-bar {
  min-height: 0;
  margin-bottom: 8px;
  border-color: rgba(104, 227, 179, 0.16);
  background: linear-gradient(180deg, rgba(3, 22, 18, 0.72), rgba(2, 14, 12, 0.86));
  box-shadow: 0 10px 24px rgba(2, 12, 10, 0.16), inset 0 1px 0 rgba(156, 255, 213, 0.04);
}

.app-shell.overview-mode .overview-nav-shell .primary-steps {
  min-height: 34px;
  border-bottom-color: rgba(104, 227, 179, 0.1);
  background: rgba(2, 15, 13, 0.42);
}

.app-shell.overview-mode .overview-nav-shell .primary-steps button {
  min-height: 34px;
  padding: 5px 12px;
  border-right-color: rgba(104, 227, 179, 0.08);
  border-bottom-width: 1px;
  background: transparent;
  color: rgba(168, 215, 194, 0.48);
  font-size: 12px;
}

.app-shell.overview-mode .overview-nav-shell .primary-steps button.active {
  border-bottom-color: rgba(112, 242, 192, 0.9);
  background: rgba(18, 78, 59, 0.12);
  color: #e7fff4;
}

.app-shell.overview-mode .overview-nav-shell .step-index {
  width: 22px;
  height: 20px;
  border-radius: 5px;
  background: rgba(12, 52, 40, 0.76);
  color: rgba(172, 222, 198, 0.58);
  font-size: 10px;
}

.app-shell.overview-mode .overview-nav-shell .primary-steps button.active .step-index {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.82), rgba(31, 136, 96, 0.9));
  color: #032119;
}

.app-shell.overview-mode .overview-nav-shell .secondary-nav {
  gap: 5px;
  min-height: 34px;
  padding: 5px 10px;
  border-bottom-color: rgba(104, 227, 179, 0.08);
  background: rgba(4, 20, 17, 0.52);
}

.app-shell.overview-mode .overview-nav-shell .secondary-nav button,
.app-shell.overview-mode .overview-nav-shell .nav-more-tools summary {
  min-height: 24px;
  padding: 0 10px;
  border-color: rgba(104, 227, 179, 0.2);
  background: linear-gradient(180deg, rgba(8, 38, 31, 0.86), rgba(5, 23, 19, 0.9));
  color: rgba(224, 255, 240, 0.76);
  font-size: 11px;
}

.app-shell.overview-mode .overview-nav-shell .secondary-nav button.active {
  border-color: rgba(112, 242, 192, 0.46);
  background: linear-gradient(180deg, rgba(36, 157, 112, 0.78), rgba(13, 86, 62, 0.9));
  color: #042119;
}

.overview-command-center {
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(420px, 1.2fr) minmax(280px, 0.85fr);
  gap: 12px;
  margin: 14px 0 10px;
  align-items: start;
}

.overview-state-panel,
.overview-action-panel,
.overview-demo-panel {
  display: grid;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-card);
  align-self: start;
}

.overview-state-panel .eyebrow {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.overview-score-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.overview-score-line strong {
  font-size: 40px;
  line-height: 1;
  font-weight: 900;
}

.overview-score-line span {
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
}

.overview-state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.overview-state-grid > div,
.overview-quick-stats span {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-alt);
}

.overview-state-grid b,
.overview-quick-stats b {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

.overview-state-grid span,
.overview-quick-stats span {
  color: var(--fg);
  font-size: 13px;
  line-height: 1.4;
}

.overview-action-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.overview-action-head h2 {
  margin: 0;
  font-size: 15px;
}

.overview-action-head p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.overview-quick-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: end;
}

.overview-quick-stats span {
  min-width: 92px;
  text-align: right;
}

.batch-health-note {
  margin: -2px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.overview-action-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.overview-action-list button,
.overview-route-mini {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 6px 10px;
  min-height: 58px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-alt);
  color: var(--fg);
  text-align: left;
  box-shadow: var(--shadow-card);
}

.overview-action-list button:hover,
.overview-route-mini:hover {
  border-color: var(--border-strong);
  background: var(--hover);
}

.overview-action-list button svg {
  color: var(--primary);
}

.overview-action-list button b,
.overview-route-mini strong {
  font-size: 14px;
  font-weight: 850;
}

.overview-action-list button small,
.overview-route-mini small {
  color: var(--muted);
  line-height: 1.45;
}

.demo-route-panel.compact {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.demo-steps.compact {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 0;
}

.demo-steps.compact .overview-route-mini {
  min-height: 64px;
  padding: 10px 12px;
  box-shadow: none;
}

.overview-route-mini span {
  font-size: 13px;
  line-height: 1.35;
}

.overview-core {
  grid-template-columns: minmax(170px, 0.8fr) repeat(5, minmax(150px, 1fr));
  gap: 10px;
  margin: 14px 0 10px;
  padding: 0;
}

.core-card {
  align-items: start;
  justify-content: center;
  min-height: 116px;
  padding: 16px;
  border-color: var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-card);
  text-align: left;
}

.core-card span {
  color: var(--muted);
  font-weight: 700;
}

.core-card strong {
  color: var(--fg);
  font-size: 20px;
  font-weight: 850;
  line-height: 1.18;
}

.core-card.main-score {
  background: linear-gradient(180deg, var(--primary-soft), var(--surface));
}

.core-card.main-score strong {
  color: var(--primary-strong);
  font-size: 38px;
}

.text-good { color: var(--success); }
.text-ok { color: var(--info); }
.text-warn { color: var(--warning); }

.entry-cards {
  gap: 10px;
  margin: 0 0 10px;
  padding: 0;
}

.entry-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px 12px;
  min-height: 82px;
  padding: 14px 16px;
  border-color: var(--border);
  background: var(--surface);
  color: var(--fg);
  text-align: left;
  box-shadow: var(--shadow-card);
  transition: border-color .16s ease, background .16s ease, transform .16s ease;
}

.entry-card:hover {
  border-color: var(--border-strong);
  background: var(--hover);
  transform: translateY(-1px);
}

.entry-card svg {
  grid-row: span 2;
  color: var(--primary);
}

.entry-card span {
  color: var(--muted);
}

.demo-route-panel {
  margin: 0 0 14px;
  padding: 14px 16px;
  border-color: var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-card);
}

.demo-route-panel .section-title {
  margin-bottom: 12px;
}

.demo-route-panel .section-title small {
  color: var(--muted);
}

.demo-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.demo-step {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 4px 9px;
  min-height: 94px;
  padding: 12px;
  border-color: var(--border);
  background: var(--surface-alt);
  color: var(--fg);
}

.demo-step:hover {
  border-color: var(--border-strong);
  background: var(--hover);
}

.demo-step strong {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--primary);
  color: var(--surface);
  font-size: 12px;
}

.demo-step span {
  font-size: 13px;
  font-weight: 800;
}

.demo-step small {
  grid-column: 2;
  color: var(--muted);
  line-height: 1.45;
}

.drawer-panel {
  width: min(460px, 92vw);
  background: var(--surface);
}

.btn-action:hover,
.btn-process:hover,
.btn-review:hover,
.btn-close-action:hover {
  color: var(--surface);
}

@media (max-width: 1180px) {
  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar-actions {
    justify-self: start;
  }

  .overview-core {
    grid-template-columns: repeat(3, minmax(170px, 1fr));
  }

  .overview-command-center {
    grid-template-columns: 1fr;
  }

  .overview-action-list,
  .demo-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .app-shell {
    padding: 12px;
  }

  .topbar-status,
  .overview-core {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .overview-state-grid,
  .overview-action-list,
  .demo-steps {
    grid-template-columns: 1fr;
  }

  .overview-action-head {
    flex-direction: column;
    align-items: start;
  }

  .overview-quick-stats {
    justify-content: start;
  }
}
</style>


