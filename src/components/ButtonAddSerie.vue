<template>
    <v-btn v-if="!exists" elevation="0" :icon="ADD_ICON" @click="addSerie(serie)" />
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { ADD_ICON } from '@/constants/icons';
import type { Serie } from '@/models/serie';
import { onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true }
});

const { addSerie, getSerieFromCache } = useSerie();

const exists = ref(false);

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serie.id));
});
</script>