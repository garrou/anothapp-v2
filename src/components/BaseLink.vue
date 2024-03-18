<template>
    <router-link :to="to">{{ text }}</router-link>
</template>

<script lang="ts" setup>
import BaseButton from './BaseButton.vue';

defineProps({
    button: { type: Boolean, default: false },
    text: { type: String, default: "Link" },
    to: { type: String, required: true },
});
</script>