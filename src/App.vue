<template>
  <router-view /> 
  <base-navbar />
  <base-snackbar />
</template>

<script setup lang="ts">
import BaseNavbar from "./components/BaseNavbar.vue";
import BaseSnackbar from "./components/BaseSnackbar.vue";
</script>
