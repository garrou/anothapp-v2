<template>
  <base-bar-chart class="mb-2" color="#1ae86c" :data="data" title="Episodes par mois cette année" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getEpisodesMonthCurrYear } = useStatistic();

const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  data.value = await getEpisodesMonthCurrYear(props.userId);
});
</script>