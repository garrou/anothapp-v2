<template>

  <div class="text-center">
    <h1>Anothapp</h1>

    <v-btn class="mt-2" @click="$router.push('/login')">Se connecter</v-btn>
  </div>

  <v-container>
    <v-row class="mt-1">
      <v-col v-for="(image, index) in images" cols="6" md="4" lg="3" :key="index">
        <base-image :src="image" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useSearch } from '@/composables/search';
import { onBeforeMount, ref } from 'vue';
import BaseImage from '@/components/BaseImage.vue';

const { getImages } = useSearch();

const images = ref<string[]>([]);

onBeforeMount(async () => {
  images.value = await getImages(8);
});
</script>