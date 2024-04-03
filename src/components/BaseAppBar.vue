<template>
    <v-layout class="mb-10">
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

        <base-modal v-if="selected && selected.component" v-model="modal" :max-width="800">
            <template #title>
                <span>{{ selected.title }}</span>
                <v-btn icon="mdi-close" variant="text" @click="modal = false" />
            </template>
            <component :is="selected.component" />
        </base-modal>
        <base-confirm v-else v-model="modal" text="Confirmez-vous la déconnexion ?" title="Se déconnecter" persistent
            @cancel="modal = false" @confirm="logout" />
    </v-layout>
</template>

<script lang="ts" setup>
import BaseConfirm from "./BaseConfirm.vue";
import BaseModal from "./BaseModal.vue";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SEARCH_ICON } from "@/constants/icons";
import { APP_MENU } from "@/constants/menus";
import { ref } from "vue";
import type { AppMenuItem } from "@/types/menu";
import { useUser } from "@/composables/user";

defineProps({
    search: { type: Boolean, default: false }
});

defineEmits<{
    search: [string|undefined]
}>();

const { logout } = useUser();

const drawer = ref(false);
const modal = ref(false);
const selected = ref<AppMenuItem>();
const title = ref<string>();

const selectMenu = (item: AppMenuItem) => {
    selected.value = item;
    modal.value = true;
}
</script>