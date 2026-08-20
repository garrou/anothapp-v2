<template>
    <input v-model="color" class="color-swatch" title="Changer la couleur" type="color" @change="saveColor" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import storageService from '@/services/storageService';

const props = defineProps({
    default: { type: String, required: true },
    id: { type: String, required: true }
});

const emit = defineEmits<{
    change: []
}>();

const color = ref(props.default);

const saveColor = () => {
    storageService.saveColorChart(props.id, color.value);
    emit("change");
}
</script>

<style scoped>
.color-swatch {
    appearance: none;
    -webkit-appearance: none;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 2px solid rgb(var(--v-theme-surface));
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 0 1px rgb(var(--v-border-color));
}

.color-swatch::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
}

.color-swatch::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
}

.color-swatch::-moz-color-swatch {
    border: none;
    border-radius: 50%;
}
</style>