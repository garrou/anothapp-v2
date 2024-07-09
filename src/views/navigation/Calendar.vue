<template>
    <v-container>
        <v-sheet>
            <v-calendar ref="calendar" v-model="value" :events="seasons" view-mode="month" :weekdays="weekdays">
                <template v-slot:event="{ event }">
                    <v-card class="ma-2" :color="event.color as string" @click="$router.push(`/series/${event.id}`)">
                        <v-card-text class="py-1">{{ event.title }}</v-card-text>
                        <v-card-subtitle class="mb-1">{{ event.season }}</v-card-subtitle>
                    </v-card>
                </template>
            </v-calendar>
        </v-sheet>
    </v-container>
</template>

<script lang="ts" setup>
import { useSeason } from "@/composables/season";
import { onBeforeMount, ref } from "vue";

const colors = ["blue", "indigo", "purple", "cyan", "green", "orange", "red", "amber"];
const weekdays = [0, 1, 2, 3, 4, 5, 6];

const { getSeasonsTimeline } = useSeason();

const seasons = ref<any[]>([]);
const value = ref([new Date()]);

const rnd = (a: number, b: number) => Math.floor((b - a + 1) * Math.random()) + a;

const getSeasons = async () => {
    const timeline = await getSeasonsTimeline(120);
    seasons.value = timeline.map((s) => ({
        id: s.showId,
        title: s.showTitle,
        season: `Saison ${s.season.number}`,
        start: new Date(s.addedAt),
        end: new Date(s.addedAt),
        color: colors[rnd(0, colors.length - 1)],
    }));
}

onBeforeMount(async () => await getSeasons());
</script>