<template>
    <v-tooltip v-if="exists" text="Supprimer la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="surface-variant" elevation="0" :icon="DELETE_ICON" variant="text"
                @click="confirm = true" />
        </template>
    </v-tooltip>

    <base-confirm v-model="confirm" title="Supprimer" text="Confirmez-vous la suppression de la série ?"
        @cancel="confirm = false" @confirm="removeSerie" />
</template>

<script lang="ts" setup>
import BaseConfirm from './BaseConfirm.vue';
import { useSerie } from '@/composables/serie';
import { DELETE_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { onBeforeMount, ref, watch, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { deleteSerie, getSerieFromCache } = useSerie();

const confirm = ref(false);
const exists = ref(false);

const removeSerie = async (): Promise<void> => {
    confirm.value = !(await deleteSerie(props.serie));
}

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serie.id));
});
</script>