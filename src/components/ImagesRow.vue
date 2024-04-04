<template>
    <v-container>
        <v-row>
            <v-col v-for="(image, index) in images" cols="6" md="4" lg="3" :key="index">
                <base-skeleton :loading="loading" type="card">
                    <v-card>
                        <base-image cover max-height="580" :src="image" />
                    </v-card>
                </base-skeleton>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import BaseSkeleton from "./BaseSkeleton.vue";
import type { PropType } from "vue";

defineProps({
    loading: { type: Boolean, required: true },
    images: { type: Array as PropType<string[]>, required: true }
});
</script>