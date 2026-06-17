<script setup lang="ts">
import type { NavItem } from '../data/navigation';
import type { ViewKey } from '../types';

interface GroupedNavItem {
  name: string;
  items: NavItem[];
}

defineProps<{
  activeView: ViewKey;
  groupedNavItems: GroupedNavItem[];
}>();

const emit = defineEmits<{
  selectView: [view: ViewKey];
}>();

function isActiveGroup(group: GroupedNavItem, activeView: ViewKey) {
  return group.items.some((item) => item.key === activeView);
}
</script>

<template>
  <nav class="primary-nav-bar" aria-label="系统模块">
    <!-- 5个主入口 -->
    <div class="primary-steps">
      <button
        v-for="(group, index) in groupedNavItems"
        :key="group.name"
        type="button"
        :class="{ active: isActiveGroup(group, activeView) }"
        @click="emit('selectView', group.items[0].key)"
      >
        <span class="step-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ group.name }}</strong>
      </button>
    </div>

    <!-- 二级导航：当前激活分组下的子视图 -->
    <div
      v-for="group in groupedNavItems"
      v-show="isActiveGroup(group, activeView)"
      :key="group.name"
      class="secondary-nav"
    >
      <button
        v-for="item in primaryItems(group.items)"
        :key="item.key"
        type="button"
        :class="{ active: activeView === item.key, 'aux-item': isAuxItem(item.key) }"
        @click="emit('selectView', item.key)"
      >
        {{ item.label }}
      </button>
      <details v-if="overflowItems(group.items).length" class="nav-more-tools">
        <summary>更多工具</summary>
        <div>
          <button
            v-for="item in overflowItems(group.items)"
            :key="item.key"
            type="button"
            :class="{ active: activeView === item.key, 'aux-item': isAuxItem(item.key) }"
            @click="emit('selectView', item.key)"
          >
            {{ item.label }}
          </button>
        </div>
      </details>
    </div>
  </nav>
</template>

<script lang="ts">
const AUX_KEYS: ViewKey[] = [
  'screen',
  'calendar',
  'recipe',
  'closure',
  'biosecurity',
  'experience',
  'quality',
  'professional',
  'security',
  'settings',
  'search',
  'explain',
  'display',
  'governance',
  'drill',
  'delivery'
];
const CORE_LIMIT = 6;
function isAuxItem(key: ViewKey): boolean {
  return AUX_KEYS.includes(key);
}
function primaryItems(items: NavItem[]): NavItem[] {
  const core = items.filter((item) => !isAuxItem(item.key)).slice(0, CORE_LIMIT);
  return core.length ? core : items.slice(0, CORE_LIMIT);
}
function overflowItems(items: NavItem[]): NavItem[] {
  const visible = new Set(primaryItems(items).map((item) => item.key));
  return items.filter((item) => !visible.has(item.key));
}
</script>

<style scoped>
.primary-nav-bar {
  position: relative;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: min(1600px, 100%);
  margin: 0 auto 12px;
  overflow: visible;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.primary-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  border-bottom: 1px solid var(--border);
  background: var(--surface-strong);
}

.primary-steps button {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 54px;
  padding: 10px 16px;
  border: 0;
  border-right: 1px solid var(--border);
  border-bottom: 3px solid transparent;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 760;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
}

.primary-steps button:last-child {
  border-right: 0;
}

.primary-steps button.active {
  border-bottom-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary-strong);
}

.primary-steps button:hover {
  background: var(--hover);
  color: var(--fg);
}

.step-index {
  display: grid;
  place-items: center;
  width: 26px;
  height: 24px;
  border-radius: 6px;
  background: var(--surface-alt);
  color: var(--muted);
  opacity: 1;
}

.primary-steps button.active .step-index {
  background: var(--primary);
  color: var(--surface);
}

.secondary-nav {
  position: relative;
  z-index: 65;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-alt);
}

.secondary-nav button {
  min-height: 30px;
  padding: 0 11px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--fg);
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease, color .12s ease;
}

.secondary-nav button:hover {
  border-color: var(--border-strong);
  background: var(--hover);
}

.secondary-nav button.active {
  background: var(--primary);
  color: var(--surface);
}

.secondary-nav button.aux-item {
  border-style: dashed;
  color: var(--muted);
  opacity: 1;
}

.nav-more-tools {
  position: relative;
  flex: 0 0 auto;
  z-index: 80;
}

.nav-more-tools summary {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px dashed var(--border-strong);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}

.nav-more-tools summary::-webkit-details-marker {
  display: none;
}

.nav-more-tools[open] summary {
  color: var(--primary-strong);
  background: var(--primary-soft);
}

.nav-more-tools > div {
  position: absolute;
  top: 34px;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: min(620px, calc(100vw - 48px));
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}

@media (max-width: 900px) {
  .primary-steps {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x proximity;
  }

  .primary-steps button {
    flex: 0 0 168px;
    min-height: 46px;
    border-right: 0;
    border-bottom-width: 3px;
    scroll-snap-align: start;
  }

  .secondary-nav {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .secondary-nav button {
    flex: 0 0 auto;
  }
}
</style>

