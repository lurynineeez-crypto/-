<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next';

defineProps<{
  title: string;
  cards: Array<{ label: string; value: string | number; note?: string }>;
}>();
</script>

<template>
  <article class="system-panel page-summary-panel" style="grid-column: 1 / -1;">
    <div class="system-panel-header">
      <SlidersHorizontal :size="18" />
      <h2>{{ title }}</h2>
    </div>
    <div class="review-grid">
      <article v-for="item in cards" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small v-if="item.note">{{ item.note }}</small>
      </article>
    </div>
  </article>
</template>
