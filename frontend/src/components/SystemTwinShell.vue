<script setup lang="ts">
import type { Component } from 'vue';
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

type WorkspaceLayout = 'overview' | 'task' | 'batch' | 'ops' | 'delivery' | 'admin';

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
  workspaceLayout: WorkspaceLayout;
  mode?: 'ops' | 'app';
}>();

const emit = defineEmits<{
  selectView: [view: ViewKey];
}>();
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

    <div
      :class="[
        'system-twin-content',
        'system-shell-content',
        'twin-shared-content',
        `workspace-layout-${workspaceLayout}`
      ]"
    >
      <section class="system-workspace-canvas" :aria-label="eyebrow">
        <slot />
      </section>
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
  --bg: #03120f;
  --bg-soft: #061c16;
  --surface: rgba(4, 28, 23, 0.86);
  --surface-alt: rgba(2, 20, 17, 0.72);
  --surface-strong: rgba(7, 36, 30, 0.92);
  --fg: var(--cc-text);
  --muted: var(--cc-muted);
  --subtle: rgba(170, 218, 195, 0.56);
  --border: rgba(110, 232, 186, 0.18);
  --border-strong: rgba(132, 255, 211, 0.34);
  --primary: #00f5b2;
  --primary-strong: #8ef6ca;
  --primary-soft: rgba(0, 245, 178, 0.12);
  --hover: rgba(20, 110, 82, 0.42);
  --success: #8ef6ca;
  --warning: #ffbb63;
  --danger: #ff8375;
  --info: #7db7ff;
  --app-bg: #03120f;
  --app-bg-soft: #061c16;
  --app-surface: rgba(4, 28, 23, 0.86);
  --app-surface-alt: rgba(2, 20, 17, 0.72);
  --app-border: rgba(110, 232, 186, 0.18);
  --app-border-strong: rgba(132, 255, 211, 0.34);
  --app-text: var(--cc-text);
  --app-text-muted: var(--cc-muted);
  --app-text-subtle: rgba(170, 218, 195, 0.56);
  --app-primary: #00f5b2;
  --app-primary-strong: #8ef6ca;
  --app-primary-soft: rgba(0, 245, 178, 0.12);
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

.system-workspace-canvas {
  --ws-left: 320px;
  --ws-right: 340px;
  --ws-gap: var(--shell-gap);
  --ws-pad: 12px;
  --ws-radius: 8px;
  --ws-title: 16px;
  --ws-subtitle: 12px;
  --ws-card-title: 14px;
  --ws-body: 12.5px;
  --ws-caption: 11.5px;
  --ws-line: 1.38;
  --ws-line-tight: 1.16;
  --ws-panel-min: 92px;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--twin-border);
  border-radius: 10px;
  background:
    linear-gradient(rgba(95, 227, 176, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(95, 227, 176, 0.026) 1px, transparent 1px),
    linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  background-size: 48px 48px, 48px 48px, auto;
  box-shadow: var(--twin-glow), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

@media (max-height: 860px), (max-width: 1500px) {
  .system-workspace-canvas {
    --ws-left: 300px;
    --ws-right: 320px;
    --ws-pad: 10px;
    --ws-panel-min: 84px;
  }
}

.workspace-layout-overview .system-workspace-canvas,
.workspace-layout-ops .system-workspace-canvas {
  --workspace-density: compact;
}

.workspace-layout-task .system-workspace-canvas {
  --workspace-density: execution;
}

.workspace-layout-batch .system-workspace-canvas,
.workspace-layout-delivery .system-workspace-canvas,
.workspace-layout-admin .system-workspace-canvas {
  --workspace-density: management;
}

.system-workspace-canvas > :deep(.section-content),
.system-workspace-canvas > :deep(.system-section) {
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  margin: 0;
  overflow: hidden;
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

.system-twin-content :deep(.system-content-grid),
.system-twin-content :deep(.system-panel),
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

.system-twin-content :deep(.system-panel),
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
  border-color: rgba(110, 232, 186, 0.18) !important;
  background: linear-gradient(180deg, rgba(8, 39, 31, 0.82), rgba(4, 20, 17, 0.9)) !important;
  color: var(--cc-text) !important;
  box-shadow: inset 0 1px 0 rgba(164, 255, 221, 0.04) !important;
}

.system-twin-content :deep(.system-panel article:not(.no-system-skin)),
.system-twin-content :deep(.report-section article:not(.no-system-skin)),
.system-twin-content :deep(.system-panel li:not(.no-system-skin)),
.system-twin-content :deep(.report-section li:not(.no-system-skin)),
.system-twin-content :deep(.system-panel .card),
.system-twin-content :deep(.report-section .card) {
  border-color: rgba(110, 232, 186, 0.14) !important;
  background: rgba(2, 20, 17, 0.46) !important;
  color: var(--cc-text) !important;
}

.system-twin-content :deep(.system-panel [style*="background"]),
.system-twin-content :deep(.report-section [style*="background"]) {
  background: rgba(2, 20, 17, 0.52) !important;
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

.system-twin-content :deep(.system-panel-header h2),
.system-twin-content :deep(.system-panel-header h3),
.system-twin-content :deep(.system-panel h2),
.system-twin-content :deep(.system-panel h3),
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

.system-twin-content :deep(.system-panel-header p),
.system-twin-content :deep(.system-panel p),
.system-twin-content :deep(.report-section p),
.system-twin-content :deep(.system-panel small),
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

.system-twin-content :deep(.system-panel-header svg),
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

/* Workspace zoning standard
   Third-module pages keep the approved shell size and only reorganize content inside it.
   Region intent: left = context, center = primary work, right = status / evidence / feedback. */
.system-twin-content :deep(.system-content-grid),
.system-twin-content :deep(.focused-workbench > .system-content-grid),
.system-twin-content :deep(.report-center) {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: var(--ws-pad);
  overflow: auto;
  scrollbar-gutter: stable;
}

.system-twin-content :deep(*) {
  box-sizing: border-box;
}

.system-twin-content :deep(input),
.system-twin-content :deep(select),
.system-twin-content :deep(textarea) {
  min-height: 32px;
  border: 1px solid rgba(110, 232, 186, 0.2) !important;
  border-radius: var(--ws-radius);
  background: rgba(2, 20, 17, 0.66) !important;
  color: var(--cc-text) !important;
  box-shadow: inset 0 1px 0 rgba(164, 255, 221, 0.04) !important;
}

.system-twin-content :deep(input::placeholder),
.system-twin-content :deep(textarea::placeholder) {
  color: rgba(170, 218, 195, 0.52) !important;
}

.system-twin-content :deep(select option) {
  color: var(--cc-text);
  background: #03120f;
}

.system-twin-content :deep(.system-content-grid) {
  display: grid;
  grid-template-columns: var(--ws-left) minmax(0, 1fr) var(--ws-right);
  grid-auto-rows: auto;
  align-content: start;
  gap: var(--ws-gap);
}

.system-twin-content :deep(.report-center) {
  display: grid;
  grid-template-columns: var(--ws-left) minmax(0, 1fr) var(--ws-right);
  grid-auto-rows: auto;
  align-content: start;
  gap: var(--ws-gap);
}

.system-twin-content :deep(.system-content-grid > .system-panel),
.system-twin-content :deep(.report-center > .report-section),
.system-twin-content :deep(.focused-workbench > .system-panel) {
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 13px;
  border-radius: var(--ws-radius);
}

.system-twin-content :deep(.system-content-grid > .system-panel[class*="-wide"]),
.system-twin-content :deep(.system-content-grid > .system-panel[class*="wide"]),
.system-twin-content :deep(.report-center > .report-section:not(.report-hero)) {
  grid-column: span 2;
}

.system-twin-content :deep(.system-content-grid > .system-panel:first-child[class*="-wide"]),
.system-twin-content :deep(.system-content-grid > .system-panel:first-child[class*="wide"]),
.system-twin-content :deep(.report-center > .report-hero) {
  grid-column: 1 / -1;
}

.system-twin-content.workspace-layout-task :deep(.system-content-grid),
.system-twin-content.workspace-layout-ops :deep(.system-content-grid) {
  grid-template-columns: var(--ws-left) minmax(0, 1fr) var(--ws-right);
}

.system-twin-content.workspace-layout-batch :deep(.system-content-grid) {
  grid-template-columns: var(--ws-left) minmax(420px, 1fr) var(--ws-right);
}

.system-twin-content.workspace-layout-batch :deep(.growth-layout) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.system-twin-content.workspace-layout-delivery :deep(.system-content-grid),
.system-twin-content.workspace-layout-delivery :deep(.report-center),
.system-twin-content.workspace-layout-admin :deep(.system-content-grid) {
  grid-template-columns: minmax(280px, 0.85fr) minmax(520px, 1.4fr) minmax(280px, 0.85fr);
}

.system-twin-content.workspace-layout-task :deep(.user-layout > .user-wide:first-child),
.system-twin-content.workspace-layout-task :deep(.sop-layout > .sop-panel:first-child) {
  grid-column: 2;
  grid-row: 1 / span 3;
}

.system-twin-content.workspace-layout-task :deep(.user-layout > .system-panel:nth-child(2)),
.system-twin-content.workspace-layout-task :deep(.sop-layout > .system-panel:nth-child(2)) {
  grid-column: 1;
}

.system-twin-content.workspace-layout-task :deep(.user-layout > .system-panel:nth-child(3)),
.system-twin-content.workspace-layout-task :deep(.sop-layout > .system-panel:nth-child(3)) {
  grid-column: 3;
}

.system-twin-content.workspace-layout-batch :deep(.batch-layout > .batch-command-hero),
.system-twin-content.workspace-layout-batch :deep(.director-layout > .director-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.economics-layout > .economics-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.quality-layout > .quality-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.strategy-layout > .strategy-wide:first-child) {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.system-twin-content.workspace-layout-batch :deep(.batch-layout > .batch-command-hero) {
  grid-column: 1 / -1 !important;
  grid-row: auto !important;
}

.system-twin-content.workspace-layout-batch :deep(.batch-layout > .lifecycle-wide:nth-child(2)),
.system-twin-content.workspace-layout-batch :deep(.growth-layout > .growth-wide),
.system-twin-content.workspace-layout-batch :deep(.calendar-layout > .calendar-wide),
.system-twin-content.workspace-layout-batch :deep(.production-layout > .production-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.harvest-layout > .harvest-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.review-meeting-layout > .review-meeting-wide:first-child),
.system-twin-content.workspace-layout-batch :deep(.collaboration-layout > .collaboration-wide:first-child) {
  grid-column: 1 / -1 !important;
  grid-row: auto !important;
}

.system-twin-content.workspace-layout-ops :deep(.professional-layout > .score-card),
.system-twin-content.workspace-layout-ops :deep(.decision-layout > .score-card) {
  grid-column: 1;
  grid-row: 1 / span 2;
}

.system-twin-content.workspace-layout-ops :deep(.professional-layout > .health-panel),
.system-twin-content.workspace-layout-ops :deep(.decision-layout > .decision-wide:first-of-type) {
  grid-column: 2 / -1;
}

.system-twin-content.workspace-layout-delivery :deep(.report-center > .report-section:not(.report-hero)),
.system-twin-content.workspace-layout-admin :deep(.config-layout > .config-wide),
.system-twin-content.workspace-layout-admin :deep(.history-layout > .history-wide) {
  grid-column: 2 / -1;
}

.system-twin-content.workspace-layout-delivery :deep(.delivery-layout > .delivery-wide),
.system-twin-content.workspace-layout-delivery :deep(.engineering-layout > .engineering-wide:first-child),
.system-twin-content.workspace-layout-delivery :deep(.integration-layout > .integration-wide:first-child),
.system-twin-content.workspace-layout-delivery :deep(.drill-layout > .drill-wide:first-child),
.system-twin-content.workspace-layout-delivery :deep(.search-layout > .search-wide:first-child),
.system-twin-content.workspace-layout-delivery :deep(.explain-layout > .system-panel:first-child) {
  grid-column: 2 / -1;
}

.system-twin-content.workspace-layout-ops :deep(.point-layout > .point-wide) {
  grid-column: 1 / -1 !important;
  grid-row: auto !important;
}

.system-twin-content :deep(.system-panel-header) {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(110, 232, 186, 0.16);
}

.system-twin-content :deep(.system-panel-header svg) {
  flex: 0 0 auto;
  margin-top: 0;
}

.system-twin-content :deep(.system-panel-header h2),
.system-twin-content :deep(.system-panel-header h3),
.system-twin-content :deep(.panel-section-title h2),
.system-twin-content :deep(.system-panel-header h3) {
  margin: 0;
  font-size: var(--ws-title);
  font-weight: 700;
  line-height: var(--ws-line-tight);
  letter-spacing: 0;
}

.system-twin-content :deep(.system-panel-header p),
.system-twin-content :deep(.panel-section-title p),
.system-twin-content :deep(.system-panel-header p) {
  margin: 4px 0 0;
  max-width: 68ch;
  font-size: var(--ws-subtitle);
  font-weight: 400;
  line-height: var(--ws-line);
}

.system-twin-content :deep(.system-panel strong),
.system-twin-content :deep(.report-section strong),
.system-twin-content :deep(.asset-row strong),
.system-twin-content :deep(.rtable-row strong),
.system-twin-content :deep(.threshold-list strong),
.system-twin-content :deep(.review-grid strong) {
  font-size: var(--ws-card-title);
  font-weight: 700;
  line-height: var(--ws-line-tight);
}

.system-twin-content :deep(.system-panel span),
.system-twin-content :deep(.system-panel p),
.system-twin-content :deep(.report-section span),
.system-twin-content :deep(.report-section p),
.system-twin-content :deep(.asset-row span),
.system-twin-content :deep(.rtable-row span),
.system-twin-content :deep(.threshold-list span),
.system-twin-content :deep(.review-grid span) {
  font-size: var(--ws-body);
  line-height: var(--ws-line);
}

.system-twin-content :deep(.system-panel small),
.system-twin-content :deep(.report-section small),
.system-twin-content :deep(.asset-row small),
.system-twin-content :deep(.rtable-row small),
.system-twin-content :deep(.threshold-list small),
.system-twin-content :deep(.review-grid small) {
  font-size: var(--ws-caption);
  line-height: var(--ws-line);
}

.system-twin-content :deep(.asset-table),
.system-twin-content :deep(.report-table),
.system-twin-content :deep(.threshold-list),
.system-twin-content :deep(.suggestion-list),
.system-twin-content :deep(.review-grid),
.system-twin-content :deep(.uniformity-grid),
.system-twin-content :deep(.timeline),
.system-twin-content :deep(.delivery-grid),
.system-twin-content :deep(.recipe-grid),
.system-twin-content :deep(.drill-grid),
.system-twin-content :deep(.search-results),
.system-twin-content :deep(.help-grid) {
  gap: 8px;
}

.system-twin-content :deep(.asset-row),
.system-twin-content :deep(.rtable-row),
.system-twin-content :deep(.threshold-list article),
.system-twin-content :deep(.suggestion-list article),
.system-twin-content :deep(.review-grid article),
.system-twin-content :deep(.uniformity-grid article),
.system-twin-content :deep(.delivery-grid article),
.system-twin-content :deep(.recipe-grid article),
.system-twin-content :deep(.drill-grid article),
.system-twin-content :deep(.search-results article),
.system-twin-content :deep(.help-grid article) {
  min-height: 46px;
  padding: 9px 11px;
  border-radius: var(--ws-radius);
}

.system-twin-content :deep(.asset-row.head),
.system-twin-content :deep(.rtable-head) {
  min-height: 34px;
  padding: 7px 11px;
  color: rgba(190, 232, 213, 0.72);
  font-size: var(--ws-caption);
  font-weight: 700;
}

.system-twin-content :deep(.score-card strong),
.system-twin-content :deep(.summary-item strong),
.system-twin-content :deep(.feature-value strong),
.system-twin-content :deep(.growth-state strong) {
  font-size: 20px;
  line-height: 1.1;
}

@media (max-width: 1180px) {
  .system-twin-content :deep(.system-content-grid),
  .system-twin-content :deep(.report-center) {
    grid-template-columns: minmax(0, 1fr);
  }

  .system-twin-content :deep(.system-content-grid > .system-panel),
  .system-twin-content :deep(.system-content-grid > .system-panel[class*="-wide"]),
  .system-twin-content :deep(.system-content-grid > .system-panel[class*="wide"]),
  .system-twin-content :deep(.report-center > .report-section),
  .system-twin-content :deep(.report-center > .report-hero) {
    grid-column: auto;
    grid-row: auto;
  }
}

</style>
