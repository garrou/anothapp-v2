<template>
    <v-row>
        <v-col v-if="serie.poster" cols="12" md="6" class="preview-img my-2">
            <base-image max-height="580" :src="serie.poster" />
        </v-col>
        <v-col cols="12" md="6">
            <v-alert class="my-2" :color="status" :density="DENSITY" :icon="icon" :title="statusLabel" />
            <info-list :cards="cards" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseImage from "@/components/BaseImage.vue";
import InfoList from "@/components/InfoList.vue";
import { type PropType } from "vue";
import type { Serie } from "@/models/serie";
import { DENSITY } from "@/constants/style";
import { SerieDetailsLayout } from "@/layouts/serie-details-layout";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const cards = SerieDetailsLayout(props.serie);
const status = props.serie.finished ? "success" : "info";
const statusLabel = props.serie.finished ? "Terminée" : "En cours";
const icon = `\$${status}`;
</script>

<style scoped>
.preview-img {
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>