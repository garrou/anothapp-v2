<template>
    <!-- TODO: add lazy-src -->
    <v-img :src="src" class="align-end" :cover="cover">
        <template #placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular :color="MAIN_COLOR" indeterminate />
            </v-row>
        </template>
    </v-img>
</template>

<script lang="ts" setup>
import { MAIN_COLOR } from "@/constants/style";

defineProps({
    cover: { type: Boolean, default: false },
    src: { type: String, required: true },
});
</script>