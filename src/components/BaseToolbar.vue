<template>
    <v-toolbar color="white">
        <v-app-bar-nav-icon v-if="icon" @click="navigate">
            <v-icon>{{ icon }}</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <v-menu open-on-click open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item v-if="slots.firstBtn">
                <slot name="firstBtn" />
              </v-list-item>
              <v-list-item v-if="slots.secondBtn">
                <slot name="secondBtn" />
              </v-list-item>
              <v-list-item v-if="slots.thirdBtn">
                <slot name="thirdBtn" />
              </v-list-item>
              <v-list-item v-if="slots.fourthBtn">
                <slot name="fourthBtn" />
              </v-list-item>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";
import { useRouter } from "vue-router";

defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true }
});

const router = useRouter();
const slots = useSlots();

const navigate = () => {
  if (router.options.history.state.back) 
    router.back();
  else
    router.push('/series');
}
</script>