<template>
    <v-layout v-if="navbar">
        <v-app-bar fixed elevation="0" border>
            <v-app-bar-title class="brand" @click="$router.push('/')">
                <span class="brand-dot"></span>
                <span class="text-h5 font-weight-bold">anothapp</span>
            </v-app-bar-title>

            <template v-slot:append>
                <div v-if="showAuthBtns" class="d-flex ga-2">
                    <v-btn color="primary" variant="tonal" rounded="pill" @click="$router.push('/login')">
                        Se connecter
                    </v-btn>
                    <v-btn color="primary" variant="flat" rounded="pill" @click="$router.push('/register')">
                        S'inscrire
                    </v-btn>
                </div>
            </template>
        </v-app-bar>
    </v-layout>
</template>

<script lang="ts" setup>
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from '@/constants/menus';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navbar = computed(() => PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));
const showAuthBtns = computed(() => route.name === "home");
</script>

<style scoped>
.brand {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.brand-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    flex-shrink: 0;
}
</style>