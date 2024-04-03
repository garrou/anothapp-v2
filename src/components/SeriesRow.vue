<template>
    <v-container>
        <v-row>
            <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                <v-skeleton-loader :elevation="ELEVATION" :loading="loading" type="card">
                    <v-responsive>
                        <serie-card :lovable="lovable" :serie="serie" @show-serie="$emit('showSerie', serie)" @refresh-favs="$emit('refreshFavs')" />
                    </v-responsive>
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import { ELEVATION } from "@/constants/style";
import type { Serie } from "@/models/serie";
import type { PropType } from "vue";

defineProps({
    loading: { type: Boolean, required: true },
    lovable: { type: Boolean, default: false },
    series: { type: Array as PropType<Serie[]>, required: true }
});

const emit = defineEmits<{
    showSerie: [Serie]
    refreshFavs: []
}>();
</script>