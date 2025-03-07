<template>
    <v-row>
        <v-col v-if="serie.poster" cols="12" md="6" class="preview-img my-2">
            <base-image max-height="580" :src="serie.poster" />
        </v-col>
        <v-col cols="12" md="6">
            <v-alert class="my-2" :color="status" :density="DENSITY" :icon="icon" :title="serie.status" />
            <template v-for="(obj, index) in cards">
                <v-card v-if="obj.display !== false" class="mb-2" :elevation="ELEVATION" :key="index">
                    <v-card-item>
                        <v-card-title>{{ obj.name }}</v-card-title>
                        <v-card-text v-if="obj.format === 'text'">{{ obj.value }}</v-card-text>
                        <v-row v-else-if="obj.format === 'array'">
                            <v-col v-for="v in obj.value" :key="v.name" cols="6" md="4" lg="3">
                                <base-image v-if="v.logo" :src="v.logo" />
                                <div class="text-center">{{ v.name }}</div>
                            </v-col>
                        </v-row>
                        <v-card-subtitle v-else>{{ obj.value }}</v-card-subtitle>
                    </v-card-item>
                </v-card>
            </template>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import { type PropType } from "vue";
import type { Serie } from "@/models/serie";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SerieDetailsLayout } from "@/layouts/serie-details-layout";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const cards = SerieDetailsLayout(props.serie);
const status = props.serie.status === "En cours" ? "info" : "success";
const icon = `\$${status}`;
</script>

<style scoped>
.preview-img {
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>