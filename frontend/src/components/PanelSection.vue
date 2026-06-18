<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  description?: string;
  icon?: Component;
  wide?: boolean;
}>();
</script>

<template>
  <article :class="['system-panel', 'panel-section-shell', { 'panel-section-wide': wide }]">
    <header class="system-panel-header panel-section-title">
      <component :is="icon" v-if="icon" :size="18" />
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
    </header>
    <div class="panel-section-body">
      <slot />
    </div>
  </article>
</template>
