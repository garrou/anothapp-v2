<template>
    <v-container>
        <v-table>
            <tbody>
                <tr v-for="serie in series" :key="serie.id">
                    <td><base-image :src="serie.poster" /></td>
                    <td>
                        <router-link :text="serie.title" :to="`/series/${serie.id}`" />
                    </td>
                    <td>{{ serie.missing }} saison{{ serie.missing > 1 ? 's' : '' }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const { getSeriesToContinue } = useSerie();

const series = ref<Serie[]>([]);

onBeforeMount(async () => {
    series.value = await getSeriesToContinue();
});
</script>