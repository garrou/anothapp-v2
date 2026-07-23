<template>
  <router-view :key="$route.path" />
  <home-app-bar />
  <base-bottom-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import BaseBottomNavbar from "./components/BaseBottomNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
import HomeAppBar from "./components/HomeAppBar.vue";
import { useSerie } from "./composables/serie";
import { useAuth } from "./composables/auth";
import { SerieStatus } from "./types/types";
import { usePlatform } from "./composables/platform.js";

const { checkAuth } = useAuth();
const { getUserPlatforms } = usePlatform();
const { getSeries, getSeriesByStatus } = useSerie();

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
