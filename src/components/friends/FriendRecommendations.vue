<template>
    <div v-if="recommendations.length" class="pt-4 pb-0">
        <span class="v-card-title pa-0 px-4">Suggestions de vos amis</span>
        <card-grid class="mt-2" :items="recommendations" :loading="false" :sm="4" :md="2" :lg="2">
            <template #default="{ item }">
                <recommendation-card :recommendation="item" />
            </template>
        </card-grid>
    </div>
</template>

<script lang="ts" setup>
import CardGrid from "@/components/CardGrid.vue";
import RecommendationCard from "@/components/series/RecommendationCard.vue";
import { useSerie } from "@/composables/serie";
import type { Recommendation } from "@/models/serie";
import { onBeforeMount, ref } from "vue";

const { getRecommendations } = useSerie();

const recommendations = ref<Recommendation[]>([]);

onBeforeMount(async () => {
    recommendations.value = await getRecommendations();
});
</script>
