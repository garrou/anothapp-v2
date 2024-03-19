<template>
    <v-container>
        <v-row>
            <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
                <v-skeleton-loader :loading="loading" type="card">
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
import serieService from "@/services/serieService";
import { onBeforeMount, ref } from "vue";

const props = defineProps({
    id: { type: Number, required: true }
});

const loading = ref(true);
const seasons = ref<Season[]>([]);

const getSeasons = async (): Promise<void> => {
    seasons.value = await serieService.getSeasonsBySerieId(props.id);
    loading.value = false;
}

onBeforeMount(async () => {
    await getSeasons();
});
</script>