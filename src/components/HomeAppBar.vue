<template>
    <v-layout v-if="navbar">
        <v-app-bar fixed elevation="0" class="bg-black">
            <v-app-bar-title @click="$router.push('/')" class="text-h5 font-weight-bold">ANOTHAPP</v-app-bar-title>

            <template v-slot:append>
                <v-btn v-if="showLoginBtn" text @click="$router.push('/login')">Se connecter</v-btn>
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
const showLoginBtn = computed(() => route.name === "home");
</script>