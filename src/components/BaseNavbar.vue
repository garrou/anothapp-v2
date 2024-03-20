<template>
    <v-layout v-if="navbar" class="overflow-visible" style="height: 50px;">
        <v-bottom-navigation mode="shift">
            <v-btn to="/series">
                <v-icon>mdi-view-headline</v-icon>
                <span>Mes séries</span>
            </v-btn>
            <v-btn>
                <v-icon>mdi-magnify</v-icon>
                <span>Découvrir</span>
            </v-btn>
            <v-btn>
                <v-icon>mdi-account</v-icon>
                <span>Profil</span>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const PAGE_WITHOUT_NAVBAR = ["home", "login", "register"];

const navbar = computed(() => !PAGE_WITHOUT_NAVBAR.includes(route.name as string));
</script>