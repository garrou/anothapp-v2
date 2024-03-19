<template>
    <v-img :aspect-ratio="ratio" :cover="cover" :height="height" :src="src" :width="width" />
</template>

<script lang="ts" setup>
defineProps({
    cover: { type: Boolean, default: false },
    height: { type: String, default: undefined },
    ratio: { type: Number, default: undefined },
    src: { type: String, required: true },
    width: { type: String, default: undefined },
});
</script>