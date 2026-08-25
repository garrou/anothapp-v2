<template>
    <div v-if="actor">
        <serie-hero :poster="actor.poster" :title="actor.name" @back="goBack" />

        <v-container>
            <actor-details :actor="actor" />
            <series-row :loading="loading" :series="actor.series" total empty-title="Aucune série connue"
                empty-description="Aucune série n'est associée à cet acteur pour le moment." :empty-cta="false" />
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import ActorDetails from "@/components/actors/ActorDetails.vue";
import SerieHero from "@/components/series/SerieHero.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSearch } from "@/composables/search";
import type { Actor } from "@/models/person";
import { goBack as navigateBack } from "@/utils/navigation";
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true }
});

const router = useRouter();
const { getActor } = useSearch();

const actor = ref<Actor>();
const loading = ref(false);

const goBack = () => navigateBack(router, "/discover");

const load = async () => {
    loading.value = true;
    try {
        actor.value = await getActor(props.id);
    } finally {
        loading.value = false;
    }
}

watch(() => props.id, load);

onBeforeMount(load);
</script>
