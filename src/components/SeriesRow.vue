<template>
    <v-container>
        <span v-if="total">{{ buildPlural("série", series.length) }}</span>
        <v-row v-if="series.length || loading">
            <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                <base-skeleton :loading="loading" type="card">
                    <serie-card :lovable="lovable" :serie="serie" @refresh-favs="$emit('refreshFavs')" />
                </base-skeleton>
            </v-col>
        </v-row>
        <div v-else class="text-center">Aucune série</div>
    </v-container>
</template>

<script lang="ts" setup>
import BaseSkeleton from "./BaseSkeleton.vue";
import SerieCard from "@/components/SerieCard.vue";
import type { Serie } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import type { PropType } from "vue";

defineProps({
    loading: { type: Boolean, required: true },
    lovable: { type: Boolean, default: false },
    series: { type: Array as PropType<Serie[]>, required: true },
    total: { type: Boolean, default: false }
});

const emit = defineEmits<{
    refreshFavs: []
}>();
</script>