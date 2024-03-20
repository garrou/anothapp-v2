<template>
    <v-layout v-if="navbar" class="overflow-visible" style="height: 50px;">
        <v-bottom-navigation mode="shift">
            <v-btn>
                <v-icon>mdi-television-play</v-icon>

                <span>Video</span>
            </v-btn>

            <v-btn>
                <v-icon>mdi-music-note</v-icon>

                <span>Music</span>
            </v-btn>

            <v-btn>
                <v-icon>mdi-book</v-icon>

                <span>Book</span>
            </v-btn>

            <v-btn>
                <v-icon>mdi-image</v-icon>

                <span>Image</span>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const PAGE_WITHOUT_NAVBAR = ["home", "login", "register"];

const navbar = computed(() => !PAGE_WITHOUT_NAVBAR.includes(route.name as string));
</script>