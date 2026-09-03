<template>
    <span v-if="total">{{ buildPlural("série", series.length) }}</span>
    <card-grid v-if="series.length || loading" class="mt-2" :items="series" :loading="loading" :sm="4" :md="3"
        :lg="2" :xl="2">
        <template #default="{ item: serie }">
            <serie-card :serie="serie" :watch-status="watchStatus" :hide-details-button="hideDetailsButton"
                @refresh="(id: number, kind: 'favorite' | 'list' | 'watch') => $emit('refresh', id, kind)" />
        </template>
    </card-grid>
    <empty-state v-else icon="mdi-movie-open-outline" :title="emptyTitle" :description="emptyDescription">
        <v-btn v-if="emptyCta" color="primary" rounded="pill" to="/discover">Découvrir des séries</v-btn>
    </empty-state>
</template>

<script lang="ts" setup>
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import SerieCard from "@/components/series/SerieCard.vue";
import type { Serie } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import type { PropType } from "vue";

defineProps({
    emptyCta: { type: Boolean, default: true },
    emptyDescription: { type: String, default: "Il n'y a rien à afficher ici pour le moment." },
    emptyTitle: { type: String, default: "Aucune série" },
    hideDetailsButton: { type: Boolean, default: false },
    loading: { type: Boolean, required: true },
    series: { type: Array as PropType<Serie[]>, required: true },
    total: { type: Boolean, default: false },
    watchStatus: { type: Boolean, default: false }
});

defineEmits<{
    refresh: [id: number, kind: "favorite" | "list" | "watch"]
}>();
</script>