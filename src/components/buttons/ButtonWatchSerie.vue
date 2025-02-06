<template>
    <v-tooltip v-if="!!serie" :text="watchText" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="watchColor" :icon="watchIcon" variant="text" @click="changeWatch" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const emit = defineEmits<{
    refresh: []
}>();

const { getSerieFromCache, updateField } = useSerie();
const { showSuccess } = useSnackbar();

const serie = ref<Serie>();
const isWatching = ref(false);

const watchText = computed(() => isWatching.value ? "Arrêter le visionnage" : "Reprendre le visionnage");
const watchColor = computed(() => isWatching.value ? "red" : "green");
const watchIcon = computed(() => isWatching.value ? "mdi-close-circle" : "mdi-play");

const changeWatch = async (): Promise<void> => {
    if (!serie.value) throw new Error("Impossible de modifier la série");
    isWatching.value = await updateField(serie.value, "watch");
    showSuccess(isWatching.value
        ? `Visionnage en cours pour "${serie.value.title}"`
        : `Visionnage arrêté pour "${serie.value.title}"`);
    emit("refresh");
}

onBeforeMount(async () => {
    serie.value = await getSerieFromCache(props.serieId);
    isWatching.value = serie.value?.watch ?? false;
});
</script>