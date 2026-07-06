<template>
    <base-app-bar />

    <v-container>
        <v-row class="mb-10">
            <v-col v-for="plt in allPlatforms" :key="plt.id" cols="6" sm="4" md="3" lg="2">
                <v-checkbox v-model="platforms" hide-details :value="plt.id"
                    @update:model-value="manageUserPlatforms(plt.id)">
                    <template #label>
                        <div class="d-flex flex-column align-center text-center w-100">
                            <v-avatar v-if="plt.logo" :image="plt.logo" />
                            <v-avatar v-else color="grey">
                                <v-icon color="white" :icon="PLATFORM_ICON" />
                            </v-avatar>
                            <span class="text-caption mt-1">{{ plt.name }}</span>
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
import { PLATFORM_ICON } from "@/constants/icons";
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