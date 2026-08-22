<template>
    <v-btn v-if="primary && exists" class="add-btn--done" color="primary" disabled prepend-icon="mdi-check"
        rounded="pill" variant="tonal">
        Déjà ajoutée
    </v-btn>

    <v-btn v-else-if="primary" class="add-btn--primary" color="primary" :prepend-icon="ADD_ICON" rounded="pill"
        @click="addSerie(serieId)">
        Ajouter
    </v-btn>

    <v-list-item v-else-if="!exists && menuItem" prepend-icon="mdi-bookmark-plus" title="Ajouter à ma liste"
        @click="addSerie(serieId)" />

    <v-tooltip v-else-if="!exists" text="Ajouter la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="add-btn" :class="{ 'add-btn--quick': quick }"
                color="on-surface-variant" :elevation="0" :icon="ADD_ICON"
                :size="quick ? 32 : undefined" :variant="quick ? 'flat' : 'text'" @click="addSerie(serieId)" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { ADD_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import { onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    menuItem: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    quick: { type: Boolean, default: false },
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { addSerie, getSerieFromCache } = useSerie();

const exists = ref(false);

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serieId));
});
</script>

<style scoped>
.add-btn--quick {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}

.add-btn--primary {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.32);
}
</style>