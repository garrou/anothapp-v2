<template>
    <v-row align="center" class="pa-2">
        <v-col v-if="actor.poster" cols="12" md="6">
            <base-image max-height="580" :src="actor.poster" />
        </v-col>

        <v-col cols="12" md="6">
            <template v-for="card in cards" :key="card.name">
                <v-card v-if="card.display !== false" class="mb-2">
                    <v-card-item>
                        <v-card-title>{{ card.name }}</v-card-title>
                        <v-card-text v-if="card.format === 'text'">{{ card.value }}</v-card-text>
                        <v-card-subtitle v-else>{{ card.value }}</v-card-subtitle>
                    </v-card-item>
                </v-card>
            </template>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/BaseImage.vue';
import { ActorDetailsLayout } from '@/layouts/actor-details-layout';
import type { Actor } from '@/models/person';
import type { PropType } from 'vue';

const props = defineProps({
    actor: { type: Object as PropType<Actor>, required: true }
});

const cards = ActorDetailsLayout(props.actor);
</script>