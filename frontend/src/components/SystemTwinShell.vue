<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { Activity, Database, Leaf, Server, ShieldCheck } from 'lucide-vue-next';
import type { NavItem } from '../data/navigation';
import type { ViewKey } from '../types';
import TwinCommandFooter from './TwinCommandFooter.vue';
import TwinSystemTopBar from './TwinSystemTopBar.vue';

interface GroupedNavItem {
  name: string;
  items: NavItem[];
}

interface StatusCard {
  icon?: Component;
  label: string;
  value: string;
  tone?: string;
}

const props = defineProps<{
  title: string;
  eyebrow: string;
  activeView: ViewKey;
  groupedNavItems: GroupedNavItem[];
  statusCards: StatusCard[];
  leftHeaderCards?: StatusCard[];
  rightHeaderCards?: StatusCard[];
  footerStatusModules: StatusCard[];
  footerActions: Array<{ label: string; view: ViewKey }>;
  mode?: 'ops' | 'app';
}>();

const emit = defineEmits<{
  selectView: [view: ViewKey];
}>();

const activeGroup = computed(() =>
  props.groupedNavItems.find((group) => group.items.some((item) => item.key === props.activeView))
);

const activeItem = computed(() =>
  activeGroup.value?.items.find((item) => item.key === props.activeView) ?? activeGroup.value?.items[0]
);

const contextCards = computed(() => {
  const base = props.leftHeaderCards?.length ? props.leftHeaderCards : props.statusCards;
  return base.slice(0, 3);
});

const systemCards = computed(() => [
  { icon: Activity, label: '系统框架', value: '实时在线', detail: '顶部、导航、工作区与底栏统一保持。' },
  { icon: ShieldCheck, label: '数据链路', value: '可追溯', detail: '采集、入库、报告与审计连续留痕。' },
  { icon: Database, label: '页面内容', value: activeItem.value?.label ?? '当前页面', detail: '只替换中间工作区内容，不改变系统外框。' }
]);
</script>

<template>
  <div
    :class="[
      'system-twin-shell',
      'twin-shared-command-frame',
      'system-shell-frame',
      mode === 'app' ? 'system-twin-shell-app system-shell-frame-app' : 'system-twin-shell-ops system-shell-frame-ops'
    ]"
  >
    <TwinSystemTopBar
      :title="title"
      :active-view="activeView"
      :grouped-nav-items="groupedNavItems"
      :left-cards="leftHeaderCards ?? statusCards.slice(0, 3)"
      :right-cards="rightHeaderCards ?? statusCards.slice(3, 5)"
      @select-view="emit('selectView', $event)"
    />

    <div class="system-twin-content system-shell-content twin-shared-content">
      <div class="system-content-frame twin-body-grid home3d-grid">
        <aside class="twin-left-column side-panel system-context-panel">
          <header class="panel-head">
            <div class="panel-title">
              <Leaf :size="18" />
              <div>
                <h2>{{ activeGroup?.name ?? '系统工作区' }}</h2>
                <p>{{ eyebrow }}</p>
              </div>
            </div>
          </header>

          <div class="system-context-list">
            <article v-for="item in contextCards" :key="item.label" :class="['system-context-card', item.tone]">
              <component v-if="item.icon" :is="item.icon" :size="16" />
              <div>
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </article>
          </div>
        </aside>

        <section class="twin-center-stage center-stage system-content-stage">
          <header class="stage-head">
            <div>
              <h2>{{ activeItem?.label ?? activeGroup?.name ?? '当前页面' }}</h2>
            </div>
            <div class="stage-meta">
              <span>系统网络</span>
              <strong>正常</strong>
              <span>页面内容已接入统一工作区</span>
            </div>
          </header>

          <div class="system-content-stage-body">
            <slot />
          </div>
        </section>

        <aside class="twin-right-column side-panel system-status-panel">
          <header class="panel-head">
            <div class="panel-title">
              <Server :size="18" />
              <div>
                <h2>系统运行态势</h2>
                <p>所有页面共用同一套运行状态与框架反馈。</p>
              </div>
            </div>
          </header>

          <div class="system-status-list">
            <article v-for="item in systemCards" :key="item.label" class="system-state-card">
              <component :is="item.icon" :size="18" />
              <div class="state-copy">
                <span>{{ item.label }}</span>
                <p>{{ item.detail }}</p>
              </div>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
        </aside>
      </div>
    </div>

    <TwinCommandFooter
      :modules="footerStatusModules"
      :actions="footerActions"
      @navigate="emit('selectView', $event)"
    />
  </div>
</template>

<style scoped>
.system-twin-shell {
  --twin-bg-deep: #020f0c;
  --twin-bg-panel: rgba(4, 29, 23, 0.9);
  --twin-border: rgba(0, 245, 178, 0.42);
  --twin-border-soft: rgba(0, 245, 178, 0.18);
  --twin-green: #00f5b2;
  --twin-green-soft: rgba(0, 245, 178, 0.68);
  --twin-amber: #ffb22e;
  --twin-text: #ecfff8;
  --twin-muted: rgba(172, 220, 202, 0.68);
  --twin-glow: 0 0 26px rgba(0, 245, 178, 0.2);
  --panel-gap: 8px;
  --panel-section-gap: 10px;
  --cc-bg-top: rgba(6, 28, 22, 0.98);
  --cc-bg-bottom: rgba(3, 18, 15, 0.98);
  --cc-border: rgba(110, 232, 186, 0.18);
  --cc-border-strong: rgba(132, 255, 211, 0.28);
  --cc-glow: rgba(73, 209, 160, 0.18);
  --cc-shadow-panel: 0 16px 36px rgba(2, 11, 9, 0.24);
  --cc-text: #effff7;
  --cc-muted: rgba(170, 218, 195, 0.72);
  --cc-ok: #8ef6ca;
  --cc-warn: #ffbb63;
  --cc-danger: #ff8375;
  --shell-gap: 8px;
  --shell-padding: 10px;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: var(--shell-gap);
  width: min(1600px, 100%);
  height: min(900px, calc(100dvh - 20px));
  min-height: 700px;
  margin: 0 auto;
  padding: var(--shell-padding);
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 14%, rgba(90, 255, 196, 0.12), transparent 24%),
    radial-gradient(circle at 50% 72%, rgba(45, 196, 135, 0.08), transparent 20%),
    linear-gradient(180deg, var(--cc-bg-top), var(--cc-bg-bottom));
  box-shadow: 0 24px 48px rgba(4, 18, 14, 0.35);
}

@media (max-height: 860px), (max-width: 1500px) {
  .system-twin-shell {
    --shell-gap: 5px;
    --shell-padding: 8px;
  }
}

.system-twin-shell-app {
  background:
    radial-gradient(circle at 50% 14%, rgba(90, 255, 196, 0.1), transparent 24%),
    radial-gradient(circle at 50% 72%, rgba(45, 196, 135, 0.07), transparent 20%),
    linear-gradient(180deg, var(--cc-bg-top), var(--cc-bg-bottom));
}

.system-twin-shell::before,
.system-twin-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.system-twin-shell::before {
  background:
    linear-gradient(rgba(95, 227, 176, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(95, 227, 176, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 86%);
}

.system-twin-shell::after {
  display: none;
}

.system-twin-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  align-items: stretch;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(rgba(95, 227, 176, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(95, 227, 176, 0.026) 1px, transparent 1px),
    transparent;
  background-size: 48px 48px, 48px 48px, auto;
  box-shadow: none;
}

.system-content-frame,
.system-content-frame.home3d-grid,
.system-content-frame.twin-body-grid {
  display: grid;
  grid-template-columns: 320px minmax(620px, 1fr) 340px;
  gap: var(--panel-gap);
  min-height: 0;
  height: 100%;
  overflow: hidden;
  align-items: stretch;
}

.system-content-frame .side-panel,
.system-content-frame .center-stage {
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--twin-border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  box-shadow: var(--twin-glow), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

.system-content-frame .side-panel {
  display: grid;
  align-content: start;
  gap: var(--panel-section-gap);
  padding: 10px;
}

.system-content-frame .panel-head {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 58px;
  padding: 6px 0 12px;
  margin: 0;
  box-sizing: border-box;
}

.system-content-frame .panel-head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background:
    linear-gradient(90deg, transparent 0%, rgba(0, 245, 178, 0.18) 18%, rgba(0, 245, 178, 0.64) 50%, rgba(0, 245, 178, 0.18) 82%, transparent 100%);
  box-shadow: 0 0 10px rgba(0, 245, 178, 0.22);
}

.system-content-frame .panel-title {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.system-content-frame .panel-title svg {
  color: var(--twin-green);
  filter: drop-shadow(0 0 8px rgba(0, 245, 178, 0.35));
}

.system-content-frame .panel-title h2,
.system-content-frame .center-stage h2 {
  margin: 0;
  color: var(--twin-text);
  font-size: 16px;
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(0, 245, 178, 0.42);
}

.system-content-frame .panel-title p,
.system-content-frame .stage-meta,
.system-content-frame .state-copy p {
  margin: 5px 0 0;
  color: var(--twin-muted);
  font-size: 12px;
  line-height: 1.38;
}

.system-content-stage {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.system-content-frame .stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--twin-border-soft);
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.42), rgba(2, 17, 14, 0.22));
}

.system-content-frame .stage-meta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  white-space: nowrap;
}

.system-content-frame .stage-meta strong {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(0, 245, 178, 0.12);
  color: var(--twin-green);
  font-size: 12px;
}

.system-content-stage-body {
  min-height: 0;
  overflow: auto;
  padding: 12px;
}

.system-context-list,
.system-status-list {
  display: grid;
  gap: 10px;
  min-height: 0;
}

.system-context-card,
.system-state-card {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 66px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(7, 45, 35, 0.78), rgba(4, 24, 20, 0.86));
}

.system-context-card {
  grid-template-columns: 20px minmax(0, 1fr);
}

.system-context-card svg,
.system-state-card svg {
  color: var(--twin-green);
  filter: drop-shadow(0 0 8px rgba(0, 245, 178, 0.3));
}

.system-context-card span,
.system-state-card span {
  display: block;
  color: var(--twin-muted);
  font-size: 12px;
  line-height: 1.2;
}

.system-context-card strong,
.system-state-card strong {
  display: block;
  margin-top: 3px;
  color: var(--twin-text);
  font-size: 16px;
  line-height: 1.2;
}

.system-state-card strong {
  justify-self: end;
  min-width: 58px;
  color: var(--twin-green);
  text-align: right;
}

.system-twin-content :deep(.system-section),
.system-twin-content :deep(.section-content) {
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  margin: 0;
  overflow: hidden;
}

.system-twin-content :deep(.section-content) {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  align-items: stretch;
}

.system-twin-content :deep(.section-content > *) {
  min-height: 0;
}

.system-twin-content :deep(.system-page),
.system-twin-content :deep(.app-page),
.system-twin-content :deep(.ops-workbench-shell) {
  align-self: stretch;
  width: 100%;
  height: 100%;
  max-height: 100%;
  margin: 0;
  gap: var(--shell-gap);
}

.system-twin-content :deep(.ops-workbench-shell) {
  padding: 0;
  border: 0;
  border-radius: 0;
  overflow: visible;
  background: transparent;
  box-shadow: none;
}

.system-twin-content :deep(.ops-workbench-shell)::before {
  display: none;
}

.system-twin-content :deep(.daily-workbench) {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 340px;
  grid-template-rows: minmax(136px, 158px) 76px minmax(0, 1fr);
  height: 100%;
  max-height: 100%;
  min-height: 0;
  gap: var(--shell-gap);
  overflow: hidden;
}

.system-twin-content :deep(.daily-page-header) {
  grid-column: 1;
  grid-row: 1;
  overflow: hidden;
  min-height: 0;
}

.system-twin-content :deep(.daily-page-header) {
  grid-template-columns: 1fr;
  align-content: center;
  gap: 7px;
  padding: 12px;
}

.system-twin-content :deep(.daily-page-header h2) {
  font-size: 21px;
  line-height: 1.08;
}

.system-twin-content :deep(.daily-page-header .daily-header-stats) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-content: stretch;
  max-width: none;
  margin-top: 2px;
  gap: 6px;
}

.system-twin-content :deep(.daily-page-header .daily-header-stats .system-tag) {
  justify-content: center;
  min-width: 0;
  min-height: 24px;
  padding: 0 7px;
}

.system-twin-content :deep(.daily-page-header .daily-header-stats .system-tag:last-child) {
  grid-column: 1 / -1;
}

.system-twin-content :deep(.daily-flow-strip) {
  grid-column: 1;
  grid-row: 2;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-content: center;
  gap: 5px;
  padding: 8px;
  overflow: hidden;
}

.system-twin-content :deep(.daily-flow-strip .app-workflow-step),
.system-twin-content :deep(.daily-flow-strip .ops-workflow-step) {
  min-height: 0;
  height: 58px;
  padding: 6px 4px;
  gap: 2px;
  text-align: center;
}

.system-twin-content :deep(.daily-flow-strip .app-workflow-step strong),
.system-twin-content :deep(.daily-flow-strip .ops-workflow-step strong) {
  font-size: 15px;
  line-height: 1;
}

.system-twin-content :deep(.daily-flow-strip .app-workflow-step span),
.system-twin-content :deep(.daily-flow-strip .ops-workflow-step span) {
  font-size: 11px;
  line-height: 1.1;
}

.system-twin-content :deep(.daily-flow-strip .app-workflow-step small),
.system-twin-content :deep(.daily-flow-strip .ops-workflow-step small) {
  display: none;
}

.system-twin-content :deep(.daily-workbench-grid) {
  display: contents;
}

.system-twin-content :deep(.daily-workbench-grid > .panel-section-wide:first-child) {
  grid-column: 2;
  grid-row: 1 / 4;
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.daily-workbench-grid > .panel-section-shell:nth-child(2)) {
  grid-column: 3;
  grid-row: 1 / 3;
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.daily-workbench-grid > .panel-section-shell:nth-child(3)) {
  grid-column: 1;
  grid-row: 3;
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.daily-workbench-grid > .panel-section-wide:nth-child(4)) {
  grid-column: 3;
  grid-row: 3;
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.daily-workbench .panel-section-shell),
.system-twin-content :deep(.alarm-ops-page .panel-section-shell),
.system-twin-content :deep(.focused-workbench .panel-section-shell) {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.system-twin-content :deep(.daily-workbench .grower-task-stack) {
  max-height: none;
}

.system-twin-content :deep(.daily-workbench .grower-task-card) {
  gap: 10px;
}

.system-twin-content :deep(.daily-workbench .panel-section-title),
.system-twin-content :deep(.alarm-ops-page .system-panel-header),
.system-twin-content :deep(.focused-workbench .panel-section-title) {
  min-height: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(110, 232, 186, 0.16);
}

.system-twin-content :deep(.daily-workbench .panel-section-title p),
.system-twin-content :deep(.alarm-ops-page .system-panel-header p),
.system-twin-content :deep(.focused-workbench .panel-section-title p) {
  display: -webkit-box;
  margin-top: 3px;
  overflow: hidden;
  color: rgba(170, 218, 195, 0.68);
  font-size: 12px;
  line-height: 1.35;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.system-twin-content :deep(.daily-workbench .panel-section-body) {
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.daily-workbench .task-decision-grid) {
  grid-template-columns: 1fr;
}

.system-twin-content :deep(.daily-workbench .task-meta-grid) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.system-twin-content :deep(.daily-workbench .task-action-row) {
  gap: 6px;
}

.system-twin-content :deep(.alarm-ops-page) {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 340px;
  grid-template-rows: minmax(128px, 150px) minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  gap: var(--shell-gap);
  overflow: hidden;
}

.system-twin-content :deep(.alarm-page-header) {
  grid-column: 1;
  grid-row: 1;
  grid-template-columns: 1fr;
  align-content: center;
  min-height: 0;
  overflow: hidden;
  padding: 12px;
}

.system-twin-content :deep(.alarm-page-header .daily-header-stats) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-content: stretch;
  gap: 6px;
}

.system-twin-content :deep(.alarm-page-header .daily-header-stats .system-tag) {
  justify-content: center;
  min-width: 0;
  min-height: 24px;
  padding: 0 7px;
}

.system-twin-content :deep(.alarm-command-grid) {
  display: contents;
}

.system-twin-content :deep(.alarm-priority-card) {
  grid-column: 2;
  grid-row: 1 / 3;
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.alarm-workflow-panel) {
  grid-column: 3;
  grid-row: 1;
  min-height: 0;
  overflow: hidden;
}

.system-twin-content :deep(.alarm-workflow) {
  grid-template-columns: 1fr;
  gap: 6px;
  min-height: 0;
}

.system-twin-content :deep(.alarm-workflow .app-workflow-step),
.system-twin-content :deep(.alarm-workflow .ops-workflow-step) {
  min-height: 44px;
  padding: 7px 9px;
}

.system-twin-content :deep(.alarm-queue-panel) {
  grid-column: 1 / 2;
  grid-row: 2;
  min-height: 0;
  overflow: hidden;
}

.system-twin-content :deep(.alarm-queue-panel .system-table),
.system-twin-content :deep(.alarm-queue-panel .app-table) {
  min-height: 0;
  overflow: auto;
}

.system-twin-content :deep(.module-grid),
.system-twin-content :deep(.panel-block),
.system-twin-content :deep(.report-delivery-center),
.system-twin-content :deep(.report-section),
.system-twin-content :deep(.summary-card),
.system-twin-content :deep(.delivery-card),
.system-twin-content :deep(.feature-card),
.system-twin-content :deep(.stage-card),
.system-twin-content :deep(.rule-card),
.system-twin-content :deep(.metric),
.system-twin-content :deep(.summary-item),
.system-twin-content :deep(.report-card),
.system-twin-content :deep(.lifecycle-step),
.system-twin-content :deep(.batch-metrics article),
.system-twin-content :deep(.batch-health-metrics),
.system-twin-content :deep(.batch-health-metrics div),
.system-twin-content :deep(.stage-line),
.system-twin-content :deep(.stage-status-grid > div),
.system-twin-content :deep(.production-summary-grid article),
.system-twin-content :deep(.director-summary article),
.system-twin-content :deep(.harvest-summary article),
.system-twin-content :deep(.stage-action-strip article),
.system-twin-content :deep(.correlation-grid article),
.system-twin-content :deep(.overview-focus-panel),
.system-twin-content :deep(.batch-production-board),
.system-twin-content :deep(.delivery-package-board) {
  color: var(--cc-text);
}

.system-twin-content :deep(.panel-block),
.system-twin-content :deep(.report-section),
.system-twin-content :deep(.summary-card),
.system-twin-content :deep(.delivery-card),
.system-twin-content :deep(.feature-card),
.system-twin-content :deep(.stage-card),
.system-twin-content :deep(.rule-card),
.system-twin-content :deep(.metric),
.system-twin-content :deep(.summary-item),
.system-twin-content :deep(.report-card),
.system-twin-content :deep(.lifecycle-step),
.system-twin-content :deep(.batch-metrics article),
.system-twin-content :deep(.batch-health-metrics),
.system-twin-content :deep(.batch-health-metrics div),
.system-twin-content :deep(.stage-line),
.system-twin-content :deep(.stage-status-grid > div),
.system-twin-content :deep(.production-summary-grid article),
.system-twin-content :deep(.director-summary article),
.system-twin-content :deep(.harvest-summary article),
.system-twin-content :deep(.stage-action-strip article),
.system-twin-content :deep(.correlation-grid article),
.system-twin-content :deep(.overview-focus-panel),
.system-twin-content :deep(.batch-production-board),
.system-twin-content :deep(.delivery-package-board),
.system-twin-content :deep(.asset-row),
.system-twin-content :deep(.rtable-row),
.system-twin-content :deep(.review-grid article),
.system-twin-content :deep(.threshold-list article),
.system-twin-content :deep(.history-list article),
.system-twin-content :deep(.plan-list article),
.system-twin-content :deep(.chain-list article),
.system-twin-content :deep(.response-grid article),
.system-twin-content :deep(.help-grid article),
.system-twin-content :deep(.drill-grid article),
.system-twin-content :deep(.search-results article),
.system-twin-content :deep(.point-profile article),
.system-twin-content :deep(.delivery-grid article),
.system-twin-content :deep(.recipe-grid article),
.system-twin-content :deep(.sensor-list button),
.system-twin-content :deep(.mini-table button),
.system-twin-content :deep(.attention-point-row button),
.system-twin-content :deep(.ops-mini-card),
.system-twin-content :deep(.ops-rule-list article),
.system-twin-content :deep(.ops-maintenance-card),
.system-twin-content :deep(.maintenance-check-list article),
.system-twin-content :deep(.app-workflow-step),
.system-twin-content :deep(.ops-workflow-step),
.system-twin-content :deep(.environment-action-card article),
.system-twin-content :deep(.environment-next-action),
.system-twin-content :deep(.ops-alert-summary article),
.system-twin-content :deep(.point-type-strip button),
.system-twin-content :deep(.point-filter-bar) {
  border-color: rgba(110, 232, 186, 0.18);
  background: linear-gradient(180deg, rgba(8, 39, 31, 0.82), rgba(4, 20, 17, 0.9));
  box-shadow: inset 0 1px 0 rgba(164, 255, 221, 0.04);
}

.system-twin-content :deep(.app-workflow-step.done),
.system-twin-content :deep(.ops-workflow-step.done),
.system-twin-content :deep(.lifecycle-step.done) {
  border-color: rgba(110, 232, 186, 0.24);
  background: linear-gradient(180deg, rgba(7, 54, 42, 0.84), rgba(4, 28, 23, 0.9));
}

.system-twin-content :deep(.app-workflow-step.active),
.system-twin-content :deep(.ops-workflow-step.active),
.system-twin-content :deep(.lifecycle-step.current),
.system-twin-content :deep(.stage-card.current) {
  border-color: rgba(255, 187, 99, 0.42);
  background: linear-gradient(180deg, rgba(72, 48, 9, 0.7), rgba(23, 21, 10, 0.92));
}

.system-twin-content :deep(.app-workflow-step.pending),
.system-twin-content :deep(.ops-workflow-step.pending) {
  border-color: rgba(110, 232, 186, 0.12);
  background: linear-gradient(180deg, rgba(8, 32, 27, 0.62), rgba(4, 18, 16, 0.82));
  opacity: 0.72;
}

.system-twin-content :deep(.section-title h2),
.system-twin-content :deep(.section-title h3),
.system-twin-content :deep(.panel-block h2),
.system-twin-content :deep(.panel-block h3),
.system-twin-content :deep(.report-section h2),
.system-twin-content :deep(.report-section h3),
.system-twin-content :deep(.lifecycle-step strong),
.system-twin-content :deep(.summary-item strong),
.system-twin-content :deep(.batch-metrics strong),
.system-twin-content :deep(.stage-status-grid strong),
.system-twin-content :deep(.production-summary-grid strong),
.system-twin-content :deep(.director-summary strong),
.system-twin-content :deep(strong),
.system-twin-content :deep(dd) {
  color: var(--cc-text);
}

.system-twin-content :deep(.app-workflow-step.active strong),
.system-twin-content :deep(.ops-workflow-step.active strong),
.system-twin-content :deep(.environment-action-card article strong),
.system-twin-content :deep(.environment-next-action strong) {
  color: var(--cc-warn);
}

.system-twin-content :deep(.section-title p),
.system-twin-content :deep(.panel-block p),
.system-twin-content :deep(.report-section p),
.system-twin-content :deep(.panel-block small),
.system-twin-content :deep(.report-section small),
.system-twin-content :deep(.lifecycle-step small),
.system-twin-content :deep(.lifecycle-step span),
.system-twin-content :deep(.summary-item span),
.system-twin-content :deep(.batch-metrics span),
.system-twin-content :deep(.batch-metrics small),
.system-twin-content :deep(.stage-status-grid span),
.system-twin-content :deep(.stage-status-grid small),
.system-twin-content :deep(.production-summary-grid span),
.system-twin-content :deep(.production-summary-grid small),
.system-twin-content :deep(span),
.system-twin-content :deep(dt),
.system-twin-content :deep(.muted) {
  color: var(--cc-muted);
}

.system-twin-content :deep(.lifecycle-step > span:first-child),
.system-twin-content :deep(.trace-dot) {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.82), rgba(31, 136, 96, 0.9));
  color: #032119;
}

.system-twin-content :deep(.section-title svg),
.system-twin-content :deep(.metric svg),
.system-twin-content :deep(.text-good),
.system-twin-content :deep(.text-ok) {
  color: #00f5b2;
}

.system-twin-content :deep(.text-warn),
.system-twin-content :deep(.warning) {
  color: var(--cc-warn);
}

.system-twin-content :deep(button:not(.drawer-close)),
.system-twin-content :deep(.btn-sm) {
  border-color: rgba(0, 245, 178, 0.28);
  background: rgba(0, 245, 178, 0.08);
  color: #dffff2;
}

.system-twin-content :deep(button:not(.drawer-close):hover),
.system-twin-content :deep(.btn-sm:not(:disabled):hover) {
  border-color: rgba(0, 245, 178, 0.52);
  background: rgba(0, 245, 178, 0.14);
}

.system-content-stage-body :deep(.section-content),
.system-content-stage-body :deep(.system-section),
.system-content-stage-body :deep(.system-page),
.system-content-stage-body :deep(.app-page),
.system-content-stage-body :deep(.ops-workbench-shell),
.system-content-stage-body :deep(.focused-workbench),
.system-content-stage-body :deep(.report-center) {
  display: grid;
  width: 100%;
  height: auto;
  max-height: none;
  min-height: 0;
  margin: 0;
  overflow: visible;
  background: transparent;
  box-shadow: none;
}

.system-content-stage-body :deep(.daily-workbench),
.system-content-stage-body :deep(.alarm-ops-page) {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  gap: 12px;
  height: auto;
  max-height: none;
  overflow: visible;
}

.system-content-stage-body :deep(.daily-page-header),
.system-content-stage-body :deep(.daily-flow-strip),
.system-content-stage-body :deep(.daily-workbench-grid > *),
.system-content-stage-body :deep(.alarm-page-header),
.system-content-stage-body :deep(.alarm-priority-card),
.system-content-stage-body :deep(.alarm-workflow-panel),
.system-content-stage-body :deep(.alarm-queue-panel) {
  grid-column: auto;
  grid-row: auto;
  width: 100%;
  height: auto;
  min-height: 0;
  overflow: visible;
}

.system-content-stage-body :deep(.daily-workbench-grid),
.system-content-stage-body :deep(.alarm-command-grid),
.system-content-stage-body :deep(.module-grid),
.system-content-stage-body :deep(.summary-grid),
.system-content-stage-body :deep(.batch-metrics),
.system-content-stage-body :deep(.production-summary-grid) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

.system-content-stage-body :deep(.panel-block),
.system-content-stage-body :deep(.report-section),
.system-content-stage-body :deep(.system-panel),
.system-content-stage-body :deep(.system-page-header),
.system-content-stage-body :deep(.app-page-header) {
  border-color: rgba(0, 245, 178, 0.2);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(7, 36, 30, 0.72), rgba(3, 20, 17, 0.9));
  box-shadow: inset 0 1px 0 rgba(166, 255, 222, 0.05);
}

.system-content-stage-body :deep(.daily-flow-strip) {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.system-content-stage-body :deep(.alarm-workflow) {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

</style>
