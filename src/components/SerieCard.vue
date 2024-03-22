<template>
    <v-card @click="$emit('show', serie)">
        <router-link v-if="!addable" :to="link">
            <base-image cover max-height="580" :src="serie.poster" />
        </router-link>
        <base-image v-else cover max-height="580" :src="serie.poster" />

        <v-card-subtitle class="pt-4">
            <router-link v-if="!addable" class="text-black" :text="serie.title" :to="link" />
            <span v-else>{{ serie.title }}</span>
        </v-card-subtitle>

        <v-card-actions>
            <v-btn v-if="!addable" :color="favoriteColor" variant="text" @click="changeFavorite">{{ FAVORITE_ICON }}</v-btn>
            <v-btn v-else variant="text" @click="add">{{ ADD_ICON }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import { useSerie } from "@/composables/serie";
import { FAVORITE_ICON, type ADD_ICON } from "@/constants/icons";
import type { Serie } from "@/models/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const addable = !!props.serie.description;
const link = `/series/${props.serie.id}`;

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