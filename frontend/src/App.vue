<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Activity, Bell, Box, Clock3, Cpu, Database, Leaf, MapPinned, Radio, ShieldAlert, Target, Video } from 'lucide-vue-next';
import { api, connectTelemetry } from './api';
import Home3DCommandCenter from './components/Home3DCommandCenter.vue';
import OverviewWorkspace from './components/OverviewWorkspace.vue';
import ProfessionalBatchPanels from './components/ProfessionalBatchPanels.vue';
import SystemTwinShell from './components/SystemTwinShell.vue';
import OpsWorkbenchPanels from './components/OpsWorkbenchPanels.vue';
import { navGroups, navItems, roleViews, sceneModes, typeOptions } from './data/navigation';
import type { NavGroup } from './data/navigation';
import { deriveEnvironmentScore } from './data/integrated-workbench';
import type { AlarmEvent, DashboardSummary, RoleKey, SceneMode, SensorPoint, SensorType, TelemetryPayload, ViewKey } from './types';
import { useCultivationData } from './composables/useCultivationData';
import { useUserSystemData } from './composables/useUserSystemData';
import { useEngineeringData } from './composables/useEngineeringData';
import { useAdminData } from './composables/useAdminData';
import {
  fallbackSummary, fallbackSensors, fallbackAlarms,
  connectionLabel,
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
const shellTitle = computed(() => '智能种植方舱数字孪生系统');
const shellEyebrow = computed(() => `${activeSection.value} / ${activeNavItem.value?.label ?? activeRoleView.value.label}`);

type WorkspaceLayout = 'overview' | 'task' | 'batch' | 'ops' | 'delivery' | 'admin';
const workspaceLayoutByView: Partial<Record<ViewKey, WorkspaceLayout>> = {
  overview: 'overview',
  cabin: 'overview',
  screen: 'overview',
  brain: 'overview',
  workflow: 'task',
  sop: 'task',
  user: 'task',
  batch: 'batch',
  growth: 'batch',
  production: 'batch',
  harvest: 'batch',
  calendar: 'batch',
  recipe: 'batch',
  closure: 'batch',
  biosecurity: 'batch',
  experience: 'batch',
  quality: 'batch',
  director: 'batch',
  economics: 'batch',
  collaboration: 'batch',
  strategy: 'batch',
  reviewMeeting: 'batch',
  environment: 'ops',
  control: 'ops',
  alarms: 'ops',
  point: 'ops',
  professional: 'ops',
  decision: 'ops',
  reports: 'delivery',
  acceptance: 'delivery',
  audit: 'delivery',
  presentation: 'delivery',
  engineering: 'delivery',
  integration: 'delivery',
  delivery: 'delivery',
  drill: 'delivery',
  search: 'delivery',
  explain: 'delivery',
  config: 'admin',
  governance: 'admin',
  history: 'admin',
  display: 'admin',
  trace: 'admin',
  security: 'admin',
  settings: 'admin',
  demo: 'admin'
};
const activeWorkspaceLayout = computed<WorkspaceLayout>(() => workspaceLayoutByView[activeView.value] ?? 'admin');

/* ── 子视图计算 ── */
const overviewView = computed(() => activeView.value as 'overview' | 'cabin' | 'screen' | 'brain');
const opsWorkbenchView = computed(() => activeView.value as 'environment' | 'control' | 'alarms');
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
const pageShellClass = computed(() => {
  if (isOverviewHome.value) return 'twin-page shell-twin';
  if (['今日作业', '运维处置'].includes(activeSection.value) || ['cabin', 'point'].includes(activeView.value)) {
    return 'ops-page shell-ops';
  }
  return 'app-page shell-app';
});

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
const engineeringNavItems = computed(() => navGroups.find(g => g.name === '报告交付')?.items.map(k => navItems.find(n => n.key === k)).filter(Boolean) as Array<{ key: ViewKey; label: string }> ?? []);

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

const twinHeaderLeftCards = computed(() => [
  { icon: Leaf, label: '生产对象', value: unifiedMetrics.value.batch },
  { icon: Box, label: '作物品种', value: '金耳' },
  { icon: Target, label: '当前阶段', value: unifiedMetrics.value.stage }
]);

const twinHeaderRightCards = computed(() => [
  { icon: Activity, label: '系统状态', value: '实时在线' },
  { icon: Bell, label: '待处理报警', value: String(unifiedMetrics.value.pendingCount), tone: 'warn' },
  { icon: Clock3, label: '时间', value: '2026-06-16 17:08' },
  { icon: Radio, label: '班次', value: '晚班' }
]);

const commandStatusModules = computed(() => [
  { icon: Radio, label: '采集正常', value: `${displaySensors.value.length}/${displaySensors.value.length}`, tone: 'normal' },
  { icon: Video, label: '视频在线', value: '6/6', tone: 'normal' },
  { icon: Activity, label: '历史入库', value: '1 min', tone: 'normal' },
  { icon: Cpu, label: '边缘计算', value: '<50ms', tone: 'normal' },
  { icon: Database, label: '数据追溯', value: '可追溯', tone: 'normal' }
]);

const commandQuickActions = [
  { label: '视频监控', view: 'cabin' as ViewKey },
  { label: '历史曲线', view: 'environment' as ViewKey },
  { label: '报警处置', view: 'alarms' as ViewKey }
];

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
  <main :class="['app-shell', 'app-host-shell', { 'overview-mode': isOverviewHome }]">
    <!-- Toast 容器 -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" :class="['toast-item', `toast-${t.type}`]">{{ t.msg }}</div>
    </div>

    <!-- 总览首页保留已通过的 3D 总控台；其他页面进入同源系统壳。 -->
    <section v-if="isOverviewHome" class="section-content system-section overview-home-section">
      <Home3DCommandCenter
        :active-role="activeRole" :active-layer="activeLayer" :active-type="activeType" :alarm-timeline="displayAlarms"
        :display-sensors="displaySensors" :filtered-sensors="filteredSensors" :layer-option-items="layerOptionItems"
        :scene-mode="sceneMode" :scene-modes="sceneModes" :selected-sensor="selectedSensor" :summary="displaySummary"
        :type-options="typeOptions" :active-view="activeView" :grouped-nav-items="groupedNavItems"
        :left-header-cards="twinHeaderLeftCards" :right-header-cards="twinHeaderRightCards"
        :footer-status-modules="commandStatusModules"
        :footer-actions="commandQuickActions"
        :unified-metrics="unifiedMetrics" @navigate="activeView = $event"
        @select-view="activeView = $event"
        @select-sensor="selectedSensor = $event" @update-active-layer="activeLayer = $event"
        @update-active-type="activeType = $event" @update-scene-mode="sceneMode = $event"
      />
    </section>

    <SystemTwinShell
      v-else
      :title="shellTitle"
      :eyebrow="shellEyebrow"
      :active-view="activeView"
      :grouped-nav-items="groupedNavItems"
      :status-cards="roleTopbarCards"
      :left-header-cards="twinHeaderLeftCards"
      :right-header-cards="twinHeaderRightCards"
      :footer-status-modules="commandStatusModules"
      :footer-actions="commandQuickActions"
      :workspace-layout="activeWorkspaceLayout"
      :mode="pageShellClass.includes('shell-app') ? 'app' : 'ops'"
      @select-view="activeView = $event"
    >
    <!-- 总览 -->
    <section v-if="activeSection === '总览'" class="section-content system-section">
      <OverviewWorkspace
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
    <section v-else-if="activeSection === '今日作业'" class="section-content system-section">
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
    <section v-else-if="activeSection === '种植批次'" class="section-content system-section">
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
    <section v-else-if="activeSection === '运维处置'" :class="['section-content', 'system-section', `ops-view-${activeView}`]">
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
    <section v-else-if="activeSection === '报告交付'" class="section-content system-section">
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
    </SystemTwinShell>

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

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #001c16;
}

.app-host-shell {
  display: block;
  width: 100%;
}

.section-content {
  min-width: 0;
}

.overview-home-section {
  width: 100%;
}

.point-archive-workbench {
  height: 100%;
  min-height: 0;
}

.attention-sensor-list,
.point-type-strip,
.mini-table,
.point-profile,
.sensor-list,
.point-filter-bar {
  min-width: 0;
}

.attention-sensor-list,
.sensor-list.compact {
  display: grid;
  gap: 8px;
  max-height: 100%;
  overflow: auto;
}

.attention-sensor-list button,
.sensor-list.compact button,
.mini-table button,
.point-type-strip button {
  width: 100%;
  min-width: 0;
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 8px;
  background: rgba(2, 28, 23, 0.82);
  color: #edfff7;
  text-align: left;
}

.attention-sensor-list button,
.sensor-list.compact button {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
}

.attention-sensor-list button.active,
.sensor-list.compact button.active,
.point-type-strip button.attention {
  border-color: rgba(255, 178, 46, 0.72);
  background: linear-gradient(180deg, rgba(71, 47, 9, 0.78), rgba(18, 24, 13, 0.88));
}

.attention-sensor-list strong,
.sensor-list.compact strong,
.point-type-strip strong,
.point-profile strong {
  color: #f4fff9;
  font-weight: 700;
}

.attention-sensor-list span,
.attention-sensor-list small,
.sensor-list.compact span,
.sensor-list.compact em,
.point-type-strip span,
.point-type-strip small,
.point-profile span {
  color: rgba(190, 226, 210, 0.72);
  font-style: normal;
}

.point-type-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.point-type-strip button,
.mini-table button {
  display: grid;
  gap: 4px;
  padding: 10px;
}

.mini-table {
  display: grid;
  gap: 8px;
}

.mini-table button {
  grid-template-columns: 42px 1fr auto;
  align-items: center;
}

.mini-table em {
  color: #00f5b2;
  font-style: normal;
}

.point-profile {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.point-profile article {
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(0, 245, 178, 0.14);
  border-radius: 8px;
  background: rgba(2, 28, 23, 0.72);
}

.point-profile span,
.point-profile strong {
  display: block;
}

.point-filter-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 8px;
  margin-bottom: 10px;
}

.point-filter-bar select,
.point-filter-bar button {
  height: 34px;
  border: 1px solid rgba(0, 245, 178, 0.24);
  border-radius: 8px;
  background: rgba(1, 25, 20, 0.9);
  color: #edfff7;
}

.btn-action,
.btn-process,
.detail-actions button,
.drawer-actions button {
  border: 1px solid rgba(0, 245, 178, 0.32);
  border-radius: 8px;
  background: rgba(0, 138, 111, 0.22);
  color: #edfff7;
  font-weight: 700;
  cursor: pointer;
}

.btn-action,
.btn-process {
  min-height: 34px;
  padding: 0 12px;
}

.drawer-mask,
.report-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 10, 8, 0.48);
  backdrop-filter: blur(4px);
}

.drawer,
.report-drawer {
  width: min(460px, 92vw);
  height: 100%;
  padding: 18px;
  overflow: auto;
  border-left: 1px solid rgba(0, 245, 178, 0.28);
  background: linear-gradient(180deg, rgba(4, 35, 29, 0.98), rgba(1, 18, 15, 0.98));
  color: #edfff7;
  box-shadow: -24px 0 44px rgba(0, 0, 0, 0.36);
}

.drawer-head,
.report-drawer-head,
.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.drawer-head h2,
.report-drawer-head h2,
.detail-head h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
}

.drawer-head p,
.report-drawer-head p,
.detail-head p,
.detail-grid span,
.detail-section p {
  margin: 4px 0 0;
  color: rgba(190, 226, 210, 0.72);
}

.drawer-head button,
.report-drawer-head button {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 245, 178, 0.26);
  border-radius: 8px;
  background: rgba(0, 138, 111, 0.18);
  color: #edfff7;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.detail-grid article,
.detail-section {
  padding: 12px;
  border: 1px solid rgba(0, 245, 178, 0.16);
  border-radius: 8px;
  background: rgba(2, 28, 23, 0.72);
}

.detail-grid strong,
.detail-section strong {
  display: block;
  margin-top: 4px;
  color: #f4fff9;
}

.detail-section {
  margin-bottom: 12px;
}

.drawer-actions,
.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.drawer-actions button,
.detail-actions button {
  min-height: 34px;
  padding: 0 12px;
}

.report-content {
  white-space: pre-wrap;
  color: rgba(237, 255, 247, 0.86);
  line-height: 1.55;
}

.toast-container {
  position: fixed;
  right: 18px;
  top: 18px;
  z-index: 80;
  display: grid;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  min-width: 220px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 245, 178, 0.28);
  border-radius: 8px;
  background: rgba(2, 28, 23, 0.94);
  color: #edfff7;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
}

.toast-success {
  border-color: rgba(0, 245, 178, 0.5);
}

.toast-error {
  border-color: rgba(255, 92, 92, 0.5);
}

@media (max-width: 900px) {
  .point-filter-bar,
  .point-profile,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>


