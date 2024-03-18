<template>
    <img v-if="localImage" :src="src" width="125" height="125" />
    <v-img v-else :aspect-ratio="ratio" :cover="cover" :height="height" :src="src" :width="width" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    cover: { type: Boolean, default: false },
    height: { type: String, default: undefined },
    ratio: { type: Number, default: undefined },
    src: { type: String, required: true },
    width: { type: String, default: undefined },
});

const localImage = computed(() => props.src.startsWith("@"));
</script>