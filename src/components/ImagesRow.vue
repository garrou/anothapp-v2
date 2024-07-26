<template>
        <v-row>
            <v-col v-for="(image, index) in images" cols="6" md="4" :key="index">
                <base-skeleton :loading="loading" type="card">
                    <v-card>
                        <base-image cover max-height="580" :src="image" />

                        <v-card-actions>
                            <v-btn :icon="ADD_ICON" @click="saveImage(image)" />
                        </v-card-actions>
                    </v-card>
                </base-skeleton>
            </v-col>
        </v-row>
</template>

<script lang="ts" setup>
import { ADD_ICON } from "@/constants/icons";
import BaseImage from "./BaseImage.vue";
import BaseSkeleton from "./BaseSkeleton.vue";
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