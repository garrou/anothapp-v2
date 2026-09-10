<template>
    <base-app-bar />

    <v-container class="achievements-container">
        <div class="achievements-header text-h6 font-weight-bold">
            <v-icon :icon="ACHIEVEMENT_ICON" class="me-2" />Succès
        </div>

        <badges-grid />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BadgesGrid from "@/components/achievements/BadgesGrid.vue";
import { ACHIEVEMENT_ICON } from "@/constants/icons";
</script>

<style scoped>
.achievements-container {
    max-width: 880px;
}

.achievements-header {
    margin-bottom: 20px;
}
</style>
