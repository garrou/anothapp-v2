<template>
    <v-btn v-if="primary" class="watch-btn--primary" color="primary" :prepend-icon="watchIcon" rounded="pill"
        @click="changeWatch">
        {{ watchText }}
    </v-btn>

    <v-list-item v-else-if="menuItem" :prepend-icon="watchIcon" :title="watchText" @click="changeWatch" />

    <v-tooltip v-else :text="watchText" :location="tooltipLocation">
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
    menuItem: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
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

<style scoped>
.watch-btn--primary {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.32);
}
</style>
