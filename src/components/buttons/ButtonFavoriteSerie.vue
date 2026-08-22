    <template>
    <v-list-item v-if="!!serie && menuItem" :prepend-icon="FAVORITE_ICON" :title="favoriteText"
        :class="{ 'text-red': isFavorite }" @click="changeFavorite" />

    <v-tooltip v-else-if="!!serie" :text="favoriteText" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="fav-btn" :class="{ 'fav-btn--quick': quick }" :color="favoriteColor"
                :icon="FAVORITE_ICON" :size="quick ? 32 : undefined" :variant="quick ? 'flat' : 'text'"
                @click="changeFavorite" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { useSnackbar } from '@/composables/snackbar';
import { FAVORITE_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    menuItem: { type: Boolean, default: false },
    quick: { type: Boolean, default: false },
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const emit = defineEmits<{
    refresh: []
}>();

const { getSerieFromCache, updateField } = useSerie();
const { showSuccess } = useSnackbar();

const serie = ref<Serie>();
const isFavorite = ref(false);

const favoriteText = computed(() => isFavorite.value ? "Supprimer des favoris" : "Ajouter aux favoris");
const favoriteColor = computed(() => isFavorite.value ? "red" : "on-surface-variant");

const changeFavorite = async (): Promise<void> => {
    if (!serie.value) throw new Error("Impossible de modifier la série");
    isFavorite.value = await updateField(serie.value, "favorite", "update");
    showSuccess(isFavorite.value
        ? `"${serie.value.title}" ajoutée aux favoris`
        : `"${serie.value.title}" supprimée des favoris`);
    emit("refresh");
}

onBeforeMount(async () => {
    serie.value = await getSerieFromCache(props.serieId);
    isFavorite.value = serie.value?.favorite ?? false;
});
</script>

<style scoped>
.fav-btn--quick {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}
</style>