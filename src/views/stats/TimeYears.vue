<template>
  <base-line-chart class="mb-2" color="#2bccf0" :data="data" title="Temps en heures par années" />
</template>

<script lang="ts" setup>
import BaseLineChart from "@/components/BaseLineChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getTimeByYears } = useStatistic();

const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  data.value = await getTimeByYears(props.userId);
});
</script>