<template>
    <v-expansion-panels multiple>
        <v-expansion-panel v-for="episode in episodes" :key="episode.id">
            <v-expansion-panel-title>
                <p class="text-subtitle-1 mr-2">#{{ episode.global }}</p>
                <p>{{ episode.title }}</p>
          
            </v-expansion-panel-title>

            <v-expansion-panel-text>
                <v-chip class="mb-2" :color="MAIN_COLOR" size="small">
                    {{ episode.code }} • {{ episode.date }}
                </v-chip>

                <p>{{ episode.description }}</p>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import type { Episode } from "@/models/episode";
import { MAIN_COLOR } from "@/constants/style";

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
