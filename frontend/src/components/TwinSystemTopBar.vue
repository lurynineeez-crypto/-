<script setup lang="ts">
import type { Component } from 'vue';
import type { NavItem } from '../data/navigation';
import type { ViewKey } from '../types';

interface GroupedNavItem {
  name: string;
  items: NavItem[];
}

interface HeaderCard {
  icon?: Component;
  label: string;
  value: string;
  tone?: string;
}

const props = defineProps<{
  title: string;
  subtitle?: string;
  activeView?: ViewKey;
  groupedNavItems?: GroupedNavItem[];
  leftCards: HeaderCard[];
  rightCards: HeaderCard[];
}>();

const emit = defineEmits<{
  selectView: [view: ViewKey];
}>();

function isActiveGroup(group: GroupedNavItem) {
  return group.items.some((item) => item.key === props.activeView);
}

function selectItem(item: NavItem, event?: MouseEvent) {
  emit('selectView', item.key);
  const menu = (event?.currentTarget as HTMLElement | null)?.closest('details');
  menu?.removeAttribute('open');
}

function closeOtherMenus(event: Event) {
  const current = event.currentTarget as HTMLDetailsElement | null;
  if (!current?.open) return;
  current.parentElement
    ?.querySelectorAll<HTMLDetailsElement>('details.twin-nav-group-menu[open]')
    .forEach((menu) => {
      if (menu !== current) menu.removeAttribute('open');
    });
}
</script>

<template>
  <div class="twin-system-topbar">
    <header class="twin-header">
      <div class="twin-header-chips left">
        <article v-for="item in leftCards" :key="item.label" :class="['twin-header-chip', item.tone]">
          <component v-if="item.icon" :is="item.icon" :size="15" />
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>

      <div class="twin-header-title">
        <h1>{{ title }}</h1>
        <p>{{ subtitle ?? 'INTELLIGENT CULTIVATION CABIN · DIGITAL TWIN SYSTEM' }}</p>
      </div>

      <div class="twin-header-chips right">
        <article v-for="item in rightCards" :key="item.label" :class="['twin-header-chip', item.tone]">
          <component v-if="item.icon" :is="item.icon" :size="15" />
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
        <slot name="right-extra" />
      </div>
    </header>

    <nav v-if="groupedNavItems?.length" class="twin-unified-nav" aria-label="系统模块与页面选择">
      <details
        v-for="(group, index) in groupedNavItems"
        :key="group.name"
        :class="['twin-nav-group-menu', { active: isActiveGroup(group) }]"
        @toggle="closeOtherMenus"
      >
        <summary>
          <span class="twin-nav-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <strong class="twin-nav-label">{{ group.name }}</strong>
          <small class="twin-nav-count">{{ group.items.length }}</small>
        </summary>
        <div class="twin-nav-dropdown" role="menu">
          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            :class="{ active: item.key === activeView }"
            role="menuitem"
            @click="selectItem(item, $event)"
          >
            <span>{{ item.label }}</span>
            <small v-if="item.key === activeView">当前</small>
          </button>
        </div>
      </details>
    </nav>
  </div>
</template>

<style scoped>
.twin-system-topbar {
  --topbar-text: #ecfff8;
  --topbar-muted: rgba(172, 220, 202, 0.72);
  --topbar-green: #00f5b2;
  --topbar-amber: #ffb22e;
  display: grid;
  grid-template-rows: auto auto;
  gap: var(--shell-gap, 8px);
  min-width: 0;
  position: relative;
  z-index: 50;
}

.twin-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(430px, 1fr) minmax(420px, 0.9fr) minmax(500px, 1.08fr);
  align-items: center;
  min-height: 60px;
  gap: 0;
  padding: 0 12px;
  border: 1px solid rgba(0, 245, 178, 0.42);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 37, 29, 0.96), rgba(2, 17, 14, 0.98));
  box-shadow: 0 0 26px rgba(0, 245, 178, 0.2), inset 0 1px 0 rgba(167, 255, 220, 0.1);
}

.twin-header::before {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 178, 0.9), transparent);
}

.twin-header-chips {
  display: flex;
  align-items: center;
  min-width: 0;
}

.twin-header-chips.right {
  justify-content: flex-end;
}

.twin-header-chip {
  display: inline-flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 34px;
  padding: 0 10px;
  border-right: 1px solid rgba(0, 245, 178, 0.15);
  color: rgba(217, 255, 239, 0.8);
  line-height: 1;
  white-space: nowrap;
}

.twin-header-chip:last-child {
  border-right: 0;
}

.twin-header-chip svg {
  flex: 0 0 auto;
  color: var(--topbar-green);
  transform: translateY(-0.5px);
}

.twin-header-chip span {
  display: inline-flex;
  align-items: center;
  height: 16px;
  flex: 0 0 auto;
  color: var(--topbar-muted);
  font-size: 11px;
  font-weight: 720;
  line-height: 16px;
}

.twin-header-chip strong {
  display: inline-flex;
  align-items: center;
  height: 16px;
  flex: 0 0 auto;
  overflow: visible;
  color: var(--topbar-text);
  font-size: 13.5px;
  font-weight: 900;
  line-height: 16px;
  text-overflow: clip;
  white-space: nowrap;
}

.twin-header-chip.warn strong,
.twin-header-chip.warn svg {
  color: var(--topbar-amber);
  text-shadow: 0 0 12px rgba(255, 178, 46, 0.52);
}

.twin-header-chip.score strong {
  color: var(--topbar-green);
  text-shadow: 0 0 12px rgba(0, 245, 178, 0.62);
}

.twin-header-title {
  min-width: 0;
  min-height: auto;
  padding: 7px 12px;
  text-align: center;
}

.twin-header-title h1 {
  margin: 0;
  color: var(--topbar-text);
  font-size: 23px;
  font-weight: 920;
  letter-spacing: 0.13em;
  line-height: 1.1;
  text-shadow: 0 0 16px rgba(0, 245, 178, 0.5);
}

.twin-header-title p {
  margin: 3px 0 0;
  overflow: hidden;
  color: rgba(0, 245, 178, 0.66);
  font-size: 9px;
  font-weight: 780;
  letter-spacing: 0.2em;
  line-height: 1.18;
  text-overflow: clip;
  white-space: nowrap;
}

.twin-unified-nav {
  position: relative;
  z-index: 60;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  min-height: 38px;
  overflow: visible;
  border: 1px solid rgba(0, 245, 178, 0.18);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(3, 24, 20, 0.72), rgba(2, 14, 12, 0.86));
  box-shadow: inset 0 1px 0 rgba(152, 255, 214, 0.04);
}

.twin-nav-group-menu {
  position: relative;
  min-width: 0;
  border-right: 1px solid rgba(0, 245, 178, 0.08);
}

.twin-nav-group-menu:last-child {
  border-right: 0;
}

.twin-nav-group-menu summary {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  min-height: 38px;
  padding: 0 12px;
  color: rgba(172, 220, 202, 0.46);
  cursor: pointer;
  text-align: left;
  list-style: none;
}

.twin-nav-group-menu summary::-webkit-details-marker {
  display: none;
}

.twin-nav-group-menu.active summary {
  color: var(--topbar-text);
}

.twin-nav-group-menu[open] summary,
.twin-nav-group-menu summary:hover {
  background: rgba(9, 64, 49, 0.42);
}

.twin-nav-group-menu.active summary::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -1px;
  height: 1px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--topbar-green), transparent);
  box-shadow: 0 0 12px rgba(0, 245, 178, 0.48);
}

.twin-nav-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 17px;
  border-radius: 5px;
  background: rgba(12, 52, 40, 0.72);
  color: rgba(172, 222, 198, 0.62);
  font-size: 11.5px;
  font-weight: 900;
  line-height: 1;
  transform: translateY(-0.5px);
}

.twin-nav-group-menu.active .twin-nav-index {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.86), rgba(31, 136, 96, 0.92));
  color: #032119;
}

.twin-nav-label {
  display: inline-flex;
  align-items: center;
  height: 17px;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 17px;
  white-space: nowrap;
}

.twin-nav-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  margin-left: auto;
  border-radius: 999px;
  background: rgba(0, 245, 178, 0.08);
  color: rgba(172, 220, 202, 0.55);
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
}

.twin-nav-group-menu.active .twin-nav-count {
  color: rgba(236, 255, 248, 0.82);
}

.twin-nav-dropdown {
  position: absolute;
  z-index: 120;
  left: 8px;
  right: 8px;
  top: calc(100% + 6px);
  display: grid;
  gap: 6px;
  max-height: min(420px, calc(100vh - 170px));
  overflow: auto;
  padding: 8px;
  border: 1px solid rgba(0, 245, 178, 0.34);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(4, 37, 29, 0.98), rgba(1, 15, 13, 0.98));
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42), 0 0 24px rgba(0, 245, 178, 0.16),
    inset 0 1px 0 rgba(167, 255, 220, 0.08);
}

.twin-nav-dropdown button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid rgba(0, 245, 178, 0.14);
  border-radius: 6px;
  background: rgba(3, 31, 25, 0.82);
  color: rgba(217, 255, 239, 0.76);
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.twin-nav-dropdown button:hover {
  border-color: rgba(0, 245, 178, 0.38);
  background: rgba(7, 57, 45, 0.92);
  color: var(--topbar-text);
}

.twin-nav-dropdown button.active {
  border-color: rgba(0, 245, 178, 0.62);
  background: linear-gradient(180deg, rgba(14, 95, 72, 0.86), rgba(5, 49, 38, 0.94));
  color: var(--topbar-text);
}

.twin-nav-dropdown button span {
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  font-weight: 650;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.twin-nav-dropdown button small {
  flex: 0 0 auto;
  color: var(--topbar-green);
  font-size: 10px;
  font-weight: 800;
}

@media (max-width: 1420px) {
  .twin-header {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 8px;
  }

  .twin-header-chips,
  .twin-header-chips.right {
    justify-content: center;
    flex-wrap: wrap;
  }

  .twin-header-title {
    order: -1;
  }
}

@media (max-width: 1100px) {
  .twin-unified-nav {
    display: flex;
    overflow-x: auto;
  }

  .twin-nav-group-menu {
    flex: 0 0 220px;
  }
}

/* Shared topbar sizing guard. */
.twin-system-topbar .twin-header {
  grid-template-columns: minmax(430px, 1fr) minmax(420px, 0.9fr) minmax(500px, 1.08fr);
}

.twin-system-topbar .twin-header-chip {
  gap: 6px;
  padding: 0 10px;
}

.twin-system-topbar .twin-header-chip span {
  font-size: 11px;
  font-weight: 500;
}

.twin-system-topbar .twin-header-chip strong {
  flex: 0 0 auto;
  overflow: visible;
  font-size: var(--fs-chip-value, 13.5px);
  font-weight: 650;
  text-overflow: clip;
  white-space: nowrap;
}

.twin-system-topbar .twin-header-title h1 {
  font-size: var(--fs-system-title, var(--twin-font-title, 25px));
  font-weight: 700;
  letter-spacing: 0.12em;
}

.twin-system-topbar .twin-header-title p {
  font-size: var(--fs-system-subtitle, 9.5px);
  font-weight: 500;
  letter-spacing: 0.2em;
}

.twin-system-topbar .twin-nav-label {
  font-size: 12.5px;
  font-weight: 650;
}

.twin-system-topbar .twin-nav-index {
  font-size: 11.5px;
}

@media (max-width: 1420px) {
  .twin-system-topbar .twin-header {
    grid-template-columns: 1fr;
  }

  .twin-system-topbar .twin-header-title h1 {
    font-size: var(--twin-font-title-compact, 24px);
    letter-spacing: 0.1em;
  }
}
</style>
