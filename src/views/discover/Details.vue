<template>
    <div v-if="serie">
        <serie-hero :poster="serie.poster" :kinds="serie.kinds" :title="serie.title" @back="goBack" />

        <v-container>
            <div class="actions-row mb-6">
                <button-add-serie :serie-id="serie.id" primary />
                <button-favorite-serie :serie-id="serie.id" />
                <button-list-serie :serie="serie" />
            </div>

            <pill-tabs v-model="tab" class="mb-4" :tabs="DETAILS_TABS" />

            <v-window v-model="tab" class="pa-1">

                <v-window-item :value="1">
                    <serie-detail :serie="serie" />
                </v-window-item>

                <v-window-item :value="2" @group:selected="getChars">
                    <actors-row :characters="characters" :loading="loading" />
                </v-window-item>

                <v-window-item :value="3" @group:selected="getSimilars">
                    <base-skeleton :loading="loading" type="table-tbody">
                        <series-link-list :series="similars" base-path="/discover" />
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
    </div>
</template>

<script lang="ts" setup>
import ActorsRow from "@/components/actors/ActorsRow.vue";
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import FriendsRow from "@/components/friends/FriendsRow.vue";
import ImagesRow from "@/components/ImagesRow.vue";
import SerieDetail from "@/components/series/SerieDetail.vue";
import SerieHero from "@/components/series/SerieHero.vue";
import SeriesLinkList from "@/components/series/SeriesLinkList.vue";
import PillTabs from "@/components/PillTabs.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonListSerie from "@/components/buttons/ButtonListSerie.vue";
import { useFriend } from "@/composables/friend";
import { useSearch } from "@/composables/search";
import type { Character } from "@/models/person";
import type { Serie, Similar } from "@/models/serie";
import type { User } from "@/models/user";
import { goBack as navigateBack } from "@/utils/navigation";
import { onBeforeMount, ref } from "vue";
import { FriendStatus } from "@/types/types";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true }
})

const DETAILS_TABS = [
    { value: 1, label: "Informations" },
    { value: 5, label: "Vue par" },
    { value: 2, label: "Acteurs" },
    { value: 3, label: "Séries similaires" },
    { value: 4, label: "Images" }
];

const router = useRouter();
const { getFriends } = useFriend();
const { getCharacters, getSerie, getSerieImages, getSimilarsSeries } = useSearch();

const characters = ref<Character[]>([]);
const friends = ref<User[]>([]);
const images = ref<string[]>([]);
const loading = ref(false);
const serie = ref<Serie>();
const similars = ref<Similar[]>([]);
const tab = ref(1);

const goBack = () => navigateBack(router, "/discover");

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

<style scoped>
.actions-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
