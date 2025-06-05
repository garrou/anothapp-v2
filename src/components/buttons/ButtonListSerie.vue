<template>
    <v-tooltip :text="computedText" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="MAIN_COLOR" elevation="0" :icon="computedIcon" variant="text"
                @click="updateInList" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const emit = defineEmits<{
    refresh: []
}>();

const { addSerie, deleteSerieInList, getSerieFromCache } = useSerie();

const exists = ref(false);
const existsInList = ref(false);

const computedIcon = computed(() => existsInList.value ? "mdi-bookmark-minus" : "mdi-bookmark-plus");
const computedText = computed(() => existsInList.value ? "Supprimer de ma liste" : "Ajouter dans ma liste");

const updateInList = async () => {
    if (existsInList.value) {
        await deleteSerieInList(props.serie);
    } else { 
        await addSerie(props.serie.id, true);
    }
    existsInList.value = !existsInList.value;
    emit("refresh");
}

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serie.id));
    existsInList.value = !!(await getSerieFromCache(props.serie.id, { type: "userlist" }));
});
</script>