<template>
    <v-row>
        <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
            <base-skeleton :loading="loading" type="card">
                <template #content>
                    <season-card v-if="addable" :season="season">
                        <template #add>
                            <v-btn color="surface-variant" :icon="ADD_ICON" variant="text"
                                @click="$emit('addSeason', season)" />
                        </template>
                    </season-card>
                    <season-card v-else :season="season" @showSeason="$emit('showSeason', season)"
                        @click="$emit('showSeason', season)" />
                </template>
            </base-skeleton>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseSkeleton from "./BaseSkeleton.vue";
import SeasonCard from "./SeasonCard.vue";
import { type PropType } from "vue";
import type { Season } from "@/models/season";
import { ADD_ICON } from "@/constants/icons";

defineProps({
    addable: { type: Boolean, default: false },
    seasons: { type: Array as PropType<Season[]>, required: true },
    loading: { type: Boolean, required: true }
});

defineEmits<{
    addSeason: [Season]
    showSeason: [Season]
}>();
</script>