<template>
    <v-container v-if="serie">
        <base-toolbar icon="mdi-chevron-left" :title="serie.title">
            <template #firstBtn>
                <v-btn elevation="0" icon @click="add">
                    <v-icon :icon="ADD_ICON" />
                </v-btn>
            </template>
        </base-toolbar>

        <v-card class="mb-2">
            <v-tabs v-model="tab" align-tabs="title">
                <v-tab :value="1">Informations</v-tab>
                <v-tab :value="2">Acteurs</v-tab>
                <v-tab :value="3">Séries similaires</v-tab>
                <v-tab :value="4">Images</v-tab>
            </v-tabs>
        </v-card>

        <v-window v-model="tab" class="pa-1">

            <v-window-item :value="1">
                <serie-detail :serie="serie" />
            </v-window-item>

            <v-window-item :value="2" @group:selected="getChars">
                <v-row>
                    <v-col v-for="character in characters" cols="6" md="4" lg="3" :key="character.id">
                        <base-skeleton :loading="loading" type="card">
                            <template #content>
                                <v-card>
                                    <base-image v-if="character.picture" cover max-height="580"
                                        :src="character.picture" />
                                    <v-card-title>{{ character.actor }}</v-card-title>
                                    <v-card-subtitle>{{ character.name }}</v-card-subtitle>

                                    <v-card-actions>
                                        <v-btn :icon="DETAILS_ICON" variant="text" @click="" />
                                    </v-card-actions>
                                </v-card>
                            </template>
                        </base-skeleton>
                    </v-col>
                </v-row>
            </v-window-item>

            <v-window-item :value="3" @group:selected="getSimilars">
                <base-skeleton :loading="loading" type="table">
                    <template #content>
                        <v-table>
                            <tbody>
                                <tr v-for="similar in similars" :key="similar.id">
                                    <td>
                                        <router-link :text="similar.title" :to="`/discover/${similar.id}`" />
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </template>
                </base-skeleton>
            </v-window-item>

            <v-window-item :value="4" @group:selected="getImages">
                <v-row>
                    <v-col v-for="(image, index) in images" cols="6" md="4" lg="3" :key="index">
                        <base-skeleton :loading="loading" type="card">
                            <template #content>
                                <v-card>
                                    <base-image cover max-height="580" :src="image" />
                                </v-card>
                            </template>
                        </base-skeleton>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/BaseImage.vue';
import BaseSkeleton from '@/components/BaseSkeleton.vue';
import BaseToolbar from '@/components/BaseToolbar.vue';
import SerieDetail from '@/components/SerieDetail.vue';
import { useSearch } from '@/composables/search';
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { ADD_ICON, DETAILS_ICON } from '@/constants/icons';
import type { Character } from '@/models/person';
import type { Serie, Similar } from '@/models/serie';
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
    id: { type: Number, required: true }
})

const { getCharacters, getSerie, getSerieImages, getSimilarsSeries } = useSearch();
const { addSerie } = useSerie();
const { showError } = useSnackbar();

const characters = ref<Character[]>([]);
const images = ref<string[]>([]);
const loading = ref(false);
const serie = ref<Serie>();
const similars = ref<Similar[]>([]);
const tab = ref(1);

const add = async () => {
    if (!serie.value) {
        showError("Impossible d'ajouter la série");
        return;
    }
    await addSerie(serie.value);
}

const getChars = async () => {
    if (characters.value.length > 0) return;
    loading.value = true;
    characters.value = await getCharacters(props.id);
    loading.value = false;
}

const getSimilars = async () => {
    if (similars.value.length > 0) return;
    loading.value = true;
    similars.value = await getSimilarsSeries(props.id);
    loading.value = false;
}

const getImages = async () => {
    if (images.value.length > 0) return;
    loading.value = true;
    images.value = await getSerieImages(props.id);
    loading.value = false;
}

onBeforeMount(async () => {
    loading.value = true;
    serie.value = await getSerie(props.id);
    loading.value = false;
});
</script>