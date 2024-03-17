<template>
    <router-link v-if="isRouter && !button" :to="to">{{ text }}</router-link>
    <base-button v-else :block="false" :text="text" :to="to" />
</template>

<script lang="ts" setup>
import BaseButton from './BaseButton.vue';
import { computed } from 'vue';

const props =  defineProps({
    button: { type: Boolean, default: false },
    text: { type: String, default: "Link" },
    to: { type: String, required: true },
});

const isRouter = computed(() => props.to.startsWith("/"));
</script>