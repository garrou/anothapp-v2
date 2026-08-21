<template>
    <div class="pill-tabs">
        <router-link to="/series" class="pill-tab" :class="{ 'pill-tab--active': active === 'all' }">
            Toutes
        </router-link>
        <router-link v-for="item in NAV_SERIES_STATUS" :key="item.status" :to="`/series-status?status=${item.status}`"
            class="pill-tab" :class="{ 'pill-tab--active': active === item.status }">
            {{ item.title }}
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NAV_SERIES_STATUS } from "@/constants/menus";

const route = useRoute();

const active = computed(() => route.name === "series-status" ? (route.query.status as string) : "all");
</script>

<style scoped>
.pill-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding-top: 20px;
}

.pill-tab {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 7px 18px;
    text-decoration: none;
    font-weight: 600;
    font-size: 13.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    transition: background 0.15s ease, color 0.15s ease;
}

.pill-tab:hover {
    background: rgb(var(--v-theme-surface-variant));
}

.pill-tab--active {
    background: rgba(var(--v-theme-primary), 0.12);
    color: rgb(var(--v-theme-primary));
}
</style>
