<template>
    <v-card>
        <div @click="$emit('show', season)" style="cursor: pointer;">
            <template v-if="season.image">
                <router-link v-if="serieLink" :to="serieLink">
                    <base-image v-if="season.image" class="align-end" cover :src="season.image" max-height="580" />
                </router-link>
                <base-image v-else class="align-end" cover :src="season.image" max-height="580" />
            </template>

            <v-card-title>Saison {{ season.number }}</v-card-title>

            <v-chip class="ml-2" :color="MAIN_COLOR" size="small">
                {{ text }}
            </v-chip>
        </div>
        <v-card-actions>
            <slot name="add" />
            <slot name="show" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
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