<template>
  <router-view :key="$route.path" />
  <base-bottom-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import BaseBottomNavbar from "./components/BaseBottomNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
import { useSerie } from "./composables/serie";
import { useAuth } from "./composables/auth";
import { SerieStatus } from "./types/types";

const { checkAuth } = useAuth();
const { getSeries, getSeriesByStatus } = useSerie();

onBeforeMount(async () => {
  if (await checkAuth()) {
    await getSeries();
    await getSeriesByStatus(SerieStatus.Watchlist);
  }
});
</script>
