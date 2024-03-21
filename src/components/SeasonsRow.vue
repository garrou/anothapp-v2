<template>
    <v-row>
        <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
            <v-skeleton-loader :loading="loading" type="card" elevation="3">
                <v-responsive>
                    <season-card :season="season">
                        <template #add>
                            <slot name="add" />
                        </template>
                        <template #delete>
                            <slot name="delete" />
                        </template>
                    </season-card>
                </v-responsive>
            </v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import SeasonCard from './SeasonCard.vue';
import { type PropType } from 'vue';
import type { Season } from '@/models/internal/season';

defineProps({
    seasons: { type: Array as PropType<Season[]>, required: true },
    loading: { type: Boolean, required: true }
});
</script>