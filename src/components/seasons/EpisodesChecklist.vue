<template>
    <v-list class="episodes-checklist" density="compact">
        <v-list-item v-for="episode in episodes" :key="episode.id" :title="episode.title"
            :subtitle="`${episode.code} • ${formatDate(episode.date)}`">
            <template #append>
                <v-chip v-if="!isAired(episode)" size="small" variant="outlined">À venir</v-chip>

                <v-menu v-else>
                    <template #activator="{ props: menuProps }">
                        <v-btn v-bind="menuProps" size="small" variant="tonal"
                            :color="episode.views > 0 ? MAIN_COLOR : undefined">
                            x{{ episode.views }}
                        </v-btn>
                    </template>

                    <v-list density="compact">
                        <v-list-item title="Ajouter un visionnage" @click="addViewing(episode)" />
                        <v-list-item v-if="episode.views > 0" title="Supprimer le dernier visionnage"
                            @click="removeViewing(episode)" />
                    </v-list>
                </v-menu>
            </template>
        </v-list-item>
    </v-list>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useEpisode } from "@/composables/episode";
import type { UserEpisode } from "@/models/userEpisode";
import { formatDate } from "@/utils/format";
import { MAIN_COLOR } from "@/constants/style";

const props = defineProps({
    id: { type: Number, required: true },
    number: { type: Number, required: true }
});

const { getEpisodesBySerieIdBySeason, watchEpisode, unwatchEpisode } = useEpisode();

const episodes = ref<UserEpisode[]>([]);

const isAired = (episode: UserEpisode): boolean => !!episode.date && new Date(episode.date) <= new Date();

const addViewing = async (episode: UserEpisode): Promise<void> => {
    episode.views = await watchEpisode(episode.id);
}

const removeViewing = async (episode: UserEpisode): Promise<void> => {
    episode.views = await unwatchEpisode(episode.id);
}

onBeforeMount(async () => {
    episodes.value = await getEpisodesBySerieIdBySeason(props.id, props.number);
});
</script>

<style scoped>
.episodes-checklist {
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 12px;
    margin-bottom: 16px;
}
</style>
