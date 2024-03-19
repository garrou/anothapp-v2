<template>
    <v-card>
        <router-link to="`/series/${serie.id}`">
            <base-image :src="serie.poster" class="align-end" cover />
        </router-link>

        <v-card-subtitle class="pt-4">
            <base-link :text="serie.title" to="`/series/${serie.id}`" class="text-black" />
        </v-card-subtitle>

        <v-card-actions>
            <base-button :color="favoriteColor" icon="mdi-heart" size="small" variant="text"
                @click="updateFavorite" />
            <base-button color="surface-variant" icon="mdi-share-variant" size="small" variant="text"
                @click="share" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import BaseLink from '@/components/base/BaseLink.vue';
import type { Serie } from '@/models/internal/serie';
import serieService from '@/services/serieService';
import { isSuccess } from '@/utils/response';
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
    const resp = await serieService.updateFavorite(props.serie.id);
    const successMsg = isFavorite.value 
        ? `"${props.serie.title}" supprimée des favorites`
        : `"${props.serie.title}" ajoutée aux favorites`;
    const message = isSuccess(resp.status) ? successMsg : (await resp.json()).message;
    isFavorite.value = !isFavorite.value;
    emit("updateFavorite", message);
}

const share = () => {
    // TODO
}
</script>