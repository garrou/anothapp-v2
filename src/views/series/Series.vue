<template>
    <v-container>
        <v-row>
            <v-col v-for="serie in series" cols="12" sm="6" md="4" lg="3">
                <serie-card :serie="serie" @update-favorite="displaySnackbar" />
            </v-col>
        </v-row>
        <base-snackbar v-model="snackbar" :text="message" />
    </v-container>
</template>

<script lang="ts" setup>
import BaseSnackbar from '@/components/base/BaseSnackbar.vue';
import SerieCard from '@/components/SerieCard.vue';
import type { Serie } from '@/models/internal/serie';
import serieService from '@/services/serieService';
import { isSuccess } from '@/utils/response';
import { onBeforeMount, ref } from 'vue';

const series = ref<Serie[]>([]);
const message = ref("");
const snackbar = ref(false);

const getSeries = async (): Promise<Serie[]> => {
    const resp = await serieService.getSeries();

    if (isSuccess(resp.status)) {
        return await resp.json();
    } else {
        displaySnackbar((await resp.json()).message);
    }
    return [];
}

const displaySnackbar = (msg: string): void => {
    message.value = msg;
    snackbar.value = true;
}

onBeforeMount(async () => {
    series.value = await getSeries();
});
</script>