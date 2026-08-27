<template>
    <poster-card :image="recommendation.poster" :to="link">
        <template #quick-actions>
            <button-add-serie :serie-id="recommendation.id" quick />
        </template>

        <v-card-subtitle class="pt-4 pb-1 text-wrap font-weight-medium">
            <router-link class="recommendation-card-title" :text="recommendation.title" :to="link" />
        </v-card-subtitle>

        <v-card-text class="pt-0 pb-4 text-caption text-medium-emphasis">
            Aimé par {{ buildPlural("ami", recommendation.nbFriends) }} · {{ Math.round(recommendation.avgNote) }}/5
        </v-card-text>
    </poster-card>
</template>

<script lang="ts" setup>
import PosterCard from "@/components/PosterCard.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import type { Recommendation } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { type PropType } from "vue";

const props = defineProps({
    recommendation: { type: Object as PropType<Recommendation>, required: true }
});

const link = `/discover/${props.recommendation.id}`;
</script>

<style scoped>
.recommendation-card-title {
    color: inherit;
}
</style>
