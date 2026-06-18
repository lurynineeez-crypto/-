<script setup lang="ts">
import { Activity, Bell, Box, ClipboardList, Gauge, ListChecks, MapPinned, Monitor, Search, ShieldAlert } from 'lucide-vue-next';
import { defineAsyncComponent } from 'vue';
const CabinScene = defineAsyncComponent(() => import('./CabinScene.vue'));
const TrendChart = defineAsyncComponent(() => import('./TrendChart.vue'));
import type { DashboardSummary, SceneMode, SensorPoint, SensorType } from '../types';
import type { sceneModes, typeOptions } from '../data/navigation';

type TypeOption = (typeof typeOptions)[number];
type SceneOption = (typeof sceneModes)[number];
type TimelineAlarm = {
  id: string;
  sensorId: string;
  sensorName: string;
  level: string;
  message: string;
  createdAt: string;
  handled: boolean;
};

defineProps<{
  activeView: 'overview' | 'cabin' | 'screen' | 'brain';
  activeLayer: string;
  activeType: SensorType | 'all';
  alarmTimeline: TimelineAlarm[];
  approvalFlowSimulation: any[];
  batchProfile: { id: string };
  controlBrainSummary: Record<string, string>;
  environmentScore: { score: number | string };
  filteredSensors: SensorPoint[];
  importantSensors: SensorPoint[];
  layerOptionItems: Array<{ value: string; label: string }>;
  managementQa: any[];
  sceneMode: SceneMode;
  sceneModes: SceneOption[];
  selectedSensor: SensorPoint | null;
  statusCounts: { normal: number; warning: number; alarm: number; offline: number };
  summary: DashboardSummary | null;
  twinBusNodes: any[];
  typeOptions: TypeOption[];
}>();

const emit = defineEmits<{
  selectSensor: [sensor: SensorPoint];
  updateActiveLayer: [layer: string];
  updateActiveType: [type: SensorType | 'all'];
  updateSceneMode: [mode: SceneMode];
}>();
</script>

<template>
  <section v-if="activeView === 'screen'" class="screen-mode">
    <div class="screen-header">
      <h2>方舱运营面板</h2>
      <strong>{{ environmentScore.score }}分</strong>
    </div>
    <div class="screen-grid">
      <article><span>当前批次</span><strong>{{ batchProfile.id }}</strong></article>
      <article><span>当前阶段</span><strong>{{ summary?.stage ?? '子实体生长期' }}</strong></article>
      <article><span>环境达标率</span><strong>{{ summary?.targetRate ?? 92 }}%</strong><small>分项见专业视图</small></article>
      <article><span>在线率</span><strong>{{ summary?.onlineRate ?? 100 }}%</strong></article>
      <article><span>待处理报警</span><strong>{{ alarmTimeline.filter((alarm) => !alarm.handled).length }}</strong></article>
      <article><span>最大风险</span><strong>{{ controlBrainSummary.risk }}</strong></article>
      <article><span>下一步动作</span><strong>{{ controlBrainSummary.next }}</strong></article>
      <article><span>设备运行</span><strong>{{ summary?.devices.filter((d) => d.running).length ?? 4 }}/{{ summary?.devices.length ?? 4 }}</strong></article>
    </div>
  </section>

  <section v-else-if="activeView === 'brain'" class="system-content-grid brain-layout">
    <article class="system-panel brain-wide system-content-grid-wide">
      <div class="system-panel-header">
        <Monitor :size="18" />
        <h2>种植总控大脑 <small>— 当前批次风险与下一步</small></h2>
      </div>
      <div class="director-summary">
        <div>
          <span>当前批次 / 阶段</span>
          <strong>{{ controlBrainSummary.batch }}</strong>
          <small>{{ controlBrainSummary.stage }} · {{ controlBrainSummary.release }}</small>
        </div>
        <div>
          <span>最大风险</span>
          <strong>{{ controlBrainSummary.risk }}</strong>
          <small>下一步：{{ controlBrainSummary.next }}</small>
        </div>
        <div>
          <span>预计经营结果</span>
          <strong>{{ controlBrainSummary.yield }}</strong>
          <small>{{ controlBrainSummary.cost }} · {{ controlBrainSummary.quality }}</small>
        </div>
      </div>
      <div class="growth-state brain-next">
        <strong>待办责任链</strong>
        <span>{{ controlBrainSummary.todo }}</span>
      </div>
    </article>

    <article class="system-panel brain-wide system-content-grid-wide">
      <div class="system-panel-header">
        <MapPinned :size="18" />
        <h2>种植数字孪生总线 <small>— 批次、点位、报警、工单关联</small></h2>
      </div>
      <div class="review-grid">
        <article v-for="item in twinBusNodes" :key="item.node">
          <span>{{ item.type }}</span>
          <strong>{{ item.node }}</strong>
          <small>{{ item.relation }}</small>
          <p>{{ item.health }}</p>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Search :size="18" />
        <h2>管理层问答视图</h2>
      </div>
      <div class="suggestion-list">
        <article v-for="item in managementQa" :key="item.question">
          <strong>{{ item.question }}</strong>
          <span>{{ item.answer }}</span>
          <p>证据：{{ item.evidence }}</p>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <ClipboardList :size="18" />
        <h2>审批流模拟</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in approvalFlowSimulation" :key="item.item">
          <strong>{{ item.item }} 路 {{ item.status }}</strong>
          <span>负责人：{{ item.owner }}</span>
          <p>{{ item.next }}</p>
        </article>
      </div>
    </article>
  </section>

  <template v-else-if="activeView === 'overview'">
    <section class="overview-focus-board">
      <article class="overview-focus-panel main">
        <div class="system-panel-header">
          <Gauge :size="18" />
          <h2>总览焦点</h2>
        </div>
        <div class="focus-kpi-grid" v-if="summary">
          <div>
            <span>温度</span>
            <strong>{{ summary.core.temperature.toFixed(1) }}℃</strong>
            <small>目标 20-24℃</small>
          </div>
          <div>
            <span>湿度</span>
            <strong>{{ summary.core.humidity.toFixed(1) }}%</strong>
            <small>目标 85-95%RH</small>
          </div>
          <div>
            <span>CO2</span>
            <strong>{{ Math.round(summary.core.co2) }}ppm</strong>
            <small>复查回落曲线</small>
          </div>
          <div>
            <span>光照</span>
            <strong>{{ Math.round(summary.core.light) }}lx</strong>
            <small>补光目标内</small>
          </div>
        </div>
      </article>

      <article class="overview-focus-panel">
        <div class="system-panel-header">
          <ListChecks :size="18" />
          <h2>今日处置</h2>
        </div>
        <div class="compact-action-stack">
          <span>17:30 前复核下层 TH-L2-002，记录结果</span>
          <span>新风联动后 10 分钟复查 CO2 回落曲线</span>
          <span>按阶段模板维持 500-1000lx 补光</span>
        </div>
        <div class="compact-alarm-stack">
          <article v-for="alarm in alarmTimeline.filter((item) => !item.handled).slice(0, 2)" :key="alarm.id">
            <strong>{{ alarm.sensorName }}</strong>
            <span>{{ alarm.message }}</span>
          </article>
        </div>
      </article>
    </section>
  </template>

  <template v-else>
  <section class="cabin-patrol-workspace">
    <aside class="cabin-patrol-left">
      <section class="cabin-patrol-panel cabin-patrol-health-card">
        <div class="cabin-patrol-title">
          <Box :size="18" />
          <div>
            <h2>当前批次健康摘要</h2>
            <span v-if="summary">{{ summary.stage }} · 环境达标 {{ summary.targetRate }}% · 在线 {{ summary.onlineRate }}%</span>
          </div>
        </div>

        <div class="cabin-patrol-health-metrics" v-if="summary">
          <div>
            <span>当前阶段</span>
            <strong>{{ summary.stage }}</strong>
          </div>
          <div>
            <span>今日报警</span>
            <strong>{{ summary.alarmCount }}</strong>
          </div>
          <div>
            <span>最大风险</span>
            <strong>下层湿度偏低 84.9%RH</strong>
          </div>
          <div>
            <span>下一步动作</span>
            <strong>17:30 前复核 TH-L2-002</strong>
          </div>
        </div>

        <div class="cabin-patrol-status-grid">
          <span><b>{{ statusCounts.normal }}</b>正常</span>
          <span><b>{{ statusCounts.warning }}</b>预警</span>
          <span><b>{{ statusCounts.alarm }}</b>报警</span>
          <span><b>{{ statusCounts.offline }}</b>离线</span>
        </div>

        <p class="batch-health-note" v-if="summary">
          设备支撑 {{ summary.devices.filter((device) => device.running).length }}/{{ summary.devices.length }} 运行，
          空调、加湿、新风、LED 都处于在线状态。
        </p>

        <div class="cabin-patrol-section">
          <div class="cabin-patrol-section-head">
            <ListChecks :size="16" />
            <strong>下一步动作</strong>
            <span>3 条</span>
          </div>
          <div class="cabin-patrol-action-list">
            <span>17:30 前复核下层 TH-L2-002，记录复核结果</span>
            <span>新风联动后 10 分钟复查 CO2 回落曲线，确认后关闭工单</span>
            <span>按时段维持 500-1000lx 补光，2 小时后复查上层前部</span>
          </div>
        </div>
      </section>
    </aside>

    <section class="cabin-patrol-stage">
      <div class="cabin-patrol-stage-head">
        <div>
          <span>三维监控任务</span>
          <strong>{{ activeView === 'cabin' ? '舱体点位巡检' : '首页驾驶舱' }}</strong>
        </div>
        <div>
          <span>已加载 {{ filteredSensors.length }} 个点位</span>
          <span>{{ selectedSensor ? selectedSensor.name : '点击选择点位' }}</span>
        </div>
      </div>
      <div class="cabin-patrol-toolbar">
        <div class="cabin-patrol-toolbar-stack">
          <div class="cabin-patrol-segmented">
            <button
              v-for="option in typeOptions"
              :key="option.value"
              type="button"
              :class="{ active: activeType === option.value }"
              @click="emit('updateActiveType', option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <div class="cabin-patrol-segmented compact">
            <button
              v-for="mode in sceneModes"
              :key="mode.value"
              type="button"
              :class="{ active: sceneMode === mode.value }"
              @click="emit('updateSceneMode', mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>
        <div class="cabin-patrol-toolbar-stack right">
          <select
            :value="activeLayer"
            class="cabin-patrol-layer-select"
            aria-label="层级筛选"
            @change="emit('updateActiveLayer', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="layer in layerOptionItems" :key="layer.value" :value="layer.value">{{ layer.label }}</option>
          </select>
          <span class="cabin-patrol-muted">当前筛选 {{ filteredSensors.length }} 个点位</span>
        </div>
      </div>

      <div class="cabin-scene-frame">
        <CabinScene
          :sensors="filteredSensors"
          :selected-id="selectedSensor?.id"
          :view-mode="sceneMode"
          @select="emit('selectSensor', $event)"
        />
      </div>
    </section>

    <aside class="cabin-patrol-right">
      <section class="cabin-patrol-panel cabin-patrol-duty">
        <div class="cabin-patrol-title">
          <Activity :size="18" />
          <div>
            <h2>值班处置</h2>
            <span>{{ alarmTimeline.filter((alarm) => !alarm.handled).length }} 个待处理报警 · {{ importantSensors.length }} 个关键点位</span>
          </div>
        </div>

        <div class="cabin-patrol-focus">
          <template v-if="selectedSensor">
            <div class="cabin-patrol-sensor-head">
              <span :class="['cabin-patrol-dot', selectedSensor.reading.status]"></span>
              <div>
                <strong>{{ selectedSensor.name }}</strong>
                <small>{{ selectedSensor.installPosition }}</small>
              </div>
            </div>
            <div class="cabin-patrol-reading">
              {{ selectedSensor.reading.value.toFixed(1) }}{{ selectedSensor.reading.unit }}
              <small v-if="selectedSensor.reading.secondaryValue !== undefined">
                / {{ selectedSensor.reading.secondaryValue.toFixed(1) }}{{ selectedSensor.reading.secondaryUnit }}
              </small>
            </div>
            <TrendChart :sensor="selectedSensor" />
          </template>
          <div v-else class="cabin-patrol-empty">
            <Gauge :size="18" />
            <strong>请选择一个三维点位</strong>
            <span>点击下方点位查看详情</span>
          </div>
        </div>

        <div class="cabin-patrol-section alarm-queue-section">
          <div class="cabin-patrol-section-head">
            <Bell :size="16" />
            <strong>报警队列</strong>
            <span>{{ alarmTimeline.slice(0, 5).length }} 条</span>
          </div>
          <div class="cabin-patrol-alarm-list">
            <article v-for="alarm in alarmTimeline.slice(0, 2)" :key="alarm.id" :class="['cabin-patrol-alarm-item', alarm.level]">
              <strong>{{ alarm.sensorName }}</strong>
              <span>{{ alarm.message }}</span>
              <small>{{ new Date(alarm.createdAt).toLocaleTimeString() }}</small>
            </article>
          </div>
        </div>

        <div class="cabin-patrol-section key-sensor-section">
          <div class="cabin-patrol-section-head">
            <ShieldAlert :size="16" />
            <strong>关键点位</strong>
            <span>点击定位</span>
          </div>
          <div class="cabin-patrol-sensor-list">
            <button
              v-for="sensor in importantSensors.slice(0, 3)"
              :key="sensor.id"
              type="button"
              :class="{ active: selectedSensor?.id === sensor.id }"
              @click="emit('selectSensor', sensor)"
            >
              <span :class="['cabin-patrol-dot', sensor.reading.status]"></span>
              <span>{{ sensor.name }}</span>
              <strong>{{ sensor.reading.value.toFixed(1) }}{{ sensor.reading.unit }}</strong>
            </button>
          </div>
        </div>
      </section>
    </aside>
  </section>
  </template>
</template>

<style scoped>
.cabin-patrol-workspace {
  display: grid;
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr) minmax(300px, 340px);
  align-items: stretch;
  gap: var(--shell-gap, 8px);
  width: 100%;
  max-width: none;
  height: 100%;
  min-height: 0;
  margin: 0;
  color: var(--twin-text, #effff7);
}

.cabin-patrol-left,
.cabin-patrol-right,
.cabin-patrol-stage {
  align-self: stretch;
  gap: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.cabin-patrol-panel,
.cabin-patrol-stage {
  border: 1px solid rgba(0, 214, 160, 0.5);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 0%, rgba(0, 214, 160, 0.12), transparent 34%),
    linear-gradient(180deg, rgba(5, 38, 31, 0.94), rgba(2, 17, 14, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(172, 255, 226, 0.08),
    0 12px 28px rgba(0, 0, 0, 0.16);
}

.cabin-patrol-panel {
  min-height: 0;
  padding: 14px;
}

.cabin-patrol-title {
  display: flex;
  position: relative;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin: 0;
  padding-bottom: 12px;
  color: var(--twin-text, #effff7);
}

.cabin-patrol-title::after,
.cabin-patrol-stage-head::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  content: "";
  background:
    linear-gradient(90deg, transparent 0%, rgba(0, 214, 160, 0.3) 14%, rgba(113, 255, 218, 0.58) 50%, rgba(0, 214, 160, 0.3) 86%, transparent 100%);
}

.cabin-patrol-title svg,
.cabin-patrol-section-head svg {
  color: var(--twin-accent, #00f5b2);
}

.cabin-patrol-workspace h2 {
  color: var(--twin-text, #effff7);
  font-size: 17px;
  line-height: 1.22;
  font-weight: 700;
}

.cabin-patrol-title span,
.cabin-patrol-workspace .batch-health-note,
.cabin-patrol-muted,
.cabin-patrol-workspace small {
  color: rgba(188, 226, 211, 0.78);
  font-size: 12px;
  line-height: 1.38;
}

.cabin-patrol-health-card,
.cabin-patrol-duty {
  display: grid;
  gap: 12px;
  height: 100%;
  overflow: hidden;
}

.cabin-patrol-health-card {
  grid-template-rows: auto auto auto auto minmax(0, 1fr);
}

.cabin-patrol-duty {
  grid-template-rows: auto 248px 150px 118px;
  max-height: 100%;
}

.cabin-patrol-health-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 10px;
  border: 1px solid rgba(0, 214, 160, 0.14);
  border-radius: 8px;
  background: rgba(2, 24, 20, 0.72);
}

.cabin-patrol-health-metrics div {
  min-height: 64px;
  padding: 10px;
  border: 1px solid rgba(0, 214, 160, 0.1);
  border-radius: 7px;
  background: rgba(1, 16, 13, 0.66);
}

.cabin-patrol-health-metrics span,
.cabin-patrol-status-grid span {
  color: rgba(188, 226, 211, 0.76);
  font-size: 11.5px;
  font-weight: 600;
}

.cabin-patrol-health-metrics strong {
  color: var(--twin-text, #effff7);
  font-size: 14px;
  line-height: 1.25;
}

.cabin-patrol-status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  margin: 0;
}

.cabin-patrol-status-grid span {
  display: grid;
  place-items: center;
  min-height: 50px;
  border-radius: 8px;
  border: 1px solid rgba(0, 214, 160, 0.16);
  background: rgba(4, 31, 25, 0.74);
}

.cabin-patrol-status-grid b {
  color: var(--twin-accent, #00f5b2);
  font-size: 20px;
  line-height: 1.1;
}

.cabin-patrol-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 214, 160, 0.2);
  min-height: 0;
  overflow: hidden;
}

.cabin-patrol-action-list,
.cabin-patrol-alarm-list,
.cabin-patrol-sensor-list {
  display: grid;
  gap: 8px;
  max-height: none;
  min-height: 0;
  overflow: auto;
}

.alarm-queue-section .cabin-patrol-alarm-list,
.key-sensor-section .cabin-patrol-sensor-list {
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.cabin-patrol-section-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

.cabin-patrol-action-list span,
.cabin-patrol-alarm-item,
.cabin-patrol-sensor-list button {
  border: 1px solid rgba(0, 214, 160, 0.14);
  border-radius: 8px;
  background: rgba(3, 27, 22, 0.74);
  color: rgba(239, 255, 247, 0.9);
  min-width: 0;
}

.cabin-patrol-action-list span {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 9px 10px;
}

.cabin-patrol-alarm-item {
  display: grid;
  gap: 4px;
  border-left: 3px solid #ffae2b;
  min-height: 52px;
  padding: 8px 10px;
}

.cabin-patrol-alarm-item.critical {
  border-left-color: #ff5f57;
}

.cabin-patrol-alarm-item.info {
  border-left-color: var(--twin-accent, #00f5b2);
}

.cabin-patrol-alarm-item span,
.cabin-patrol-sensor-list button span {
  color: rgba(188, 226, 211, 0.84);
}

.cabin-patrol-sensor-list button {
  display: grid;
  align-items: center;
  min-height: 34px;
  padding: 6px 9px;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  text-align: left;
  cursor: pointer;
}

.cabin-patrol-sensor-list button span:nth-child(2) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cabin-patrol-stage {
  display: grid;
  grid-template-rows: 54px 96px minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.cabin-patrol-stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  min-height: 54px;
  padding: 0 16px;
  border-bottom: 0;
}

.cabin-patrol-stage-head > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.cabin-patrol-stage-head span {
  color: rgba(188, 226, 211, 0.78);
  font-size: 12px;
}

.cabin-patrol-stage-head strong {
  color: var(--twin-text, #effff7);
  font-size: 17px;
  line-height: 1.2;
}

.cabin-patrol-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(0, 214, 160, 0.18);
  background: rgba(2, 24, 20, 0.54);
}

.cabin-patrol-toolbar-stack {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.cabin-patrol-toolbar-stack.right {
  justify-items: end;
}

.cabin-patrol-segmented {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cabin-patrol-segmented button,
.cabin-patrol-layer-select {
  min-height: 30px;
  border: 1px solid rgba(0, 245, 178, 0.32);
  border-radius: 8px;
  background: rgba(2, 35, 29, 0.82);
  color: rgba(218, 255, 242, 0.9);
  font-size: 12px;
  font-weight: 650;
}

.cabin-patrol-segmented button {
  padding: 0 11px;
  cursor: pointer;
}

.cabin-patrol-segmented button.active {
  border-color: rgba(0, 245, 178, 0.78);
  background: linear-gradient(180deg, rgba(34, 222, 169, 0.36), rgba(0, 116, 88, 0.52));
  color: #effff7;
  box-shadow: 0 0 16px rgba(0, 245, 178, 0.15);
}

.cabin-patrol-layer-select {
  padding: 0 34px 0 12px;
}

.cabin-scene-frame {
  position: relative;
  min-height: 0;
  overflow: hidden;
  background:
    linear-gradient(rgba(0, 214, 160, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 214, 160, 0.045) 1px, transparent 1px),
    radial-gradient(circle at 52% 40%, rgba(0, 245, 178, 0.14), transparent 42%),
    linear-gradient(180deg, #031a15 0%, #020d0b 100%);
  background-size: 32px 32px, 32px 32px, 100% 100%, 100% 100%;
}

.cabin-scene-frame::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  background:
    radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.14) 72%),
    linear-gradient(180deg, rgba(0, 245, 178, 0.08), transparent 28%, rgba(0, 0, 0, 0.22));
}

.cabin-scene-frame :deep(.cabin-scene) {
  width: 100%;
  height: 100%;
  min-height: 0;
  background: transparent !important;
}

.cabin-scene-frame :deep(canvas) {
  display: block;
  background: transparent !important;
}

.cabin-scene-frame :deep(.scene-label) {
  border: 1px solid rgba(0, 245, 178, 0.42);
  background: rgba(7, 18, 30, 0.9);
  color: #effff7;
}

.cabin-patrol-focus {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 9px;
  min-height: 0;
  padding: 14px;
  border: 1px solid rgba(0, 214, 160, 0.16);
  border-radius: 8px;
  background:
    radial-gradient(circle at 20% 0%, rgba(0, 245, 178, 0.11), transparent 34%),
    rgba(3, 27, 22, 0.72);
  overflow: hidden;
}

.cabin-patrol-sensor-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cabin-patrol-reading {
  color: var(--twin-accent, #00f5b2);
  font-size: 28px;
  line-height: 1.05;
  font-weight: 750;
}

.cabin-patrol-reading small {
  color: rgba(188, 226, 211, 0.7);
  font-size: 13px;
  font-weight: 600;
}

.cabin-patrol-workspace :deep(.trend-chart) {
  height: 116px;
  min-height: 0;
  overflow: hidden;
}

.cabin-patrol-empty {
  display: grid;
  align-content: center;
  gap: 8px;
  color: var(--twin-text, #effff7);
}

.cabin-patrol-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(172, 220, 202, 0.68);
}

.cabin-patrol-dot.normal {
  background: var(--twin-accent, #00f5b2);
}

.cabin-patrol-dot.warning {
  background: #ffae2b;
}

.cabin-patrol-dot.alarm {
  background: #ff5f57;
}

.cabin-patrol-dot.offline {
  background: rgba(172, 220, 202, 0.48);
}

@media (max-width: 1180px) {
  .cabin-patrol-workspace {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .cabin-patrol-stage {
    min-height: 640px;
  }
}
</style>


