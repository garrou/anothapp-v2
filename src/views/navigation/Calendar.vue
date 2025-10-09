<template>
    <base-app-bar />

    <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            color="grey-darken-2"
            size="small"
            variant="text"
            icon
            @click="calendar.prev()"
          >
            <v-icon size="small">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            color="grey-darken-2"
            size="small"
            variant="text"
            icon
            @click="calendar.next()"
          >
            <v-icon size="small">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="calendar">
            {{ calendar.title }}
          </v-toolbar-title>
        </v-toolbar>
      </v-sheet>

    <v-sheet height="600">
        <v-calendar ref="calendar" v-model="value" :events="series" :type="calendarView" :weekdays="weekdays" @click:event="showEvent">
        </v-calendar>
    </v-sheet>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import { useSerie } from "@/composables/serie";
import { SerieStatus } from "@/types/types";
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { CalendarWeekdays } from "vuetify/lib/composables/calendar.mjs";

const colors = ["blue", "indigo", "purple", "cyan", "green", "orange", "red", "amber"];
const weekdays = [0, 1, 2, 3, 4, 5, 6] as CalendarWeekdays[];

const { getSeriesByStatus } = useSerie();
const router = useRouter();

const calendar = ref();
const series = ref<any[]>([]);
const value = ref("");
const windowWidth = ref(window.innerWidth);

const calendarView = computed(() => windowWidth.value < 600 ? "week" : "month");

const rnd = (a: number, b: number) => Math.floor((b - a + 1) * Math.random()) + a;

const onWidthChange = () => {
    windowWidth.value = window.innerWidth;
}

const showEvent = (nativeEvent: any, { event }: any) => {
    router.push(`/series/${event.id}`);
}

onMounted(() => window.addEventListener('resize', onWidthChange));

onUnmounted(() => window.removeEventListener('resize', onWidthChange));

onBeforeMount(async () => {
    const nextSeries = await getSeriesByStatus(SerieStatus.Next);
    series.value = nextSeries.map((s) => ({
        id: s.id,
        name: s.title,
        start: `${s.nextEpisode} 00:00`,
        end: `${s.nextEpisode} 23:59`,
        color: colors[rnd(0, colors.length - 1)],
    }));
});
</script>