<template>
    <v-card>
        <router-link :to="`/series/${serie.id}`">
            <v-img :src="serie.poster" class="align-end" cover />
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" to="`/series/${serie.id}`" class="text-black" />
        </v-card-subtitle>

        <v-card-actions>
            <v-btn :color="favoriteColor" icon="mdi-heart" size="small" variant="text" @click="updateFavorite" />
            <v-btn color="surface-variant" icon="mdi-share-variant" size="small" variant="text" @click="share" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import type { Serie } from '@/models/internal/serie';
import serieService from '@/services/serieService';
import { computed, ref, type PropType } from 'vue';

const emit = defineEmits<{
    updateFavorite: [msg: string]
}>();

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
})

const isFavorite = ref(props.serie.favorite);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const updateFavorite = async (): Promise<void> => {
    const success = await serieService.updateFavoriteBySerieId(props.serie.id);

    if (success) {
        const message = isFavorite.value
            ? `"${props.serie.title}" supprimée des favorites`
            : `"${props.serie.title}" ajoutée aux favorites`;
        isFavorite.value = !isFavorite.value;
        emit("updateFavorite", message);
    }
}

const share = () => {
    // TODO
}
</script>