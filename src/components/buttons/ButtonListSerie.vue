<template>
    <v-list-item v-if="menuItem" :prepend-icon="computedIcon" :title="computedText" @click="updateInList" />

    <v-tooltip v-else :text="computedText" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="list-btn" :class="{ 'list-btn--quick': quick }"
                :color="computedColor" :elevation="quick ? undefined : 0" :icon="computedIcon"
                :size="quick ? 32 : undefined" :variant="quick ? 'flat' : 'text'" @click="updateInList" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    menuItem: { type: Boolean, default: false },
    quick: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const emit = defineEmits<{
    refresh: []
}>();

const { addSerie, deleteSerieInList, getSerieFromCache } = useSerie();

const existsInList = ref(false);

const computedIcon = computed(() => existsInList.value ? "mdi-bookmark-minus" : "mdi-bookmark-plus");
const computedColor = computed(() => existsInList.value ? MAIN_COLOR : "on-surface-variant");
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
    existsInList.value = !!(await getSerieFromCache(props.serie.id, { type: "userlist" }));
});
</script>

<style scoped>
.list-btn--quick {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}
</style>