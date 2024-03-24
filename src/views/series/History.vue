<template>
    <v-container>
        <v-select v-model="month" :density="DENSITY" :items="MONTHS" item-title="text" item-value="value" />
        <v-timeline>
            <v-timeline-item v-for="season in timeline" size="x-small" :key="season.showId * season.season.number">
                <template v-slot:opposite>
                    <router-link :to="`/series/${season.showId}`">
                        <strong class="text-black">{{ season.showTitle }}</strong>
                    </router-link>
                    <p v-if="season.addedAt">{{ formatDate(season.addedAt) }}</p>
                </template>
                <season-card :season="season.season" />
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script lang="ts" setup>
import SeasonCard from "@/components/SeasonCard.vue";
import { useSeason } from "@/composables/season";
import { DENSITY } from "@/constants/style";
import type { SeasonTimeline } from "@/models/season";
import { formatDate } from "@/utils/format";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const MONTHS = [
    {
        text: "Ce mois",
        value: 0,
    },
    {
        text: "Depuis un mois",
        value: 1,
    },
    {
        text: "Depuis 2 mois",
        value: 2
    },
    {
        text: "Depuis 3 mois",
        value: 3
    },
    {
        text: "Depuis 6 mois",
        value: 6
    },
    {
        text: "Depuis 1 an",
        value: 12
    }
];

const { getSeasonsTimeline } = useSeason();

const month = ref(0);
const timeline = ref<SeasonTimeline[]>([]);

const showHistory = async () => {
    timeline.value = await getSeasonsTimeline(month.value);
}

onBeforeMount(async () => {
    await showHistory();
})
</script>