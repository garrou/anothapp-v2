<template>
    <span v-if="total">{{ buildPlural("série", series.length) }}</span>
    <v-row v-if="series.length || loading" class="mt-1">
        <v-col v-for="serie in series" :cols="6" :md="3" :key="serie.id">
            <base-skeleton :loading="loading" type="card">
                <serie-card :serie="serie" :watch-status="watchStatus"
                    @refresh="(id, kind) => $emit('refresh', id, kind)" />
            </base-skeleton>
        </v-col>
    </v-row>
    <div v-else class="text-center">Aucune série</div>
</template>

<script lang="ts" setup>
import BaseSkeleton from "./BaseSkeleton.vue";
import SerieCard from "@/components/SerieCard.vue";
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
    refresh: [number, string]
}>();
</script>