<template>
    <v-layout class="mb-10">
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click="openDrawer" />
            </template>

            <template #title>
                <v-form v-if="search" @submit="filterTitle(title)" @submit.prevent>
                    <v-text-field v-model="title" :append-inner-icon="SEARCH_ICON" :append-icon="FILTER_ICON"
                        class="mb-4 me-4" clearable hide-details :label="label" single-line variant="plain"
                        @input="onChange" @click:append-inner="filterTitle(title)" @click:clear="filterTitle(undefined)"
                        @click:append="openFilterDrawer" />
                </v-form>
                <slot v-else name="title" />
            </template>

            <template #append>
                <v-spacer />
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="menus" location="left" temporary>

            <v-list-item v-if="user" :prepend-avatar="user.picture" :title="user.username"
                @click="$router.push('/profile')" />

            <v-divider />

            <v-list :density="DENSITY" nav>
                <v-list-item v-for="(item, index) in APP_MENU" :key="index" :prepend-icon="item.icon"
                    :title="item.title" @click="updateMenuModal(item)" />
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer v-model="filters" location="right" width="320">
            <div class="d-flex flex-row mt-2">
                <v-tabs v-model="tab" direction="vertical">
                    <v-tab min-width="40" :value="1">
                        <v-icon icon="mdi-drama-masks" />
                    </v-tab>
                    <v-tab min-width="40" :value="2">
                        <v-icon icon="mdi-monitor-multiple" />
                    </v-tab>
                    <v-tab v-if="discover" min-width="40" :value="3">
                        <v-icon icon="mdi-cog" />
                    </v-tab>
                </v-tabs>
                <v-window v-model="tab" class="w-100">
                    <v-window-item :value="1">
                        <v-list class="pt-0 mb-3">
                            <v-list-item v-if="selectedKinds.length" title="Effacer les filtres"
                                @click="updateKinds([])" />
                            <v-checkbox v-for="(kind, index) in kinds" :key="index" v-model="selectedKinds" hide-details
                                :label="kind.name" :value="kind" @update:model-value="updateKinds(selectedKinds)" />
                        </v-list>
                    </v-window-item>
                    <v-window-item :value="2">
                        <v-list>
                            <v-list-item v-if="selectedPlatforms.length" title="Effacer les filtres"
                                @click="updatePlatforms([])" />
                            <v-checkbox v-for="plt in platforms" :key="plt.id" v-model="selectedPlatforms" hide-details
                                :value="plt" @update:model-value="updatePlatforms(selectedPlatforms)">
                                <template #label>
                                    <v-avatar v-if="plt.logo" :image="plt.logo" />
                                    <v-avatar v-else color="grey">
                                        <v-icon color="white" :icon="PLATFORM_ICON" />
                                    </v-avatar>
                                    <span class="ms-2">{{ plt.name }}</span>
                                </template>
                            </v-checkbox>
                        </v-list>
                    </v-window-item>
                    <v-window-item class="px-3" :value="3">
                        <v-text-field v-model="selectedLimit" label="Nombre de résultats" min="0" type="number"
                            variant="underlined" />
                        <v-btn block class="mb-2" @click="assignFilters">Filtrer</v-btn>
                        <v-btn v-if="hasChanges" block class="mb-2" @click="resetFilters">
                            Effacer tous les filtres
                        </v-btn>
                    </v-window-item>
                </v-window>
            </div>
        </v-navigation-drawer>

        <base-modal v-if="menuModal?.component" v-model="modal">
            <template #title>
                <span>{{ menuModal.title }}</span>
                <v-btn :icon="CLOSE_ICON" variant="text" @click="updateMenuModal(undefined)" />
            </template>
            <component :is="menuModal.component" />
        </base-modal>
        <base-confirm v-else v-model="modal" text="Confirmez-vous la déconnexion ?" title="Se déconnecter" persistent
            @cancel="modal = false" @confirm="logout" />
    </v-layout>
</template>

<script lang="ts" setup>
import BaseConfirm from "./BaseConfirm.vue";
import BaseModal from "./BaseModal.vue";
import { DENSITY, ELEVATION } from "@/constants/style";
import { CLOSE_ICON, FILTER_ICON, PLATFORM_ICON, SEARCH_ICON } from "@/constants/icons";
import { APP_MENU } from "@/constants/menus";
import { computed, onBeforeMount, ref } from "vue";
import { useUser } from "@/composables/user";
import { useSearch } from "@/composables/search";
import type { Platform, Kind } from "@/models/serie";
import type { User } from "@/models/user";
import { useSearchStore } from "@/stores/search";
import { useSerieStore } from "@/stores/serie";
import { useAuth } from "@/composables/auth";
import { useState } from "@/composables/state";
import type { AppMenuItem } from "@/models/menu";
import { DEFAULT_LIMIT } from "@/constants/services";

const props = defineProps({
    autoSearch: { type: Boolean, default: false },
    discover: { type: Boolean, default: false },
    label: { type: String, default: "Titre de la série" },
    search: { type: Boolean, default: false },
});
const { getKinds, getPlatforms } = useSearch();
const { getProfile } = useUser();
const { logout } = useAuth();
const { setMenuModal, menuModal } = useState();
const searchStore = useSearchStore();
const serieStore = useSerieStore();

const filters = ref(false);
const menus = ref(false);
const modal = ref(!!menuModal.value);
const selectedKinds = ref<Kind[]>(props.discover ? searchStore.filterKinds : serieStore.filterKinds);
const selectedPlatforms = ref<Platform[]>([]);
const selectedLimit = ref(props.discover ? searchStore.filterLimit : 0);
const kinds = ref<Kind[]>([]);
const platforms = ref<Platform[]>([]);
const tab = ref(1);
const title = ref(props.discover ? searchStore.filterTitle : serieStore.filterTitle);
const user = ref<User>();

const hasChanges = computed(() => props.discover ? searchStore.hasChanges() : serieStore.hasChanges());

const onChange = () => {
    if (!props.autoSearch) return;
    if (props.discover)
        searchStore.filterTitle = title.value;
    else
        serieStore.filterTitle = title.value;
}

const filterTitle = (title?: string) => {
    if (props.discover)
        searchStore.filterTitle = title;
    else
        serieStore.filterTitle = title;
}

const assignFilters = () => {
    if (selectedLimit.value)
        searchStore.filterLimit = selectedLimit.value;

    if (props.discover) {
        searchStore.filterKinds = selectedKinds.value;
        searchStore.filterPlatforms = selectedPlatforms.value;
    }
}

const resetFilters = () => {
    if (props.discover) {
        searchStore.reset();
    } else {
        serieStore.reset();
    }
    selectedLimit.value = DEFAULT_LIMIT;
}

const updateKinds = (toFilter: Kind[]) => {
    selectedKinds.value = toFilter;

    if (!props.discover)
        serieStore.filterKinds = toFilter;
}

const updatePlatforms = (toFilter: Platform[]) => {
    selectedPlatforms.value = toFilter;

    if (!props.discover)
        serieStore.filterPlatforms = toFilter;
}

const openDrawer = () => {
    filters.value = false;
    menus.value = !menus.value;
}

const openFilterDrawer = async () => {
    menus.value = false;
    filters.value = !filters.value;
}

const updateMenuModal = (item?: AppMenuItem) => {
    setMenuModal(item);
    modal.value = !!menuModal.value;
}

onBeforeMount(async () => {
    user.value = await getProfile();
    kinds.value = await getKinds();
    platforms.value = await getPlatforms();
});
</script>

<style scoped>
.v-list-item:nth-last-child(1) {
    margin-bottom: 75px;
}

.v-navigation-drawer__scrim {
    background-color: transparent;
}
</style>