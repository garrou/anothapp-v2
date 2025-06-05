<template>

    <v-btn class="mb-2 ms-1" :icon="orderIcon" @click="orderSeasons" />

    <v-row>
        <v-col v-for="season in seasons" cols="6" md="4" lg="3" :key="season.number">
            <base-skeleton :loading="loading" type="card">
                <season-card :season="season" @show="$emit('showSeason', season, addable)">
                    <template v-if="addable" #add>
                        <v-btn :color="MAIN_COLOR" :icon="ADD_ICON" variant="text"
                            @click="$emit('addSeason', season)" />
                    </template>
                </season-card>
            </base-skeleton>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import SeasonCard from "./SeasonCard.vue";
import { computed, ref, type PropType } from "vue";
import type { Season } from "@/models/season";
import { ADD_ICON } from "@/constants/icons";
import { MAIN_COLOR } from "@/constants/style";

const props = defineProps({
    addable: { type: Boolean, default: false },
    seasons: { type: Array as PropType<Season[]>, required: true },
    loading: { type: Boolean, required: true }
});

defineEmits<{
    addSeason: [Season]
    showSeason: [Season, boolean]
}>();

const order = ref(false);
const orderIcon = computed(() => order.value ? "mdi-sort-numeric-descending" : "mdi-sort-numeric-ascending");

const orderFunc = (a: Season, b: Season) => order.value ? a.number - b.number : b.number - a.number;

const orderSeasons = (): void => {
    props.seasons.sort(orderFunc);
    order.value = !order.value;
}
</script>