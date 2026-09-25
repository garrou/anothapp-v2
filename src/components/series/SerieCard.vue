<template>
    <poster-card :image="serie.poster" :to="link">
        <template #quick-actions>
            <button-add-serie v-if="!serie.addedAt" :serie-id="serie.id" quick />
            <button-favorite-serie :serie-id="serie.id" quick @refresh="$emit('refresh', serie.id, 'favorite')" />
            <button-list-serie :serie="serie" quick @refresh="$emit('refresh', serie.id, 'list')" />
            <button-watch-serie v-if="watchStatus" :serie="serie" quick @refresh="$emit('refresh', serie.id, 'watch')" />
        </template>

        <v-card-subtitle class="pt-4 pb-4 font-weight-medium" :title="serie.title">
            <router-link class="serie-card-title" :text="serie.title" :to="link" />
        </v-card-subtitle>
    </poster-card>
</template>

<script lang="ts" setup>
import PosterCard from "@/components/PosterCard.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonWatchSerie from "@/components/buttons/ButtonWatchSerie.vue";
import ButtonListSerie from "@/components/buttons/ButtonListSerie.vue";
import type { Serie } from "@/models/serie";
import type { PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    watchStatus: { type: Boolean, default: false }
});

defineEmits<{
    refresh: [id: number, kind: "favorite" | "list" | "watch"]
}>();

const link = props.serie.addedAt ? `/series/${props.serie.id}` : `/discover/${props.serie.id}`;
</script>

<style scoped>
.serie-card-title {
    color: inherit;
}
</style>
