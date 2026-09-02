<template>
    <base-app-bar />

    <v-container>
        <card-grid v-if="actors.length" :items="actors" :loading="loading" :lg="3" :xl="3">
            <template #default="{ item: actor }">
                <poster-card :image="actor.picture" :to="`/actor/${actor.id}`">
                    <template #quick-actions>
                        <button-favorite-actor :actor-id="actor.id" :actor-name="actor.name" quick
                            @change="(isFavorite) => !isFavorite && removeFromList(actor.id)" />
                    </template>

                    <v-card-title>
                        <router-link class="actor-card-title" :text="actor.name" :to="`/actor/${actor.id}`" />
                    </v-card-title>
                </poster-card>
            </template>
        </card-grid>
        <empty-state v-else icon="mdi-account-star-outline" title="Aucun acteur favori"
            description="Ajoutez un acteur à vos favoris depuis sa fiche ou le casting d'une série." />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import ButtonFavoriteActor from "@/components/buttons/ButtonFavoriteActor.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PosterCard from "@/components/PosterCard.vue";
import { useActor } from "@/composables/actor";
import type { FavoriteActor } from "@/models/person";
import { onBeforeMount, ref } from "vue";

const { getFavoriteActors } = useActor();

const actors = ref<FavoriteActor[]>([]);
const loading = ref(false);

const removeFromList = (id: number): void => {
    actors.value = actors.value.filter((actor) => actor.id !== id);
}

onBeforeMount(async () => {
    loading.value = true;
    try {
        actors.value = await getFavoriteActors();
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.actor-card-title {
    color: inherit;
}
</style>
