<template>
    <v-row align="center">
        <v-col cols="12" md="6" class="preview-img">
            <base-image max-height="580" :src="serie.poster" />
        </v-col>
        <v-col cols="12" md="6">
            <v-card-title>{{ serie.title }}</v-card-title>
            <v-card-subtitle>{{ seasons }} • {{ serie.network }}</v-card-subtitle>

            <v-alert class="mt-2" :color="status" :density="DENSITY" :icon="icon" :title="serie.status" />

            <v-card class="my-2" :elevation="ELEVATION">
                <v-card-item>
                    <v-card-title>Durée</v-card-title>
                    <v-card-subtitle>{{ totalDuration }}</v-card-subtitle>
                </v-card-item>
            </v-card>

            <v-card v-if="serie.duration" class="mb-2" :elevation="ELEVATION">
                <v-card-item>
                    <v-card-title>Création</v-card-title>
                    <v-card-subtitle>{{ serie.creation }}</v-card-subtitle>
                </v-card-item>
            </v-card>

            <v-card v-if="serie.note" class="mb-2" :elevation="ELEVATION">
                <v-card-item>
                    <v-card-title>Note</v-card-title>
                    <v-card-subtitle>{{ note }} / 5</v-card-subtitle>
                </v-card-item>
            </v-card>

            <v-card v-if="serie.description" class="mb-2" :elevation="ELEVATION">
                <v-card-item>
                    <v-card-title>Synopsis</v-card-title>
                    <v-card-text>{{ serie.description }}</v-card-text>
                </v-card-item>
            </v-card>

            <v-card v-if="serie.kinds" class="mb-2" :elevation="ELEVATION">
                <v-card-item>
                    <v-card-title>Genres</v-card-title>
                    <v-card-text>{{ kinds }}</v-card-text>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import { type PropType } from "vue";
import type { Serie } from "@/models/serie";
import { minsToStringHoursDays } from "@/utils/format";
import { DENSITY, ELEVATION } from "@/constants/style";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const kinds = props.serie.kinds?.join(" • ");
const note = props.serie.note?.toFixed(2);
const seasons = `${props.serie.seasons} saison${props.serie.seasons ?? 0 > 1 ? "s" : ""}`;
const status = props.serie.status === "En cours" ? "info" : "success";
const icon = `\$${status}`;
const totalDuration = minsToStringHoursDays(props.serie.duration * (props.serie.episodes ?? 0));
</script>

<style scoped>
.preview-img {
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>