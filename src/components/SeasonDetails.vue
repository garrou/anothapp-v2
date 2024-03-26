<template>
    <v-card-text v-if="infos">
        <div class="font-weight-bold ms-1 mb-2">{{ time }}</div>
        <v-timeline align="start" :density="DENSITY">
            <v-timeline-item v-for="season in infos.seasons" size="x-small" :key="season.id">
                <div class="mb-4">
                    <span class="font-weight-normal">{{ formatDate(season.addedAt) }}</span>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-card-text>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { computed, onBeforeMount, ref } from "vue";
import type { Season, SeasonInfo } from "@/models/season";
import { useSeason } from "@/composables/season";
import { formatDate, minsToStringHoursDays } from "@/utils/format";
import { DENSITY } from "@/constants/style";

const props = defineProps({
    id: { type: Number, required: true },
    season: { type: Object as PropType<Season>, required: true }
});

const { getSeasonInfosBySerieIdByNumber } = useSeason();

const infos = ref<SeasonInfo>();
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const fetchSeasons = async () => {
    infos.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
}

onBeforeMount(async () => {
    await fetchSeasons();
});
</script>