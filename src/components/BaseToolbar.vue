<template>
  <v-toolbar color="white">
    <v-app-bar-nav-icon v-if="icon" @click="navigate">
      <v-icon>{{ icon }}</v-icon>
    </v-app-bar-nav-icon>

    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <base-menu v-if="$slots.buttons" open-on-click open-on-hover>
      <slot name="buttons" />
    </base-menu>
  </v-toolbar>
</template>

<script lang="ts" setup>
import BaseMenu from "./BaseMenu.vue";
import { goBack } from "@/utils/navigation";
import { useRouter } from "vue-router";

defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true }
});

const router = useRouter();

const navigate = () => goBack(router, "/series");
</script>