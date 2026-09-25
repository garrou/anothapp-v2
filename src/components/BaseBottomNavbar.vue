<template>
    <v-layout v-if="navbar" class="mt-10 bottom-navbar-layout">
        <v-bottom-navigation color="primary">
            <v-btn v-for="(item, index) in NAV_MENU" :key="index" :to="item.link">
                <v-badge v-if="item.link === '/friends'" :content="friendsBadgeCount"
                    :model-value="friendsBadgeCount > 0" color="error">
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
import { usePendingWatchTogetherInvites } from "@/composables/pendingWatchTogetherInvites";

const route = useRoute();
const pendingRequests = usePendingFriendRequests();
const { pendingInvites } = usePendingWatchTogetherInvites();

const navbar = computed(() => !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));
const friendsBadgeCount = computed(() => pendingRequests.value + pendingInvites.value);
</script>

<style scoped>
@media screen and (max-width: 960px) {
    .v-btn {
        min-width: 64px !important;
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