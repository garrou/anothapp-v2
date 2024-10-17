<template>
  <router-view :key="$route.path" />
  <base-bottom-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import BaseBottomNavbar from "./components/BaseBottomNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
import { useUser } from "./composables/user";
import { useSerie } from "./composables/serie";

const { checkAuth } = useUser();
const { getSeries } = useSerie();

onBeforeMount(async () => {
  if (await checkAuth()) {
    await getSeries();
  }
});
</script>
