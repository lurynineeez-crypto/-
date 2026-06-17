<script setup lang="ts">
import {
  Activity,
  BarChart3,
  Box,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Gauge,
  HeartPulse,
  Layers,
  Lightbulb,
  ListChecks,
  MapPinned,
  Monitor,
  Power,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sprout,
  Target,
  TrendingUp
} from 'lucide-vue-next';
import type { ViewKey } from '../types';

type BatchProfile = {
  id: string;
  crop: string;
  cabin: string;
  startDate: string;
  currentStage: string;
  expectedHarvest: string;
};

type MetricItem = {
  label: string;
  value: string;
  detail?: string;
};

type StageComplianceItem = {
  metric: string;
  value: string;
  issue: string;
};

type YieldCorrelationItem = {
  label: string;
  value: string;
  note: string;
};

type GrowthStage = {
  name: string;
  temp: string;
  humidity: string;
  co2: string;
  light: string;
  strategy: string;
};

const props = defineProps<{
  activeView:
    | 'batch'
    | 'growth'
    | 'recipe'
    | 'calendar'
    | 'biosecurity'
    | 'production'
    | 'harvest'
    | 'experience'
    | 'closure'
    | 'reviewMeeting'
    | 'quality'
    | 'director'
    | 'economics'
    | 'collaboration'
    | 'strategy';
  batchMetrics: MetricItem[];
  batchProfile: BatchProfile;
  stageCompliance: StageComplianceItem[];
  yieldCorrelation: YieldCorrelationItem[];
  growthStages: GrowthStage[];
  summaryStage?: string;
  goldenEarRecipes: any[];
  stageAutoDecision: { decision: string; basis: string[] };
  growthPressure: any[];
  comfortZones: any[];
  cultivationCalendar: any[];
  deviationDurations: any[];
  harvestPrediction: { window: string; confidence: string; factors: string[] };
  yieldImpact: any[];
  batchComparison: any[];
  cultivationOperationTemplates: string[];
  cleanoutFlow: string[];
  biosecurityRecords: any[];
  cultivationKnowledge: any[];
  recipeVersions: any[];
  cultureBagArchives: any[];
  contaminationRiskRecords: any[];
  morphologyRecords: any[];
  rackMicroclimateRanking: any[];
  bagLossMetrics: any[];
  harvestGrades: any[];
  rackYieldRecords: any[];
  energyYieldEfficiency: any[];
  processOptimizationAdvice: any[];
  multiBatchExperience: any[];
  anomalyDisposalLevels: any[];
  isolationFlow: string[];
  dynamicHarvestWindow: any[];
  yieldLossEstimations: any[];
  bagLifecycleNodes: any[];
  operationImpactAssessments: any[];
  maturityIndex: { value: number; parts: any[] };
  rackReviewReports: any[];
  parameterDeviationAudit: any[];
  reviewMeetingCards: any[];
  reviewMeetingActions: any[];
  processConsistency: any[];
  ccpControls: any[];
  cqaAttributes: any[];
  capaRecords: any[];
  batchLockRules: any[];
  qualityRuleLibrary: any[];
  directorDashboard: Record<string, string>;
  batchRiskRadar: any[];
  stageReleaseChecks: any[];
  harvestPrecheck: any[];
  batchCostAccounting: any[];
  environmentYieldContribution: any[];
  reproducibilityScore: { score: number | string; verdict: string; reasons: string[] };
  productionKpis: any[];
  sopDeviationAnalysis: any[];
  evidenceChainScore: { score: number | string; missing: string[]; items: any[] };
  responsibilityMatrix: any[];
  nextBatchRecommendation: any[];
  knowledgeCards: any[];
  handoverTemplates: any[];
  eventRulesCenter: any[];
  parameterSandbox: any[];
  optimizationModes: any[];
  batchProfileTags: any[];
  exceptionManagement: any[];
  benchmarkLibrary: any[];
  navItems: Array<{ key: ViewKey; label: string }>;
}>();

const lifecycleSteps = [
  { order: 1, name: '入舱建档', stage: '入舱', focus: '批次、品种、舱体、入舱时间' },
  { order: 2, name: '菌丝恢复', stage: '菌丝恢复期', focus: '温湿度稳定、CO2 回落、设备响应' },
  { order: 3, name: '子实体生长', stage: '子实体生长期', focus: '湿度、CO2、光照和层间均匀性' },
  { order: 4, name: '采收评估', stage: '采收期', focus: '成熟度、采收窗口、质量分级' },
  { order: 5, name: '清舱复盘', stage: '清舱期', focus: '异常归档、损耗核算、下批建议' }
];

</script>

<template>
  <section v-if="activeView === 'batch'" class="module-grid batch-layout lifecycle-layout batch-command-view">
    <article class="panel-block lifecycle-wide batch-command-hero">
      <div>
        <span>当前批次</span>
        <strong>{{ batchProfile.id }}</strong>
        <small>{{ batchProfile.crop }} · {{ batchProfile.cabin }}</small>
      </div>
      <div>
        <span>当前阶段</span>
        <strong>{{ batchProfile.currentStage }}</strong>
        <small>预计采收 {{ batchProfile.expectedHarvest }}</small>
      </div>
      <div>
        <span>阶段判断</span>
        <strong>{{ stageAutoDecision.decision }}</strong>
        <small>{{ stageAutoDecision.basis[0] }}</small>
      </div>
      <div>
        <span>下一步</span>
        <strong>复核后放行</strong>
        <small>确认下层湿度与 CO2 回落曲线</small>
      </div>
      <footer class="batch-stage-actions">
        <button type="button">查看阶段条件</button>
        <button type="button">提交复核</button>
        <button type="button">记录放行意见</button>
      </footer>
    </article>

    <article class="panel-block lifecycle-wide">
      <div class="section-title">
        <ListChecks :size="18" />
        <h2>种植生命周期进度</h2>
      </div>
      <div class="lifecycle-progress">
        <article
          v-for="step in lifecycleSteps"
          :key="step.name"
          :class="['lifecycle-step', { current: step.stage === batchProfile.currentStage, done: step.order < 3 }]"
        >
          <span>{{ String(step.order).padStart(2, '0') }}</span>
          <strong>{{ step.name }}</strong>
          <small>{{ step.focus }}</small>
        </article>
      </div>
    </article>

    <article class="panel-block batch-card batch-profile-card">
      <div class="section-title">
        <ClipboardList :size="18" />
        <h2>当前种植批次</h2>
      </div>
      <dl>
        <dt>批次编号</dt>
        <dd>{{ batchProfile.id }}</dd>
        <dt>品种</dt>
        <dd>{{ batchProfile.crop }}</dd>
        <dt>方舱</dt>
        <dd>{{ batchProfile.cabin }}</dd>
        <dt>入舱日期</dt>
        <dd>{{ batchProfile.startDate }}</dd>
        <dt>当前阶段</dt>
        <dd>{{ batchProfile.currentStage }}</dd>
        <dt>预计采收</dt>
        <dd>{{ batchProfile.expectedHarvest }}</dd>
      </dl>
    </article>

    <article class="panel-block batch-metric-card">
      <div class="section-title">
        <Gauge :size="18" />
        <h2>批次运行摘要</h2>
      </div>
      <div class="batch-metrics">
        <article v-for="item in batchMetrics" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.detail }}</small>
        </article>
      </div>
    </article>

    <article class="panel-block batch-compliance-card">
      <div class="section-title">
        <FileText :size="18" />
        <h2>阶段合规报告</h2>
      </div>
      <div class="review-grid">
        <article v-for="item in stageCompliance" :key="item.metric">
          <span>{{ item.metric }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.issue }}</small>
        </article>
      </div>
    </article>

    <article class="panel-block batch-wide">
      <div class="section-title">
        <Sprout :size="18" />
        <h2>产量与环境关联</h2>
      </div>
      <div class="correlation-grid">
        <article>
          <strong>手工产量录入</strong>
          
        </article>
        <article>
          <strong>批次环境画像</strong>
          
        </article>
        <article>
          <strong>高产经验沉淀</strong>
          
        </article>
      </div>
      <div class="review-grid yield-grid">
        <article v-for="item in yieldCorrelation" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.note }}</small>
        </article>
      </div>
    </article>
  </section>
  <section v-else-if="activeView === 'growth'" class="module-grid growth-layout">
    <article class="panel-block growth-wide stage-release-card">
      <div class="section-title">
        <Sprout :size="18" />
        <h2>当前阶段管理</h2>
      </div>
      <div class="stage-status-grid">
        <div>
          <span>当前阶段</span>
          <strong>{{ summaryStage ?? batchProfile.currentStage }}</strong>
          <small>与批次生命周期进度联动，用于判断是否继续保持、调整或进入下一阶段。</small>
        </div>
        <div>
          <span>阶段目标</span>
          <strong>稳湿、控 CO2、保持补光</strong>
          
        </div>
      </div>
      <div class="stage-action-strip">
        <article>
          <span>是否可放行</span>
          <strong>待复核</strong>
          <small>需确认湿度和 CO2 回落曲线连续稳定。</small>
        </article>
        <article>
          <span>进入下一阶段条件</span>
          <strong>环境稳定 + 安全无报警</strong>
          <small>完成复核后再进入下一阶段。</small>
        </article>
      </div>
    </article>

    <article
      v-for="stage in growthStages"
      :key="stage.name"
      :class="['panel-block stage-card', { current: summaryStage === stage.name }]"
    >
      <div class="section-title">
        <Sprout :size="18" />
        <h2>{{ stage.name }}</h2>
      </div>
      <div class="stage-specs">
        <span>温度 <strong>{{ stage.temp }}</strong></span>
        <span>湿度 <strong>{{ stage.humidity }}</strong></span>
        <span>CO2 <strong>{{ stage.co2 }}</strong></span>
        <span>光照 <strong>{{ stage.light }}</strong></span>
      </div>
      <p>{{ stage.strategy }}</p>
    </article>

    <article class="panel-block growth-wide">
      <div class="section-title">
        <CheckCircle2 :size="18" />
        <h2>阶段放行判断</h2>
      </div>
      <div class="review-grid">
        <article>
          <span>环境稳定</span>
          <strong>待观察</strong>
          <small>湿度和 CO2 需要连续稳定后再切换阶段。</small>
        </article>
        <article>
          <span>设备响应</span>
          <strong>正常</strong>
          <small>空调、加湿、新风、LED 均使用现有设备状态判断。</small>
        </article>
        <article>
          <span>空间均匀性</span>
          <strong>需关注</strong>
          <small>重点看上下层温湿度和光照差异。</small>
        </article>
      </div>
    </article>
  </section>
  <section v-else-if="activeView === 'recipe'" class="module-grid recipe-layout">
      <article class="panel-block recipe-wide">
        <div class="section-title">
          <Sprout :size="18" />
          <h2>金耳生长工艺配方</h2>
        </div>
        <div class="recipe-grid">
          <article v-for="recipe in goldenEarRecipes" :key="recipe.stage">
            <strong>{{ recipe.stage }} / {{ recipe.days }}</strong>
            <span>温度 {{ recipe.temp }} · 湿度 {{ recipe.humidity }} · CO2 {{ recipe.co2 }}</span>
            <span>光照 {{ recipe.light }} · 通风 {{ recipe.ventilation }} · 加湿 {{ recipe.humidify }}</span>
            <small>风险：{{ recipe.risk }} · 要点：{{ recipe.action }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Target :size="18" />
          <h2>阶段自动判定逻辑</h2>
        </div>
        <div class="growth-state">
          <strong>{{ stageAutoDecision.decision }}</strong>
          <span v-for="item in stageAutoDecision.basis" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <HeartPulse :size="18" />
          <h2>生长压力指数</h2>
        </div>
        <div class="uniformity-grid">
          <article v-for="item in growthPressure" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.level }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <SlidersHorizontal :size="18" />
          <h2>阶段切换建议</h2>
        </div>
        <div class="threshold-list">
          <article>
            <strong>{{ stageAutoDecision.decision }}</strong>
            
          </article>
          <article>
              <strong>舒适区图谱</strong>
            
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <MapPinned :size="18" />
          <h2>环境舒适区图谱</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in comfortZones" :key="item.name">
            <strong>{{ item.name }} / {{ item.zone }}</strong>
            <span>{{ item.value }}</span>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'calendar'" class="module-grid calendar-layout">
      <article class="panel-block">
        <div class="section-title">
          <CalendarClock :size="18" />
          <h2>种植日历</h2>
        </div>
        <div class="timeline">
          <article v-for="item in cultivationCalendar" :key="item.day" class="timeline-item info">
            <strong>{{ item.day }} / {{ item.event }}</strong>
            <span>{{ item.status }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>累计偏离时长</h2>
        </div>
        <div class="uniformity-grid">
          <article v-for="item in deviationDurations" :key="item.metric">
            <span>{{ item.metric }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.impact }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>采收窗口预测</h2>
        </div>
        <div class="growth-state">
          <strong>{{ harvestPrediction.window }}</strong>
          <span>缃俊搴︼細{{ harvestPrediction.confidence }}</span>
          <span v-for="factor in harvestPrediction.factors" :key="factor">{{ factor }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>异常对产量影响估算</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in yieldImpact" :key="item.abnormal">
            <strong>{{ item.abnormal }} / {{ item.level }}</strong>
            <span>{{ item.note }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block calendar-wide">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>批次对比</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>批次</span>
            <span>评分</span>
            <span>报警</span>
            <span>采收</span>
            <span>特征</span>
          </div>
          <div v-for="item in batchComparison" :key="item.batch" class="asset-row calibration-row">
            <span>{{ item.batch }}</span>
            <span>{{ item.score }}</span>
            <span>{{ item.alarms }}</span>
            <span>{{ item.harvest }}</span>
            <strong>{{ item.feature }}</strong>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'biosecurity'" class="module-grid bio-layout">
      <article class="panel-block">
        <div class="section-title">
          <ClipboardList :size="18" />
          <h2>栽培操作记录模板</h2>
        </div>
        <div class="setting-tags">
          <span v-for="item in cultivationOperationTemplates" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CheckCircle2 :size="18" />
          <h2>清舱消毒流程</h2>
        </div>
        <div class="trace-chain">
          <span v-for="item in cleanoutFlow" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>生物安全记录</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in biosecurityRecords" :key="item.item">
            <strong>{{ item.item }}</strong>
            <span>{{ item.value }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <FileText :size="18" />
          <h2>种植知识库</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in cultivationKnowledge" :key="item.title">
            <strong>{{ item.title }}</strong>
            <span>原因：{{ item.reason }}</span>
            <p>处理：{{ item.action }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block bio-wide">
        <div class="section-title">
          <Settings2 :size="18" />
          <h2>工艺参数版本管理</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in recipeVersions" :key="item.version">
            <span>{{ item.version }}</span>
            <strong>{{ item.feature }}</strong>
            <small>绑定：{{ item.bound }}</small>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'production'" class="module-grid production-layout">
      <article class="panel-block production-wide production-metrics">
        <div class="section-title">
          <Box :size="18" />
          <h2>菌包生产作业总览</h2>
        </div>
        <div class="stage-status-grid">
          <div>
            <span>当前作业</span>
            <strong>菌包状态跟踪</strong>
            
          </div>
          <div>
            <span>风险关注</span>
            <strong>污染、畸形、层间差异</strong>
            
          </div>
        </div>
        <div class="production-summary-grid">
          <article>
            <span>菌包档案</span>
            <strong>{{ cultureBagArchives.length }}</strong>
            <small>批次记录已全部归属当前生命周期</small>
          </article>
          <article>
            <span>风险点位</span>
            <strong>{{ contaminationRiskRecords.length }}</strong>
            <small>关注污染、畸形和层间差异</small>
          </article>
          <article>
            <span>异常样本</span>
            <strong>{{ morphologyRecords.length }}</strong>
            <small>用于沉淀处理经验和复盘依据</small>
          </article>
          <article>
            <span>当前最佳层架</span>
            <strong>{{ rackMicroclimateRanking[0]?.rack ?? '未排序' }}</strong>
            <small>评分 {{ rackMicroclimateRanking[0]?.score ?? '-' }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>污染风险管理</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in contaminationRiskRecords" :key="item.area">
            <strong>{{ item.area }} · {{ item.risk }} · {{ item.level }}风险</strong>
            <span>依据：{{ item.source }}</span>
            <p>{{ item.action }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block production-wide">
        <div class="section-title">
          <Box :size="18" />
          <h2>菌包批次档案</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>菌包批号</span>
            <span>层架</span>
            <span>数量</span>
            <span>状态</span>
            <span>损耗率</span>
            <span>备注</span>
          </div>
          <div v-for="item in cultureBagArchives" :key="item.id" class="asset-row production-row">
            <strong>{{ item.id }}</strong>
            <span>{{ item.rack }}</span>
            <span>{{ item.count }}包</span>
            <span>{{ item.status }}</span>
            <span>{{ item.lossRate }}</span>
            <small>{{ item.note }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <FileText :size="18" />
          <h2>异常形态记录</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in morphologyRecords" :key="item.symptom">
            <strong>{{ item.symptom }} · {{ item.layer }} · {{ item.severity }}</strong>
            <span>关联环境：{{ item.linked }}</span>
            <p>处理：{{ item.action }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block production-wide">
        <div class="section-title">
          <Layers :size="18" />
          <h2>层架微环境排行</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in rackMicroclimateRanking" :key="item.rack">
            <span>#{{ item.rank }} {{ item.rack }}</span>
            <strong>{{ item.score }}分</strong>
            <small>{{ item.temperature }} · {{ item.humidity }} · {{ item.co2 }}</small>
            <p>{{ item.conclusion }}</p>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'harvest'" class="module-grid harvest-layout">
      <article class="panel-block harvest-wide harvest-metrics">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>采收质量总览</h2>
        </div>
        <div class="stage-status-grid">
          <div>
            <span>采收窗口</span>
            <strong>{{ harvestPrediction.window }}</strong>
            <small>置信度 {{ harvestPrediction.confidence }}，结合当前成熟度和环境波动判断。</small>
          </div>
          <div>
            <span>成熟度判断</span>
            <strong>{{ maturityIndex.value }}分</strong>
            
          </div>
        </div>
        <div class="stage-action-strip">
          <article>
            <span>质量风险</span>
            <strong>关注下层一致性</strong>
            <small>下层湿度波动会影响采收分级稳定性。</small>
          </article>
          <article>
            <span>建议采收动作</span>
            <strong>窗口前完成成熟度复核</strong>
            <small>先复核异常层架，再确认采收顺序。</small>
          </article>
        </div>
        <div class="production-summary-grid harvest-summary">
          <article>
            <span>采收关注</span>
            <strong>{{ harvestPrediction.factors.length }}</strong>
            <small>窗口判断依据</small>
          </article>
          <article>
            <span>层架产量</span>
            <strong>{{ rackYieldRecords.length }}</strong>
            <small>参与分级统计的层架</small>
          </article>
          <article>
            <span>分级记录</span>
            <strong>{{ harvestGrades.length }}</strong>
            <small>用于采收质量对照</small>
          </article>
          <article>
            <span>能效项</span>
            <strong>{{ energyYieldEfficiency.length }}</strong>
            <small>采收和能耗联动参考</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>菌包损耗率 / 成品率</h2>
        </div>
        <div class="uniformity-grid">
          <article v-for="item in bagLossMetrics" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.detail }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CheckCircle2 :size="18" />
          <h2>采收分级记录</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in harvestGrades" :key="item.grade">
            <strong>{{ item.grade }} / {{ item.weight }} / {{ item.rate }}</strong>
            <span>{{ item.standard }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block harvest-wide">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>层架产量记录</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>层架</span>
            <span>产量</span>
            <span>A级率</span>
            <span>湿度均值</span>
            <span>报警</span>
            <span>建议</span>
          </div>
          <div v-for="item in rackYieldRecords" :key="item.rack" class="asset-row production-row">
            <strong>{{ item.rack }}</strong>
            <span>{{ item.yield }}</span>
            <span>{{ item.gradeA }}</span>
            <span>{{ item.humidity }}</span>
            <span>{{ item.alarms }}次</span>
            <small>{{ item.advice }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block harvest-wide">
        <div class="section-title">
          <Power :size="18" />
          <h2>能耗与产量效率</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in energyYieldEfficiency" :key="item.item">
            <span>{{ item.item }}</span>
            <strong>{{ item.efficiency }}</strong>
            <small>运行 {{ item.runtime }}</small>
            <p>{{ item.judgement }}</p>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'experience'" class="module-grid experience-layout">
      <article class="panel-block experience-wide">
        <div class="section-title">
          <Lightbulb :size="18" />
          <h2>工艺优化建议</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in processOptimizationAdvice" :key="item.title">
            <strong>{{ item.title }}</strong>
            <span>证据：{{ item.evidence }}</span>
            <p>{{ item.suggestion }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block experience-wide">
        <div class="section-title">
          <Database :size="18" />
          <h2>多批次经验库</h2>
      </div>
        <div class="review-grid">
          <article v-for="item in multiBatchExperience" :key="item.pattern">
            <span>{{ item.pattern }}</span>
            <strong>{{ item.result }}</strong>
            <small>适用：{{ item.apply }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Target :size="18" />
          <h2>下一批次复用目标</h2>
        </div>
        <div class="growth-state">
          <strong>以下层高产参数作为基线</strong>
          <span>目标：湿度达标率≥92%，CO2超限≤3次/天；验收进入批次复盘</span>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'closure'" class="module-grid closure-layout">
      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>种植异常分级处置</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in anomalyDisposalLevels" :key="item.level">
            <strong>{{ item.level }} / {{ item.example }}</strong>
            <span>触发：{{ item.trigger }}</span>
            <p>处置：{{ item.response }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CheckCircle2 :size="18" />
          <h2>污染隔离流程</h2>
        </div>
        <div class="trace-chain">
          <span v-for="item in isolationFlow" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CalendarClock :size="18" />
          <h2>采收窗口动态调整</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in dynamicHarvestWindow" :key="item.factor">
            <strong>{{ item.factor }} / {{ item.effect }}</strong>
            <span>依据：{{ item.evidence }}</span>
            <p>{{ item.decision }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>产量损失估算</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in yieldLossEstimations" :key="item.abnormal">
            <strong>{{ item.abnormal }} / {{ item.loss }}</strong>
            <span>依据：{{ item.basis }}</span>
            <p>{{ item.action }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block closure-wide">
        <div class="section-title">
          <Box :size="18" />
          <h2>菌包生命周期追踪</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head lifecycle-row">
            <span>节点</span>
            <span>时间</span>
            <span>责任人</span>
            <span>证据</span>
            <span>状态</span>
          </div>
          <div v-for="item in bagLifecycleNodes" :key="item.node" class="asset-row lifecycle-row">
            <strong>{{ item.node }}</strong>
            <span>{{ item.time }}</span>
            <span>{{ item.owner }}</span>
            <span>{{ item.evidence }}</span>
            <small>{{ item.status }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block closure-wide">
        <div class="section-title">
          <Activity :size="18" />
          <h2>操作影响评估</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in operationImpactAssessments" :key="item.operation">
            <span>{{ item.time }} / {{ item.operation }}</span>
            <strong>{{ item.impact }}</strong>
            <small>{{ item.recovery }}</small>
            <p>{{ item.conclusion }}</p>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'reviewMeeting'" class="module-grid review-meeting-layout">
      <article class="panel-block">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>批次成熟度指数 <small>— 距采收窗口的进度</small></h2>
        </div>
        <div class="score-card">
          <strong>{{ maturityIndex.value }}%</strong>
          <span>综合运行天数、环境评分、形态记录和阶段合规</span>
        </div>
        <div class="uniformity-grid">
          <article v-for="item in maturityIndex.parts" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.detail }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Layers :size="18" />
          <h2>单层架复盘</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in rackReviewReports" :key="item.rack">
            <span>{{ item.rack }} · 达标率 {{ item.targetRate }}</span>
            <strong>{{ item.yield }} / A级率 {{ item.gradeA }}</strong>
            <small>报警 {{ item.alarms }} 次</small>
            <p>{{ item.decision }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block review-meeting-wide">
        <div class="section-title">
          <SlidersHorizontal :size="18" />
          <h2>参数偏差审计</h2>
        </div>
        <p class="decision-note">偏差审计明细已合一至工程交付视图，此处仅显示条数：{{ parameterDeviationAudit.length }}项</p>
      </article>

      <article class="panel-block review-meeting-wide">
        <div class="section-title">
          <ClipboardList :size="18" />
          <h2>种植复盘会议</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in reviewMeetingCards" :key="item.title">
            <span>{{ item.title }}</span>
            <strong>{{ item.content }}</strong>
          </article>
        </div>
      </article>

      <article class="panel-block review-meeting-wide">
        <div class="section-title">
          <ListChecks :size="18" />
          <h2>会议行动项</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head action-row">
            <span>行动项</span>
            <span>责任人</span>
            <span>截止</span>
            <span>状态</span>
            <span>复核</span>
          </div>
          <div v-for="item in reviewMeetingActions" :key="item.action" class="asset-row action-row">
            <strong>{{ item.action }}</strong>
            <span>{{ item.owner }}</span>
            <span>{{ item.due }}</span>
            <small>{{ item.status }}</small>
            <small>{{ item.owner === '种植负责人' ? '管理者' : '种植负责人' }}</small>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'quality'" class="module-grid quality-layout">
      <article class="panel-block quality-wide">
        <div class="section-title">
          <Activity :size="18" />
          <h2>工艺执行一致性</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head consistency-row">
            <span>项目</span>
            <span>目标</span>
            <span>实际</span>
            <span>偏差</span>
            <span>结论</span>
          </div>
          <div v-for="item in processConsistency" :key="item.item" class="asset-row consistency-row">
            <strong>{{ item.item }}</strong>
            <span>{{ item.target }}</span>
            <span>{{ item.actual }}</span>
            <span>{{ item.deviation }}</span>
            <small>{{ item.verdict }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Target :size="18" />
          <h2>关键控制点 CCP</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in ccpControls" :key="item.code">
            <strong>{{ item.code }} / {{ item.name }}</strong>
            <span>限值：{{ item.limit }}</span>
            <p>{{ item.monitor }} · {{ item.action }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CheckCircle2 :size="18" />
          <h2>关键质量属性 CQA</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in cqaAttributes" :key="item.name">
            <strong>{{ item.name }} / {{ item.current }}</strong>
            <span>目标：{{ item.target }}；方法：{{ item.method }}</span>
            <p>风险：{{ item.risk }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block quality-wide">
        <div class="section-title">
          <ClipboardList :size="18" />
          <h2>工艺偏差 CAPA</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head capa-row">
            <span>偏差</span>
            <span>纠正措施</span>
            <span>预防措施</span>
            <span>责任人</span>
            <span>验证</span>
          </div>
          <div v-for="item in capaRecords" :key="item.deviation" class="asset-row capa-row">
            <strong>{{ item.deviation }}</strong>
            <span>{{ item.correction }}</span>
            <span>{{ item.prevention }}</span>
            <span>{{ item.owner }}</span>
            <small>{{ item.verify }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>批次冻结/锁定</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in batchLockRules" :key="item.trigger">
            <strong>{{ item.trigger }}</strong>
            <span>锁定：{{ item.lock }}</span>
            <p>例外：{{ item.exception }}；证据：{{ item.evidence }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <FileText :size="18" />
          <h2>质量判定规则库</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in qualityRuleLibrary" :key="item.grade">
            <span>{{ item.grade }}</span>
            <strong>{{ item.rule }}</strong>
            <small>{{ item.action }}</small>
          </article>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'director'" class="module-grid director-layout">
      <article class="panel-block director-wide">
        <div class="section-title">
          <Monitor :size="18" />
          <h2>种植主任工作台</h2>
        </div>
        <div class="director-summary-grid">
          <article>
            <span>今日放行结论</span>
            <strong>{{ directorDashboard.release }}</strong>
            <small>{{ directorDashboard.decision }}</small>
          </article>
          <article>
            <span>最大风险</span>
            <strong>{{ directorDashboard.mainRisk }}</strong>
          <small>责任：{{ directorDashboard.owner }}</small>
          </article>
          <article>
            <span>预计损失</span>
            <strong>{{ directorDashboard.estimatedLoss }}</strong>
            <small>{{ directorDashboard.nextBatchChange }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>批次风险预警雷达</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in batchRiskRadar" :key="item.risk">
            <span>{{ item.risk }} / {{ item.level }}</span>
            <strong>{{ item.score }}</strong>
            <small>{{ item.reason }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ListChecks :size="18" />
          <h2>阶段放行机制</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in stageReleaseChecks" :key="item.item">
            <strong>{{ item.item }} / {{ item.passed ? '通过' : '暂缓' }}</strong>
            <span>标准：{{ item.standard }}</span>
            <p>结果：{{ item.result }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block director-wide">
        <div class="section-title">
          <ClipboardList :size="18" />
          <h2>采收前检查清单</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head precheck-row">
            <span>检查项</span>
            <span>要求</span>
            <span>状态</span>
            <span>责任人</span>
            <span>复核人</span>
            <span>证据</span>
          </div>
          <div v-for="item in harvestPrecheck" :key="item.item" class="asset-row precheck-row">
            <strong>{{ item.item }}</strong>
            <span>{{ item.requirement }}</span>
            <span>{{ item.status }}</span>
            <small>{{ item.owner }}</small>
            <small>{{ item.reviewer }}</small>
            <small>{{ item.evidence }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block director-wide">
        <div class="section-title">
          <Lightbulb :size="18" />
          <h2>主任决策建议</h2>
        </div>
        <div class="growth-state">
          <strong>{{ directorDashboard.decision }}</strong>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'economics'" class="module-grid economics-layout">
      <article class="panel-block economics-wide">
        <div class="section-title">
          <Database :size="18" />
          <h2>单批次成本核算</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in batchCostAccounting" :key="item.item">
            <span>{{ item.item }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.basis }}</small>
            <p>{{ item.trend }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>环境-产量贡献分析</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in environmentYieldContribution" :key="item.factor">
            <strong>{{ item.factor }} / {{ item.contribution }}</strong>
            <span>{{ item.evidence }}</span>
            <p>{{ item.conclusion }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Target :size="18" />
          <h2>批次可复制性评估</h2>
        </div>
        <div class="score-card">
          <strong>{{ reproducibilityScore.score }}</strong>
          <span>{{ reproducibilityScore.verdict }}</span>
        </div>
        <div class="threshold-list">
          <article v-for="item in reproducibilityScore.reasons" :key="item">
            <strong>{{ item }}</strong>
            <span>用于判断是否沉淀为下一批次模板。</span>
          </article>
        </div>
      </article>

      <article class="panel-block economics-wide">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>生产KPI看板</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head kpi-row">
            <span>KPI</span>
            <span>当前值</span>
            <span>目标</span>
            <span>状态</span>
          </div>
          <div v-for="item in productionKpis" :key="item.name" class="asset-row kpi-row">
            <strong>{{ item.name }}</strong>
            <span>{{ item.value }}</span>
            <span>{{ item.target }}</span>
            <small>{{ item.status }}</small>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="activeView === 'collaboration'" class="module-grid collaboration-layout">
      <article class="panel-block collaboration-wide">
        <div class="section-title">
          <ListChecks :size="18" />
          <h2>标准作业偏离分析</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head sop-row">
            <span>SOP</span>
            <span>要求</span>
            <span>实际</span>
            <span>偏差</span>
            <span>动作</span>
          </div>
          <div v-for="item in sopDeviationAnalysis" :key="item.sop" class="asset-row sop-row">
            <strong>{{ item.sop }}</strong>
            <span>{{ item.required }}</span>
            <span>{{ item.actual }}</span>
            <span>{{ item.deviation }}</span>
            <small>{{ item.action }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>证据链完整性评估 <small>— 报告是否可追溯</small></h2>
        </div>
        <div class="score-card">
          <strong>{{ evidenceChainScore.score }}</strong>
          <span>缺口：{{ evidenceChainScore.missing.join('、') }}</span>
        </div>
        <div class="threshold-list">
          <article v-for="item in evidenceChainScore.items" :key="item.item">
            <strong>{{ item.item }} / {{ item.status }}</strong>
            <span>{{ item.detail }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ClipboardList :size="18" />
          <h2>班组责任矩阵</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in responsibilityMatrix" :key="item.matter">
            <strong>{{ item.matter }} / {{ item.owner }}</strong>
            <span>协同：{{ item.support }}；截止：{{ item.deadline }}</span>
            <p>证据：{{ item.evidence }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block collaboration-wide">
        <div class="section-title">
          <FileText :size="18" />
          <h2>下一批次工艺推荐单</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in nextBatchRecommendation" :key="item.section">
            <span>{{ item.section }}</span>
            <strong>{{ item.content }}</strong>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Lightbulb :size="18" />
          <h2>种植知识沉淀卡片</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in knowledgeCards" :key="item.title">
            <strong>{{ item.title }}</strong>
            <span>条件：{{ item.condition }}</span>
            <p>{{ item.lesson }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <CalendarClock :size="18" />
          <h2>交接班专业模板</h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in handoverTemplates" :key="item.role">
            <strong>{{ item.role }}</strong>
            <span>风险：{{ item.risk }} · 待办：{{ item.todo }}</span>
            <p>禁止：{{ item.forbidden }} · 明日重点：{{ item.tomorrow }}</p>
          </article>
        </div>
      </article>
    </section>


    <section v-else-if="activeView === 'strategy'" class="module-grid strategy-layout">
      <article class="panel-block strategy-wide">
        <div class="section-title">
          <SlidersHorizontal :size="18" />
          <h2>事件驱动规则中心 <small>— 自动触发工单与处置策略</small></h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head rule-row">
            <span>事件</span>
            <span>条件</span>
            <span>动作</span>
            <span>证据</span>
            <span>复核</span>
          </div>
          <div v-for="item in eventRulesCenter" :key="item.event" class="asset-row rule-row">
            <strong>{{ item.event }}</strong>
            <span>{{ item.condition }}</span>
            <span>{{ item.action }}</span>
            <span>{{ item.evidence }}</span>
            <small>{{ item.review }}</small>
          </div>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Gauge :size="18" />
          <h2>专家参数沙盘 <small>— 下批参数调整建议</small></h2>
        </div>
        <div class="suggestion-list">
          <article v-for="item in parameterSandbox" :key="item.scenario">
            <strong>{{ item.scenario }}</strong>
            <span>质量：{{ item.quality }} · 成本：{{ item.cost }}</span>
            <p>{{ item.risk }} · {{ item.decision }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Target :size="18" />
          <h2>多目标优化建议 <small>— 产量/质量/成本/稳态权重</small></h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in optimizationModes" :key="item.mode">
            <strong>{{ item.mode }}</strong>
            <span>{{ item.weights }}</span>
            <p>{{ item.advice }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <FileText :size="18" />
          <h2>批次画像标签</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in batchProfileTags" :key="item.tag">
            <span>{{ item.tag }}</span>
            <strong>{{ item.reason }}</strong>
            <small>{{ item.action }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>生产例外管理</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in exceptionManagement" :key="item.exception">
            <strong>{{ item.exception }} / {{ item.status }}</strong>
            <span>责任：{{ item.owner }}；原因：{{ item.reason }}</span>
            <p>证据：{{ item.evidence }}</p>
          </article>
        </div>
      </article>

      <article class="panel-block strategy-wide">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>批次对标库</h2>
        </div>
        <div class="review-grid">
          <article v-for="item in benchmarkLibrary" :key="item.benchmark">
            <span>{{ item.benchmark }}</span>
            <strong>{{ item.gap }}</strong>
            <small>{{ item.learn }}</small>
          </article>
        </div>
      </article>
    </section>
</template>



