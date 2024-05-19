<template>
    <base-app-bar />

    <v-container>
        <v-card v-if="profile" class="mb-2 pa-2">
            <base-image v-if="profile.picture" :src="profile.picture" max-height="350" />

            <v-card-title>{{ profile.username }}</v-card-title>
            <v-card-subtitle>{{ profile.email }}</v-card-subtitle>

            <v-card-actions>
                <v-btn icon="mdi-image" @click="showModal('images')" />
                <v-btn icon="mdi-email" @click="showModal('email')" />
                <v-btn icon="mdi-account-lock" @click="showModal('password')" />
            </v-card-actions>
        </v-card>
    </v-container>

    <base-modal v-model="modal" :max-width="800">
        <template #title>
            <span>Modifier</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <div v-if="selected === 'images'">
            <v-expansion-panels variant="accordion">
                <v-expansion-panel v-for="serie in series" :key="serie.id"
                    @group:selected="(open) => getImages(open.value, serie.id)">
                    <v-expansion-panel-title>{{ serie.title }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <images-row :images="images" :loading="loading" @refresh="refresh" />
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
import BaseImage from "@/components/BaseImage.vue";
import Email from "./Email.vue";
import Password from "./Password.vue";
import ImagesRow from "@/components/ImagesRow.vue";
import { useUser } from "@/composables/user";
import type { User } from "@/models/user";
import { onBeforeMount, ref } from "vue";
import type { Serie } from "@/models/serie";
import { useSerie } from "@/composables/serie";
import { useSearch } from "@/composables/search";
import type { ProfileModal } from "@/types/types";
import { CLOSE_ICON } from "@/constants/icons";

const { getProfile } = useUser();
const { getSeries } = useSerie();
const { getSerieImages } = useSearch();

const images = ref<string[]>([]);
const loading = ref(false);
const modal = ref(false);
const profile = ref<User>();
const selected = ref("");
const series = ref<Serie[]>();

const showModal = async (select: ProfileModal) => {
    if (select === "images")
        series.value = await getSeries();

    selected.value = select;
    modal.value = true;
}

const getImages = async (open: boolean, id: number) => {
    if (!open) return;
    loading.value = true;
    images.value = await getSerieImages(id);
    loading.value = false;
}

const refresh = async () => {
    loading.value = true;
    modal.value = false;
    profile.value = await getProfile();
    loading.value = false;
}

onBeforeMount(async () => {
    profile.value = await getProfile();
});
</script>