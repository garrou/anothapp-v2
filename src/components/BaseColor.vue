<template>
    <input v-model="color" type="color" @change="saveColor" />
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