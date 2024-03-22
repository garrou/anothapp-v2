<template>
    <v-layout v-if="navbar" class="overflow-visible" style="height: 50px;">
        <v-bottom-navigation mode="shift">
            <v-btn v-for="(item, index) in NAV_MENU" :key="index" :to="item.link">
                <v-icon>{{ item.icon }}</v-icon>
                <span>{{ item.title }}</span>
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script lang="ts" setup>
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from '@/constants/menu';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { NAV_MENU } from "@/constants/menu";

const route = useRoute();

const navbar = computed(() => !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string));
</script>