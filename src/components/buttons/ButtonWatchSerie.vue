<template>
    <v-tooltip :text="watchText" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="watchColor" :icon="watchIcon" variant="text" @click="changeWatch" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { computed, ref, watch, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const emit = defineEmits<{
    refresh: []
}>();

const { updateField } = useSerie();
const { showSuccess } = useSnackbar();

const isWatching = ref(props.serie.watch ?? false);

watch(() => props.serie.watch, (value) => { isWatching.value = value ?? false; });

const watchText = computed(() => isWatching.value ? "Arrêter le visionnage" : "Reprendre le visionnage");
const watchColor = computed(() => isWatching.value ? "red" : "green");
const watchIcon = computed(() => isWatching.value ? "mdi-close-circle" : "mdi-play");

const changeWatch = async (): Promise<void> => {
    isWatching.value = await updateField(props.serie, "watch", "update");
    showSuccess(isWatching.value
        ? `Visionnage en cours pour "${props.serie.title}"`
        : `Visionnage arrêté pour "${props.serie.title}"`);
    emit("refresh");
}
</script>
