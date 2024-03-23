<template>
    <v-card-text v-if="infos">
        <div class="font-weight-bold ms-1 mb-2">{{ infos.time }}</div>
        <v-timeline align="start" density="compact">
            <v-timeline-item v-for="season in infos.seasons" :key="season.id" size="x-small">
                <div class="mb-4">
                    <div class="font-weight-normal">
                        {{ season.addedAt }}
                    </div>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-card-text>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { onBeforeMount, ref } from 'vue';
import type { Season, SeasonInfos } from "@/models/season";
import { useSeason } from "@/composables/season";

const props = defineProps({
    id: { type: Number, required: true },
    season: { type: Object as PropType<Season>, required: true }
});

const infos = ref<SeasonInfos>();
const { getSeasonInfosBySerieIdByNumber } = useSeason();

const fetchSeasons = async () => {
    infos.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
}

onBeforeMount(async () => {
    await fetchSeasons();
});
</script>