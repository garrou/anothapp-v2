<template>
    <v-card>
        <router-link :to="link">
            <base-image cover max-height="580" :src="serie.poster" />
        </router-link>

        <v-card-subtitle class="pt-4 d-flex justify-space-between">
            <router-link :text="serie.title" :to="link" />
        </v-card-subtitle>

        <v-card-actions>
            <template v-if="serie.addedAt">
                <v-btn :color="favoriteColor" :icon="FAVORITE_ICON" variant="text" @click="changeFavorite" />
                <v-btn v-if="watchStatus" :color="watchColor" :icon="watchIcon" variant="text" @click="changeWatch" />
            </template>
            <template v-else>
                <v-btn :icon="ADD_ICON" variant="text" @click="addSerie(serie)" />
            </template>
            <v-btn v-if="serie.description" :icon="DETAILS_ICON" variant="text" @click="modal = true" />
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
import { useSnackbar } from "@/composables/snackbar";
import { ADD_ICON, CLOSE_ICON, DETAILS_ICON, FAVORITE_ICON } from "@/constants/icons";
import type { Serie } from "@/models/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    watchStatus: { type: Boolean, default: false }
});

const emit = defineEmits<{
    refresh: []
}>();

const link = props.serie.addedAt ? `/series/${props.serie.id}` : `/discover/${props.serie.id}`;

const { addSerie, updateField } = useSerie();
const { showSuccess } = useSnackbar();

const isFavorite = ref(props.serie.favorite ?? false);
const isWatching = ref(props.serie.watch ?? false);
const watchColor = computed(() => isWatching.value ? "red" : "green");
const watchIcon = computed(() => isWatching.value ? "mdi-close-circle" : "mdi-play");
const modal = ref(false);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const changeFavorite = async (): Promise<void> => {
    isFavorite.value = await updateField(props.serie, "favorite");
    showSuccess(isFavorite.value
        ? `"${props.serie.title}" ajoutée aux favoris`
        : `"${props.serie.title}" supprimée des favoris`);
    emit("refresh");
}

const changeWatch = async (): Promise<void> => {
    isWatching.value = await updateField(props.serie, "watch");
    showSuccess(isWatching.value
        ? `Visionnage en cours pour "${props.serie.title}"`
        : `Visionnage arrêté pour "${props.serie.title}"`);
    emit("refresh");
}
</script>
