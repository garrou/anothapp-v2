<template>
  <base-bar-chart class="mb-2" color="#e81ac2" :data="data" title="Saisons par mois" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getSeasonsMonths } = useStatistic();

const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  data.value = await getSeasonsMonths(props.userId);
});
</script>