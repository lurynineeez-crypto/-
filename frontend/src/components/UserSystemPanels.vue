<script setup lang="ts">
import { Bell, CheckCircle2, ClipboardList, FileText, ListChecks, Settings2, ShieldAlert, SlidersHorizontal } from 'lucide-vue-next';
import type { RoleKey, ViewKey } from '../types';
import DailyWorkbenchPanels from './DailyWorkbenchPanels.vue';

defineProps<{
  activeView: 'security' | 'settings' | 'user' | 'workflow' | 'sop' | 'demo';
  activeRole: RoleKey;
  taskFilter: string;
  simplifiedMode: string;
  approvalRecords: any[];
  loginRoles: any[];
  settingGroups: any[];
  alarmTimeline: any[];
  userTodoSummary: any[];
  taskFilterOptions: readonly string[];
  filteredTaskPreview: any[];
  roleWorkbenchCards: Record<RoleKey, any[]>;
  statusColorStandards: any[];
  bulkActionEntries: any[];
  noteCards: any[];
  exportShortcuts: string[];
  keyboardHints: any[];
  executiveSimpleCards: any[];
  fieldSimpleCards: any[];
  userQuickActions: any[];
  favoritePages: any[];
  recentObjects: any[];
  taskPriorityQueue: any[];
  confirmationCards: any[];
  onboardingSteps: any[];
  enhancedSearchCategories: any[];
  groupedNotifications: any[];
  userOperationHistory: any[];
  conceptHelpCenter: any[];
  pageStateSamples: any[];
  feedbackEntries: any[];
  weakNetworkStatus: any[];
  userPreferenceItems: any[];
  terminologyModes: any[];
  todayTasks: any[];
  inspectionChecklist: any[];
  inspectionSchedule: any[];
  handoverItems: any[];
  plantingLogs: any[];
  sopGuides: any[];
  stageChecklist: any[];
  workOrders: any[];
  demoScenario: string;
  demoScenarios: any[];
  setTaskFilter: (filter: any) => void;
  setSimplifiedMode: (mode: any) => void;
  navigateToView: (view: ViewKey) => void;
  runDemoScenario: (name: string) => void;
}>();
</script>

<template>
  <DailyWorkbenchPanels
    v-if="activeView === 'workflow'"
    :today-tasks="todayTasks"
    :inspection-checklist="inspectionChecklist"
    :inspection-schedule="inspectionSchedule"
    :handover-items="handoverItems"
    :planting-logs="plantingLogs"
    :work-orders="workOrders"
    :navigate-to-view="navigateToView"
  />

  <section v-else-if="activeView === 'sop'" class="module-grid sop-layout focused-workbench">
    <article class="panel-block sop-panel wide">
      <div class="section-title">
        <ClipboardList :size="18" />
        <div>
          <h2>SOP 工单</h2>
          <p>把今日作业拆成可执行、可复核、可闭环的标准动作。</p>
        </div>
      </div>
      <div class="sop-list">
        <article v-for="guide in sopGuides" :key="guide.title">
          <strong>{{ guide.title }}</strong>
          <span>{{ guide.trigger }}</span>
          <ol>
            <li v-for="step in guide.steps" :key="step">{{ step }}</li>
          </ol>
        </article>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <ListChecks :size="18" />
        <h2>阶段检查</h2>
      </div>
      <div class="checklist">
        <article v-for="item in stageChecklist" :key="item.item">
          <span :class="['check-dot', item.passed ? 'done' : 'todo']"></span>
          <div>
            <strong>{{ item.item }}</strong>
            <small>{{ item.passed ? '已满足' : '需确认' }}</small>
          </div>
          <b>{{ item.passed ? '通过' : '待处理' }}</b>
        </article>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <SlidersHorizontal :size="18" />
        <h2>审批记录</h2>
      </div>
      <div class="approval-list">
        <article v-for="record in approvalRecords" :key="record.title">
          <strong>{{ record.title }}</strong>
          <span>{{ record.applicant }} · {{ record.status }}</span>
          <p>{{ record.reason }}</p>
        </article>
      </div>
    </article>
  </section>

  <section v-else-if="activeView === 'security'" class="module-grid security-layout focused-workbench">
    <article class="panel-block login-card">
      <div class="section-title">
        <ShieldAlert :size="18" />
        <h2>登录权限</h2>
      </div>
      <div class="role-list">
        <article v-for="role in loginRoles" :key="role.user">
          <strong>{{ role.user }}</strong>
          <span>{{ role.role }}</span>
          <small>{{ role.mode }}</small>
        </article>
      </div>
    </article>
  </section>

  <section v-else class="module-grid user-layout focused-workbench">
    <article class="panel-block user-wide">
      <div class="section-title">
        <CheckCircle2 :size="18" />
        <div>
          <h2>个人工作台</h2>
          <p>用户偏好、通知、历史和帮助只作为辅助入口，不再干扰今日作业。</p>
        </div>
      </div>
      <div class="uniformity-grid">
        <article v-for="item in userTodoSummary" :key="item.title">
          <span>{{ item.title }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.detail }}</small>
        </article>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <Bell :size="18" />
        <h2>通知</h2>
      </div>
      <div class="threshold-list">
        <article v-for="item in groupedNotifications.slice(0, 4)" :key="item.group">
          <strong>{{ item.group }} · {{ item.count }}</strong>
          <span>{{ item.detail }}</span>
        </article>
      </div>
    </article>

    <article class="panel-block">
      <div class="section-title">
        <Settings2 :size="18" />
        <h2>偏好设置</h2>
      </div>
      <div class="setting-tags">
        <span v-for="item in userPreferenceItems.slice(0, 6)" :key="item.setting">{{ item.setting }}：{{ item.value }}</span>
      </div>
    </article>

    <article class="panel-block user-wide">
      <div class="section-title">
        <FileText :size="18" />
        <h2>最近记录</h2>
      </div>
      <div class="timeline">
        <article v-for="item in userOperationHistory.slice(0, 5)" :key="`${item.time}-${item.action}`" class="timeline-item info">
          <strong>{{ item.time }} · {{ item.user }} · {{ item.action }}</strong>
          <span>{{ item.object }} · {{ item.result }}</span>
        </article>
      </div>
    </article>
  </section>
</template>
