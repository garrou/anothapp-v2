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
            <v-btn :color="favoriteColor" icon="mdi-heart" size="small" variant="text" @click="changeFavorite" />
            <v-btn color="surface-variant" icon="mdi-share-variant" size="small" variant="text" @click="share" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/internal/serie";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const link = `/series/${props.serie.id}`;

const { updateFavorite } = useSerie();

const isFavorite = ref(props.serie.favorite);
const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");

const changeFavorite = async (): Promise<void> => {
    isFavorite.value = await updateFavorite(props.serie);
}

const share = () => {
    // TODO
}
</script>