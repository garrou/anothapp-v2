<template>
    <v-container>
        <v-row>
            <v-col v-for="season in seasons" cols="6" md="4" lg="3">
                <season-card :season="season" />
            </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :text="message" />
    </v-container>
</template>

<script lang="ts" setup>
import SeasonCard from "@/components/SeasonCard.vue";
import type { Season } from "@/models/internal/season";
import serieService from "@/services/serieService";
import { isSuccess } from "@/utils/response";
import { onBeforeMount, ref, watch } from "vue";

const props = defineProps({
    id: { type: Number, required: true }
});

const message = ref("");
const seasons = ref<Season[]>([]);
const snackbar = ref(false);

const getSeasons = async (): Promise<Season[]> => {
    const resp = await serieService.getSeasonsBySerieId(props.id);
    const data = await resp.json();

    if (isSuccess(resp.status)) {
        return data;
    } 
    message.value = data.message;
    return [];
}

onBeforeMount(async () => {
    seasons.value = await getSeasons();
});

watch(message, () => {
    snackbar.value = true;
});
</script>