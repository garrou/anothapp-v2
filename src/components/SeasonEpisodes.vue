<template>
    <v-card v-for="episode in episodes" :key="episode.id" class="mx-auto my-2">
        <v-card-item>
            <v-card-title class="text-h5 mb-1">
                {{ episode.title }}
                <v-chip class="ml-2" color="black" size="small">
                    {{ episode.code }}
                </v-chip>
            </v-card-title>
            <v-card-subtitle>
                #{{ episode.global }} • {{ episode.date }}
            </v-card-subtitle>
        </v-card-item>

        <v-card-text>
            <p class="text-body-1">{{ episode.description }}</p>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import type { Episode } from "@/models/episode";

const props = defineProps({
    id: { type: Number, required: true },
    number: { type: Number, required: true }
});

const { getEpisodes } = useSearch();

const episodes = ref<Episode[]>([]);

onBeforeMount(async () => {
    episodes.value = await getEpisodes(props.id, props.number);
});
</script>
