<template>
    <v-sheet>
        <v-calendar ref="calendar" v-model="value" :events="seasons" :view-mode="calendarView" :weekdays="weekdays">
            <template v-slot:event="{ event }">
                <v-card class="ma-2" :color="event.color as string" @click="$router.push(`/series/${event.id}`)">
                    <v-card-text class="py-1">{{ event.title }}</v-card-text>
                    <v-card-subtitle class="mb-1">{{ event.season }}</v-card-subtitle>
                </v-card>
            </template>
        </v-calendar>
    </v-sheet>
</template>

<script lang="ts" setup>
import { useSeason } from "@/composables/season";
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import type { CalendarWeekdays } from "vuetify/lib/composables/calendar.mjs";

const colors = ["blue", "indigo", "purple", "cyan", "green", "orange", "red", "amber"];
const weekdays = [0, 1, 2, 3, 4, 5, 6] as CalendarWeekdays[];

const { getSeasonsTimeline } = useSeason();

const seasons = ref<any[]>([]);
const value = ref([new Date()]);
const windowWidth = ref(window.innerWidth);

const calendarView = computed(() => windowWidth.value < 600 ? "day" : "month");

const rnd = (a: number, b: number) => Math.floor((b - a + 1) * Math.random()) + a;

const onWidthChange = () => windowWidth.value = window.innerWidth;

onMounted(() => window.addEventListener('resize', onWidthChange));

onUnmounted(() => window.removeEventListener('resize', onWidthChange));

onBeforeMount(async () => {
    const timeline = await getSeasonsTimeline(60);
    seasons.value = timeline.map((s) => ({
        id: s.showId,
        title: s.showTitle,
        season: `Saison ${s.season.number}`,
        start: new Date(s.addedAt),
        end: new Date(s.addedAt),
        color: colors[rnd(0, colors.length - 1)],
    }));
});
</script>