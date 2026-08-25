<template>
    <base-app-bar />

    <v-container v-if="profile">
        <v-card class="profile-card">
            <div class="profile-hero">
                <v-avatar size="96" :image="profile.picture" />
                <div class="text-h6 font-weight-bold mt-3">{{ profile.username }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ profile.email }}</div>
            </div>

            <v-list class="py-2 px-2">
                <v-list-item v-for="(item, i) in ProfileLayout" :key="i" rounded="lg" :prepend-icon="item.icon"
                    :title="item.name" :to="item.route" @click="item.route ? undefined : showModal(item.value)" />
            </v-list>
        </v-card>
    </v-container>

    <base-modal v-model="modal" :max-width="800" title="Modifier">
        <div v-if="selected === 'images'">
            <v-text-field v-model="imagesQuery" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                hide-details label="Filtrer par titre" variant="underlined" />

            <v-expansion-panels multiple variant="accordion">
                <v-expansion-panel v-for="serie in filteredSeries" :key="serie.id"
                    @group:selected="(open: any) => getImages(open.value, serie.id)">
                    <v-expansion-panel-title>{{ serie.title }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <images-row :images="images[serie.id] ?? []" :loading="loading" @refresh="refresh" />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <div v-else-if="selected === 'email'">
            <email @refresh="refresh" />
        </div>
        <div v-else-if="selected === 'password'">
            <password @refresh="refresh" />
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
import Email from "./Email.vue";
import Password from "./Password.vue";
import ImagesRow from "@/components/ImagesRow.vue";
import { useUser } from "@/composables/user";
import type { User } from "@/models/user";
import { computed, onBeforeMount, ref } from "vue";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { useSearch } from "@/composables/search";
import type { ProfileModal } from "@/types/types";
import { ProfileLayout } from "@/layouts/profile-layout";
import { SEARCH_ICON } from "@/constants/icons";
import { withoutAccentsIgnoreCase } from "@/utils/format";

const { getProfile } = useUser();
const { getSeries } = useSerie();
const { getSerieImages } = useSearch();

const images = ref<Record<number, string[]>>({});
const imagesQuery = ref<string | null>("");
const loading = ref(false);
const modal = ref(false);
const profile = ref<User>();
const selected = ref("");
const series = ref<Serie[]>();

const filteredSeries = computed(() => series.value?.filter((serie) =>
    withoutAccentsIgnoreCase(serie.title).includes(withoutAccentsIgnoreCase(imagesQuery.value))) ?? []);

const showModal = async (select: ProfileModal) => {
    if (select === "images") {
        series.value = await getSeries();
        imagesQuery.value = "";
    }
    selected.value = select;
    modal.value = true;
}

const getImages = async (open: boolean, id: number) => {
    if (!open || images.value[id]) return;
    loading.value = true;
    images.value[id] = await getSerieImages(id);
    loading.value = false;
}

const refresh = async () => {
    loading.value = true;
    modal.value = false;
    profile.value = await getProfile();
    loading.value = false;
}

onBeforeMount(refresh);
</script>

<style scoped>
.profile-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
    text-align: center;
}
</style>