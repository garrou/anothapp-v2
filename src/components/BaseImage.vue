<template>
    <img v-if="localImage" src="@/assets/logo.png" width="125" height="125" />
    <v-img v-else :aspect-ratio="ratio" :height="height" :src="src" :width="width" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    height: { type: String, required: true },
    ratio: { type: Number, default: 1 },
    src: { type: String, required: true },
    width: { type: String, required: true },
});

const localImage = computed(() => props.src.startsWith("@"));
</script>