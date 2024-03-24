<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <template #title>
                <v-form v-if="search" @submit="$emit('search', title)" @submit.prevent>
                    <v-text-field v-model="title" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable hide-details
                        label="Title de la série" single-line variant="plain"
                        @click:append-inner="$emit('search', title)" @click:clear="$emit('search', undefined)" />
                </v-form>
                <slot v-else name="title" />
            </template>

            <template #append>
                <v-spacer />
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="left" temporary>
            <v-list-item v-for="(item, index) in APP_MENU" :key="index" :prepend-icon="item.icon" :title="item.title"
                @click="selectMenu(item)" />
        </v-navigation-drawer>

        <base-modal v-if="selected" v-model="modal" :max-width="800">
            <template #title>
                <span>{{ selected.title }}</span>
                <v-btn icon="mdi-close" variant="text" @click="modal = false" />
            </template>
            <component :is="selected.component" />
        </base-modal>
    </v-layout>
</template>

<script lang="ts" setup>
import BaseModal from "./BaseModal.vue";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SEARCH_ICON } from "@/constants/icons";
import { APP_MENU } from "@/constants/menus";
import { ref } from "vue";
import type { MenuItem } from "@/types/menu";

defineProps({
    search: { type: Boolean, default: false }
});

const drawer = ref(false);
const modal = ref(false);
const selected = ref<MenuItem>();
const title = ref<string>();

const selectMenu = (item: MenuItem) => {
    selected.value = item;
    modal.value = true;
}
</script>