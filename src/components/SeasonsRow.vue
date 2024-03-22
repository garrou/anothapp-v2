<template>
    <v-row>
        <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
            <v-skeleton-loader  :elevation="ELEVATION" :loading="loading" type="card">
                <v-responsive>
                    <season-card :season="season">
                        <template v-if="addable" #add>
                            <v-btn color="surface-variant" :icon="ADD_ICON" variant="text" @click="$emit('add', season)" />
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
import type { Season } from '@/models/season';
import { ELEVATION } from '@/constants/style';
import { ADD_ICON } from '@/constants/icons';

defineProps({
    addable: { type: Boolean, default: false },
    seasons: { type: Array as PropType<Season[]>, required: true },
    loading: { type: Boolean, required: true }
});
</script>@/models/season