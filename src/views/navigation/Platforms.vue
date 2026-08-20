<template>
    <base-app-bar />

    <v-container>
        <v-row class="mb-10">
            <v-col v-for="plt in allPlatforms" :key="plt.id" cols="6" sm="4" md="3" lg="2">
                <v-checkbox v-model="platforms" class="platform-checkbox" hide-details :value="plt.id"
                    :class="{ 'platform-checkbox--selected': platforms.includes(plt.id) }"
                    @update:model-value="manageUserPlatforms(plt.id)">
                    <template #label>
                        <div class="d-flex flex-column align-center text-center w-100">
                            <platform-card :platform="plt" show-name />
                        </div>
                    </template>
                </v-checkbox>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import { usePlatform } from "@/composables/platform";
import { useSearch } from "@/composables/search";
import PlatformCard from "@/components/series/PlatformCard.vue";
import type { Platform } from "@/models/serie";
import { onBeforeMount, ref } from "vue";

const { getUserPlatforms, updateUserPlatforms, deleteUserPlatform } = usePlatform();
const { getPlatforms } = useSearch();

const allPlatforms = ref<Platform[]>([]);
const platforms = ref<number[]>([]); 

const initAllPlatforms = async () => {
    allPlatforms.value = (await getPlatforms()).filter(plt => plt.logo);
    platforms.value = await getUserPlatforms();
}

const manageUserPlatforms = async (platformId: number) => {
    if (platforms.value.includes(platformId)) {
        await updateUserPlatforms(platformId);
    } else {
        await deleteUserPlatform(platformId); 
    }
}

onBeforeMount(async () => {
    await initAllPlatforms();
})
</script>

<style scoped>
.platform-checkbox {
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 12px;
    padding: 12px 4px;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}

.platform-checkbox--selected {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.06);
}
</style>