<template>
    <v-container v-if="serie">
        <base-toolbar icon="mdi-chevron-left" :title="serie.title">
            <template #buttons>
                <button-add-serie :serie-id="serie.id" />
                <button-favorite-serie :serie-id="serie.id" />
                <button-list-serie :serie="serie" />
            </template>
        </base-toolbar>

        <v-card class="mb-2">
            <v-tabs v-model="tab">
                <v-tab :value="1">Informations</v-tab>
                <v-tab :value="5">Vue par</v-tab>
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
                <actors-row :characters="characters" :loading="loading" />
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

            <v-window-item :value="5" @group:selected="getFriendsWhoWatch">
                <friends-row consult :friends="friends" :loading="loading" />
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script lang="ts" setup>
import ActorsRow from "@/components/actors/ActorsRow.vue";
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import FriendsRow from "@/components/friends/FriendsRow.vue";
import ImagesRow from "@/components/ImagesRow.vue";
import SerieDetail from "@/components/series/SerieDetail.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonListSerie from "@/components/buttons/ButtonListSerie.vue";
import { useFriend } from "@/composables/friend";
import { useSearch } from "@/composables/search";
import type { Character } from "@/models/person";
import type { Serie, Similar } from "@/models/serie";
import type { User } from "@/models/user";
import { onBeforeMount, ref } from "vue";
import { FriendStatus } from "@/types/types";

const props = defineProps({
    id: { type: Number, required: true }
})

const { getFriends } = useFriend();
const { getCharacters, getSerie, getSerieImages, getSimilarsSeries } = useSearch();

const characters = ref<Character[]>([]);
const friends = ref<User[]>([]);
const images = ref<string[]>([]);
const loading = ref(false);
const serie = ref<Serie>();
const similars = ref<Similar[]>([]);
const tab = ref(1);

const getChars = async () => {
    if (characters.value.length) return;
    loading.value = true;
    characters.value = await getCharacters(props.id);
    loading.value = false;
}

const getSimilars = async () => {
    if (similars.value.length) return;
    loading.value = true;
    similars.value = await getSimilarsSeries(props.id);
    loading.value = false;
}

const getImages = async () => {
    if (images.value.length) return;
    loading.value = true;
    images.value = await getSerieImages(props.id);
    loading.value = false;
}

const getFriendsWhoWatch = async (): Promise<void> => {
    if (friends.value.length) return;
    loading.value = true;
    friends.value = (await getFriends(FriendStatus.Viewed, props.id)).viewed;
    loading.value = false;
}

onBeforeMount(async () => {
    loading.value = true;
    serie.value = await getSerie(props.id);
    loading.value = false;
});
</script>
