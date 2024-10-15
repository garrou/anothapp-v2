<template>
    <v-card>
        <router-link :to="link">
            <base-image cover max-height="580" :src="serie.poster" />
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" :to="link" />
        </v-card-subtitle>

        <v-card-actions>
            <button-favorite-serie :serie-id="serie.id" @refresh="$emit('refresh')" />
            <button-watch-serie v-if="watchStatus" :serie-id="serie.id" @refresh="$emit('refresh')" />
            <button-add-serie :serie="serie" />
            <v-btn v-if="serie.description" :icon="DETAILS_ICON" variant="text" @click="modal = true" />
        </v-card-actions>
    </v-card>

    <base-modal v-model="modal">
        <template #title>
            <span>{{ serie.title }}</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <serie-detail :serie="serie" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import BaseModal from "./BaseModal.vue";
import SerieDetail from "./SerieDetail.vue";
import ButtonAddSerie from "./ButtonAddSerie.vue";
import ButtonFavoriteSerie from "./ButtonFavoriteSerie.vue";
import ButtonWatchSerie from "./ButtonWatchSerie.vue";
import { CLOSE_ICON, DETAILS_ICON } from "@/constants/icons";
import type { Serie } from "@/models/serie";
import { ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    watchStatus: { type: Boolean, default: false }
});

const emit = defineEmits<{
    refresh: []
}>();

const link = props.serie.addedAt ? `/series/${props.serie.id}` : `/discover/${props.serie.id}`;

const modal = ref(false);
</script>
