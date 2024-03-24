<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <template #title>
                <v-form @submit="$emit('search', title)" @submit.prevent>
                    <v-text-field v-model="title" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable hide-details
                        label="Title de la série" single-line variant="plain" @click:append-inner="$emit('search', title)"
                        @click:clear="$emit('search')" />
                </v-form>
            </template>

            <template #append>
                <v-spacer />
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="left" temporary>
            <v-list-item v-for="(item, index) in SERIES_MENU" :key="index" :prepend-icon="item.icon" :title="item.title"
                @click="" />
        </v-navigation-drawer>
    </v-layout>
</template>

<script lang="ts" setup>
import { DENSITY, ELEVATION } from '@/constants/style';
import { SEARCH_ICON } from '@/constants/icons';
import { SERIES_MENU } from '@/constants/menus';
import { ref } from 'vue';

const drawer = ref(false);
const title = ref<string>();
</script>