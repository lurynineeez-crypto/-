<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bell, CalendarClock, CheckCircle2, Gauge, Layers, MapPinned, Search, Wrench } from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';
import type { SensorPoint } from '../types';

const props = defineProps<{
  activeView: 'alarms' | 'maintenance';
  alarmTimeline: any[];
  maintenancePlans: any[];
  maintenanceRows: any[];
  calibrationComparisons: any[];
  focusSensorById: (id: string) => void;
}>();

const alarmLevelFilter = ref<'all' | 'warning' | 'info'>('all');
const alarmHandledFilter = ref<'all' | 'pending' | 'handled'>('all');
const maintenanceKeyword = ref('');
const maintenanceStatusFilter = ref<'all' | '即将到期' | '正常'>('all');

const filteredAlarmTimeline = computed(() =>
  props.alarmTimeline.filter((alarm) => {
    const levelOk = alarmLevelFilter.value === 'all' || alarm.level === alarmLevelFilter.value;
    const handledOk =
      alarmHandledFilter.value === 'all' ||
      (alarmHandledFilter.value === 'pending' ? !alarm.handled : alarm.handled);
    return levelOk && handledOk;
  })
);

const alarmSummary = computed(() => ({
  total: props.alarmTimeline.length,
  pending: props.alarmTimeline.filter((alarm) => !alarm.handled).length,
  warning: props.alarmTimeline.filter((alarm) => alarm.level === 'warning').length
}));

const filteredMaintenanceRows = computed(() => {
  const keyword = maintenanceKeyword.value.trim().toLowerCase();
  return props.maintenanceRows.filter((row) => {
    const keywordOk =
      !keyword ||
      String(row.name).toLowerCase().includes(keyword) ||
      String(row.position).toLowerCase().includes(keyword) ||
      String(row.type ?? '').toLowerCase().includes(keyword);
    const statusOk = maintenanceStatusFilter.value === 'all' || row.status === maintenanceStatusFilter.value;
    return keywordOk && statusOk;
  });
});

const maintenanceSummary = computed(() => {
  const dueCount = props.maintenanceRows.filter((row) => row.status === '即将到期').length;
  const passCount = props.calibrationComparisons.filter((row) => String(row.result).includes('合格')).length;
  const passRate = props.calibrationComparisons.length ? Math.round((passCount / props.calibrationComparisons.length) * 100) : 0;
  return { total: props.maintenanceRows.length, dueCount, passRate };
});

const opsSummaryCards = computed(() => [
  { label: '报警总量', value: `${alarmSummary.value.total}`, note: `待处理 ${alarmSummary.value.pending} 项` },
  { label: '维护点位', value: `${maintenanceSummary.value.total}`, note: `即将到期 ${maintenanceSummary.value.dueCount} 项` },
  { label: '校准通过率', value: `${maintenanceSummary.value.passRate}%`, note: '看校准前后偏差' },
  { label: '预警数量', value: `${alarmSummary.value.warning}`, note: '优先进入处置队列' }
]);

const emit = defineEmits<{
  selectSensor: [sensor: SensorPoint];
  openAlarm: [alarm: any];
}>();
</script>

<template>
  <section class="module-grid" :class="activeView === 'alarms' ? 'alarms-layout' : 'maintenance-layout'">
    <template v-if="activeView === 'alarms'">
      <article class="panel-block">
        <div class="section-title">
          <Bell :size="18" />
          <h2>报警闭环</h2>
        </div>
        <div class="uniformity-grid">
          <article>
            <span>报警总数</span>
            <strong>{{ alarmSummary.total }}</strong>
            <small>当前告警与预警累计</small>
          </article>
          <article>
            <span>待处理</span>
            <strong>{{ alarmSummary.pending }}</strong>
            <small>需要值班员继续处理</small>
          </article>
          <article>
            <span>预警级别</span>
            <strong>{{ alarmSummary.warning }}</strong>
            <small>建议优先复核 warning</small>
          </article>
        </div>
        <div class="toolbar-row">
          <div class="segmented">
            <button type="button" :class="{ active: alarmLevelFilter === 'all' }" @click="alarmLevelFilter = 'all'">全部级别</button>
            <button type="button" :class="{ active: alarmLevelFilter === 'warning' }" @click="alarmLevelFilter = 'warning'">预警</button>
            <button type="button" :class="{ active: alarmLevelFilter === 'info' }" @click="alarmLevelFilter = 'info'">提示</button>
          </div>
          <div class="segmented">
            <button type="button" :class="{ active: alarmHandledFilter === 'all' }" @click="alarmHandledFilter = 'all'">全部状态</button>
            <button type="button" :class="{ active: alarmHandledFilter === 'pending' }" @click="alarmHandledFilter = 'pending'">待处理</button>
            <button type="button" :class="{ active: alarmHandledFilter === 'handled' }" @click="alarmHandledFilter = 'handled'">已闭环</button>
          </div>
        </div>
        <div class="timeline">
          <button
            v-for="alarm in filteredAlarmTimeline"
            :key="alarm.id"
            type="button"
            :class="['timeline-item', alarm.level, 'interactive-row']"
            @click="emit('openAlarm', alarm); focusSensorById(alarm.sensorId)"
          >
            <strong>{{ alarm.sensorName }}</strong>
            <span>{{ alarm.message }}</span>
            <small>{{ alarm.handled ? '已闭环' : '待处理' }} · {{ new Date(alarm.createdAt).toLocaleString() }}</small>
          </button>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <MapPinned :size="18" />
          <h2>处置流程</h2>
        </div>
        <div class="process-list">
          <span><CheckCircle2 :size="16" /> 发现异常（系统自动检测）</span>
          <span><CheckCircle2 :size="16" /> 页面提醒（推送值班员）</span>
          <span><CheckCircle2 :size="16" /> 点位定位（跳转三维或列表）</span>
          <span><CalendarClock :size="16" /> 人员确认（记录处理人与时间）</span>
          <span><CalendarClock :size="16" /> 处置记录（执行 SOP 并填写结果）</span>
          <span><CalendarClock :size="16" /> 恢复复核（确认数值回归后归档）</span>
        </div>
      </article>
    </template>

    <template v-else>
      <article class="panel-block">
        <div class="section-title">
          <Wrench :size="18" />
          <h2>维护校准计划</h2>
        </div>
        <div class="uniformity-grid">
          <article>
            <span>维护点位</span>
            <strong>{{ maintenanceSummary.total }}</strong>
            <small>纳入当前维护清单</small>
          </article>
          <article>
            <span>即将到期</span>
            <strong>{{ maintenanceSummary.dueCount }}</strong>
            <small>建议本周完成校准</small>
          </article>
          <article>
            <span>校准通过率</span>
            <strong>{{ maintenanceSummary.passRate }}%</strong>
            <small>基于当前前后对比结果</small>
          </article>
        </div>
        <div class="plan-list">
          <article v-for="plan in maintenancePlans" :key="plan.type">
            <strong>{{ plan.type }}</strong>
            <span>{{ plan.cycle }} · {{ plan.standard }}</span>
            <small>{{ plan.scope }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Layers :size="18" />
          <h2>传感器台账</h2>
        </div>
        <div class="toolbar-row">
          <label class="search-field">
            <Search :size="16" />
            <input v-model="maintenanceKeyword" type="text" placeholder="搜索点位、位置、类型" />
          </label>
          <div class="segmented">
            <button type="button" :class="{ active: maintenanceStatusFilter === 'all' }" @click="maintenanceStatusFilter = 'all'">全部</button>
            <button type="button" :class="{ active: maintenanceStatusFilter === '即将到期' }" @click="maintenanceStatusFilter = '即将到期'">即将到期</button>
            <button type="button" :class="{ active: maintenanceStatusFilter === '正常' }" @click="maintenanceStatusFilter = '正常'">正常</button>
          </div>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>点位</span>
            <span>安装位置</span>
            <span>下次维护</span>
            <span>状态</span>
          </div>
          <button
            v-for="row in filteredMaintenanceRows"
            :key="row.id"
            class="asset-row interactive-row"
            type="button"
            @click="focusSensorById(row.id)"
          >
            <span>{{ row.name }}</span>
            <span>{{ row.position }}</span>
            <span>{{ row.nextDate }}</span>
            <strong>{{ row.status }}</strong>
          </button>
        </div>
      </article>

      <article class="panel-block maintenance-wide">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>校准前后对比</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>点位</span>
            <span>标准仪表</span>
            <span>校准前偏差</span>
            <span>校准后偏差</span>
            <span>结果</span>
          </div>
          <button
            v-for="row in calibrationComparisons"
            :key="row.id"
            class="asset-row calibration-row interactive-row"
            type="button"
            @click="focusSensorById(row.id)"
          >
            <span>{{ row.name }}</span>
            <span>{{ row.standard }}</span>
            <span>{{ row.before }}</span>
            <span>{{ row.after }}</span>
            <strong>{{ row.result }}</strong>
          </button>
        </div>
      </article>
    </template>
  </section>
</template>
