<template>
    <base-bar-chart class="mb-2" color="#e81a70" :data="data" title="Episodes par années" />
  </template>
  
  <script lang="ts" setup>
  import BaseBarChart from '@/components/BaseBarChart.vue';
  import type { Stat } from '@/models/stat';
  import { onBeforeMount, ref } from 'vue';
  import { useStatistic } from '@/composables/statistic';
  
  const { getEpisodesYears } = useStatistic();
  
  const data = ref<Stat[]>([]);
  
  onBeforeMount(async () => {
    data.value = await getEpisodesYears();
  });
  </script>