<template>
    <poster-card :image="season.image" :to="serieLink" @click="$emit('show', season)">
        <v-card-title>Saison {{ season.number }}</v-card-title>

        <v-chip class="ml-2" :color="MAIN_COLOR" size="small">
            {{ text }}
        </v-chip>

        <template #actions>
            <slot name="add" />
            <slot name="show" />
        </template>
    </poster-card>
</template>

<script lang="ts" setup>
import PosterCard from "@/components/PosterCard.vue";
import type { Season } from "@/models/season";
import { buildPlural } from "@/utils/format";
import { computed, type PropType } from "vue";
import { MAIN_COLOR } from "@/constants/style";

const props = defineProps({
    season: { type: Object as PropType<Season>, required: true },
    serieLink: { type: String, default: undefined }
});

defineEmits<{
    show: [Season]
}>();

const text = computed(() => {
    const prefix = buildPlural("épisode", props.season.episodes);
    return props.season.interval ? `${prefix} (${props.season.interval})` : prefix;
});
</script>