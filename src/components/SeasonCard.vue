<template>
    <v-card>
        <v-img v-if="season.image" :src="season.image" class="align-end" cover />

        <v-card-title>Saison {{ season.number }}</v-card-title>
        <v-card-subtitle>{{ season.episode }} épisodes</v-card-subtitle>

        <v-card-actions>
            <slot name="delete" />
            <slot name="add" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import type { Season } from "@/models/internal/season";
import type { PropType } from "vue";

defineProps({
    season: { type: Object as PropType<Season>, required: true }
});
</script>