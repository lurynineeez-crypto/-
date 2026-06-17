<script setup lang="ts">
import type { Component } from 'vue';
import type { NavItem } from '../data/navigation';
import type { ViewKey } from '../types';
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

defineProps<{
  title: string;
  eyebrow: string;
  activeView: ViewKey;
  groupedNavItems: GroupedNavItem[];
  statusCards: StatusCard[];
  leftHeaderCards?: StatusCard[];
  rightHeaderCards?: StatusCard[];
  mode?: 'ops' | 'app';
}>();

const emit = defineEmits<{
  selectView: [view: ViewKey];
}>();
</script>

<template>
  <div :class="['system-twin-shell', mode === 'app' ? 'system-twin-shell-app' : 'system-twin-shell-ops']">
    <TwinSystemTopBar
      :title="title"
      :active-view="activeView"
      :grouped-nav-items="groupedNavItems"
      :left-cards="leftHeaderCards ?? statusCards.slice(0, 3)"
      :right-cards="rightHeaderCards ?? statusCards.slice(3, 5)"
      @select-view="emit('selectView', $event)"
    />

    <div class="system-twin-content">
      <slot />
    </div>

    <footer class="system-twin-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.system-twin-shell {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 7px;
  width: min(1600px, 100%);
  min-height: calc(100vh - 18px);
  margin: 0 auto;
  padding: 10px;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 12%, rgba(0, 245, 178, 0.12), transparent 28%),
    linear-gradient(180deg, #041c16 0%, #020f0d 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 245, 178, 0.16), 0 30px 70px rgba(0, 0, 0, 0.36);
}

.system-twin-shell-app {
  background:
    radial-gradient(circle at 50% 12%, rgba(0, 245, 178, 0.1), transparent 28%),
    linear-gradient(180deg, #041c16 0%, #020f0d 100%);
}

.system-twin-content {
  min-height: 0;
  overflow: auto;
  padding: 0;
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.46), rgba(2, 17, 14, 0.72));
  box-shadow: 0 0 26px rgba(0, 245, 178, 0.12), inset 0 1px 0 rgba(166, 255, 222, 0.06);
}

.system-twin-footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 62px;
  padding: 8px 16px;
  border: 1px solid rgba(0, 245, 178, 0.42);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  color: rgba(224, 255, 240, 0.82);
  box-shadow: 0 0 26px rgba(0, 245, 178, 0.2), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

.system-twin-footer::before {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 178, 0.9), transparent);
}

:deep(.system-twin-footer-status) {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  min-width: 184px;
  padding-right: 18px;
  border-right: 1px solid rgba(0, 245, 178, 0.18);
  color: rgba(172, 220, 202, 0.68);
}

:deep(.system-twin-footer-status span) {
  font-size: 10px;
  font-weight: 780;
  letter-spacing: 0.24em;
}

:deep(.system-twin-footer-status strong) {
  color: #00f5b2;
  font-size: 19px;
  font-weight: 920;
  letter-spacing: 0.18em;
  text-shadow: 0 0 18px rgba(0, 245, 178, 0.52);
}

:deep(.system-twin-footer-modules) {
  display: grid;
  grid-template-columns: repeat(5, minmax(80px, 1fr));
  flex: 1 1 auto;
  min-width: 0;
}

:deep(.system-twin-footer-modules article) {
  display: grid;
  place-items: center;
  gap: 2px;
  min-height: 38px;
  padding: 0 12px;
  border-right: 1px solid rgba(0, 245, 178, 0.14);
}

:deep(.system-twin-footer-modules article:last-child) {
  border-right: 0;
}

:deep(.system-twin-footer-modules span) {
  color: rgba(172, 220, 202, 0.68);
  font-size: 10px;
  font-weight: 760;
}

:deep(.system-twin-footer-modules strong) {
  color: #00f5b2;
  font-size: 22px;
  font-weight: 920;
  line-height: 1;
  text-shadow: 0 0 14px rgba(0, 245, 178, 0.42);
}

:deep(.system-twin-footer-actions) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 0 auto;
}

:deep(.system-twin-footer-actions button) {
  min-height: 30px;
  padding: 0 13px;
  border: 1px solid rgba(0, 245, 178, 0.34);
  border-radius: 5px;
  background: rgba(0, 245, 178, 0.08);
  color: #dffff2;
  font-size: 12px;
  font-weight: 820;
  cursor: pointer;
}

:deep(.system-twin-footer-actions button:hover) {
  border-color: rgba(0, 245, 178, 0.62);
  background: rgba(0, 245, 178, 0.16);
}
</style>
