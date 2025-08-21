<template>
    <v-layout class="mb-10">
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click="openDrawer" />
            </template>

            <template #title>
                <v-form v-if="search" @submit="filterTitle(title)" @submit.prevent>
                    <v-text-field v-model="title" :append-inner-icon="SEARCH_ICON" :append-icon="FILTER_ICON"
                        class="mb-4 me-4" clearable hide-details :placeholder="placeholder" single-line variant="plain"
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
                <v-list-item v-for="(item, index) in NAV_SERIES_STATUS" :key="index"
                    :to="`/series-status?status=${item.status}`" :prepend-icon="item.icon" :title="item.title"
                    variant="plain" />
            </v-list>

            <v-divider />

            <v-list :density="DENSITY" nav>
                <v-list-item v-for="(item, index) in NAV_OTHERS" :key="index" :to="item.link" :prepend-icon="item.icon"
                    :title="item.title" variant="plain" />
            </v-list>

            <v-divider />

            <v-list :density="DENSITY" nav>
                <v-list-item prepend-icon="mdi-logout" title="Se déconnecter" variant="plain" @click="logout" />
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
                    <v-tab v-if="!discover" min-width="40" :value="4">
                        <v-icon icon="mdi-flag" />
                    </v-tab>
                    <v-tab v-if="!discover" min-width="40" :value="5">
                        <v-icon icon="mdi-numeric" />
                    </v-tab>
                </v-tabs>
                <v-window v-model="tab" class="w-100">

                    <v-window-item :value="1">
                        <v-list class="pt-0 mb-10">
                            <v-list-item v-if="selectedKinds.length" title="Effacer les filtres"
                                @click="updateKinds([])" />
                            <v-checkbox v-for="(kind, index) in kinds" :key="index" v-model="selectedKinds" hide-details
                                :label="kind.name" :value="kind" @update:model-value="updateKinds(selectedKinds)" />
                        </v-list>
                    </v-window-item>

                    <v-window-item :value="2">
                        <v-list class="pt-0 mb-10">
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

                    <v-window-item class="px-3" :value="4">
                        <v-list class="pt-0 mb-10">
                            <v-list-item v-if="serieStore.filterCountries.length" title="Effacer les filtres"
                                @click="serieStore.filterCountries = []" />
                            <v-checkbox v-for="(country, index) in countries" :key="index"
                                v-model="serieStore.filterCountries" hide-details :label="country" :value="country" />
                        </v-list>
                    </v-window-item>

                    <v-window-item class="px-3" :value="5">
                        <v-list class="pt-0 mb-10">
                            <v-list-item v-if="serieStore.filterNotes.length" title="Effacer les filtres"
                                @click="updateNotes([])" />
                            <v-checkbox v-for="(note) in notes" :key="note.id" v-model="selectedNotes" hide-details
                                :label="note.name" :value="note" @update:model-value="updateNotes(selectedNotes)" />
                        </v-list>
                    </v-window-item>
                </v-window>
            </div>
        </v-navigation-drawer>
    </v-layout>
</template>

<script lang="ts" setup>
import { DENSITY, ELEVATION } from "@/constants/style";
import { FILTER_ICON, PLATFORM_ICON, SEARCH_ICON } from "@/constants/icons";
import { NAV_OTHERS, NAV_SERIES_STATUS } from "@/constants/menus";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useUser } from "@/composables/user";
import { useSearch } from "@/composables/search";
import type { Platform, Kind } from "@/models/serie";
import type { User } from "@/models/user";
import { useSearchStore } from "@/stores/search";
import { useSerieStore } from "@/stores/serie";
import { useAuth } from "@/composables/auth";
import { useState } from "@/composables/state";
import { DEFAULT_LIMIT } from "@/constants/services";
import { useSerie } from "@/composables/serie";
import type { Note } from "@/models/note";

const props = defineProps({
    autoSearch: { type: Boolean, default: false },
    discover: { type: Boolean, default: false },
    placeholder: { type: String, default: "Titre de la série" },
    search: { type: Boolean, default: false },
});
const { getKinds, getPlatforms, getNotes } = useSearch();
const { getProfile } = useUser();
const { logout } = useAuth();
const { getCountries } = useSerie();
const searchStore = useSearchStore();
const serieStore = useSerieStore();

const filters = ref(false);
const menus = ref(false);
const selectedKinds = ref<Kind[]>(props.discover ? searchStore.filterKinds : serieStore.filterKinds);
const selectedPlatforms = ref<Platform[]>(props.discover ? searchStore.filterPlatforms : serieStore.filterPlatforms);
const selectedLimit = ref(props.discover ? searchStore.filterLimit : 0);
const selectedNotes = ref(serieStore.filterNotes);
const notes = ref<Note[]>([]);
const kinds = ref<Kind[]>([]);
const platforms = ref<Platform[]>([]);
const tab = ref(1);
const title = ref(props.discover ? searchStore.filterTitle : serieStore.filterTitle);
const user = ref<User>();
const countries = ref<string[]>([]);

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

const updateNotes = (toFilter: Note[]) => {
    selectedNotes.value = toFilter;

    if (!props.discover)
        serieStore.filterNotes = toFilter;
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

onBeforeMount(async () => {
    user.value = await getProfile();
    kinds.value = await getKinds();
    platforms.value = await getPlatforms();
    countries.value = await getCountries();
    notes.value = await getNotes();
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