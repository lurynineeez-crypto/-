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
  border: 1px solid rgba(110, 232, 186, 0.18);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(5, 35, 29, 0.86), rgba(3, 21, 18, 0.94));
  box-shadow:
    inset 0 1px 0 rgba(156, 255, 213, 0.05),
    0 14px 30px rgba(2, 12, 10, 0.16);
}

.primary-nav-bar.system-nav {
  width: min(1600px, 100%);
  margin: 0 auto 12px;
  border-color: rgba(110, 232, 186, 0.2);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 35, 29, 0.9), rgba(3, 21, 18, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(156, 255, 213, 0.06),
    0 16px 32px rgba(2, 12, 10, 0.16);
}

.primary-nav-bar.system-nav.shell-ops {
  border-color: rgba(142, 246, 202, 0.24);
  background:
    radial-gradient(circle at 12% 0%, rgba(0, 245, 178, 0.1), transparent 28%),
    linear-gradient(180deg, rgba(5, 35, 29, 0.94), rgba(2, 17, 14, 0.98));
}

.primary-nav-bar.system-nav.shell-app {
  border-color: rgba(110, 232, 186, 0.2);
  background: linear-gradient(180deg, rgba(6, 39, 32, 0.92), rgba(4, 24, 20, 0.96));
}

.primary-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  border-bottom: 1px solid rgba(110, 232, 186, 0.12);
  background: rgba(2, 16, 14, 0.42);
}

.system-nav .primary-steps {
  min-height: 52px;
  border-bottom-color: rgba(110, 232, 186, 0.12);
  background: rgba(2, 16, 14, 0.46);
}

.primary-steps button {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 54px;
  padding: 10px 16px;
  border: 0;
  border-right: 1px solid rgba(110, 232, 186, 0.08);
  border-bottom: 2px solid transparent;
  background: transparent;
  color: rgba(190, 226, 210, 0.62);
  font-size: 14px;
  font-weight: 760;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
}

.system-nav .primary-steps button {
  position: relative;
  min-height: 52px;
  color: rgba(190, 226, 210, 0.62);
}

.primary-steps button:last-child {
  border-right: 0;
}

.primary-steps button.active {
  border-bottom-color: #70f2c0;
  background: linear-gradient(180deg, rgba(17, 93, 70, 0.34), rgba(8, 44, 35, 0.28));
  color: #effff7;
}

.system-nav .primary-steps button.active {
  border-bottom-color: transparent;
  background: linear-gradient(180deg, rgba(17, 93, 70, 0.34), rgba(8, 44, 35, 0.28));
  color: #effff7;
}

.system-nav .primary-steps button.active::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #8ef6ca, transparent);
  box-shadow: 0 0 14px rgba(142, 246, 202, 0.48);
}

.primary-steps button:hover {
  background: rgba(14, 78, 61, 0.28);
  color: #effff7;
}

.step-index {
  display: grid;
  place-items: center;
  width: 26px;
  height: 24px;
  border-radius: 6px;
  background: rgba(12, 52, 40, 0.72);
  color: rgba(172, 222, 198, 0.72);
  opacity: 1;
}

.primary-steps button.active .step-index {
  background: linear-gradient(180deg, rgba(82, 229, 172, 0.86), rgba(31, 136, 96, 0.92));
  color: #032119;
}

.secondary-nav {
  position: relative;
  z-index: 65;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(110, 232, 186, 0.1);
  background: rgba(4, 23, 20, 0.7);
}

.system-nav .secondary-nav {
  gap: 6px;
  padding: 9px 12px;
  border-bottom-color: rgba(110, 232, 186, 0.1);
  background: rgba(4, 23, 20, 0.72);
}

.secondary-nav button {
  min-height: 30px;
  padding: 0 11px;
  border: 1px solid rgba(110, 232, 186, 0.2);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(8, 38, 31, 0.9), rgba(5, 23, 19, 0.94));
  color: rgba(224, 255, 240, 0.78);
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease, color .12s ease;
}

.system-nav .secondary-nav button,
.system-nav .nav-more-tools summary {
  border-color: rgba(110, 232, 186, 0.22);
  background: linear-gradient(180deg, rgba(8, 38, 31, 0.9), rgba(5, 23, 19, 0.94));
  color: rgba(224, 255, 240, 0.78);
}

.secondary-nav button:hover {
  border-color: rgba(128, 255, 211, 0.38);
  background: rgba(16, 66, 52, 0.94);
}

.secondary-nav button.active {
  border-color: rgba(112, 242, 192, 0.46);
  background: linear-gradient(180deg, rgba(36, 157, 112, 0.78), rgba(13, 86, 62, 0.9));
  color: #042119;
}

.system-nav .secondary-nav button.active {
  border-color: rgba(142, 246, 202, 0.48);
  background: linear-gradient(180deg, rgba(64, 205, 146, 0.82), rgba(17, 107, 76, 0.92));
  color: #032119;
}

.secondary-nav button.aux-item {
  border-style: dashed;
  color: rgba(190, 226, 210, 0.6);
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
  border: 1px dashed rgba(110, 232, 186, 0.3);
  border-radius: 999px;
  background: rgba(8, 38, 31, 0.9);
  color: rgba(224, 255, 240, 0.72);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}

.nav-more-tools summary::-webkit-details-marker {
  display: none;
}

.nav-more-tools[open] summary {
  color: #032119;
  background: #70f2c0;
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
  border: 1px solid rgba(110, 232, 186, 0.22);
  border-radius: 8px;
  background: rgba(4, 25, 21, 0.98);
  box-shadow: 0 18px 40px rgba(2, 12, 10, 0.22);
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

