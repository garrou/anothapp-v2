<template>
    <div class="home">
        <div class="hero-glow"></div>

        <v-container>
            <v-row align="center" justify="center" class="text-center mt-6">
                <v-col cols="12" md="8">
                    <h1 class="text-h3 font-weight-bold mb-2 mt-6">
                        Suivez l'avancée de vos séries préférées
                    </h1>
                    <p class="text-medium-emphasis">
                        Suivez chaque série, chaque saison, grâce à notre plateforme complète de suivi des séries.
                    </p>

                    <div class="d-flex justify-center ga-3 mt-6">
                        <v-btn color="primary" rounded="pill" size="large" to="/register">
                            Commencer gratuitement
                        </v-btn>
                        <v-btn color="primary" variant="tonal" rounded="pill" size="large" to="/login">
                            Se connecter
                        </v-btn>
                    </div>

                    <div class="poster-collage">
                        <div v-for="(image, index) in images.slice(0, 6)" class="poster-tile" :key="index">
                            <base-image :src="image" />
                        </div>
                    </div>
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
            <div class="steps-row">
                <div v-for="step in HOME_STEPS" :key="step.id" class="step-item">
                    <div class="step-connector"></div>
                    <v-avatar color="primary" size="48" class="mb-3">
                        <span class="text-h6 font-weight-bold">{{ step.id }}</span>
                    </v-avatar>
                    <div class="step-title">{{ step.title }}</div>
                    <p class="step-text">{{ step.description }}</p>
                </div>
            </div>
        </v-container>

        <v-container>
            <div class="cta-band">
                <h2 class="text-h5 font-weight-bold">Prêt à reprendre le fil de vos séries ?</h2>
                <v-btn color="white" rounded="pill" size="large" to="/register">
                    Créer un compte gratuit
                </v-btn>
            </div>
        </v-container>

        <div class="home-footer">
            <span class="brand-dot"></span>
            <span>anothapp</span>
        </div>
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
.home {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
}

.hero-glow {
    position: absolute;
    top: -220px;
    left: 50%;
    transform: translateX(-50%);
    width: 1100px;
    height: 700px;
    max-width: 150vw;
    background: radial-gradient(closest-side, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-primary), 0) 70%);
    pointer-events: none;
}

.feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.poster-collage {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin-top: 48px;
}

.poster-tile {
    width: 130px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 14px 28px rgba(56, 24, 95, 0.18);
}

.poster-tile:nth-child(odd) {
    transform: rotate(-4deg) translateY(10px);
}

.poster-tile:nth-child(even) {
    transform: rotate(3deg);
}

.steps-row {
    display: flex;
    align-items: flex-start;
    margin-top: 40px;
    flex-wrap: wrap;
    gap: 24px 0;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1 1 180px;
    padding: 0 14px;
    position: relative;
}

.step-connector {
    position: absolute;
    top: 24px;
    left: calc(50% + 30px);
    width: calc(100% - 60px);
    height: 1px;
    background: rgb(var(--v-border-color));
}

.step-item:last-child .step-connector {
    display: none;
}

.step-title {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 4px;
}

.step-text {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: rgb(var(--v-theme-on-surface-variant));
}

.cta-band {
    background: rgb(var(--v-theme-primary));
    border-radius: 8px;
    padding: 56px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    color: #fff;
}

.home-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 48px 40px;
    color: rgb(var(--v-theme-on-surface-variant));
    font-size: 13px;
}

.brand-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    display: inline-block;
}
</style>
