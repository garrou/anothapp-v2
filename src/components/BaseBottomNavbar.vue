<template>
    <v-layout v-if="navbar" class="mt-10">
        <v-bottom-navigation :density="DENSITY" mode="shift">
            <v-btn v-for="(item, index) in NAV_MENU" class="btn" :key="index" :to="item.link">
                <v-icon>{{ item.icon }}</v-icon>
                <span>{{ item.title }}</span>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NAV_MENU, PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";
import { DENSITY } from "@/constants/style";

const route = useRoute();

const navbar = computed(() => !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));
</script>

<style scoped>
.btn {
    min-width: 74px;
}
</style>