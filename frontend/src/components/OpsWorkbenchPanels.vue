<script setup lang="ts">
import { computed } from 'vue';
import { Activity, CheckCircle2, MapPinned, ShieldAlert, SlidersHorizontal, Wrench } from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';
import PanelSection from './PanelSection.vue';
import type { AlarmEvent, SensorPoint } from '../types';

type EnvironmentCard = {
  title: string;
  icon: unknown;
  sensors: SensorPoint[];
  primary: string;
  secondary: string;
  insight: string;
};

type ControlRule = {
  name: string;
  when: string;
  action: string;
  target: string;
};

type PointConfigRow = {
  id: string;
  name: string;
  type: string;
  area: string;
  threshold: string;
  coordinate: string;
  enabled: boolean;
};

type CalibrationRow = {
  sensor: string;
  before: string;
  after: string;
  result: string;
};

type StageReleaseCheck = {
  item: string;
  passed: boolean;
  standard: string;
  result: string;
};

const props = defineProps<{
  activeView: 'environment' | 'control' | 'alarms' | 'maintenance';
  environmentCards: EnvironmentCard[];
  controlRules: ControlRule[];
  alarmTimeline: AlarmEvent[];
  pointConfigRows: PointConfigRow[];
  calibrationComparisons: CalibrationRow[];
  stageReleaseChecks: StageReleaseCheck[];
  displaySensors: SensorPoint[];
  openAlarm: (alarm: AlarmEvent) => void;
  selectSensor: (sensor: SensorPoint) => void;
  focusSensorById: (id: string) => void;
  formatPointValue: (sensor: SensorPoint) => string;
  statusText: (status: SensorPoint['reading']['status']) => string;
}>();

const pageTitle = computed(() => ({
  environment: '环境监测',
  control: '联动控制',
  alarms: '报警处置',
  maintenance: '维护校准'
}[props.activeView]));

const alarmRows = computed(() => props.alarmTimeline.map((alarm, index) => ({
  ...alarm,
  name: index === 0 ? '下层湿度偏低' : alarm.sensorName || `报警 ${index + 1}`,
  point: index === 0 ? 'TH-L2-002' : alarm.sensorId,
  currentValue: index === 0 ? '84.9%RH' : index === 1 ? '1720ppm' : '关注',
  target: index === 0 ? '>=85%RH' : index === 1 ? '500-1500ppm' : '按阶段目标',
  deviation: index === 0 ? '-0.1%RH' : '-',
  duration: index === 0 ? '38 分钟' : '10 分钟',
  status: alarm.handled ? '已关闭' : index === 0 ? '处理中' : index === 1 ? '待复核' : '预警',
  suggestion: index === 0
    ? '17:30 前现场复核并记录'
    : index === 1
      ? '新风联动后 10 分钟复查回落曲线'
      : '按 SOP 分派处理并提交复核',
  owner: index === 0 ? '晚班种植员' : '运维员',
  reviewer: '班组长',
  updatedAt: new Date(alarm.createdAt).toLocaleString()
})));

const topAlarm = computed(() => alarmRows.value[0] ?? {
  id: 'demo-alarm',
  name: '下层湿度偏低',
  point: 'TH-L2-002',
  currentValue: '84.9%RH',
  target: '>=85%RH',
  deviation: '-0.1%RH',
  duration: '38 分钟',
  owner: '晚班种植员',
  reviewer: '班组长',
  status: '处理中',
  suggestion: '17:30 前现场复核并记录',
  updatedAt: '当前'
});

const pendingAlarmCount = computed(() => Math.max(7, alarmRows.value.filter((item) => item.status !== '已关闭').length));
const reviewAlarmCount = computed(() => 1);

const alarmWorkflow = computed(() => [
  { name: '报警', text: '系统识别异常点位', state: 'done' },
  { name: '分派', text: '晚班种植员接收', state: 'done' },
  { name: '处理', text: '现场复核并记录', state: 'active' },
  { name: '复核', text: '班组长确认材料', state: 'pending' },
  { name: '关闭', text: '进入报告追溯', state: 'pending' }
]);

const summaryCards = computed(() => {
  if (props.activeView === 'environment') {
    return [
      { label: '环境摘要', value: props.environmentCards[0]?.primary ?? '稳定', note: props.environmentCards[0]?.secondary ?? '当前环境监测' },
      { label: '可见点位', value: `${props.displaySensors.length} 个`, note: '来自既有硬件清单' },
      { label: '异常点位', value: `${props.displaySensors.filter((item) => item.reading.status !== 'normal').length} 个`, note: '优先进入报警处置' }
    ];
  }
  if (props.activeView === 'control') {
    return [
      { label: '联动规则', value: `${props.controlRules.length} 条`, note: '按现有设备执行' },
      { label: '目标', value: '稳定恢复', note: '看动作、对象和复核结果' },
      { label: '复核点', value: '10 分钟', note: 'CO2 与湿度变化复查' }
    ];
  }
  return [
    { label: '校准对比', value: `${props.calibrationComparisons.length} 项`, note: '校准前后差异' },
    { label: '阶段检查', value: `${props.stageReleaseChecks.length} 项`, note: '用于放行和验收' },
    { label: '维护对象', value: '传感器 / 设备', note: '不新增硬件点位' }
  ];
});

const abnormalSensors = computed(() => props.displaySensors.filter((sensor) => sensor.reading.status !== 'normal'));
const environmentConclusion = computed(() => {
  const first = abnormalSensors.value[0];
  return {
    level: abnormalSensors.value.some((sensor) => sensor.reading.status === 'alarm') ? '预警' : abnormalSensors.value.length ? '关注' : '稳定',
    parameter: first?.name ?? '全部关键参数',
    point: first?.id ?? '无异常点位',
    action: first ? `优先复核 ${first.id}，记录当前读数并进入报警处置。` : '保持当前阶段控制策略，按今日作业完成例行巡检。'
  };
});

const orderedEnvironmentCards = computed(() => [...props.environmentCards].sort((a, b) => {
  const aRisk = a.sensors.some((sensor) => sensor.reading.status !== 'normal') ? 0 : 1;
  const bRisk = b.sensors.some((sensor) => sensor.reading.status !== 'normal') ? 0 : 1;
  return aRisk - bRisk;
}));
</script>

<template>
  <section :class="['app-page', 'ops-workbench-layout', 'focused-workbench', { 'ops-workbench-shell ops-page alarm-ops-page': activeView === 'alarms' }]">
    <template v-if="activeView === 'alarms'">
      <header class="ops-page-header app-page-header alarm-page-header">
        <div>
          <p class="eyebrow">事件闭环处理台</p>
          <h2>报警处置</h2>
          <p>首屏优先展示报警事件、闭环状态和可执行动作。</p>
        </div>
        <div class="daily-header-stats">
          <span class="app-status-chip app-tag-warning"><b>待处理报警</b>{{ pendingAlarmCount }}</span>
          <span class="app-status-chip app-tag-review"><b>待复核</b>{{ reviewAlarmCount }}</span>
          <span class="app-status-chip app-tag-danger"><b>最大风险</b>下层湿度偏低 84.9%RH</span>
          <span class="app-status-chip app-tag-processing"><b>当前步骤</b>处理</span>
        </div>
      </header>

      <div class="alarm-command-grid">
        <article class="ops-risk-card app-risk-card alarm-priority-card">
          <div class="alarm-card-head">
            <span class="app-tag-warning">{{ topAlarm.status }}</span>
            <strong>{{ topAlarm.name }}</strong>
          </div>
          <div class="alarm-primary-value">
            <b>{{ topAlarm.currentValue }}</b>
            <span>目标 {{ topAlarm.target }}</span>
          </div>
          <dl class="alarm-detail-grid">
            <div><dt>点位</dt><dd>{{ topAlarm.point }}</dd></div>
            <div><dt>偏差</dt><dd>{{ topAlarm.deviation }}</dd></div>
            <div><dt>持续时长</dt><dd>{{ topAlarm.duration }}</dd></div>
            <div><dt>责任人</dt><dd>{{ topAlarm.owner }}</dd></div>
            <div><dt>复核人</dt><dd>{{ topAlarm.reviewer }}</dd></div>
            <div><dt>建议操作</dt><dd>{{ topAlarm.suggestion }}</dd></div>
          </dl>
          <div class="alarm-action-buttons">
            <button type="button" class="app-button-secondary">分派</button>
            <button type="button" class="app-button-warning">开始处理</button>
            <button type="button" class="app-button-primary">提交复核</button>
            <button type="button" class="app-button-secondary">关闭</button>
          </div>
        </article>

        <section class="ops-panel app-panel alarm-workflow-panel">
          <div class="app-panel-title">
            <ShieldAlert :size="18" />
            <div>
              <h3>报警闭环流程</h3>
              <p>报警 → 分派 → 处理 → 复核 → 关闭</p>
            </div>
          </div>
          <div class="ops-workflow app-workflow alarm-workflow">
            <article v-for="step in alarmWorkflow" :key="step.name" class="ops-workflow-step app-workflow-step" :class="[step.state]">
              <strong>{{ step.name }}</strong>
              <span>{{ step.text }}</span>
            </article>
          </div>
        </section>
      </div>

      <section class="ops-panel ops-table app-data-panel alarm-queue-panel">
        <div class="app-panel-title">
          <Activity :size="18" />
          <div>
            <h3>报警队列</h3>
            <p>每条报警保留点位、当前值、目标、责任人和处理入口。</p>
          </div>
        </div>
        <div class="app-table alarm-queue-table">
          <div class="app-table-head">
            <span>报警名称</span>
            <span>点位</span>
            <span>当前值</span>
            <span>阈值 / 目标</span>
            <span>状态</span>
            <span>责任人</span>
            <span>更新时间</span>
            <span>操作</span>
          </div>
          <button
            v-for="alarm in alarmRows"
            :key="alarm.id"
            type="button"
            class="app-table-row alarm-queue-row"
            @click="openAlarm(alarm)"
          >
            <strong>{{ alarm.name }}</strong>
            <span>{{ alarm.point }}</span>
            <span>{{ alarm.currentValue }}</span>
            <span>{{ alarm.target }}</span>
            <b class="app-status-chip" :class="alarm.status === '已关闭' ? 'app-tag-done' : alarm.status === '待复核' ? 'app-tag-review' : alarm.status === '处理中' ? 'app-tag-processing' : 'app-tag-warning'">
              {{ alarm.status }}
            </b>
            <span>{{ alarm.owner }}</span>
            <span>{{ alarm.updatedAt }}</span>
            <em>查看处置</em>
          </button>
        </div>
      </section>
    </template>

    <template v-else>
      <PageSummaryBar :title="pageTitle" :cards="summaryCards" />

      <div v-if="activeView === 'environment'" class="ops-workbench-grid environment-focus">
        <PanelSection
          :icon="ShieldAlert"
          title="当前环境结论"
          description="种植员先看结论、异常点位和建议动作，再看详细读数。"
          wide
        >
          <div class="environment-action-card">
            <article>
              <span>环境状态</span>
              <strong>{{ environmentConclusion.level }}</strong>
            </article>
            <article>
              <span>最大异常参数</span>
              <strong>{{ environmentConclusion.parameter }}</strong>
            </article>
            <article>
              <span>关联点位</span>
              <strong>{{ environmentConclusion.point }}</strong>
            </article>
            <article class="environment-next-action">
              <span>建议动作</span>
              <strong>{{ environmentConclusion.action }}</strong>
            </article>
          </div>
          <div class="attention-point-row" v-if="abnormalSensors.length">
            <button v-for="sensor in abnormalSensors.slice(0, 4)" :key="sensor.id" type="button" @click="selectSensor(sensor)">
              <strong>{{ sensor.name }}</strong>
              <span>{{ sensor.id }} · {{ formatPointValue(sensor) }} · {{ statusText(sensor.reading.status) }}</span>
            </button>
          </div>
        </PanelSection>

        <PanelSection
          :icon="Activity"
          title="详细读数"
          description="异常和接近阈值参数排在前面，正常参数作为后续依据。"
          wide
        >
          <article v-for="card in orderedEnvironmentCards" :key="card.title" class="ops-mini-card">
            <header>
              <component :is="card.icon" :size="18" />
              <div>
                <strong>{{ card.title }}</strong>
                <span>{{ card.secondary }}</span>
              </div>
            </header>
            <div class="feature-value">
              <strong>{{ card.primary }}</strong>
              <span>{{ card.insight }}</span>
            </div>
            <div class="mini-table">
              <button v-for="sensor in card.sensors.slice(0, 4)" :key="sensor.id" type="button" @click="selectSensor(sensor)">
                <span>{{ sensor.name }}</span>
                <strong>{{ formatPointValue(sensor) }}</strong>
              </button>
            </div>
          </article>
        </PanelSection>
      </div>

      <div v-else-if="activeView === 'control'" class="ops-workbench-grid control-focus">
        <PanelSection
          :icon="SlidersHorizontal"
          title="联动规则"
          description="只保留规则触发条件、执行设备、复核目标，避免和报警处置混在一起。"
          wide
        >
          <div class="ops-rule-list">
            <article v-for="rule in controlRules" :key="rule.name">
              <strong>{{ rule.name }}</strong>
              <span>{{ rule.when }}</span>
              <p>{{ rule.action }}</p>
              <small>关联：{{ rule.target }}</small>
            </article>
          </div>
        </PanelSection>

        <PanelSection
          :icon="MapPinned"
          title="规则关联点位"
          description="点位只作为联动判断依据，详细档案进入点位档案页。"
        >
          <div class="asset-table compact-table">
            <button
              v-for="row in pointConfigRows.slice(0, 6)"
              :key="row.id"
              class="asset-row interactive-row"
              type="button"
              @click="focusSensorById(row.id)"
            >
              <span>{{ row.name }}</span>
              <span>{{ row.area }}</span>
              <strong>{{ row.enabled ? '启用' : '停用' }}</strong>
            </button>
          </div>
        </PanelSection>
      </div>

      <div v-else class="ops-workbench-grid maintenance-focus">
        <PanelSection
          :icon="Wrench"
          title="维护校准"
          description="维护页只看巡检、校准前后对比、阶段放行检查。"
          wide
        >
          <div class="ops-maintenance-grid">
            <article class="ops-maintenance-card">
              <div class="section-title">
                <CheckCircle2 :size="16" />
                <h2>阶段放行检查</h2>
              </div>
              <div class="maintenance-check-list">
                <article v-for="check in stageReleaseChecks" :key="check.item">
                  <strong>{{ check.item }}</strong>
                  <span>{{ check.standard }}</span>
                  <small>{{ check.result }}</small>
                </article>
              </div>
            </article>

            <article class="ops-maintenance-card">
              <div class="section-title">
                <Wrench :size="16" />
                <h2>校准前后对比</h2>
              </div>
              <div class="maintenance-check-list">
                <article v-for="row in calibrationComparisons" :key="row.sensor">
                  <strong>{{ row.sensor }}</strong>
                  <span>{{ row.before }} → {{ row.after }}</span>
                  <small>{{ row.result }}</small>
                </article>
              </div>
            </article>
          </div>
        </PanelSection>
      </div>
    </template>
  </section>
</template>
