<template>
    <div class="px-3">
        <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
            <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                label="Nom d'utilisateur" required variant="underlined"
                @click:append-inner="$emit('search', username)" />
        </v-form>

        <card-grid v-if="friends.length" :items="friends" :loading="loading">
            <template #default="{ item: friend }">
                <poster-card :image="friend.picture" @click="consult ? showFriend(friend) : undefined">
                    <template #quick-actions>
                        <v-btn v-if="consult" class="friend-quick-btn" :icon="DETAILS_ICON" size="32" variant="flat"
                            color="on-surface-variant" @click.stop="showFriend(friend)" />
                        <v-btn v-if="addable" class="friend-quick-btn" :icon="ADD_ICON" size="32" variant="flat"
                            color="on-surface-variant" @click.stop="addFriend(friend)" />
                        <v-btn v-if="accept" class="friend-quick-btn" icon="mdi-check" size="32" variant="flat"
                            color="green" @click.stop="acceptFriend(friend)" />
                        <v-btn v-if="remove" class="friend-quick-btn" :icon="DELETE_ICON" size="32" variant="flat"
                            color="red" @click.stop="showConfirm(friend)" />
                    </template>

                    <v-card-subtitle class="pt-4 pb-4 font-weight-medium">{{ friend.username }}</v-card-subtitle>
                </poster-card>
            </template>
        </card-grid>
        <empty-state v-else :icon="emptyCopy.icon" :title="emptyCopy.title" :description="emptyCopy.description" />
    </div>

    <base-confirm v-model="confirm" text="Supprimer cet(te) ami(e) ?" title="Supprimer" persistent
        @cancel="confirm = false" @confirm="removeFriend" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PosterCard from "@/components/PosterCard.vue";
import { ADD_ICON, DELETE_ICON, DETAILS_ICON, SEARCH_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { computed, ref, type PropType } from "vue";
import { useFriend } from "@/composables/friend";
import { useFriendStore } from "@/stores/friend";
import { useRouter } from "vue-router";

const props = defineProps({
    accept: { type: Boolean, default: false },
    addable: { type: Boolean, default: false },
    consult: { type: Boolean, default: false },
    friends: { type: Array as PropType<User[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    search: { type: Boolean, default: false },
    remove: { type: Boolean, default: false }
});

const emit = defineEmits<{
    search: [string]
    refresh: []
}>();

const router = useRouter();
const friendStore = useFriendStore();
const { acceptFriendRequest, deleteFriend, sendFriendRequest } = useFriend();

const confirm = ref(false);
const selected = ref<User>();
const username = ref<string>("");

const emptyCopy = computed(() => {
    if (props.addable) return { icon: "mdi-account-search-outline", title: "Aucun résultat", description: "Recherchez un nom d'utilisateur pour envoyer une demande." };
    if (props.accept) return { icon: "mdi-account-clock-outline", title: "Aucune demande reçue", description: "Les demandes d'ami reçues apparaîtront ici." };
    if (props.remove && !props.consult) return { icon: "mdi-send-outline", title: "Aucune demande envoyée", description: "Les demandes que vous envoyez apparaîtront ici." };
    return { icon: "mdi-account-heart-outline", title: "Aucun ami pour l'instant", description: "Ajoutez des amis pour comparer vos séries et vos statistiques." };
});

const showFriend = (user: User) => {
    friendStore.setFriend(user);
    router.push('/friend');
}

const acceptFriend = async (user: User) => {
    await acceptFriendRequest(user);
    emit("refresh");
}

const addFriend = async (user: User) => {
    await sendFriendRequest(user);
    emit("refresh");
}

const removeFriend = async () => {
    if (!selected.value) throw new Error("Impossible de supprimer cet(te) ami(e).");
    await deleteFriend(selected.value);
    confirm.value = false;
    emit("refresh");
}

const showConfirm = (user: User) => {
    selected.value = user;
    confirm.value = true;
}
</script>

<style scoped>
.friend-quick-btn {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}
</style>