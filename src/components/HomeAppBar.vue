<template>
    <v-app>
        <v-app-bar v-if="navbar" app fixed elevation="0" class="bg-black">
            <v-container>
                <v-row align="center" no-gutters>
                    <v-col>
                        <v-toolbar-title @click="$router.push('/')" class="text-h5 font-weight-bold">ANOTHAPP</v-toolbar-title>
                    </v-col>
                    <v-col v-if="showLoginBtn" cols="auto">
                        <v-btn text class="d-none d-md-inline-flex" @click="$router.push('/login')">Se connecter</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
    </v-app>

</template>

<script lang="ts" setup>
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from '@/constants/menus';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navbar = computed(() => PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));
const showLoginBtn = computed(() => route.name === "home");
</script>