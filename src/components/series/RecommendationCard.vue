<template>
    <poster-card :image="recommendation.poster" :to="link">
        <template #quick-actions>
            <button-add-serie :serie-id="recommendation.id" quick />
        </template>

        <div class="friend-avatars px-4 pt-3">
            <v-avatar v-for="friend in visibleFriends" :key="friend.id" size="28" class="friend-avatar"
                :color="friend.picture ? undefined : 'primary'" @click.stop="goToFriend(friend)">
                <v-img v-if="friend.picture" :src="friend.picture" alt="" />
                <span v-else class="text-caption font-weight-bold">{{ initial(friend.username) }}</span>
            </v-avatar>
            <v-avatar v-if="extraFriendsCount > 0" size="28" class="friend-avatar" color="surface-variant">
                <span class="text-caption font-weight-bold">+{{ extraFriendsCount }}</span>
            </v-avatar>
        </div>

        <v-card-subtitle class="pt-2 pb-1 text-wrap font-weight-medium">
            <router-link class="recommendation-card-title" :text="recommendation.title" :to="link" />
        </v-card-subtitle>

        <v-card-text class="pt-0 pb-4 text-caption text-medium-emphasis">
            Aimé par {{ buildPlural("ami", recommendation.nbFriends) }} · {{ Math.round(recommendation.avgNote) }}/5
        </v-card-text>
    </poster-card>
</template>

<script lang="ts" setup>
import PosterCard from "@/components/PosterCard.vue";
import ButtonAddSerie from "@/components/buttons/ButtonAddSerie.vue";
import type { Recommendation, RecommendationFriend } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { useFriendStore } from "@/stores/friend";
import { computed, type PropType } from "vue";
import { useRouter } from "vue-router";

const MAX_VISIBLE_FRIENDS = 3;

const props = defineProps({
    recommendation: { type: Object as PropType<Recommendation>, required: true }
});

const router = useRouter();
const friendStore = useFriendStore();

const link = `/discover/${props.recommendation.id}`;

const visibleFriends = computed(() => props.recommendation.friends.slice(0, MAX_VISIBLE_FRIENDS));
const extraFriendsCount = computed(() => props.recommendation.friends.length - MAX_VISIBLE_FRIENDS);

const initial = (username: string): string => username.charAt(0).toUpperCase();

const goToFriend = (friend: RecommendationFriend) => {
    friendStore.setFriend({ id: friend.id, username: friend.username, picture: friend.picture, current: false });
    router.push("/friend");
}
</script>

<style scoped>
.recommendation-card-title {
    color: inherit;
}

.friend-avatars {
    display: flex;
}

.friend-avatar {
    cursor: pointer;
    border: 2px solid rgb(var(--v-theme-surface));
    margin-left: -10px;
}

.friend-avatar:first-child {
    margin-left: 0;
}
</style>
