<template>
    <v-container v-if="infos && seasons">
        <v-toolbar density="compact">
            <v-app-bar-nav-icon @click="$router.back()">
                <v-icon>mdi-arrow-left</v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title>{{ infos.serie.title }}</v-toolbar-title>

            <v-btn icon @click="changeFavorite">
                <v-icon :color="favoriteColor">mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>

            <template v-slot:extension>
                <v-tabs v-model="tab" align-tabs="title">
                    <v-tab v-for="item in items" :key="item.value" :value="item.value">
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>

        <v-window v-model="tab" class="pa-1">

            <v-window-item title="Informations" :value="1">
                <v-card class="mb-1">
                    <v-card-title>Temps de visionnage</v-card-title>
                    <v-card-text>{{ time }}</v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>Saisons vues ({{ infos.seasons.length }} / {{ seasons.length }})</v-card-title>
                    <v-card-text>
                        <v-progress-linear v-model="infos.seasons.length" height="10" :max="seasons.length" rounded striped />
                    </v-card-text>
                </v-card>
            </v-window-item>

            <v-window-item title="Mes saisons" :value="2">
                <v-row>
                    <v-col v-for="season in infos.seasons" cols="6" md="4" lg="3" :key="season.number">
                        <v-skeleton-loader :loading="loading" type="card" elevation="3">
                            <v-responsive>
                                <season-card :season="season">
                                    <template #delete>
                                        <v-btn color="surface-variant" icon="mdi-delete" size="small" variant="text"
                                            @click="" />
                                    </template>
                                </season-card>
                            </v-responsive>
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script lang="ts" setup>
import SeasonCard from "@/components/SeasonCard.vue";
import type { SerieInfos } from "@/models/internal/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import { minsToStringHoursDays } from "@/utils/format";
import type { Season } from "@/models/internal/season";

const props = defineProps({
    id: { type: Number, required: true }
});

const items = ["Informations", "Saisons"].map((text, index) => ({ title: text, value: index + 1 }));

const { getSerie, updateFavorite } = useSerie();
const { getSeasonsBySerieId } = useSearch();

const loading = ref(false);
const infos = ref<SerieInfos>();
const seasons = ref<Season[]>();
const tab = ref(1);
const isFavorite = ref(infos.value?.serie.favorite);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerie({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    loading.value = false;
}

const changeFavorite = async () => {
    if (!infos.value?.serie) return
    isFavorite.value = await updateFavorite(infos.value?.serie);
}

onBeforeMount(async () => {
    await load();
});
</script>