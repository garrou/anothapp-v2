<template>
    <v-container v-if="serie">
        <base-toolbar icon="mdi-chevron-left" :title="serie.title">
            <template #firstBtn>
                <v-btn elevation="0" :icon="ADD_ICON" @click="add" />
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
                            <v-card>
                                <base-image v-if="character.picture" cover max-height="580" :src="character.picture" />
                                <v-card-title>{{ character.actor }}</v-card-title>
                                <v-card-subtitle>{{ character.name }}</v-card-subtitle>

                                <v-card-actions>
                                    <v-btn :icon="DETAILS_ICON" variant="text" @click="showModal(character.id)" />
                                </v-card-actions>
                            </v-card>
                        </base-skeleton>
                    </v-col>
                </v-row>
            </v-window-item>

            <v-window-item :value="3" @group:selected="getSimilars">
                <base-skeleton :loading="loading" type="table-tbody">
                    <v-table>
                        <tbody>
                            <tr v-for="similar in similars" :key="similar.id">
                                <td>
                                    <router-link :text="similar.title" :to="`/discover/${similar.id}`" />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </base-skeleton>
            </v-window-item>

            <v-window-item :value="4" @group:selected="getImages">
                <images-row :images="images" :loading="loading" />
            </v-window-item>
        </v-window>
    </v-container>

    <base-modal v-if="actor" v-model="modal">
        <template #title>
            <v-spacer />
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>

        <v-row align="center" class="pa-2">
            <v-col v-if="actor.poster" cols="12" md="6">
                <base-image max-height="580" :src="actor.poster" />
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="mb-2">
                    <v-card-item>
                        <v-card-title>Nom</v-card-title>
                        <v-card-subtitle>{{ actor.name }}</v-card-subtitle>
                    </v-card-item>
                </v-card>

                <v-card class="mb-2">
                    <v-card-item>
                        <v-card-title>Naissance</v-card-title>
                        <v-card-subtitle>{{ actor.birthday }}</v-card-subtitle>
                    </v-card-item>
                </v-card>

                <v-card v-if="actor.deathday" class="mb-2">
                    <v-card-item>
                        <v-card-title>Mort</v-card-title>
                        <v-card-subtitle>{{ actor.deathday }}</v-card-subtitle>
                    </v-card-item>
                </v-card>

                <v-card class="mb-2">
                    <v-card-item>
                        <v-card-title>Nationalité</v-card-title>
                        <v-card-subtitle>{{ actor.nationality }}</v-card-subtitle>
                    </v-card-item>
                </v-card>

                <v-card class="mb-2">
                    <v-card-item>
                        <v-card-title>Description</v-card-title>
                        <v-card-subtitle>{{ actor.description }}</v-card-subtitle>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <series-row :loading="loading" :series="actor.series" total />

        <!-- <series-row :loading="loading" :series="actor.movies" total /> -->
    </base-modal>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import ImagesRow from "@/components/ImagesRow.vue";
import SerieDetail from "@/components/SerieDetail.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import { useSnackbar } from "@/composables/snackbar";
import { ADD_ICON, CLOSE_ICON, DETAILS_ICON } from "@/constants/icons";
import type { Actor, Character } from "@/models/person";
import type { Serie, Similar } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true }
})

const { getActor, getCharacters, getSerie, getSerieImages, getSimilarsSeries } = useSearch();
const { addSerie } = useSerie();
const { showError } = useSnackbar();

const actor = ref<Actor>();
const characters = ref<Character[]>([]);
const images = ref<string[]>([]);
const loading = ref(false);
const modal = ref(false);
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

const showModal = async (id: number) => {
    actor.value = await getActor(id);
    modal.value = true;
}

onBeforeMount(async () => {
    loading.value = true;
    serie.value = await getSerie(props.id);
    loading.value = false;
});

onBeforeRouteUpdate(async (to, from) => {
    if (to.params.id !== from.params.id) {
        loading.value = true;
        serie.value = await getSerie(to.params.id as unknown as number);
        loading.value = false;
    }
});
</script>