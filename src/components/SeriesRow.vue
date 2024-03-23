<template>
    <v-container class="mt-10">
        <v-form @submit="$emit('search', search)" @submit.prevent>
            <v-row align="center">
                <v-col cols="9">
                    <v-text-field v-model="search" label="Titre de la série" variant="underlined" />
                </v-col>
                <v-col cols="3">
                    <v-btn type="submit" size="small">
                        <v-icon :icon="SEARCH_ICON" />
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                    <v-skeleton-loader :elevation="ELEVATION" :loading="loading" type="card">
                        <v-responsive>
                            <serie-card :serie="serie" @show="show" />
                        </v-responsive>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import { SEARCH_ICON } from '@/constants/icons';
import { ELEVATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { ref, type PropType } from 'vue';

defineProps({
    loading: { type: Boolean, required: true },
    series: { type: Array as PropType<Serie[]>, required: true }
});

const emit = defineEmits<{
    "show": [Serie],
    "search": [string]
}>();

const search = ref("");

const show = (serie: Serie) => {
    emit("show", serie);
}
</script>