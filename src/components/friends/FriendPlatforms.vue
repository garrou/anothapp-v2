<template>
    <v-expansion-panels v-if="userId" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">{{ platformsLabel }}</span>
            </template>
            <template #text>
                <v-row>
                    <v-col v-for="plt in platforms" :key="plt.id" cols="6" sm="4" md="3" lg="2">
                        <platform-card :platform="plt" show-name />
                    </v-col>
                </v-row>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { usePlatform } from '@/composables/platform';
import { useSearch } from '@/composables/search';
import { ELEVATION } from '@/constants/style';
import type { Platform } from '@/models/serie';
import PlatformCard from '@/components/series/PlatformCard.vue';
import { buildPlural } from '@/utils/format';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps({
    userId: { type: String, required: true }
});

const { getFriendPlatforms } = usePlatform();
const { getPlatforms } = useSearch();

const platforms = ref<Platform[]>([]);

const platformsLabel = computed(() =>
    `${buildPlural("plateforme", platforms.value.length)} ${buildPlural("suivie", platforms.value.length, false, false)}`);

onBeforeMount(async () => {
    const [allPlatforms, friendPlatformIds] = await Promise.all([getPlatforms(), getFriendPlatforms(props.userId)]);
    platforms.value = allPlatforms.filter((plt) => friendPlatformIds.includes(plt.id));
});
</script>
