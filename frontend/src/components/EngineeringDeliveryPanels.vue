<script setup lang="ts">
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  HeartPulse,
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
    | 'delivery'
    | 'acceptance'
    | 'presentation';
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
  dataAccessStatus: any[];
  sourceCredibility: any[];
  pointBusinessMapping: any[];
  pagePermissionMatrix: any[];
  demoFlowScenarios: any[];
  processSwimlanes: any[];
  presentationScript: any[];
  navItems: Array<{ key: string; label: string }>;
  runDemoScenario: (name: string) => void;
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
    v-if="['engineering', 'integration', 'drill', 'search', 'point', 'explain', 'delivery', 'acceptance', 'presentation'].includes(activeView)"
    title="交付总览"
    :cards="deliverySummaryCards"
  />

  <section v-if="activeView === 'engineering'" class="module-grid engineering-layout">
    <article class="panel-block engineering-wide">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block engineering-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'integration'" class="module-grid integration-layout">
    <article class="panel-block integration-wide">
      <div class="section-title">
        <MapPinned :size="18" />
        <h2>数据血缘 / 数据流视图</h2>
      </div>
      <div class="trace-chain horizontal">
        <span v-for="node in dataLineage" :key="node">{{ node }}</span>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block integration-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'drill'" class="module-grid drill-layout">
    <article class="panel-block drill-wide">
      <div class="section-title">
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

    <article class="panel-block drill-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'search'" class="module-grid search-layout">
    <article class="panel-block search-wide">
      <div class="section-title">
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

    <article class="panel-block search-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'point'" class="module-grid point-layout">
    <article v-if="selectedPointProfile" class="panel-block point-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'explain'" class="module-grid explain-layout">
    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
        <ShieldAlert :size="18" />
        <h2>数据状态水印</h2>
      </div>
      <div class="setting-tags">
        <span v-for="badge in dataModeBadges" :key="badge">{{ badge }}</span>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
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

  <section v-else-if="activeView === 'delivery'" class="module-grid delivery-layout">
    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block">
      <div class="section-title">
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

    <article class="panel-block delivery-wide">
      <div class="section-title">
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

  <section v-else-if="activeView === 'acceptance'" class="module-grid acceptance-layout">
    <article class="panel-block acceptance-wide">
      <div class="section-title">
        <CheckCircle2 :size="18" />
        <h2>系统交付验收清单</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head acceptance-row">
          <span>类别</span>
          <span>验收项</span>
          <span>状态</span>
          <span>责任人</span>
        </div>
        <div v-for="item in acceptanceChecklist" :key="item.item" class="asset-row acceptance-row">
          <strong>{{ item.item }}</strong>
          <span>{{ item.status }}</span>
          <span>{{ item.owner }}</span>
          <small>{{ item.note }}</small>
        </div>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <Database :size="18" />
        <h2>数据接入状态看板</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in dataAccessStatus" :key="item.system">
          <strong>{{ item.system }} ·{{ item.status }}</strong>
          <span>{{ item.purpose }}</span>
          <p>{{ item.blocker }}</p>
        </article>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <HeartPulse :size="18" />
        <h2>数据可信度标识</h2>
      </div>
      <div class="suggestion-list">
        <article v-for="item in sourceCredibility" :key="item.conclusion">
          <strong>{{ item.conclusion }} ·{{ item.confidence }}</strong>
          <span>{{ item.source }} ·{{ item.type }}</span>
          <p>{{ item.note }}</p>
        </article>
      </div>
    </article>

    <article class="panel-block acceptance-wide">
      <div class="section-title">
        <MapPinned :size="18" />
        <h2>点位-业务映射</h2>
      </div>
      <div class="review-grid">
        <article v-for="item in pointBusinessMapping" :key="item.hardware">
          <span>{{ item.hardware }}</span>
          <strong>{{ item.business }}</strong>
          <small>{{ item.evidence }}</small>
        </article>
      </div>
    </article>

    <article class="panel-block acceptance-wide">
      <div class="section-title">
        <ShieldAlert :size="18" />
        <h2>页面权限矩阵</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head permission-row">
          <span>角色</span>
          <span>功能页面</span>
          <span>权限</span>
        </div>
        <div v-for="item in pagePermissionMatrix" :key="item.role" class="asset-row permission-row">
          <strong>{{ item.role }}</strong>
          <span>{{ item.pages }}</span>
          <small>{{ item.authority }}</small>
        </div>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'presentation'" class="module-grid presentation-layout">
    <article class="panel-block presentation-wide">
      <div class="section-title">
        <PlayCircle :size="18" />
        <h2>一键演示模式</h2>
      </div>
      <div class="review-grid">
        <button
          v-for="item in demoFlowScenarios"
          :key="item.name"
          class="demo-card"
          type="button"
          @click="runDemoScenario(item.name === '正常运行' ? '恢复正常' : item.name)"
        >
          <span>{{ item.name }}</span>
          <strong>{{ item.effect }}</strong>
          <small>{{ navItems.find((nav) => nav.key === item.view)?.label ?? item.view }}</small>
        </button>
      </div>
    </article>

    <article class="panel-block presentation-wide">
      <div class="section-title">
        <Layers :size="18" />
        <h2>流程泳道视图</h2>
      </div>
      <div class="delivery-grid">
        <article v-for="lane in processSwimlanes" :key="lane.role">
          <strong>{{ lane.role }}</strong>
          <span v-for="step in lane.steps" :key="step">{{ step }}</span>
        </article>
      </div>
    </article>

    <article class="panel-block presentation-wide">
      <div class="section-title">
        <FileText :size="18" />
        <h2>汇报演示脚本</h2>
      </div>
      <div class="asset-table">
        <div class="asset-row head script-row">
          <span>步骤</span>
          <span>场景</span>
          <span>页面</span>
          <span>重点</span>
        </div>
        <div v-for="item in presentationScript" :key="item.step" class="asset-row script-row">
          <strong>{{ item.step }}</strong>
          <span>{{ item.title }}</span>
          <span>{{ item.view }}</span>
          <small>{{ item.highlight }}</small>
        </div>
      </div>
    </article>
  </section>
</template>

