<template>
    <base-pie-chart class="mb-2" :data="data" title="Temps par année" />
  </template>
  
  <script lang="ts" setup>
  import BasePieChart from '@/components/BasePieChart.vue';
  import type { Stat } from '@/models/stat';
  import { onBeforeMount, ref } from 'vue';
  import { useStatistic } from '@/composables/statistic';
  
  const { getSeriesRanking } = useStatistic();
  
  const data = ref<Stat[]>([]);
  
  onBeforeMount(async () => {
    data.value = await getSeriesRanking();
  });
  </script>