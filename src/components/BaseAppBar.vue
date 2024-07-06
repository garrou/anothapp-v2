<template>
    <v-layout class="mb-10">
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click="openDrawer" />
            </template>

            <template #title>
                <v-form v-if="search" @submit="$emit('search', title)" @submit.prevent>
                    <v-text-field v-model="title" :append-inner-icon="SEARCH_ICON" :append-icon="FILTER_ICON"
                        class="mb-4" clearable hide-details label="Titre de la série" single-line variant="plain"
                        @input="onChange" @click:append-inner="$emit('search', title)"
                        @click:clear="$emit('search', undefined)" @click:append="openKindsFilter" />
                </v-form>
                <slot v-else name="title" />
            </template>

            <template #append>
                <v-spacer />
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="menus" location="left" temporary>
      
            <v-list-item v-if="user" :prepend-avatar="user.picture" :subtitle="user.email" :title="user.username"
                    @click="$router.push('/profile')" />

            <v-divider />

            <v-list density="compact" nav>
                <v-list-item v-for="(item, index) in APP_MENU" :key="index" :prepend-icon="item.icon"
                    :title="item.title" @click="selectMenu(item)" />
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer v-model="filters" location="right" temporary>
            <v-list>
                <v-list-item v-for="(kind, index) in kinds" :key="index" color="#067d5f" :title="kind.name"
                    :value="kind.value" @click="filterKind(kind)" />
            </v-list>
        </v-navigation-drawer>

        <base-modal v-if="selected && selected.component" v-model="modal">
            <template #title>
                <span>{{ selected.title }}</span>
                <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
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
import { CLOSE_ICON, FILTER_ICON, SEARCH_ICON } from "@/constants/icons";
import { APP_MENU } from "@/constants/menus";
import { onBeforeMount, ref } from "vue";
import type { AppMenuItem } from "@/models/menu";
import { useUser } from "@/composables/user";
import { useSearch } from "@/composables/search";
import type { Kind } from "@/models/serie";
import type { User } from "@/models/user";

const props = defineProps({
    discover: { type: Boolean, default: false },
    search: { type: Boolean, default: false }
});

const emit = defineEmits<{
    filter: [string]
    search: [string | undefined]
}>();

const { getKinds } = useSearch();
const { getProfile } = useUser();
const { logout } = useUser();

const filters = ref(false);
const menus = ref(false);
const modal = ref(false);
const selected = ref<AppMenuItem>();
const kinds = ref<Kind[]>([]);
const title = ref<string>();
const user = ref<User>();

const onChange = () => {
    if ((title.value?.length ?? 0) > 2)
        emit('search', title.value);
}

const filterKind = (item: Kind) => {
    emit('filter', props.discover ? item.value : item.name);
}

const openDrawer = () => {
    filters.value = false;
    menus.value = !menus.value;
}

const openKindsFilter = async () => {
    if (kinds.value.length === 0)
        kinds.value = await getKinds();
    menus.value = false;
    filters.value = !filters.value;
}

const selectMenu = (item: AppMenuItem) => {
    selected.value = item;
    modal.value = true;
}

onBeforeMount(async () => {
    user.value = await getProfile();
});
</script>

<style scoped>
.v-list-item:nth-last-child(1) {
    margin-bottom: 75px;
}
</style>