<template>
    <v-card>
        <template v-if="season.image">
            <router-link v-if="serieLink" :to="serieLink">
                <base-image v-if="season.image" class="align-end" cover :src="season.image" max-height="580" />
            </router-link>
            <base-image v-else class="align-end" cover :src="season.image" max-height="580" />
        </template>
        <v-card-title>Saison {{ season.number }}</v-card-title>
        <v-card-subtitle v-if="season.episodes">{{ season.episodes }} épisodes</v-card-subtitle>
        <v-card-subtitle v-if="season.interval">({{ season.interval }})</v-card-subtitle>

        <v-card-actions>
            <slot name="add" />
            <slot name="show" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import type { Season } from "@/models/season";
import type { PropType } from "vue";

defineProps({
    season: { type: Object as PropType<Season>, required: true },
    serieLink: { type: String, default: undefined }
});
</script>