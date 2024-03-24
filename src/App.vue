<template>
  <router-view />
  <base-bottom-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import BaseBottomNavbar from "./components/BaseBottomNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
</script>
