<template>
  <side-nav />
  <div class="app-shell" :class="{ 'app-shell--nav': showSideNav }">
    <router-view :key="$route.path" />
  </div>
  <home-app-bar />
  <base-bottom-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import BaseBottomNavbar from "./components/BaseBottomNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
import HomeAppBar from "./components/HomeAppBar.vue";
import SideNav from "./components/SideNav.vue";
import { useSerie } from "./composables/serie";
import { useAuth } from "./composables/auth";
import { SerieStatus } from "./types/types";
import { usePlatform } from "./composables/platform.js";
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from "./constants/menus";

const route = useRoute();
const { checkAuth } = useAuth();
const { getUserPlatforms } = usePlatform();
const { getSeries, getSeriesByStatus } = useSerie();

const showSideNav = computed(() => !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));

onBeforeMount(async () => {
  if (await checkAuth()) {
    await Promise.all([
      getSeries(),
      getSeriesByStatus(SerieStatus.Watchlist),
      getUserPlatforms(),
    ]);
  }
});
</script>

<style scoped>
@media (min-width: 960px) {
  .app-shell--nav {
    padding-left: 96px;
  }
}
</style>
