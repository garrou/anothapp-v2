<template>
    <div class="mb-4">
        <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold d-flex align-center ga-1">
                <v-icon :icon="ACCOUNT_MULTIPLE_ICON" size="18" />
                Collaborateurs
            </span>
            <v-btn v-if="isOwner" size="small" variant="text" :prepend-icon="ADD_ICON" @click="inviting = true">
                Inviter
            </v-btn>
        </div>

        <v-list v-if="collaborators.length" class="collaborators-list" density="compact">
            <v-list-item v-for="collaborator in collaborators" :key="collaborator.id" :title="collaborator.username"
                :subtitle="collaborator.accepted ? undefined : 'Invitation en attente'">
                <template #prepend>
                    <v-avatar v-if="collaborator.picture" :image="collaborator.picture" size="32" />
                    <v-avatar v-else color="surface-variant" size="32">
                        <v-icon :icon="ACCOUNT_ICON" size="18" />
                    </v-avatar>
                </template>

                <template v-if="isOwner" #append>
                    <v-btn :icon="DELETE_ICON" color="on-surface-variant" size="32" variant="text"
                        @click="startRemoving(collaborator)" />
                </template>
            </v-list-item>
        </v-list>
        <p v-else class="text-caption text-medium-emphasis mb-0">Aucun collaborateur pour le moment.</p>

        <v-btn v-if="!isOwner" class="mt-2" size="small" variant="text" :prepend-icon="LOGOUT_ICON" @click="leaving = true">
            Quitter la playlist
        </v-btn>

        <v-dialog v-model="inviting" max-width="400">
            <v-card title="Inviter un collaborateur">
                <v-card-text>
                    <v-autocomplete v-model="selectedFriendId" :density="DENSITY" :items="invitableFriends"
                        item-title="username" item-value="id" label="Choisir un ami" hide-details autofocus>
                        <template #item="{ item, props: itemProps }">
                            <v-list-item v-bind="itemProps" :title="item.raw.username">
                                <template #prepend>
                                    <v-avatar v-if="item.raw.picture" :image="item.raw.picture" size="32" />
                                    <v-avatar v-else color="surface-variant" size="32">
                                        <v-icon :icon="ACCOUNT_ICON" size="18" />
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <p v-if="!invitableFriends.length" class="text-caption text-medium-emphasis mt-2 mb-0">
                        Tous vos amis sont déjà invités, ou vous n'avez pas encore d'amis.
                    </p>
                </v-card-text>

                <template #actions>
                    <v-spacer />
                    <v-btn variant="text" @click="inviting = false">Annuler</v-btn>
                    <v-btn color="primary" variant="flat" :disabled="!selectedFriendId" @click="invite">Inviter</v-btn>
                </template>
            </v-card>
        </v-dialog>

        <base-confirm v-model="leaving" title="Quitter" text="Quitter cette playlist ?" persistent
            @cancel="leaving = false" @confirm="leave" />

        <base-confirm v-model="removingOpen" title="Retirer" :text="`Retirer ${removing?.username} de la playlist ?`" persistent
            @cancel="removingOpen = false" @confirm="removeCollaboratorConfirmed" />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import BaseConfirm from "@/components/BaseConfirm.vue";
import { ACCOUNT_ICON, ACCOUNT_MULTIPLE_ICON, ADD_ICON, DELETE_ICON, LOGOUT_ICON } from "@/constants/icons";
import { DENSITY } from "@/constants/style";
import { usePlaylist } from "@/composables/playlist";
import { useFriend } from "@/composables/friend";
import { useUser } from "@/composables/user";
import { useSnackbar } from "@/composables/snackbar";
import type { PlaylistCollaborator } from "@/models/playlist";
import type { User } from "@/models/user";

const props = defineProps({
    playlistId: { type: String, required: true },
    isOwner: { type: Boolean, required: true },
});

const emit = defineEmits<{
    left: []
}>();

const { getCollaborators, inviteCollaborator, removeCollaborator } = usePlaylist();
const { getCachedFriends } = useFriend();
const { getProfile } = useUser();
const { showError } = useSnackbar();

const collaborators = ref<PlaylistCollaborator[]>([]);
const friends = ref<User[]>([]);
const currentUserId = ref<string>();
const inviting = ref(false);
const leaving = ref(false);
const removing = ref<PlaylistCollaborator>();
const removingOpen = ref(false);
const selectedFriendId = ref<string>();

const invitableFriends = computed(() => friends.value.filter(
    (friend) => !collaborators.value.some((collaborator) => collaborator.id === friend.id)
));

const refresh = async (): Promise<void> => {
    collaborators.value = await getCollaborators(props.playlistId);
}

const invite = async (): Promise<void> => {
    const friend = friends.value.find((f) => f.id === selectedFriendId.value);
    if (!friend) return;

    try {
        await inviteCollaborator(props.playlistId, friend.id, friend.username);
        selectedFriendId.value = undefined;
        inviting.value = false;
        await refresh();
    } catch (e) {
        showError(e as Error);
    }
}

const leave = async (): Promise<void> => {
    leaving.value = false;
    if (!currentUserId.value) return;

    try {
        await removeCollaborator(props.playlistId, currentUserId.value, "Vous avez quitté la playlist");
        emit("left");
    } catch (e) {
        showError(e as Error);
    }
}

const startRemoving = (collaborator: PlaylistCollaborator): void => {
    removing.value = collaborator;
    removingOpen.value = true;
}

const removeCollaboratorConfirmed = async (): Promise<void> => {
    const collaborator = removing.value;
    removingOpen.value = false;
    removing.value = undefined;
    if (!collaborator) return;

    try {
        await removeCollaborator(props.playlistId, collaborator.id, `${collaborator.username} a été retiré de la playlist`);
        collaborators.value = collaborators.value.filter((c) => c.id !== collaborator.id);
    } catch (e) {
        showError(e as Error);
    }
}

onBeforeMount(async () => {
    try {
        const [ownCollaborators, cachedFriends, profile] = await Promise.all([
            getCollaborators(props.playlistId), getCachedFriends(), getProfile(),
        ]);
        collaborators.value = ownCollaborators;
        friends.value = cachedFriends;
        currentUserId.value = profile.id;
    } catch (e) {
        showError(e as Error);
    }
});
</script>

<style scoped>
.collaborators-list {
    background: transparent;
}
</style>
