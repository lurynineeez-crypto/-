<script setup lang="ts">
import { computed } from 'vue';
import { SlidersHorizontal } from 'lucide-vue-next';
import PageSummaryBar from './PageSummaryBar.vue';
import type { SensorPoint } from '../types';

type EnvironmentCard = {
  title: string;
  icon: unknown;
  sensors: SensorPoint[];
  primary: string;
  secondary: string;
  insight: string;
};

type ControlRule = {
  name: string;
  when: string;
  action: string;
  target: string;
};

const props = defineProps<{
  activeView: 'environment' | 'control';
  controlRules: ControlRule[];
  environmentCards: EnvironmentCard[];
}>();

const emit = defineEmits<{
  selectSensor: [sensor: SensorPoint];
}>();

const opsSummaryCards = computed(() => [
  {
    label: '环境摘要',
    value: props.environmentCards[0]?.primary ?? '--',
    note: props.environmentCards[0]?.title ?? '当前环境监测'
  },
  {
    label: '控制规则',
    value: `${props.controlRules.length}条`,
    note: '联动控制已收口'
  },
  {
    label: '关键关注',
    value: props.environmentCards[1]?.secondary ?? 'CO2 / 温湿度',
    note: props.environmentCards[1]?.insight ?? '重点看波动与响应'
  },
  {
    label: '现场定位',
    value: props.environmentCards[0]?.sensors.length ? `${props.environmentCards[0].sensors.length}点` : '0点',
    note: '点位可直接回跳'
  }
]);
</script>

<template>
  <section class="module-grid" :class="{ wide: activeView === 'control' }">
    <template v-if="activeView === 'environment'">
      <article v-for="card in environmentCards" :key="card.title" class="panel-block feature-card">
        <div class="section-title">
          <component :is="card.icon" :size="18" />
          <h2>{{ card.title }}</h2>
        </div>
        <div class="feature-value">
          <strong>{{ card.primary }}</strong>
          <span>{{ card.secondary }}</span>
        </div>
        <p>{{ card.insight }}</p>
        <div class="mini-table">
          <button v-for="sensor in card.sensors.slice(0, 6)" :key="sensor.id" type="button" @click="emit('selectSensor', sensor)">
            <span>{{ sensor.name }}</span>
            <strong>{{ sensor.reading.value.toFixed(1) }}{{ sensor.reading.unit }}</strong>
          </button>
        </div>
      </article>
    </template>

    <template v-else>
      <article v-for="rule in controlRules" :key="rule.name" class="panel-block rule-card">
        <div class="section-title">
          <SlidersHorizontal :size="18" />
          <h2>{{ rule.name }}</h2>
        </div>
        <dl>
          <dt>触发条件</dt>
          <dd>{{ rule.when }}</dd>
          <dt>执行动作</dt>
          <dd>{{ rule.action }}</dd>
          <dt>关联硬件</dt>
          <dd>{{ rule.target }}</dd>
        </dl>
        <span class="rule-status">自动策略预留</span>
      </article>
    </template>
  </section>
</template>
