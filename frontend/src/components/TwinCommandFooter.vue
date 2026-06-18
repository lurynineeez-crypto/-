<script setup lang="ts">
import type { Component } from 'vue';
import type { ViewKey } from '../types';

defineProps<{
  modules: Array<{
    icon?: Component;
    label: string;
    value: string;
    tone?: string;
  }>;
  actions: Array<{
    label: string;
    view: ViewKey;
  }>;
}>();

const emit = defineEmits<{
  navigate: [view: ViewKey];
}>();
</script>

<template>
  <footer class="twin-command-bar">
    <div class="status-modules" aria-label="运行证据链路">
      <article
        v-for="module in modules"
        :key="module.label"
        :class="['twin-status-module', module.tone]"
      >
        <component v-if="module.icon" :is="module.icon" :size="17" />
        <span>{{ module.label }}</span>
        <strong>{{ module.value }}</strong>
      </article>
    </div>
    <nav class="command-evidence-actions" aria-label="总控快捷入口">
      <button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="emit('navigate', action.view)"
      >
        {{ action.label }}
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.twin-command-bar {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(560px, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 5px 14px;
  border: 1px solid rgba(0, 245, 178, 0.42);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(5, 38, 30, 0.82), rgba(2, 17, 14, 0.96));
  color: rgba(224, 255, 240, 0.82);
  box-shadow: 0 0 26px rgba(0, 245, 178, 0.2), inset 0 1px 0 rgba(166, 255, 222, 0.08);
}

.twin-command-bar::before {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 178, 0.9), transparent);
}

.status-modules {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;
}

.twin-status-module {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(0, 245, 178, 0.12);
  border-radius: 7px;
  background: rgba(3, 31, 25, 0.52);
  cursor: default;
}

.twin-status-module svg {
  display: block;
  align-self: center;
  justify-self: center;
  color: #00f5b2;
}

.twin-status-module span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 17px;
  color: rgba(172, 220, 202, 0.68);
  font-size: 11px;
  line-height: 17px;
  letter-spacing: 0.12em;
}

.twin-status-module strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 17px;
  color: #00f5b2;
  font-size: 14px;
  font-weight: 750;
  line-height: 17px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.twin-status-module.warning strong,
.twin-status-module.warning svg {
  color: #ffb22e;
}

.command-evidence-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 2px;
}

.command-evidence-actions button {
  min-height: 32px;
  padding: 0 13px;
  border: 1px solid rgba(0, 245, 178, 0.32);
  border-radius: 7px;
  background: rgba(2, 28, 22, 0.72);
  color: #00f5b2;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(147, 255, 214, 0.05);
  transition: background 0.16s ease, border-color 0.16s ease;
}

.command-evidence-actions button:hover {
  border-color: rgba(0, 245, 178, 0.58);
  background: rgba(9, 67, 50, 0.86);
}
</style>
