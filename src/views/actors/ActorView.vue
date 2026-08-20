<template>
    <div v-if="actor">
        <serie-hero :poster="actor.poster" :title="actor.name" @back="goBack" />

        <v-container>
            <actor-details :actor="actor" />
            <series-row :loading="loading" :series="actor.series" total />
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import ActorDetails from "@/components/actors/ActorDetails.vue";
import SerieHero from "@/components/series/SerieHero.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSearch } from "@/composables/search";
import type { Actor } from "@/models/person";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true }
});

const router = useRouter();
const { getActor } = useSearch();

const actor = ref<Actor>();
const loading = ref(false);

const goBack = () => {
    if (router.options.history.state.back) router.back();
    else router.push('/discover');
}

onBeforeMount(async () => {
    loading.value = true;
    actor.value = await getActor(props.id);
    loading.value = false;
});
</script>
