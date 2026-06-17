<script setup lang="ts">
import { Activity, BarChart3, Bell, CalendarClock, CheckCircle2, ClipboardList, Database, FileText, Gauge, HeartPulse, Layers, Search, SlidersHorizontal, TrendingUp } from 'lucide-vue-next';
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

type ReportCard = {
  title: string;
  content: string;
};

type OperationReport = {
  title: string;
  value: string;
  note: string;
};

const props = defineProps<{
  activeView: 'governance' | 'display' | 'config' | 'history' | 'reports' | 'audit' | 'trace';
  anomalyCaseLibrary: any[];
  apiContracts: ApiContract[];
  complianceAudit: any[];
  dataQualityMetrics: DataQualityMetric[];
  dataTrustRows: DataTrustRow[];
  exportItems: string[];
  historyQueries: HistoryQuery[];
  managementBoard: any[];
  notificationItems: NotificationItem[];
  operationReports: OperationReport[];
  pointConfigRows: PointConfigRow[];
  productionTraceChain: string[];
  reportCards: ReportCard[];
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
    v-if="['governance', 'display', 'config', 'history', 'reports', 'audit', 'trace'].includes(activeView)"
    title="数据交付总览"
    :cards="supportSummaryCards"
  />

  <section v-if="activeView === 'trace'" class="module-grid trace-layout">
    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
        <Layers :size="18" />
        <h2>生产质量追溯链</h2>
      </div>
      <p class="decision-note">追溯链已合一至工程交付视图数据血缘模块，点击导航切换</p>
    </article>
  </section>

  <section v-else-if="activeView === 'audit'" class="module-grid audit-layout">
    <article class="panel-block audit-wide">
      <div class="section-title">
        <CheckCircle2 :size="18" />
        <h2>合规审计</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head">
          <span>审计项</span>
          <span>结果</span>
          <span>详情</span>
          <span>状态</span>
          <span>责任人</span>
          <span>复核人</span>
        </div>
        <div v-for="item in complianceAudit" :key="item.item" class="asset-row">
          <strong>{{ item.item }}</strong>
          <span>{{ item.result }}</span>
          <span>{{ item.detail }}</span>
          <strong>{{ item.status }}</strong>
          <span>{{ item.owner }}</span>
          <small>{{ item.reviewer }}</small>
        </div>
      </div>
    </article>

    <article class="panel-block audit-wide">
      <div class="section-title">
        <BarChart3 :size="18" />
        <h2>管理者决策看板</h2>
      </div>
      <div class="review-grid">
        <article v-for="item in managementBoard" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.note }}</small>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'governance'" class="module-grid governance-layout">
    <article class="panel-block">
      <div class="section-title">
        <BarChart3 :size="18" />
        <h2>批次复盘</h2>
      </div>
      <p class="decision-note">复盘报告已合一至工程交付视图验收模块，点击导航切换</p>
    </article>

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block export-panel">
      <div class="section-title">
        <ClipboardList :size="18" />
        <h2>数据导出</h2>
      </div>
      <div class="export-grid">
        <button v-for="item in exportItems" :key="item" type="button">{{ item }}</button>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'display'" class="module-grid display-layout">
    <article class="panel-block bigscreen-card">
      <div class="section-title">
        <Gauge :size="18" />
        <h2>大屏模式</h2>
      </div>
      <div class="bigscreen-preview">
        <strong>现场展示视图</strong>
        
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block trust-panel">
      <div class="section-title">
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

    <article class="panel-block trust-panel">
      <div class="section-title">
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

  <section v-else-if="activeView === 'config'" class="module-grid config-layout">
    <article class="panel-block config-wide">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block config-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'history'" class="module-grid history-layout">
    <article class="panel-block">
      <div class="section-title">
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
    <article class="panel-block history-wide">
      <div class="section-title">
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

  <section v-else class="module-grid reports-layout">
    <article class="panel-block reports-wide">
      <div class="section-title">
        <BarChart3 :size="18" />
        <h2>运营报告</h2>
      </div>
      <p class="decision-note">运营报告已合一至工程交付视图交付状态总览，点击导航切换</p>
    </article>
  </section>
</template>
