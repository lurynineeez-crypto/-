<script setup lang="ts">
import { Activity, ClipboardList, FileText, RefreshCcw, Search } from 'lucide-vue-next';

defineProps<{
  batchId: string;
  breadcrumbItems: string[];
  connectionState: string;
  pageAnchors: string[];
  simplifiedMode: string;
  simplifiedModes: string[];
}>();

const emit = defineEmits<{
  refresh: [];
  selectBatch: [];
  selectSearch: [];
  updateSimplifiedMode: [mode: string];
}>();
</script>

<template>
  <header class="topbar">
    <div>
      <p class="eyebrow">种植方舱运营</p>
      <h1>方舱工作台</h1>
    </div>
    <div class="topbar-actions">
      <span class="live-pill">
        <Activity :size="16" />
        {{ connectionState }}
      </span>
      <button class="icon-button" type="button" title="导出报告">
        <FileText :size="18" />
      </button>
      <button class="icon-button" type="button" title="复制摘要">
        <ClipboardList :size="18" />
      </button>
      <button class="icon-button" type="button" title="刷新" @click="emit('refresh')">
        <RefreshCcw :size="18" />
      </button>
    </div>
  </header>

  <section class="command-bar">
    <div class="breadcrumb">
      <span v-for="item in breadcrumbItems" :key="item">{{ item }}</span>
    </div>
    <button class="global-top-search" type="button" @click="emit('selectSearch')">
      <Search :size="16" />
      搜索点位、批次、报警、页面
    </button>
    <button class="batch-switcher" type="button" @click="emit('selectBatch')">批次：{{ batchId }}</button>
    <div class="segmented compact">
      <button
        v-for="mode in simplifiedModes"
        :key="mode"
        type="button"
        :class="{ active: simplifiedMode === mode }"
        @click="emit('updateSimplifiedMode', mode)"
      >
        {{ mode }}
      </button>
    </div>
  </section>
</template>
