<template>
    <v-btn v-if="!!serie" :color="watchColor" :icon="watchIcon" variant="text" @click="changeWatch" />
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import type { Serie } from '@/models/serie';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps({
    serieId: { type: Number, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

const { getSerieFromCache, updateField } = useSerie();
const { showSuccess } = useSnackbar();

const serie = ref<Serie>();
const isWatching = ref(false);

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