<template>
    <v-row align="center">
        <v-col cols="12" md="6" class="preview-img">
            <base-image max-height="580" :src="serie.poster" />
        </v-col>
        <v-col cols="12" md="6">
            <v-card-title>{{ serie.title }}</v-card-title>
            <v-card-subtitle>{{ seasons }} • {{ serie.network }}</v-card-subtitle>

            <v-alert class="my-2" :color="status" :density="DENSITY" :icon="icon" :title="serie.status" />

            <v-card v-for="(entry, _, index) in layout" class="mb-2" :elevation="ELEVATION" :key="index">
                <v-card-item>
                    <v-card-title>{{ entry.name }}</v-card-title>
                    <v-card-text v-if="isText(entry.format)">{{ formatData(serie, entry) }}</v-card-text>
                    <v-card-subtitle v-else>{{ formatData(serie, entry) }}</v-card-subtitle>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import { onBeforeMount, ref, type PropType } from "vue";
import type { Serie } from "@/models/serie";
import { buildPlural, minsToStringHoursDays } from "@/utils/format";
import { DENSITY, ELEVATION } from "@/constants/style";
import serieDetailsLayout from "@/layouts/serie-details-layout.json";
import { LayoutFieldFormat } from "@/types/types";
import type { SerieDetailsLayout } from "@/models/layout";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const seasons = buildPlural("saison", props.serie.seasons);
const status = props.serie.status === "En cours" ? "info" : "success";
const icon = `\$${status}`;

const layout = ref<SerieDetailsLayout[]>(serieDetailsLayout.map((entry) => ({
    name: entry.name,
    field: entry.field,
    format: entry.format as LayoutFieldFormat,
    limit: entry.limit
})));

const formatData = (serie: Serie, entry: SerieDetailsLayout) => {
    const isCustom = entry.field.includes("|");

    if (!(entry.field in serie) && !isCustom) {
        return "";
    }
    const value = serie[entry.field as keyof Serie];

    switch (entry.format) {
        case LayoutFieldFormat.Text:
            return value;
        case LayoutFieldFormat.Number:
            const number = value?.toString().includes(".") ? (value as number).toFixed(2) : value;
            return entry.limit ? `${number} / ${entry.limit}` : number;
        case LayoutFieldFormat.Array:
            return (value as Array<string>).join(" • ");
        case LayoutFieldFormat.Custom:
            const [left, right] = entry.field.split("|");
            return minsToStringHoursDays(
                serie[left as keyof Serie] as number * (serie[right as keyof Serie] as number ?? 0)
            );
    }
}

const isText = (format: LayoutFieldFormat): boolean => 
    [LayoutFieldFormat.Array, LayoutFieldFormat.Text].includes(format);
</script>

<style scoped>
.preview-img {
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>