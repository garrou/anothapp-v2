<template>
    <v-expansion-panels v-if="userId && actors.length" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">{{ favoriteActorsLabel }}</span>
            </template>
            <template #text>
                <card-grid :items="actors" :loading="false" :lg="3" :xl="3">
                    <template #default="{ item: actor }">
                        <poster-card :image="actor.picture" :to="`/actor/${actor.id}`">
                            <v-card-title>
                                <router-link class="actor-card-title" :text="actor.name" :to="`/actor/${actor.id}`" />
                            </v-card-title>
                        </poster-card>
                    </template>
                </card-grid>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import CardGrid from '@/components/CardGrid.vue';
import PosterCard from '@/components/PosterCard.vue';
import { useActor } from '@/composables/actor';
import { ELEVATION } from '@/constants/style';
import type { FavoriteActor } from '@/models/person';
import { buildPlural } from '@/utils/format';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps({
    userId: { type: String, required: true }
});

const { getFriendFavoriteActors } = useActor();

const actors = ref<FavoriteActor[]>([]);

const favoriteActorsLabel = computed(() =>
    `${buildPlural("acteur", actors.value.length)} ${buildPlural("favori", actors.value.length, false, false)}`);

onBeforeMount(async () => {
    actors.value = await getFriendFavoriteActors(props.userId);
});
</script>

<style scoped>
.actor-card-title {
    color: inherit;
}
</style>
