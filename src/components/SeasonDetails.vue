<template>
    <v-card-text v-if="infos">
        <div class="font-weight-bold ms-1 mb-2">{{ time }}</div>
        <v-timeline align="start" :density="DENSITY">
            <v-timeline-item v-for="season in infos.seasons" size="x-small" :key="season.id">
                <div class="mb-4">
                    <span class="font-weight-normal">{{ formatDate(season.addedAt) }}</span>
                    <v-btn class="mb-1" elevation="0" :icon="DELETE_ICON" @click="selectSeason(season.id)" />
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-card-text>

    <base-confirm v-model="modal" text="Supprimer ce visionnage ?" title="Supprimer" persistent
        @cancel="modal = false" @confirm="dropSeason(selected)" />
</template>

<script lang="ts" setup>
import BaseConfirm from "./BaseConfirm.vue";
import type { PropType } from "vue";
import { computed, onBeforeMount, ref } from "vue";
import type { Season, SeasonInfo } from "@/models/season";
import { useSeason } from "@/composables/season";
import { formatDate, minsToStringHoursDays } from "@/utils/format";
import { DENSITY } from "@/constants/style";
import { DELETE_ICON } from "@/constants/icons";

const props = defineProps({
    id: { type: Number, required: true },
    season: { type: Object as PropType<Season>, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

const { deleteSeason, getSeasonInfosBySerieIdByNumber } = useSeason();

const modal = ref(false);
const infos = ref<SeasonInfo>();
const selected = ref(-1);
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const selectSeason = (id: number) => {
    selected.value = id;
    modal.value = true;
}

const dropSeason = async (id: number) => {
    await deleteSeason(id);
    modal.value = false;
    emit("refresh");
}

const fetchSeasons = async () => {
    infos.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
}

onBeforeMount(async () => {
    await fetchSeasons();
});
</script>