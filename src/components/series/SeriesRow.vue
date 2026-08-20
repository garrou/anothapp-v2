<template>
    <span v-if="total">{{ buildPlural("série", series.length) }}</span>
    <card-grid v-if="series.length || loading" class="mt-2" :items="series" :loading="loading" :md="3">
        <template #default="{ item: serie }">
            <serie-card :serie="serie" :watch-status="watchStatus" @refresh="(id: number) => $emit('refresh', id)" />
        </template>
    </card-grid>
    <div v-else class="text-center mt-2">Aucune série</div>
</template>

<script lang="ts" setup>
import CardGrid from "@/components/CardGrid.vue";
import SerieCard from "@/components/series/SerieCard.vue";
import type { Serie } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import type { PropType } from "vue";

defineProps({
    loading: { type: Boolean, required: true },
    series: { type: Array as PropType<Serie[]>, required: true },
    total: { type: Boolean, default: false },
    watchStatus: { type: Boolean, default: false }
});

defineEmits<{
    refresh: [number]
}>();
</script>