<template>
    <v-card>
        <router-link :to="link">
            <base-image cover max-height="580" :src="serie.poster" />
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" :to="link" />
        </v-card-subtitle>

        <v-card-actions>
            <v-btn v-if="!addable && lovable" :color="favoriteColor" :icon="FAVORITE_ICON" variant="text"
                @click="changeFavorite" />
            <div v-else-if="addable">
                <v-btn :icon="ADD_ICON" variant="text" @click="add" />
                <v-btn :icon="DETAILS_ICON" variant="text" @click="$emit('showSerie', serie)" />
            </div>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import { useSerie } from "@/composables/serie";
import { FAVORITE_ICON, ADD_ICON, DETAILS_ICON } from "@/constants/icons";
import type { Serie } from "@/models/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    lovable: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true }
});

const emit = defineEmits<{
    showSerie: [Serie]
    refreshFavs: []
}>();

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
    emit("refreshFavs");
}
</script>