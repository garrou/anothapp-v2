<template>
    <template v-if="seasons.length">
        <div class="font-weight-bold mb-2">{{ minsToStringHoursDays(time) }}</div>
        <v-card v-for="subSeason in seasons" class="mb-2" :key="subSeason.id" :subtitle="subSeason.platform.name">
            <template #prepend>
                <v-avatar v-if="subSeason.platform.logo" :image="subSeason.platform.logo" />
                <v-avatar v-else-if="subSeason.platform.name" color="grey">
                    <v-icon color="white" :icon="PLATFORM_ICON" />
                </v-avatar>
            </template>
            <template #title>
                <span class="text-subtitle-1">{{ formatDate(subSeason.addedAt) }}</span>
            </template>
            <template #append>
                <v-btn elevation="0" :icon="isEdited(subSeason.id) ? 'mdi-close' : 'mdi-pencil'"
                    @click="editSeason(subSeason.id)" />
                <v-btn elevation="0" :icon="DELETE_ICON" @click="selectSeason(subSeason.id)" />
            </template>

            <div v-if="isEdited(subSeason.id)" class="px-4">
                <v-label>Plateformes</v-label>
                <v-select v-model="platform" :density="DENSITY" :items="platforms" item-title="name" item-value="id"
                    @update:modelValue="updateSeason(toEdit, platform)" />
            </div>
        </v-card>
    </template>

    <base-confirm v-model="modal" text="Supprimer ce visionnage ?" title="Supprimer" persistent @cancel="modal = false"
        @confirm="dropSeason(selected)" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import type { PropType } from "vue";
import { onBeforeMount, ref, watch } from "vue";
import type { Season, SeasonDetail } from "@/models/season";
import { useSeason } from "@/composables/season";
import { formatDate, minsToStringHoursDays } from "@/utils/format";
import { DENSITY } from "@/constants/style";
import { DELETE_ICON, PLATFORM_ICON } from "@/constants/icons";
import { useSerie } from "@/composables/serie";
import type { Platform } from "@/models/serie";
import { useSearch } from "@/composables/search";

const props = defineProps({
    id: { type: Number, required: true },
    season: { type: Object as PropType<Season>, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

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
    toEdit.value = isEdited(id) ? -1 : id;
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

watch(toEdit, () => {
    platform.value = seasons.value.find((s) => s.id === toEdit.value)?.platform.id;
});

onBeforeMount(async () => {
    platforms.value = await getPlatforms();
    seasons.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
    const serie = await getSerie({ id: props.id });
    time.value = serie.duration * props.season.episodes * seasons.value.length;
});
</script>
