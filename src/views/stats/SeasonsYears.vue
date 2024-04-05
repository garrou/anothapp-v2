<template>
    <base-bar-chart class="mb-2" color="#1a20e8" :data="data" title="Saisons par années" />
  </template>
  
  <script lang="ts" setup>
  import BaseBarChart from '@/components/BaseBarChart.vue';
  import type { Stat } from '@/models/stat';
  import { onBeforeMount, ref } from 'vue';
  import { useStatistic } from '@/composables/statistic';
  
  const { getSeasonsYears } = useStatistic();
  
  const data = ref<Stat[]>([]);
  
  onBeforeMount(async () => {
    data.value = await getSeasonsYears();
  });
  </script>