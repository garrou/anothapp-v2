<template>
    <nav v-if="show" class="side-nav" aria-label="Navigation principale">
        <router-link to="/series" class="side-nav-brand" aria-label="anothapp">
            <span class="brand-dot"></span>
        </router-link>

        <div class="side-nav-links">
            <router-link v-for="(item, index) in NAV_MENU" :key="index" :to="item.link" class="side-nav-link"
                :class="{ 'side-nav-link--active': isMenuActive(item.link) }">
                <v-icon :icon="item.icon" size="22" />
                <span>{{ item.title }}</span>
            </router-link>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NAV_MENU, PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";

const route = useRoute();

const show = computed(() => !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));

// Exact or segment-boundary match: avoids "/series-status" being wrongly
// treated as active for the "/series" link (plain startsWith would collide
// since "/series-status" begins with the same characters as "/series").
const isMenuActive = (link: string) => route.path === link || route.path.startsWith(`${link}/`);
</script>

<style scoped>
.side-nav {
    display: none;
}

@media (min-width: 960px) {
    .side-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 84px;
        padding: 20px 0;
        background: rgb(var(--v-theme-surface));
        border-right: 1px solid rgb(var(--v-border-color));
        z-index: 1005;
    }
}

.side-nav-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
}

.brand-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
}

.side-nav-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 0 10px;
}

.side-nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 4px;
    border-radius: 12px;
    text-decoration: none;
    color: rgb(var(--v-theme-on-surface-variant));
    font-size: 10.5px;
    font-weight: 600;
    transition: background 0.15s ease, color 0.15s ease;
}

.side-nav-link span {
    text-align: center;
    line-height: 1.15;
}

.side-nav-link:hover {
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface));
}

.side-nav-link--active {
    background: rgba(var(--v-theme-primary), 0.12);
    color: rgb(var(--v-theme-primary));
}
</style>
