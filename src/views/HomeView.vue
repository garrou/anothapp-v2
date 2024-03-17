<template>
  <h1 class="text-center">Anothapp V2</h1>

  <div class="text-center ga-3">
    <base-link text="Se connecter" to="/login" />
    <base-link text="S'inscrire" to="/register" />
  </div>
</template>

<script setup lang="ts">
import BaseLink from '@/components/BaseLink.vue';
</script>
