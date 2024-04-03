<template>
    <v-layout v-if="navbar" class="mt-10">
        <v-bottom-navigation :density="DENSITY">
            <v-btn v-for="(item, index) in NAV_MENU" :key="index" :to="item.link">
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
@media screen and (max-width: 960px) {
    .v-btn {
        min-width: 75px !important;
    }

    .v-btn span {
        display: none;
    }
}
</style>