<template>
        <card-grid :items="images" :loading="loading" :lg="4">
            <template #default="{ item: image }">
                <poster-card :image="image">
                    <template #actions>
                        <v-btn :icon="ADD_ICON" @click="saveImage(image)" />
                    </template>
                </poster-card>
            </template>
        </card-grid>
</template>

<script lang="ts" setup>
import { ADD_ICON } from "@/constants/icons";
import CardGrid from "./CardGrid.vue";
import PosterCard from "./PosterCard.vue";
import type { PropType } from "vue";
import { useUser } from "@/composables/user";

defineProps({
    loading: { type: Boolean, required: true },
    images: { type: Array as PropType<string[]>, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

const { changeImage } = useUser();

const saveImage = async (image: string) => {
    await changeImage(image);
    emit("refresh");
}
</script>