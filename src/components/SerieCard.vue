<template>
    <v-card>
        <router-link :to="link">
            <base-image :src="serie.poster" cover max-height="580" />
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" :to="link" class="text-black" />
        </v-card-subtitle>

        <v-card-actions>
            <v-btn v-if="!addable" :color="favoriteColor" icon="mdi-heart" variant="text" @click="changeFavorite" />
            <v-btn v-else icon="mdi-plus-thick" variant="text" @click="add" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/internal/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const addable = !!props.serie.description;
const link = addable ? `/discover/${props.serie.id}` : `/series/${props.serie.id}`;

const { addSerie, updateFavorite } = useSerie();

const isFavorite = ref(props.serie.favorite);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const add = async () => {
    await addSerie(props.serie);
}

const changeFavorite = async (): Promise<void> => {
    isFavorite.value = await updateFavorite(props.serie);
}
</script>