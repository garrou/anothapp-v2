<template>
    <v-card class="poster-card" @click="$emit('click')">
        <router-link v-if="to" :to="to" @click.stop>
            <base-image v-if="image" cover max-height="580" :src="image" />
        </router-link>
        <base-image v-else-if="image" cover max-height="580" :src="image" />

        <slot />

        <v-card-actions v-if="$slots.actions" @click.stop>
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";

defineProps({
    image: { type: String, default: undefined },
    to: { type: String, default: undefined },
});

defineEmits<{
    click: []
}>();
</script>

<style scoped>
.poster-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.poster-card:hover {
    transform: translateY(-2px);
}
</style>
