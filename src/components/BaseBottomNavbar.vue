<template>
    <v-layout v-if="navbar" class="mt-10 bottom-navbar-layout">
        <v-bottom-navigation color="primary">
            <v-btn v-for="(item, index) in NAV_MENU" :key="index" :to="item.link">
                <v-badge v-if="item.link === '/friends'" :content="pendingRequests"
                    :model-value="pendingRequests > 0" color="error">
                    <v-icon>{{ item.icon }}</v-icon>
                </v-badge>
                <v-icon v-else>{{ item.icon }}</v-icon>
                <span>{{ item.title }}</span>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { NAV_MENU, PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";
import { usePendingFriendRequests } from "@/composables/pendingFriendRequests";

const route = useRoute();
const pendingRequests = usePendingFriendRequests();

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

@media (min-width: 960px) {
    .bottom-navbar-layout {
        display: none;
    }
}
</style>