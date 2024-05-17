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
                <v-btn :icon="DETAILS_ICON" variant="text" @click="modal = true" />
            </div>
        </v-card-actions>
    </v-card>

    <base-modal v-model="modal">
        <template #title>
            <v-spacer />
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <serie-detail :serie="serie" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import BaseModal from "./BaseModal.vue";
import SerieDetail from "./SerieDetail.vue";
import { useSerie } from "@/composables/serie";
import { ADD_ICON, CLOSE_ICON, DETAILS_ICON, FAVORITE_ICON } from "@/constants/icons";
import type { Serie } from "@/models/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    lovable: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true }
});

const emit = defineEmits<{
    refreshFavs: []
}>();

const addable = !!props.serie.creation;
const link = addable ? `/discover/${props.serie.id}` : `/series/${props.serie.id}`;

const { addSerie, updateFavorite } = useSerie();

const isFavorite = ref(props.serie.favorite);
const modal = ref(false);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const add = async () => {
    await addSerie(props.serie);
}

const changeFavorite = async (): Promise<void> => {
    isFavorite.value = await updateFavorite(props.serie);
    emit("refreshFavs");
}
</script>