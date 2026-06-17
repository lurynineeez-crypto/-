<script setup lang="ts">
import { computed } from 'vue';
import { BarChart3, Bell, HeartPulse, MapPinned, Settings2, ShieldAlert, SlidersHorizontal, Sprout, Target, TrendingUp, Wrench } from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';

type EnvironmentScore = {
  score: number;
  level: string;
  parts: Array<{ label: string; value: number }>;
  deductions: string[];
};

type UniformityItem = { label: string; value: string; status: string };
type StabilityRisk = { label: string; value: string; level: string; note: string };
type SuggestionItem = { title: string; reason: string; action: string };
type EfficiencyItem = { name: string; hardware: string; score: number | string; value: string; note: string };
type AlarmCauseItem = { source: string; cause: string; status: string; suggestion: string };
type SensorHealthRow = { id: string; name: string; position: string; score: number | string; risk: string };

const props = defineProps<{
  activeView: 'professional' | 'decision';
  alarmRootCauses: AlarmCauseItem[];
  anomalyChains: any[];
  cropGrowthStatus: { status: string; basis: string[] };
  environmentScore: EnvironmentScore;
  equipmentEfficiency: EfficiencyItem[];
  operationSuggestions: SuggestionItem[];
  predictiveMaintenance: any[];
  responseCurves: any[];
  riskIndex: { value: number | string; level: string; sources: string[]; action: string };
  sensorHealthRows: SensorHealthRow[];
  stabilityRisks: StabilityRisk[];
  thresholdSensitivity: any[];
  uniformity: UniformityItem[];
}>();

const emit = defineEmits<{
  focusSensorById: [id: string];
}>();

const decisionSummaryCards = computed(() => [
  { label: '风险结论', value: `${props.riskIndex.value}`, note: props.riskIndex.level },
  { label: '环境评分', value: `${props.environmentScore.score}`, note: props.environmentScore.level },
  { label: '建议动作', value: props.operationSuggestions[0]?.title ?? '待生成', note: '详见策略视图优化建议' },
  { label: '设备响应', value: props.equipmentEfficiency[0]?.value ?? '待评估', note: props.equipmentEfficiency[0]?.name ?? '等待分析' }
]);
</script>

<template>
  <section class="module-grid" :class="activeView === 'decision' ? 'decision-layout' : 'professional-layout'">
    <PageSummaryBar :title="activeView === 'decision' ? '决策闭环摘要' : '专业分析摘要'" :cards="decisionSummaryCards" />

    <template v-if="activeView === 'decision'">
      <article class="panel-block score-card">
        <div class="section-title">
          <ShieldAlert :size="18" />
          <h2>风险指数</h2>
        </div>
        <div class="score-ring" :style="{ '--score': `${riskIndex.value}%` }">
          <strong>{{ riskIndex.value }}</strong>
          <span>{{ riskIndex.level }}风险</span>
        </div>
        <p class="decision-note">{{ riskIndex.action }}</p>
        <small>明细见策略视图例外管理</small>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Sprout :size="18" />
          <h2>作物生长状态判定</h2>
        </div>
        <div class="growth-state">
          <strong>{{ cropGrowthStatus.status }}</strong>
          <span v-for="item in cropGrowthStatus.basis" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block decision-wide">
        <div class="section-title">
          <MapPinned :size="18" />
          <h2>异常传播链分析</h2>
        </div>
        <div class="chain-list">
          <article v-for="item in anomalyChains" :key="item.start">
            <strong>{{ item.start }}</strong>
            <span v-for="node in item.chain" :key="node">{{ node }}</span>
          </article>
        </div>
      </article>

      <article class="panel-block decision-wide">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>设备-环境响应曲线</h2>
        </div>
        <div class="response-grid">
          <article v-for="curve in responseCurves" :key="curve.device">
            <strong>{{ curve.device }} 路 {{ curve.metric }}</strong>
            <div class="curve-points">
              <span v-for="point in curve.points" :key="point">{{ point }}</span>
            </div>
            <small>{{ curve.result }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <SlidersHorizontal :size="18" />
          <h2>参数敏感性推演</h2>
        </div>
        <p class="decision-note">参数调节后果推演已合一至策略视图专家参数沙盘</p>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Wrench :size="18" />
          <h2>预测性维护</h2>
        </div>
        <div class="threshold-list">
          <article v-for="item in predictiveMaintenance" :key="item.target">
            <strong>{{ item.target }} 路 {{ item.days }}</strong>
            <span>{{ item.reason }}</span>
            <small>{{ item.action }}</small>
          </article>
        </div>
      </article>
    </template>

    <template v-else>
      <article class="panel-block score-card">
        <div class="section-title">
          <Target :size="18" />
          <h2>环境达标评分</h2>
        </div>
        <div class="score-ring" :style="{ '--score': `${environmentScore.score}%` }">
          <strong>{{ environmentScore.score }}</strong>
          <span>{{ environmentScore.level }}</span>
        </div>
        <div class="score-parts">
          <label v-for="part in environmentScore.parts" :key="part.label">
            <span>{{ part.label }}</span>
            <strong>{{ part.value }}</strong>
            <i><b :style="{ width: `${part.value}%` }"></b></i>
          </label>
        </div>
        <div class="deduction-list">
          <span v-for="item in environmentScore.deductions" :key="item">{{ item }}</span>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <BarChart3 :size="18" />
          <h2>空间均匀性分析</h2>
        </div>
        <div class="uniformity-grid">
          <article v-for="item in uniformity" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.status }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>环境稳定性分析</h2>
        </div>
        <div class="uniformity-grid">
          <article v-for="risk in stabilityRisks" :key="risk.label">
            <span>{{ risk.label }}</span>
            <strong>{{ risk.value }}</strong>
            <small>{{ risk.level }} 路 {{ risk.note }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Settings2 :size="18" />
          <h2>操作建议</h2>
        </div>
        <p class="decision-note">操作建议已合一至策略视图多目标优化模块，点击导航切换</p>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <TrendingUp :size="18" />
          <h2>设备效能分析</h2>
        </div>
        <div class="efficiency-list">
          <article v-for="item in equipmentEfficiency" :key="item.name">
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.hardware }}</span>
            </div>
            <b>{{ item.score }}</b>
            <small>{{ item.value }} 路 {{ item.note }}</small>
          </article>
        </div>
      </article>

      <article class="panel-block">
        <div class="section-title">
          <Bell :size="18" />
          <h2>报警处置</h2>
        </div>
        <p class="decision-note">报警闭环入口已合一至运维视图，点击导航切换</p>
      </article>

      <article class="panel-block health-panel">
        <div class="section-title">
          <HeartPulse :size="18" />
          <h2>传感器健康度</h2>
        </div>
        <div class="asset-table">
          <div class="asset-row head">
            <span>点位</span>
            <span>安装位置</span>
            <span>健康度</span>
            <span>风险</span>
          </div>
          <button
            v-for="row in sensorHealthRows"
            :key="row.id"
            class="asset-row"
            type="button"
            @click="emit('focusSensorById', row.id)"
          >
            <span>{{ row.name }}</span>
            <span>{{ row.position }}</span>
            <span>{{ row.score }}</span>
            <strong>{{ row.risk }}</strong>
          </button>
        </div>
      </article>
    </template>
  </section>
</template>
