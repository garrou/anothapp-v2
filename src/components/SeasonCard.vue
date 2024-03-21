<template>
    <v-card>
        <base-image v-if="season.image" :src="season.image" class="align-end" cover />
        <v-card-title>Saison {{ season.number }}</v-card-title>
        <v-card-subtitle>{{ season.episodes }} épisodes</v-card-subtitle>

        <v-card-actions>
            <slot name="add" />
            <slot name="delete" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import type { Season } from "@/models/internal/season";
import type { PropType } from "vue";

defineProps({
    season: { type: Object as PropType<Season>, required: true }
});
</script>