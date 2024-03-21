<template>
    <v-card>
        <base-image v-if="season.image" class="align-end" cover :src="season.image" max-height="580" max-width="420" />
        <v-card-title>Saison {{ season.number }}</v-card-title>
        <v-card-subtitle :class="margin">{{ season.episodes }} épisodes</v-card-subtitle>

        <v-card-actions v-if="slots.add">
            <slot name="add" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import type { Season } from "@/models/internal/season";
import type { PropType } from "vue";
import { ref, useSlots } from "vue";

defineProps({
    season: { type: Object as PropType<Season>, required: true }
});

const slots = useSlots();
const margin = ref(slots.add ? "" : "mb-2");
</script>