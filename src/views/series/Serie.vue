<template>
    <v-container v-if="infos">
        <base-toolbar icon="mdi-chevron-left" :title="infos.serie.title">
            <template #buttons>
                <button-details-serie :serie-id="id" />
                <button-favorite-serie :serie-id="id" />
                <button-watch-serie :serie-id="id" />
                <button-remove-serie :serie="infos.serie" />
            </template>
        </base-toolbar>
        <v-row>
            <v-col cols="12" sm="3">
                <base-image :src="infos.serie.poster" max-height="350" />
            </v-col>
            <v-col cols="12" sm="9">
                <v-card>
                    <v-card-title class="text-overline">
                        <div class="text-h4 font-weight-bold">{{ viewingPercent }}%</div>

                        <div class="text-h6 text-medium-emphasis font-weight-regular">
                            {{ buildPlural("Saison", infos.seasons.length, false, false) }}
                            {{ infos.seasons.length }} / {{ seasons.length }}
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <v-progress-linear height="20" :model-value="viewingPercent" rounded="lg" />

                        <div class="d-flex flex-column py-3">
                            <span class="font-weight-bold mb-2">
                                {{ buildPlural("épisode", infos.episodes) }}
                            </span>
                            <span class="font-weight-bold">{{ time }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-card class="my-2">
            <v-tabs v-model="tab">
                <v-tab :value="1">Mes saisons</v-tab>
                <v-tab :value="2">Ajouter</v-tab>
                <v-tab :value="3">Vue par</v-tab>
            </v-tabs>
        </v-card>

        <v-window v-model="tab" class="pa-1">
            <v-window-item :value="1">
                <seasons-row :loading="loading" :seasons="infos.seasons" @show-season="showSeason" />
            </v-window-item>
            <v-window-item :value="2">
                <seasons-row addable :loading="loading" :seasons="seasons" @add-season="newSeason" />
            </v-window-item>
            <v-window-item :value="3" @group:selected="getFriendsWhoWatch">
                <friends-row consult :friends="friends" />
            </v-window-item>
        </v-window>
    </v-container>

    <base-confirm v-if="infos?.serie" v-model="confirmModal" title="Supprimer"
        text="Confirmez-vous la suppression de la série ?" @cancel="confirmModal = false"
        @confirm="deleteSerie(infos.serie)" />

    <base-modal v-if="selected" v-model="modal" :max-width="500">
        <template #title>
            <span>Saison {{ selected.number }}</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <season-details :id="id" :season="selected" @refresh="refresh" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import ButtonWatchSerie from "@/components/ButtonWatchSerie.vue";
import ButtonFavoriteSerie from "@/components/ButtonFavoriteSerie.vue";
import ButtonRemoveSerie from "@/components/ButtonRemoveSerie.vue";
import ButtonDetailsSerie from "@/components/ButtonDetailsSerie.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseImage from "@/components/BaseImage.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import SeasonDetails from "@/components/SeasonDetails.vue";
import SeasonsRow from "@/components/SeasonsRow.vue";
import FriendsRow from "@/components/FriendsRow.vue";
import type { SerieInfo } from "@/models/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSeason } from "@/composables/season";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import type { Season } from "@/models/season";
import { buildPlural, minsToStringHoursDays } from "@/utils/format";
import { CLOSE_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { useFriend } from "@/composables/friend";
import { useState } from "@/composables/state";

const props = defineProps({
    id: { type: Number, required: true }
});

const { confirmModal } = useState();
const { getFriends } = useFriend();
const { addSeason } = useSeason();
const { deleteSerie, getSerieInfos } = useSerie();
const { getSeasonsBySerieId, getPlatforms } = useSearch();

const friends = ref<User[]>([]);
const infos = ref<SerieInfo>();
const isFavorite = ref(false);
const isWatching = ref(false);
const loading = ref(false);
const modal = ref(false);
const seasons = ref<Season[]>([]);
const selected = ref<Season>();
const tab = ref(1);

const time = computed(() => minsToStringHoursDays(infos.value?.time));
const viewingPercent = computed(() => ((infos.value?.seasons.length ?? 0) / seasons.value.length) * 100);

const refresh = async () => {
    modal.value = false;
    await load();
}

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerieInfos({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    isFavorite.value = infos.value?.serie.favorite ?? false;
    isWatching.value = infos.value?.serie.watch ?? false;
    loading.value = false;
}

const newSeason = async (season: Season): Promise<void> => {
    if (!infos.value?.serie) throw new Error("Impossible d'ajouter une saison");
    await addSeason(infos.value.serie, season);
    infos.value = await getSerieInfos({ id: props.id });
}

const showSeason = (season: Season): void => {
    selected.value = season;
    modal.value = true;
}

const getFriendsWhoWatch = async (): Promise<void> => {
    if (friends.value.length) return;
    loading.value = true;
    friends.value = (await getFriends("viewed", props.id)).viewed;
    loading.value = false;
}

onBeforeMount(async () => {
    await load();
    await getPlatforms();
});
</script>