<script setup lang="ts">
import { computed } from 'vue';
import { Archive, Camera, CheckCircle2, ClipboardList, Eye, ListChecks, ShieldAlert } from 'lucide-vue-next';
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

const growerFlow = [
  { key: '看', title: '看状态', text: '先确认批次、阶段、风险点和今日任务。' },
  { key: '判', title: '判风险', text: '按读数、阈值和持续时间判断优先级。' },
  { key: '做', title: '做动作', text: '按任务卡执行现场复核、设备检查和记录。' },
  { key: '核', title: '核结果', text: '由班组长复核读数、照片和处理备注。' },
  { key: '留', title: '留痕迹', text: '材料进入批次追溯和阶段报告。' }
];

const taskCards = computed(() => {
  const demoTasks = [
    {
      priority: 'P1',
      name: '复核下层湿度点位 TH-L2-002',
      due: '17:30',
      target: 'TH-L2-002',
      status: '待处理',
      owner: '晚班种植员',
      reviewer: '班组长',
      judgement: '84.9%RH，目标 >=85%RH，已持续 38 分钟。',
      action: '现场复核探头，检查 HUM-01 水位和雾化流量。',
      evidence: '复测截图、现场照片、处理备注',
      primaryAction: '立即复核'
    },
    {
      priority: 'P2',
      name: '检查加湿水位 HUM-01',
      due: '18:00',
      target: 'HUM-01',
      status: '处理中',
      owner: '晚班种植员',
      reviewer: '班组长',
      judgement: '下层湿度接近下限，需要确认加湿响应是否稳定。',
      action: '检查水位、雾化流量和喷头状态，记录处理前后读数。',
      evidence: '水位照片、设备状态、处理备注',
      primaryAction: '提交复核'
    },
    {
      priority: 'P2',
      name: '复查新风后 CO2 回落曲线',
      due: '18:30',
      target: 'CO2-L2',
      status: '待复核',
      owner: '运维员',
      reviewer: '班组长',
      judgement: 'CO2 回落速度偏慢，需要确认新风联动效果。',
      action: '新风联动后 10 分钟复查曲线，确认是否继续观察。',
      evidence: '趋势截图、联动记录、复核结论',
      primaryAction: '查看详情'
    },
    {
      priority: 'P3',
      name: '完成晚班交接留痕',
      due: '19:00',
      target: 'JE-202606-001',
      status: '待处理',
      owner: '晚班种植员',
      reviewer: '班组长',
      judgement: '当班存在湿度关注点，需要给下一班明确复核口径。',
      action: '补齐风险说明、遗留动作和下一次复核时间。',
      evidence: '交接备注、复核时间、责任人',
      primaryAction: '完成登记'
    }
  ];

  return demoTasks
    .slice(0, Math.max(4, props.todayTasks.length))
    .sort((a, b) => a.priority.localeCompare(b.priority));
});

const pendingReviewCount = computed(() => taskCards.value.filter((task) => task.status.includes('复核')).length || 3);
const pendingActionCount = computed(() => pendingOrders.value.length || 6);
</script>

<template>
  <section class="ops-workbench-shell ops-page app-page grower-workbench daily-workbench">
    <header class="ops-page-header app-page-header daily-page-header">
      <div>
        <p class="eyebrow">种植员高频操作工作台</p>
        <h2>今日作业</h2>
        <p>当前批次 JE-202606-001 · 当前阶段 子实体生长期</p>
      </div>
      <div class="daily-header-stats">
        <span class="app-status-chip"><b>今日任务</b>{{ taskCards.length }}</span>
        <span class="app-status-chip app-tag-review"><b>待复核</b>{{ pendingReviewCount }}</span>
        <span class="app-status-chip app-tag-warning"><b>待处理</b>{{ pendingActionCount }}</span>
        <span class="app-status-chip app-tag-danger"><b>最大风险</b>下层湿度偏低 84.9%RH</span>
      </div>
    </header>

    <div class="ops-workflow app-workflow daily-flow-strip" aria-label="今日作业流程">
      <article v-for="(item, index) in growerFlow" :key="item.key" class="ops-workflow-step app-workflow-step" :class="{ active: index === 2, done: index < 2 }">
        <strong>{{ item.key }}</strong>
        <span>{{ item.title }}</span>
        <small>{{ item.text }}</small>
      </article>
    </div>

    <section class="grower-main-grid daily-workbench-grid">
      <PanelSection
        wide
        :icon="ListChecks"
        title="任务队列"
        description="任务卡直接给出判断依据、标准动作、复核人和留档材料，种植员按按钮执行。"
      >
        <div class="grower-task-stack">
          <article v-for="task in taskCards" :key="task.name" class="ops-task-card app-task-card grower-task-card" :class="`priority-${task.priority.toLowerCase()}`">
            <header>
              <span class="task-priority">{{ task.priority }}</span>
              <div>
                <strong>{{ task.name }}</strong>
                <small>截止 {{ task.due }} · 关联 {{ task.target }}</small>
              </div>
              <b class="app-status-chip" :class="task.status === '处理中' ? 'app-tag-processing' : task.status === '待复核' ? 'app-tag-review' : 'app-tag-warning'">
                {{ task.status }}
              </b>
            </header>

            <div class="task-meta-grid">
              <span><b>责任人</b>{{ task.owner }}</span>
              <span><b>复核人</b>{{ task.reviewer }}</span>
              <span><b>关联对象</b>{{ task.target }}</span>
            </div>

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
                <span>留档材料</span>
                <p>{{ task.evidence }}</p>
              </section>
            </div>

            <footer class="task-action-row">
              <button type="button" class="app-button-primary">{{ task.primaryAction }}</button>
              <button type="button" class="app-button-secondary">提交复核</button>
              <button type="button" class="app-button-secondary" @click="navigateToView('sop')">查看详情</button>
            </footer>
          </article>
        </div>
      </PanelSection>

      <PanelSection
        :icon="ShieldAlert"
        title="当前风险摘要"
        description="只保留当班最需要处理的风险，避免抢任务队列主线。"
      >
        <div class="ops-risk-card app-risk-card grower-risk-card">
          <span class="app-tag-warning">预警</span>
          <strong>下层湿度偏低</strong>
          <div class="risk-value-line">
            <b>84.9%RH</b>
            <small>目标 >=85%RH</small>
          </div>
          <p>点位 TH-L2-002，下一步 17:30 前现场复核并记录。</p>
          <button type="button" class="app-button-warning" @click="navigateToView('alarms')">进入报警处置</button>
        </div>
      </PanelSection>

      <PanelSection
        :icon="CheckCircle2"
        title="巡检与复核"
        description="只显示未完成项，减少重复阅读。"
      >
        <div class="inspection-list compact-grower-list">
          <article v-for="item in pendingChecklist.slice(0, 4)" :key="item.item">
            <span>{{ item.frequency }}</span>
            <strong>{{ item.item }}</strong>
            <small>{{ item.owner }} · {{ item.reviewer }}</small>
          </article>
        </div>
        <button type="button" class="app-button-secondary grower-secondary-action" @click="navigateToView('point')">查看点位巡检</button>
      </PanelSection>

      <PanelSection
        wide
        :icon="Camera"
        title="自动留痕"
        description="完成任务后，材料沉淀到批次追溯和阶段报告。"
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
