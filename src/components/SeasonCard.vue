<template>
    <v-card>
        <template v-if="season.image">
            <router-link v-if="serieLink" :to="serieLink">
                <base-image v-if="season.image" class="align-end" cover :src="season.image" max-height="580" />
            </router-link>
            <base-image v-else class="align-end" cover :src="season.image" max-height="580" />
        </template>
        <div class="d-flex flex-row mt-2">
            <v-chip class="ml-2" color="black" size="small">
                Saison {{ season.number }}
            </v-chip>

            <v-chip class="ml-2" color="black" size="small">
                {{ buildPlural("épisode", season.episodes) }} - ({{ season.interval }})
            </v-chip>
        </div>

        <v-card-actions>
            <slot name="add" />
            <slot name="show" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import type { Season } from "@/models/season";
import { buildPlural } from "@/utils/format";
import type { PropType } from "vue";

defineProps({
    season: { type: Object as PropType<Season>, required: true },
    serieLink: { type: String, default: undefined }
});
</script>