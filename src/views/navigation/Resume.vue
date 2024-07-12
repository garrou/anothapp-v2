<template>
    <v-container>
        <base-skeleton v-if="series.length" :loading="loading" type="table-tbody">
            <v-table>
                <tbody>
                    <tr v-for="serie in series" :key="serie.id">
                        <td>
                            <router-link :text="serie.title" :to="`/series/${serie.id}`" />
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </base-skeleton>
        <div v-else class="text-center">Aucune série à reprendre</div>
    </v-container>
</template>

<script lang="ts" setup>
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const { getSeriesByStatus } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

onBeforeMount(async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("resume");
    loading.value = false;
});
</script>