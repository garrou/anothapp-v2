<template>
    <v-card>
        <router-link :to="link">
            <v-img :src="serie.poster" class="align-end" cover>
                <template v-slot:placeholder>
                    <v-row align="center" class="fill-height ma-0" justify="center">
                        <v-progress-circular color="black" indeterminate />
                    </v-row>
                </template>
            </v-img>
        </router-link>

        <v-card-subtitle class="pt-4">
            <router-link :text="serie.title" :to="link" class="text-black" />
        </v-card-subtitle>

        <v-card-actions>
            <v-btn :color="favoriteColor" icon="mdi-heart" size="small" variant="text" @click="updateFavorite" />
            <v-btn color="surface-variant" icon="mdi-share-variant" size="small" variant="text" @click="share" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/internal/serie";
import { useSnackbar } from "@/composables/snackbar";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});


const link = `/series/${props.serie.id}`;

const snackBar = useSnackbar();
const { updateFavoriteBySerieId } = useSerie();

const isFavorite = ref(props.serie.favorite);
const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const updateFavorite = async (): Promise<void> => {
    const success = await updateFavoriteBySerieId(props.serie.id);
    if (!success) return

    const message = isFavorite.value
        ? `"${props.serie.title}" supprimée des favorites`
        : `"${props.serie.title}" ajoutée aux favorites`;
    isFavorite.value = !isFavorite.value;
    snackBar.setMessage(message);
}

const share = () => {
    // TODO
}
</script>