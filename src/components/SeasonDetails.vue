<template>
    <v-card-text v-if="seasons.length">
        <div class="font-weight-bold ms-1 mb-2">{{ minsToStringHoursDays(time) }}</div>
        <v-timeline align="start" :density="DENSITY">
            <v-timeline-item v-for="season in seasons" size="x-small" :key="season.id">
                <v-card :subtitle="season.platform.name">
                    <template #prepend>
                        <v-avatar v-if="season.platform.logo" :image="season.platform.logo" />
                        <v-avatar v-else color="grey">
                            <v-icon color="white">mdi-movie-open-play</v-icon>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="text-subtitle-1">{{ formatDate(season.addedAt) }}</span>
                    </template>
                    <template #append>
                        <v-btn elevation="0" :icon="isEdited(season.id) ? 'mdi-close' : 'mdi-pencil'"
                            @click="editSeason(season.id)" />
                        <v-btn elevation="0" :icon="DELETE_ICON" @click="selectSeason(season.id)" />
                    </template>

                    <div v-if="isEdited(season.id)">
                        <v-card>
                            <v-card-item class="py-0">
                                <v-label>Plateformes</v-label>
                                <v-select v-model="platform" :density="DENSITY" :items="platforms" item-title="name"
                                    item-value="id" />
                                <v-card-actions>
                                    <v-btn elevation="0" icon="mdi-content-save" @click="update(season)" />
                                </v-card-actions>
                            </v-card-item>
                        </v-card>
                    </div>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-card-text>

    <base-confirm v-model="modal" text="Supprimer ce visionnage ?" title="Supprimer" persistent @cancel="modal = false"
        @confirm="dropSeason(selected)" />
</template>

<script lang="ts" setup>
import BaseConfirm from "./BaseConfirm.vue";
import type { PropType } from "vue";
import { onBeforeMount, ref } from "vue";
import type { Season, SeasonDetail } from "@/models/season";
import { useSeason } from "@/composables/season";
import { formatDate, minsToStringHoursDays } from "@/utils/format";
import { DENSITY } from "@/constants/style";
import { DELETE_ICON } from "@/constants/icons";
import { useSerie } from "@/composables/serie";
import type { Platform } from "@/models/serie";
import { useSearch } from "@/composables/search";
import { useSnackbar } from "@/composables/snackbar";

const props = defineProps({
    id: { type: Number, required: true },
    season: { type: Object as PropType<Season>, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

const { showError } = useSnackbar();
const { getPlatforms } = useSearch();
const { getSerie } = useSerie();
const { deleteSeason, getSeasonInfosBySerieIdByNumber, updateSeason } = useSeason();

const modal = ref(false);
const seasons = ref<SeasonDetail[]>([]);
const selected = ref(-1);
const time = ref(0);
const toEdit = ref(-1);
const platforms = ref<Platform[]>([]);
const platform = ref<number>();

const isEdited = (id: number): boolean => toEdit.value === id;

const editSeason = (id: number) => {
    toEdit.value = toEdit.value == id ? -1 : id;
}

const selectSeason = (id: number) => {
    selected.value = id;
    modal.value = true;
}

const dropSeason = async (id: number) => {
    await deleteSeason(id);
    modal.value = false;
    emit("refresh");
}

const update = async (season: SeasonDetail) => {
    if (!platform.value) {
        showError("Impossible de modifier la saison");
        return;
    }
    await updateSeason(season.id, platform.value);
}

onBeforeMount(async () => {
    platforms.value = await getPlatforms();
    seasons.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
    const serie = await getSerie({ id: props.id });
    time.value = serie.duration * props.season.episodes * seasons.value.length;
});
</script>