<template>
    <v-container class="mt-10">
        <v-row>
            <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                <v-skeleton-loader :elevation="ELEVATION" :loading="loading" type="card">
                    <v-responsive>
                        <serie-card :serie="serie" @showSerie="showSerie" />
                    </v-responsive>
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import { SEARCH_ICON } from "@/constants/icons";
import { ELEVATION } from "@/constants/style";
import type { Serie } from "@/models/serie";
import { ref, type PropType } from "vue";

defineProps({
    loading: { type: Boolean, required: true },
    series: { type: Array as PropType<Serie[]>, required: true }
});

const emit = defineEmits<{
    "showSerie": [Serie]
}>();

const search = ref("");

const showSerie = (serie: Serie) => {
    emit("showSerie", serie);
}
</script>