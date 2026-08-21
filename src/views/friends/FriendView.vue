<template>
    <div v-if="friend">
        <v-btn class="back-btn" icon="mdi-chevron-left" variant="text" @click="goBack" />

        <div class="friend-hero">
            <v-avatar size="96" :image="friend.picture" />
            <div class="text-h6 font-weight-bold mt-3">{{ friend.username }}</div>
        </div>

        <v-container>
            <dashboard :user-id="friend.id" :show-bar="false" />
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import Dashboard from "@/views/stats/Dashboard.vue";
import { useFriendStore } from "@/stores/friend";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const friendStore = useFriendStore();
const { friend } = storeToRefs(friendStore);

const goBack = () => {
    friendStore.reset();
    if (router.options.history.state.back) router.back();
    else router.push('/friends');
}

onBeforeMount(() => {
    if (!friend.value) router.replace('/friends');
});
</script>

<style scoped>
.back-btn {
    margin: 12px 0 0 8px;
}

.friend-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px 24px;
    text-align: center;
}
</style>
