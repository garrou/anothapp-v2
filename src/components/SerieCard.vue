<template>
    <v-card>
        <router-link v-if="serie.poster" :to="link">
            <base-image cover max-height="580" :src="serie.poster" />
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" :to="link" />
        </v-card-subtitle>

        <v-card-actions>
            <base-menu open-on-click open-on-hover>
                <button-favorite-serie :serie-id="serie.id" @refresh="$emit('refresh', serie.id, 'favorite')" />
                <button-watch-serie v-if="watchStatus" :serie-id="serie.id"
                    @refresh="$emit('refresh', serie.id, 'watch')" />
                <button-add-serie :serie-id="serie.id" />
                <button-list-serie :serie="serie" @refresh="$emit('refresh', serie.id, 'list')" />
                <button-modal-serie-details :serie="serie" />
            </base-menu>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import BaseMenu from "./BaseMenu.vue";
import ButtonAddSerie from "./ButtonAddSerie.vue";
import ButtonFavoriteSerie from "./ButtonFavoriteSerie.vue";
import ButtonWatchSerie from "./ButtonWatchSerie.vue";
import ButtonListSerie from "./ButtonListSerie.vue";
import ButtonModalSerieDetails from "./ButtonModalSerieDetails.vue";
import type { Serie } from "@/models/serie";
import type { PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    watchStatus: { type: Boolean, default: false }
});

const link = props.serie.addedAt ? `/series/${props.serie.id}` : `/discover/${props.serie.id}`;
</script>
