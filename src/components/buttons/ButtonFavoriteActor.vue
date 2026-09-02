<template>
    <v-tooltip :text="favoriteText" :location="TOOLTIP_LOCATION">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="fav-btn" :class="{ 'fav-btn--quick': quick }" :color="favoriteColor"
                :icon="FAVORITE_ICON" :size="quick ? 32 : undefined" :variant="quick ? 'flat' : 'text'"
                :loading="loading" :disabled="loading" @click="changeFavorite" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useActor } from '@/composables/actor';
import { useActorStore } from '@/stores/actor';
import { useSnackbar } from '@/composables/snackbar';
import { FAVORITE_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps({
    actorId: { type: Number, required: true },
    actorName: { type: String, required: true },
    quick: { type: Boolean, default: false }
});

const emit = defineEmits<{
    change: [isFavorite: boolean]
}>();

const { addFavoriteActor, loadFavoriteActorIds, removeFavoriteActor } = useActor();
const { showError } = useSnackbar();
const actorStore = useActorStore();

const loading = ref(false);

const isFavorite = computed(() => actorStore.isFavorite(props.actorId));
const favoriteText = computed(() => isFavorite.value ? "Supprimer des favoris" : "Ajouter aux favoris");
const favoriteColor = computed(() => isFavorite.value ? "red" : "on-surface-variant");

const changeFavorite = async (): Promise<void> => {
    loading.value = true;

    try {
        if (isFavorite.value) {
            await removeFavoriteActor(props.actorId, props.actorName);
            emit("change", false);
        } else {
            await addFavoriteActor(props.actorId, props.actorName);
            emit("change", true);
        }
    } catch (e) {
        showError((e as Error).message);
    } finally {
        loading.value = false;
    }
}

onBeforeMount(loadFavoriteActorIds);
</script>

<style scoped>
.fav-btn--quick {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}
</style>
