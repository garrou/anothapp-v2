<template>
    <v-container v-if="serie">
        <base-toolbar icon="mdi-chevron-left" :title="serie.title">
            <template #firstBtn>
                <v-btn icon @click="add">
                    <v-icon :icon="ADD_ICON" />
                </v-btn>
            </template>
        </base-toolbar>

        <serie-detail :serie="serie" />
    </v-container>
</template>

<script lang="ts" setup>
import BaseToolbar from '@/components/BaseToolbar.vue';
import SerieDetail from '@/components/SerieDetail.vue';
import { useSearch } from '@/composables/search';
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { ADD_ICON } from '@/constants/icons';
import type { Serie } from '@/models/serie';
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
    id: { type: Number, required: true }
})

const { getSerie } = useSearch();
const { addSerie } = useSerie();
const { showError } = useSnackbar(); 

const serie = ref<Serie>();

const add = async () => {
    if (!serie.value) {
        showError("Impossible d'ajouter la série");
        return;
    }
    await addSerie(serie.value);
}

onBeforeMount(async () => {
    serie.value = await getSerie(props.id);
});
</script>