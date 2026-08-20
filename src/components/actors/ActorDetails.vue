<template>
    <v-row align="center" class="pa-2">
        <v-col v-if="actor.poster" cols="12" md="6">
            <base-image max-height="580" :src="actor.poster" />
        </v-col>

        <v-col cols="12" md="6">
            <info-list :cards="cards" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/BaseImage.vue';
import InfoList from '@/components/InfoList.vue';
import { ActorDetailsLayout } from '@/layouts/actor-details-layout';
import type { Actor } from '@/models/person';
import type { PropType } from 'vue';

const props = defineProps({
    actor: { type: Object as PropType<Actor>, required: true }
});

const cards = ActorDetailsLayout(props.actor);
</script>