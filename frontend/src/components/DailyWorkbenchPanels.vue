<script setup lang="ts">
import { computed } from 'vue';
import { Archive, CheckCircle2, ClipboardList, Eye, ListChecks, ShieldAlert, Sparkles } from 'lucide-vue-next';
import PanelSection from './PanelSection.vue';

const props = defineProps<{
  todayTasks: any[];
  inspectionChecklist: any[];
  inspectionSchedule: any[];
  handoverItems: any[];
  plantingLogs: any[];
  workOrders: any[];
  navigateToView: (view: any) => void;
}>();

const pendingChecklist = computed(() => props.inspectionChecklist.filter((item) => !item.done));
const pendingOrders = computed(() => props.workOrders.filter((item) => item.status !== '已闭环'));

const growerFlow = computed(() => [
  { key: '看', title: '看状态', text: '批次处于子实体生长期，先确认环境评分和风险点。' },
  { key: '判', title: '判风险', text: '下层湿度偏低是当前最大风险，CO2 回落速度需要复查。' },
  { key: '做', title: '做动作', text: '按任务卡执行复核、检查、记录，不需要先理解所有菜单。' },
  { key: '核', title: '核结果', text: '每个任务都要留下复核人、时间和读数结果。' },
  { key: '留', title: '留痕迹', text: '处理记录自动进入批次追溯和阶段报告。' }
]);

const taskCards = computed(() => props.todayTasks.map((task, index) => ({
  ...task,
  priority: index === 0 ? 'P1' : index === 1 ? 'P2' : 'P3',
  target: index === 0 ? 'CO2-TOP-001' : index === 1 ? 'HUM-01' : index === 2 ? 'TH-L2-002' : '新风设备',
  status: task.status ?? (index === 0 ? '待处理' : index === 1 ? '处理中' : '待复核'),
  owner: task.owner ?? '种植员',
  reviewer: task.reviewer ?? '班组长',
  judgement: index === 0
    ? 'CO2 已接近预警区间，先看新风联动后 10 分钟回落曲线。'
    : index === 1
      ? '加湿响应影响下层湿度均匀性，检查水位和雾化流量即可。'
      : index === 2
        ? 'TH-L2-002 连续低于目标区间，复核后决定是否升级工单。'
        : '设备状态复测用于确认新风设备运行和通风响应。',
  action: index === 0
    ? '进入报警处置，确认 CO2-TOP-001，10 分钟后记录回落结果。'
    : index === 1
      ? '现场检查 HUM-01 水位和雾化流量，拍照或填写读数。'
      : index === 2
        ? '复核下层湿度点位，记录当前值和恢复时间。'
        : '检查新风风机运行状态和通风口响应，完成后关闭工单。',
  verify: task.reviewer ? `${task.reviewer} 复核` : '班组长复核'
})).sort((a, b) => a.priority.localeCompare(b.priority)));

const flowSteps = computed(() => growerFlow.value.map(item => item.key).join(' → '));
</script>

<template>
  <section class="grower-workbench">
    <article class="grower-hero compact-task-hero">
      <div>
        <p class="eyebrow">种植员今日工作台</p>
        <h2>按任务卡完成今天的方舱作业</h2>
        <p>流程：{{ flowSteps }}。系统把判断依据、标准动作和留痕要求放到每张任务卡里。</p>
      </div>
      <div class="grower-hero-stats">
        <span><b>{{ todayTasks.length }}</b>今日任务</span>
        <span><b>{{ pendingOrders.length }}</b>待处理工单</span>
        <span><b>{{ pendingChecklist.length }}</b>未完成巡检</span>
      </div>
    </article>

    <section class="grower-main-grid">
      <PanelSection
        wide
        :icon="ListChecks"
        title="今日必须完成"
        description="任务卡直接给出判断依据、操作动作、复核要求和留痕去向。"
      >
        <div class="grower-task-stack">
          <article v-for="task in taskCards" :key="task.name" class="grower-task-card">
            <header>
              <span class="task-priority">{{ task.priority }}</span>
              <div>
                <strong>{{ task.name }}</strong>
                <small>截止 {{ task.due }} · 关联 {{ task.target }} · {{ task.status }}</small>
              </div>
              <b>{{ task.owner }} / {{ task.reviewer }}</b>
            </header>
            <div class="task-decision-grid">
              <section>
                <Eye :size="16" />
                <span>判断依据</span>
                <p>{{ task.judgement }}</p>
              </section>
              <section>
                <ClipboardList :size="16" />
                <span>标准动作</span>
                <p>{{ task.action }}</p>
              </section>
              <section>
                <Archive :size="16" />
                <span>留痕材料</span>
                <p>{{ task.evidence }}</p>
              </section>
            </div>
            <footer class="task-action-row">
              <button type="button">开始处理</button>
              <button type="button">完成登记</button>
              <button type="button">提交复核</button>
              <button type="button" @click="navigateToView('sop')">查看详情</button>
            </footer>
          </article>
        </div>
      </PanelSection>

      <div class="grower-flow-strip compact-flow-strip panel-section-wide">
        <article v-for="item in growerFlow" :key="item.key">
          <strong>{{ item.key }}</strong>
          <span>{{ item.title }}</span>
          <small>{{ item.text }}</small>
        </article>
      </div>

      <PanelSection
        :icon="ShieldAlert"
        title="当前风险"
        description="少看曲线，先看系统给出的种植判断。"
      >
        <div class="grower-risk-card">
          <strong>下层湿度偏低 84.9%RH</strong>
          <span>影响：下层子实体一致性可能下降。</span>
          <p>建议：17:30 前复核 TH-L2-002；若仍低于目标，检查 HUM-01 水位和雾化流量。</p>
          <button type="button" @click="navigateToView('alarms')">进入报警处置</button>
        </div>
      </PanelSection>

      <PanelSection
        :icon="CheckCircle2"
        title="巡检与复核"
        description="只显示未闭环项，减少重复阅读。"
      >
        <div class="inspection-list compact-grower-list">
          <article v-for="item in pendingChecklist" :key="item.item">
            <span>{{ item.frequency }}</span>
            <strong>{{ item.item }}</strong>
            <small>{{ item.owner }} · {{ item.reviewer }}</small>
          </article>
        </div>
        <button type="button" class="grower-secondary-action" @click="navigateToView('point')">查看点位巡检</button>
      </PanelSection>

      <PanelSection
        :icon="Sparkles"
        title="交接班"
        description="下一班只看风险、遗留动作和复核口径。"
      >
        <div class="handover-grid grower-handover">
          <article v-for="item in handoverItems" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
      </PanelSection>

      <PanelSection
        wide
        :icon="Archive"
        title="自动留痕"
        description="种植员完成任务后，系统自动沉淀到批次追溯和阶段报告。"
      >
        <div class="log-list compact-log-list">
          <article v-for="log in plantingLogs.slice(0, 4)" :key="log.time">
            <strong>{{ log.type }}</strong>
            <span>{{ log.time }} · {{ log.operator }}</span>
            <p>{{ log.content }}</p>
          </article>
        </div>
      </PanelSection>
    </section>
  </section>
</template>
