<template>
    <v-container>
        <base-skeleton v-if="series.length" :loading="loading" type="table-tbody">
            <v-table>
                <tbody>
                    <tr v-for="serie in series" :key="serie.id">
                        <template v-if="serie.missing">
                            <td>
                                <router-link :text="serie.title" :to="`/series/${serie.id}`" />
                            </td>
                            <td>{{ buildPlural("saison", serie.missing) }}</td>
                        </template>
                    </tr>
                </tbody>
            </v-table>
        </base-skeleton>
        <div v-else class="text-center">Aucune série à continuer</div>
    </v-container>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const { getSeriesToContinue } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

onBeforeMount(async () => {
    loading.value = true;
    series.value = await getSeriesToContinue();
    loading.value = false;
});
</script>