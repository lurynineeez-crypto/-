<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SensorPoint } from '../types';

const props = defineProps<{
  sensor: SensorPoint;
}>();

let el: HTMLDivElement | null = null;
let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

function buildSeries(sensor: SensorPoint) {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, index) => {
    const wave = Math.sin(index / 2.8) * 1.6;
    const drift = (index - 12) * 0.04;
    return {
      time: new Date(now - (23 - index) * 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number((sensor.reading.value + wave + drift).toFixed(2))
    };
  });
}

function render() {
  if (!el) return;
  chart ??= echarts.init(el);
  const series = buildSeries(props.sensor);
  chart.setOption({
    grid: { top: 16, right: 12, bottom: 24, left: 38 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: series.map((item) => item.time),
      axisLabel: { color: '#6b7280', fontSize: 10 },
      axisLine: { lineStyle: { color: '#d1d5db' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280', fontSize: 10 },
      splitLine: { lineStyle: { color: '#eef2f7' } }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: series.map((item) => item.value),
        lineStyle: { color: '#0f766e', width: 3 },
        areaStyle: { color: 'rgba(15, 118, 110, 0.12)' }
      }
    ]
  });
}

onMounted(() => {
  render();
  if (el) {
    resizeObserver = new ResizeObserver(() => chart?.resize());
    resizeObserver.observe(el);
  }
});

watch(() => props.sensor.id, render);
watch(() => props.sensor.reading.value, render);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <div ref="el" class="trend-chart"></div>
</template>
