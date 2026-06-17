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

  <section v-else-if="activeView === 'brain'" class="module-grid brain-layout">
    <article class="panel-block brain-wide">
      <div class="section-title">
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

    <article class="panel-block brain-wide">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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
        <div class="section-title">
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
        <div class="section-title">
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
  <section class="workspace">
    <aside class="left-panel batch-health-panel">
      <section class="panel-block batch-health-card">
        <div class="section-title duty-title">
          <Box :size="18" />
          <div>
            <h2>当前批次健康摘要</h2>
            <span v-if="summary">{{ summary.stage }} · 环境达标 {{ summary.targetRate }}% · 在线 {{ summary.onlineRate }}%</span>
          </div>
        </div>

        <div class="batch-health-metrics" v-if="summary">
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

        <div class="status-grid compact-status">
          <span><b>{{ statusCounts.normal }}</b>正常</span>
          <span><b>{{ statusCounts.warning }}</b>预警</span>
          <span><b>{{ statusCounts.alarm }}</b>报警</span>
          <span><b>{{ statusCounts.offline }}</b>离线</span>
        </div>

        <p class="batch-health-note" v-if="summary">
          设备支撑 {{ summary.devices.filter((device) => device.running).length }}/{{ summary.devices.length }} 运行，
          空调、加湿、新风、LED 都处于在线状态。
        </p>

        <div class="health-section">
          <div class="duty-section-head">
            <ListChecks :size="16" />
            <strong>下一步动作</strong>
            <span>3 条</span>
          </div>
          <div class="action-list compact">
            <span>17:30 前复核下层 TH-L2-002，记录复核结果</span>
            <span>新风联动后 10 分钟复查 CO2 回落曲线，确认后关闭工单</span>
            <span>按时段维持 500-1000lx 补光，2 小时后复查上层前部</span>
          </div>
        </div>
      </section>
    </aside>

    <section class="scene-panel">
      <div class="scene-context-bar">
        <div>
          <span>三维监控任务</span>
          <strong>{{ activeView === 'cabin' ? '舱体点位巡检' : '首页驾驶舱' }}</strong>
        </div>
        <div>
          <span>已加载 {{ filteredSensors.length }} 个点位</span>
          <span>{{ selectedSensor ? selectedSensor.name : '点击选择点位' }}</span>
        </div>
      </div>
      <div class="scene-toolbar">
        <div class="toolbar-stack">
          <div class="segmented">
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
          <div class="segmented compact">
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
        <div class="toolbar-stack right">
          <select
            :value="activeLayer"
            class="layer-select"
            aria-label="层级筛选"
            @change="emit('updateActiveLayer', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="layer in layerOptionItems" :key="layer.value" :value="layer.value">{{ layer.label }}</option>
          </select>
          <span class="muted">当前筛选 {{ filteredSensors.length }} 个点位</span>
        </div>
      </div>

      <CabinScene
        :sensors="filteredSensors"
        :selected-id="selectedSensor?.id"
        :view-mode="sceneMode"
        @select="emit('selectSensor', $event)"
      />
    </section>

    <aside class="right-panel duty-panel">
      <section class="panel-block duty-workbench">
        <div class="section-title duty-title">
          <Activity :size="18" />
          <div>
            <h2>值班处置</h2>
            <span>{{ alarmTimeline.filter((alarm) => !alarm.handled).length }} 个待处理报警 · {{ importantSensors.length }} 个关键点位</span>
          </div>
        </div>

        <div class="duty-focus">
          <template v-if="selectedSensor">
            <div class="sensor-head">
              <span :class="['dot', selectedSensor.reading.status]"></span>
              <div>
                <strong>{{ selectedSensor.name }}</strong>
                <small>{{ selectedSensor.installPosition }}</small>
              </div>
            </div>
            <div class="reading-value">
              {{ selectedSensor.reading.value.toFixed(1) }}{{ selectedSensor.reading.unit }}
              <small v-if="selectedSensor.reading.secondaryValue !== undefined">
                / {{ selectedSensor.reading.secondaryValue.toFixed(1) }}{{ selectedSensor.reading.secondaryUnit }}
              </small>
            </div>
            <TrendChart :sensor="selectedSensor" />
          </template>
          <div v-else class="duty-empty">
            <Gauge :size="18" />
            <strong>请选择一个三维点位</strong>
            <span>点击下方点位查看详情</span>
          </div>
        </div>

        <div class="duty-section">
          <div class="duty-section-head">
            <Bell :size="16" />
            <strong>报警队列</strong>
            <span>{{ alarmTimeline.slice(0, 5).length }} 条</span>
          </div>
          <div class="alarm-list compact">
            <article v-for="alarm in alarmTimeline.slice(0, 5)" :key="alarm.id" :class="['alarm-item', alarm.level]">
              <strong>{{ alarm.sensorName }}</strong>
              <span>{{ alarm.message }}</span>
              <small>{{ new Date(alarm.createdAt).toLocaleTimeString() }}</small>
            </article>
          </div>
        </div>

        <div class="duty-section">
          <div class="duty-section-head">
            <ShieldAlert :size="16" />
            <strong>关键点位</strong>
            <span>点击定位</span>
          </div>
          <div class="sensor-list compact">
            <button
              v-for="sensor in importantSensors"
              :key="sensor.id"
              type="button"
              :class="{ active: selectedSensor?.id === sensor.id }"
              @click="emit('selectSensor', sensor)"
            >
              <span :class="['dot', sensor.reading.status]"></span>
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


