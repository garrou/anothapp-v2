<template>
    <v-card v-if="serie">
        <router-link to="`/series/${serie.id}`">
            <base-image :src="serie.poster" class="align-end" cover />
        </router-link>

        <v-card-subtitle class="pt-4">
            <base-link :text="serie.title" to="`/series/${serie.id}`" class="text-black" />
        </v-card-subtitle>

        <v-card-actions>
            <base-button :color="favoriteColor" icon="mdi-heart" size="small" variant="text"
                @click="$emit('favorite', serie.id, serie.title)" />
            <base-button color="surface-variant" icon="mdi-share-variant" size="small" variant="text"
                @click="$emit('share', serie.id)" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/BaseButton.vue';
import BaseImage from '@/components/BaseImage.vue';
import BaseLink from '@/components/BaseLink.vue';
import type { Serie } from '@/models/internal/serie';
import { computed, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, require: true }
})

const favoriteColor = computed(() => props.serie?.favorite ? "red" : "surface-variant");
</script>