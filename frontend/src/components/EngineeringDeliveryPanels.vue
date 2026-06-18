<script setup lang="ts">
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Layers,
  ListChecks,
  MapPinned,
  PlayCircle,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sprout,
  Target,
  TrendingUp,
  Wrench
} from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';
import { computed, defineAsyncComponent } from 'vue';
const TrendChart = defineAsyncComponent(() => import('./TrendChart.vue'));

const props = defineProps<{
  activeView:
    | 'engineering'
    | 'integration'
    | 'drill'
    | 'search'
    | 'point'
    | 'explain'
    | 'delivery';
  acceptanceMetrics: any[];
  slaStatuses: any[];
  backupStrategy: any[];
  releaseNotes: any[];
  dataLineage: string[];
  apiDocs: any[];
  integrationStatus: any[];
  helpManual: any[];
  drillScenarios: any[];
  permissionAuditLogs: any[];
  globalSearchResults: any[];
  eventTimeline: any[];
  selectedPointProfile: any | null;
  ruleExplanations: any[];
  demoScripts: any[];
  dataModeBadges: string[];
  legendItems: any[];
  deploymentChecklist: any[];
  selfCheckItems: any[];
  deliveryStatus: any[];
  acceptanceChecklist: any[];
  demoFlowScenarios: any[];
  presentationScript: any[];
}>();

const deliverySummaryCards = computed(() => [
  {
    label: '交付状态',
    value: `${props.deliveryStatus.length}组`,
    note: '工程、集成、验收、演示同链'
  },
  {
    label: '验收覆盖',
    value: `${props.acceptanceChecklist.length}项`,
    note: `${props.acceptanceMetrics.length}个关键指标`
  },
  {
    label: '文档与接口',
    value: `${props.apiDocs.length + props.helpManual.length}份`,
    note: '文档、联调、解释、自检整合'
  },
  {
    label: '演示脚本',
    value: `${props.demoFlowScenarios.length}个`,
    note: `${props.presentationScript.length}个汇报段落`
  }
]);
</script>

<template>
  <PageSummaryBar
    v-if="['engineering', 'integration', 'drill', 'search', 'point', 'explain', 'delivery'].includes(activeView)"
    title="交付总览"
    :cards="deliverySummaryCards"
  />

  <section v-if="activeView === 'engineering'" class="system-content-grid engineering-layout">
    <article class="system-panel engineering-wide">
      <div class="system-panel-header">
        <Target :size="18" />
        <h2>验收指标中心</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head">
          <span>指标</span>
          <span>验收目标</span>
          <span>当前状态</span>
          <span>结果</span>
        </div>
        <div v-for="item in acceptanceMetrics" :key="item.item" class="asset-row">
          <span>{{ item.item }}</span>
          <span>{{ item.target }}</span>
          <span>{{ item.current }}</span>
          <strong>{{ item.status }}</strong>
        </div>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Activity :size="18" />
        <h2>SLA / 运行保障</h2>
      </div>
      <div class="uniformity-grid">
        <article v-for="item in slaStatuses" :key="item.name">
          <span>{{ item.name }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.note }}</small>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Database :size="18" />
        <h2>数据备份与恢复策略</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in backupStrategy" :key="item.item">
          <strong>{{ item.item }}</strong>
          <span>{{ item.value }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel engineering-wide">
      <div class="system-panel-header">
        <FileText :size="18" />
        <h2>版本与发布记录</h2>
      </div>
      <div class="timeline">
        <article v-for="item in releaseNotes" :key="item.version" class="timeline-item info">
          <strong>{{ item.version }} ·{{ item.date }}</strong>
          <span>{{ item.owner }} ·{{ item.content }}</span>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'integration'" class="system-content-grid integration-layout">
    <article class="system-panel integration-wide">
      <div class="system-panel-header">
        <MapPinned :size="18" />
        <h2>数据血缘 / 数据流视图</h2>
      </div>
      <div class="trace-chain horizontal">
        <span v-for="node in dataLineage" :key="node">{{ node }}</span>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <FileText :size="18" />
        <h2>接口文档页面</h2>
      </div>
      <div class="api-list">
        <article v-for="apiItem in apiDocs" :key="apiItem.path">
          <strong>{{ apiItem.method }} {{ apiItem.path }}</strong>
          <span>{{ apiItem.desc }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <Database :size="18" />
        <h2>模拟联调状态页</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in integrationStatus" :key="item.item">
          <strong>{{ item.item }}</strong>
          <span>{{ item.value }}</span>
          <small>{{ item.result }}</small>
        </article>
      </div>
    </article>

    <article class="system-panel integration-wide">
      <div class="system-panel-header">
        <ListChecks :size="18" />
        <h2>系统帮助 / 使用手册</h2>
      </div>
      <div class="help-grid">
        <article v-for="item in helpManual" :key="item.title">
          <strong>{{ item.title }}</strong>
          <span>{{ item.content }}</span>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'drill'" class="system-content-grid drill-layout">
    <article class="system-panel drill-wide">
      <div class="system-panel-header">
        <PlayCircle :size="18" />
        <h2>异常演练模式</h2>
      </div>
      <div class="drill-grid">
        <article v-for="scenario in drillScenarios" :key="scenario.title">
          <strong>{{ scenario.title }}</strong>
          <span v-for="step in scenario.steps" :key="step">{{ step }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel drill-wide">
      <div class="system-panel-header">
        <ShieldAlert :size="18" />
        <h2>权限审计日志</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head">
          <span>时间</span>
          <span>用户</span>
          <span>动作</span>
          <span>对象</span>
        </div>
        <div v-for="log in permissionAuditLogs" :key="log.time" class="asset-row">
          <span>{{ log.time }}</span>
          <span>{{ log.user }}</span>
          <span>{{ log.action }}</span>
          <strong>{{ log.target }}</strong>
        </div>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'search'" class="system-content-grid search-layout">
    <article class="system-panel search-wide">
      <div class="system-panel-header">
        <Search :size="18" />
        <h2>全局检索</h2>
      </div>
      <div class="global-search-box">输入关键词搜索种植批次、报警、工艺页面</div>
      <div class="search-results">
        <article v-for="item in globalSearchResults" :key="`${item.type}-${item.title}`">
          <strong>{{ item.type }} ·{{ item.title }}</strong>
          <span>{{ item.detail }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel search-wide">
      <div class="system-panel-header">
        <CalendarClock :size="18" />
        <h2>事件时间线</h2>
      </div>
      <div class="timeline">
        <article v-for="event in eventTimeline" :key="event.time" class="timeline-item info">
          <strong>{{ event.time }} ·{{ event.title }}</strong>
          <span>{{ event.detail }}</span>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'point'" class="system-content-grid point-layout">
    <article v-if="selectedPointProfile" class="system-panel point-wide">
      <div class="system-panel-header">
        <MapPinned :size="18" />
        <h2>点位详情</h2>
      </div>
      <div class="point-profile">
        <article><span>当前点位</span><strong>{{ selectedPointProfile.sensor.name }}</strong></article>
        <article><span>当前值</span><strong>{{ selectedPointProfile.sensor.reading.value.toFixed(1) }}{{ selectedPointProfile.sensor.reading.unit }}</strong></article>
        <article><span>阈值</span><strong>{{ selectedPointProfile.threshold }}</strong></article>
        <article><span>安装位置</span><strong>{{ selectedPointProfile.sensor.installPosition }}</strong></article>
        <article><span>三维坐标</span><strong>{{ selectedPointProfile.sensor.position.x }}, {{ selectedPointProfile.sensor.position.y }}, {{ selectedPointProfile.sensor.position.z }}</strong></article>
        <article><span>维护状态</span><strong>{{ selectedPointProfile.maintenance }}</strong></article>
        <article><span>关联报警</span><strong>{{ selectedPointProfile.alarms }}件</strong></article>
        <article><span>数据可信度</span><strong>{{ selectedPointProfile.trust }}</strong></article>
        <article><span>邻近点位</span><strong>{{ selectedPointProfile.neighbor }}</strong></article>
      </div>
      <TrendChart :sensor="selectedPointProfile.sensor" />
    </article>
  </section>

  <section v-else-if="activeView === 'explain'" class="system-content-grid explain-layout">
    <article class="system-panel">
      <div class="system-panel-header">
        <Settings2 :size="18" />
        <h2>规则解释器 <small>— 判断结论的依据与推导</small></h2>
      </div>
      <div class="suggestion-list">
        <article v-for="item in ruleExplanations" :key="item.decision">
          <strong>{{ item.decision }}</strong>
          <span v-for="evidence in item.evidence" :key="evidence">依据：{{ evidence }}</span>
          <p>结论：{{ item.conclusion }}</p>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <PlayCircle :size="18" />
        <h2>演练脚本库</h2>
      </div>
      <div class="drill-grid">
        <article v-for="script in demoScripts" :key="script.name">
          <strong>{{ script.name }}</strong>
          <span v-for="step in script.steps" :key="step">{{ step }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <ShieldAlert :size="18" />
        <h2>数据状态水印</h2>
      </div>
      <div class="setting-tags">
        <span v-for="badge in dataModeBadges" :key="badge">{{ badge }}</span>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <ListChecks :size="18" />
        <h2>图例与单位标准</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in legendItems" :key="item.label">
          <strong>{{ item.label }} ·{{ item.value }}</strong>
          <span>{{ item.note }}</span>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'delivery'" class="system-content-grid delivery-layout">
    <article class="system-panel">
      <div class="system-panel-header">
        <ClipboardList :size="18" />
        <h2>部署检查清单</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in deploymentChecklist" :key="item.item">
          <strong>{{ item.item }}</strong>
          <span>{{ item.value }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel">
      <div class="system-panel-header">
        <CheckCircle2 :size="18" />
        <h2>继续精调巡检</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in selfCheckItems" :key="item.item">
          <strong>{{ item.item }} ·{{ item.status }}</strong>
          <span>{{ item.detail }}</span>
        </article>
      </div>
    </article>

    <article class="system-panel delivery-wide">
      <div class="system-panel-header">
        <Target :size="18" />
        <h2>交付状态总览</h2>
      </div>
      <div class="delivery-grid">
        <article v-for="group in deliveryStatus" :key="group.group">
          <strong>{{ group.group }}</strong>
          <span v-for="item in group.items" :key="item">{{ item }}</span>
        </article>
      </div>
    </article>
  </section>

</template>

