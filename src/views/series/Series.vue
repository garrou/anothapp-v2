<template>
    <v-container>
        <v-row>
            <v-col v-for="serie in series" cols="12" sm="6" md="4" lg="3">
                <v-card>
                    <router-link to="`/series/${serie.id}`">
                        <base-image :src="serie.poster" class="align-end" cover />
                    </router-link>

                    <v-card-subtitle class="pt-4">
                        <base-link :text="serie.title" to="`/series/${serie.id}`" class="text-black" />
                    </v-card-subtitle>

                    <v-card-actions>
                        <base-button :color="serie.favorite ? 'red' : 'surface-variant'" icon="mdi-heart" size="small" variant="text"  /> 
                        <base-button color="surface-variant" icon="mdi-share-variant" size="small" variant="text"  />
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/BaseButton.vue';
import BaseImage from '@/components/BaseImage.vue';
import BaseLink from '@/components/BaseLink.vue';
import type { Serie } from '@/models/internal/serie';
import serieService from '@/services/serieService';
import { isSuccess } from '@/utils/response';
import { onBeforeMount, ref } from 'vue';

const series = ref<Serie[]>([]);

const getSeries = async (): Promise<Serie[]> => {
    const resp = await serieService.getSeries();

    if (isSuccess(resp.status)) {
        return await resp.json();
    }
    console.log(await resp.json());
    return [];
}

onBeforeMount(async () => {
    series.value = await getSeries();
});
</script>