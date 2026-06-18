<script setup lang="ts">
import { Activity, BarChart3, Bell, CalendarClock, ClipboardList, Database, FileText, Gauge, HeartPulse, Layers, Search, SlidersHorizontal, TrendingUp } from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';

type ReviewReportItem = {
  label: string;
  value: string;
};

type RoleMatrixItem = {
  role: string;
  scope: string;
};

type NotificationItem = {
  title: string;
  content: string;
};

type DataTrustRow = {
  name: string;
  updated: string;
  delay: string;
  drift: string;
  calibration: string;
};

type DataQualityMetric = {
  label: string;
  value: string;
  status: string;
};

type PointConfigRow = {
  id: string;
  name: string;
  type: string;
  area: string;
  threshold: string;
  coordinate: string;
};

type ThresholdTemplate = {
  stage: string;
  temperature: string;
  humidity: string;
  co2: string;
  light: string;
  alarm: string;
};

type ApiContract = {
  path: string;
  use: string;
};

type ThresholdChangeRecord = {
  operator: string;
  time: string;
  before: string;
  after: string;
  reason: string;
};

type HistoryQuery = {
  name: string;
  points: string;
  range: string;
  status: string;
};

const props = defineProps<{
  activeView: 'governance' | 'display' | 'config' | 'history' | 'trace';
  anomalyCaseLibrary: any[];
  apiContracts: ApiContract[];
  dataQualityMetrics: DataQualityMetric[];
  dataTrustRows: DataTrustRow[];
  exportItems: string[];
  historyQueries: HistoryQuery[];
  notificationItems: NotificationItem[];
  pointConfigRows: PointConfigRow[];
  productionTraceChain: string[];
  reviewReport: ReviewReportItem[];
  roleMatrix: RoleMatrixItem[];
  thresholdChangeRecords: ThresholdChangeRecord[];
  thresholdTemplates: ThresholdTemplate[];
}>();

const emit = defineEmits<{
  focusSensorById: [id: string];
}>();

const supportSummaryCards = [
  {
    label: '报表总览',
    value: '交付链已收口',
    note: `${props.reviewReport.length}个核心指标`
  },
  {
    label: '数据可信',
    value: `${props.dataQualityMetrics.length}项`,
    note: `${props.dataTrustRows.length}个可信度条目`
  },
  {
    label: '配置台账',
    value: `${props.pointConfigRows.length}个点位`,
    note: `${props.thresholdChangeRecords.length}条变更记录`
  },
  {
    label: '导出与追溯',
    value: `${props.exportItems.length + props.productionTraceChain.length}项`,
    note: '报表、审计、追溯、配置同链'
  }
];
</script>

<template>
  <PageSummaryBar
    v-if="['governance', 'display', 'config', 'history', 'trace'].includes(activeView)"
    title="数据交付总览"
    :cards="supportSummaryCards"
  />

  <section v-if="activeView === 'trace'" class="system-content-grid trace-layout">
    <article class="system-panel">
      <div class="system-panel-header">
        <FileText :size="18" />
        <h2>异常复盘库</h2>
      </div>
      <div class="suggestion-list">
        <article v-for="item in anomalyCaseLibrary" :key="item.caseName">
          <strong>{{ item.caseName }}</strong>
          <span>原因：{{ item.reason }}</span>
          <p>处理：{{ item.solution }}；结果：{{ item.result }}</p>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Layers :size="18" />
        <h2>生产质量追溯链</h2>
      </div>
      <p class="decision-note">追溯链已合一至工程交付视图数据血缘模块，点击导航切换</p>
    </article>
  </section>

  <section v-else-if="activeView === 'governance'" class="system-content-grid governance-layout">
    <article class="system-panel">
      <div class="system-panel-header">
        <BarChart3 :size="18" />
        <h2>批次复盘</h2>
      </div>
      <p class="decision-note">复盘报告已合一至工程交付视图验收模块，点击导航切换</p>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Layers :size="18" />
        <h2>用户角色权限</h2>
      </div>
      <div class="role-list">
        <article v-for="role in roleMatrix" :key="role.role">
          <strong>{{ role.role }}</strong>
          <span>{{ role.scope }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel export-panel">
      <div class="system-panel-header">
        <ClipboardList :size="18" />
        <h2>数据导出</h2>
      </div>
      <div class="export-grid">
        <button v-for="item in exportItems" :key="item" type="button">{{ item }}</button>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'display'" class="system-content-grid display-layout">
    <article class="system-panel bigscreen-card">
      <div class="system-panel-header">
        <Gauge :size="18" />
        <h2>大屏模式</h2>
      </div>
      <div class="bigscreen-preview">
        <strong>现场展示视图</strong>
        
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Bell :size="18" />
        <h2>消息通知中心</h2>
      </div>
      <div class="notification-list">
        <article v-for="item in notificationItems" :key="item.title">
          <strong>{{ item.title }}</strong>
          <span>{{ item.content }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel trust-panel">
      <div class="system-panel-header">
        <HeartPulse :size="18" />
        <h2>数据可信度标识</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head">
          <span>点位</span>
          <span>更新</span>
          <span>数据状态</span>
          <span>校准</span>
        </div>
        <div v-for="row in dataTrustRows" :key="row.name" class="asset-row">
          <span>{{ row.name }}</span>
          <span>{{ row.updated }}</span>
          <span>{{ row.delay }} · {{ row.drift }}</span>
          <strong>{{ row.calibration }}</strong>
        </div>
      </div>
    </article>

    <article class="system-panel trust-panel">
      <div class="system-panel-header">
        <Database :size="18" />
        <h2>数据质量监控</h2>
      </div>
      <div class="uniformity-grid">
        <article v-for="item in dataQualityMetrics" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.status }}</small>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'config'" class="system-content-grid config-layout">
    <article class="system-panel config-wide">
      <div class="system-panel-header">
        <Database :size="18" />
        <h2>点位配置中心</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row config-head">
          <span>编号/名称</span>
          <span>类型/区域</span>
          <span>阈值</span>
          <span>三维坐标</span>
        </div>
        <button v-for="row in pointConfigRows" :key="row.id" class="asset-row config-head" type="button" @click="emit('focusSensorById', row.id)">
          <span>{{ row.id }} · {{ row.name }}</span>
          <span>{{ row.type }} · {{ row.area }}</span>
          <span>{{ row.threshold }}</span>
          <strong>{{ row.coordinate }}</strong>
        </button>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <SlidersHorizontal :size="18" />
        <h2>阈值配置中心</h2>
      </div>
      <div class="threshold-list">
        <article v-for="tpl in thresholdTemplates" :key="tpl.stage">
          <strong>{{ tpl.stage }}</strong>
          <span>温度 {{ tpl.temperature }} · 湿度 {{ tpl.humidity }}</span>
          <span>CO2 {{ tpl.co2 }} · 光照 {{ tpl.light }}</span>
          <small>{{ tpl.alarm }}</small>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Database :size="18" />
        <h2>真实接口适配层</h2>
      </div>
      <div class="api-list">
        <article v-for="apiItem in apiContracts" :key="apiItem.path">
          <strong>{{ apiItem.path }}</strong>
          <span>{{ apiItem.use }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel config-wide">
      <div class="system-panel-header">
        <CalendarClock :size="18" />
        <h2>阈值变更记录</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head">
          <span>修改人/时间</span>
          <span>修改前</span>
          <span>修改后</span>
          <span>原因</span>
        </div>
        <div v-for="record in thresholdChangeRecords" :key="record.time" class="asset-row">
          <span>{{ record.operator }} · {{ record.time }}</span>
          <span>{{ record.before }}</span>
          <span>{{ record.after }}</span>
          <strong>{{ record.reason }}</strong>
        </div>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'history'" class="system-content-grid history-layout">
    <article class="system-panel">
      <div class="system-panel-header">
        <Search :size="18" />
        <h2>历史数据查询</h2>
      </div>
      <div class="query-controls">
        <span>时间范围：近24小时</span>
        <span>指标：温湿度 / CO2 / 光照 / 设备</span>
        <span>点位：支持多点位对比</span>
        <button type="button">导出查询结果</button>
      </div>
    </article>
    <article class="system-panel history-wide">
      <div class="system-panel-header">
        <TrendingUp :size="18" />
        <h2>查询模板</h2>
      </div>
      <div class="history-list">
        <article v-for="query in historyQueries" :key="query.name">
          <strong>{{ query.name }}</strong>
          <span>{{ query.points }}</span>
          <small>{{ query.range }} · {{ query.status }}</small>
        </article>
      </div>
    </article>
  </section>

</template>
