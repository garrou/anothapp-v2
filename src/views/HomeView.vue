<template>
    <div class="d-flex flex-column ga-3">
        <v-container>
            <v-row align="center" justify="center" class="text-center mt-6">
                <v-col cols="12" md="8">
                    <h1 class="text-h3 font-weight-bold mb-2 mt-6">
                        Suivez l'avancée de vos séries préférées
                    </h1>
                    <p class="text-medium-emphasis">
                        Suivez chaque série, chaque saison grâce à notre plaforme complète de suivi des séries.
                    </p>

                    <v-row class="mt-2">
                        <v-col v-for="(image, index) in images" cols="6" md="4" lg="3" :key="index">
                            <base-image :src="image" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <h2 class="text-h4 font-weight-bold mb-4 text-center">
                Tout ce dont vous avez besoin pour suivre vos séries
            </h2>

            <v-row>
                <v-col v-for="feature in HOME_FEATURES" :key="feature.id" cols="12" md="4" class="mb-4 d-flex">
                    <v-card class="pa-6 text-center feature-card" height="100%" width="100%">
                        <icon-badge :icon="feature.icon" class="mx-auto mb-4" />
                        <v-card-title class="justify-center text-h6 font-weight-bold px-0">
                            {{ feature.title }}
                        </v-card-title>
                        <v-card-text class="text-body-2 px-0">
                            {{ feature.description }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <h2 class="text-h4 font-weight-bold mb-4 text-center">
                Comment ça marche
            </h2>
            <v-row>
                <v-col v-for="step in HOME_STEPS" :key="step.id" cols="12" md="4" class="mb-4 d-flex">
                    <v-card class="pa-6 text-center feature-card" height="100%" width="100%">
                        <v-avatar color="primary" size="56" class="mb-4">
                            <span class="text-h5 font-weight-bold">{{ step.id }}</span>
                        </v-avatar>
                        <v-card-title class="justify-center text-h6 font-weight-bold px-0">
                            {{ step.title }}
                        </v-card-title>
                        <v-card-text class="text-body-2 px-0">
                            {{ step.description }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { useSearch } from '@/composables/search';
import { onBeforeMount, ref } from 'vue';
import BaseImage from '@/components/BaseImage.vue';
import IconBadge from '@/components/IconBadge.vue';
import { HOME_FEATURES, HOME_STEPS } from '@/constants/home';

const { getImages } = useSearch();

const images = ref<string[]>([]);

onBeforeMount(async () => {
    images.value = await getImages(8);
});
</script>

<style scoped>
.feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>