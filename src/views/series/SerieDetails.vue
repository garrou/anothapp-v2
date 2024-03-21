<template>
    <v-container>
        <v-breadcrumbs v-if="serie" :items="['series', serie.title]" />
        <v-row>
            <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
                <v-skeleton-loader :loading="loading" type="card" elevation="3">
                    <v-responsive>
                        <season-card :season="season" />
                    </v-responsive>
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import SeasonCard from "@/components/SeasonCard.vue";
import type { Season } from "@/models/internal/season";
import type { Serie } from "@/models/internal/serie";
import { onBeforeMount, ref } from "vue";
import { useSeason } from "@/composables/season";
import { useSerie } from "@/composables/serie";

const props = defineProps({
    id: { type: Number, required: true }
});

const { getSeasonsBySerieId } = useSeason();
const { getSerie } = useSerie();

const loading = ref(false);
const serie = ref<Serie>();
const seasons = ref<Season[]>([]);

const load = async (): Promise<void> => {
    loading.value = true;
    serie.value = await getSerie({ id: props.id });
    seasons.value = await getSeasonsBySerieId({ serieId: props.id });
    loading.value = false;
}

onBeforeMount(async () => {
    await load();
});
</script>