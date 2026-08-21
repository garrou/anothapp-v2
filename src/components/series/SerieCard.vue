<template>
    <poster-card :image="serie.poster" :to="link">
        <template #quick-actions>
            <button-add-serie v-if="!serie.addedAt" :serie-id="serie.id" quick />
            <button-favorite-serie :serie-id="serie.id" quick @refresh="$emit('refresh', serie.id)" />
            <button-list-serie :serie="serie" quick @refresh="$emit('refresh', serie.id)" />
        </template>

        <v-card-subtitle class="pt-4 pb-4 text-wrap font-weight-medium">
            <router-link :text="serie.title" :to="link" />
        </v-card-subtitle>

        <template v-if="watchStatus || (!hideDetailsButton && serie.description)" #actions>
            <base-menu open-on-click open-on-hover>
                <button-watch-serie v-if="watchStatus" :serie="serie" menu-item @refresh="$emit('refresh', serie.id)" />
                <button-modal-serie-details v-if="!hideDetailsButton" :serie="serie" menu-item />
            </base-menu>
        </template>
    </poster-card>
</template>

<script lang="ts" setup>
import BaseMenu from "@/components/BaseMenu.vue";
import PosterCard from "@/components/PosterCard.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonWatchSerie from "@/components/buttons/ButtonWatchSerie.vue";
import ButtonListSerie from "@/components/buttons/ButtonListSerie.vue";
import ButtonModalSerieDetails from "@/components/buttons/ButtonModalSerieDetails.vue";
import type { Serie } from "@/models/serie";
import type { PropType } from "vue";

const props = defineProps({
    hideDetailsButton: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    watchStatus: { type: Boolean, default: false }
});

const link = props.serie.addedAt ? `/series/${props.serie.id}` : `/discover/${props.serie.id}`;
</script>
