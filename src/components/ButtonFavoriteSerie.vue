<template>
    <v-btn v-if="!!serie" :color="favoriteColor" :icon="FAVORITE_ICON" variant="text" @click="changeFavorite" />
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { FAVORITE_ICON } from '@/constants/icons';
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
const isFavorite = ref(false);
const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const changeFavorite = async (): Promise<void> => {
    if (!serie.value) throw new Error("Impossible de modifier la série");
    isFavorite.value = await updateField(serie.value, "favorite");
    showSuccess(isFavorite.value
        ? `"${serie.value.title}" ajoutée aux favoris`
        : `"${serie.value.title}" supprimée des favoris`);
    emit("refresh");
}

onBeforeMount(async () => {
    serie.value = await getSerieFromCache(props.serieId);
    isFavorite.value = serie.value?.favorite ?? false;
});
</script>