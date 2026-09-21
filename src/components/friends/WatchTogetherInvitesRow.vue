<template>
    <div class="px-3">
        <card-grid v-if="invites.length" :items="invites" :loading="loading" :sm="4" :md="2" :lg="2">
            <template #default="{ item: invite }">
                <poster-card :image="invite.showPoster">
                    <template #placeholder>
                        <span class="friend-initial">{{ invite.showTitle.charAt(0).toUpperCase() }}</span>
                    </template>

                    <template #quick-actions>
                        <template v-if="active">
                            <v-btn class="friend-quick-btn" :icon="LOGOUT_ICON" size="32" variant="flat"
                                color="red" title="Quitter" @click.stop="startLeaving(invite)" />
                        </template>
                        <template v-else>
                            <v-btn class="friend-quick-btn" :icon="CHECK_ICON" size="32" variant="flat"
                                color="green" @click.stop="respond(invite, true)" />
                            <v-btn class="friend-quick-btn" :icon="DELETE_ICON" size="32" variant="flat"
                                color="red" @click.stop="respond(invite, false)" />
                        </template>
                    </template>

                    <v-card-subtitle class="pt-4 pb-0 font-weight-medium">{{ invite.showTitle }}</v-card-subtitle>
                    <v-card-subtitle class="pt-0 pb-4 text-caption text-medium-emphasis">
                        Saison {{ invite.seasonNumber }} · {{ invite.actor.username }}
                    </v-card-subtitle>
                </poster-card>
            </template>
        </card-grid>
        <empty-state v-else :icon="emptyCopy.icon" :title="emptyCopy.title" :description="emptyCopy.description" />
    </div>

    <base-confirm v-model="leaving" text="Quitter ce visionnage partagé ? Les épisodes déjà synchronisés ne seront pas supprimés."
        title="Quitter" persistent @cancel="leaving = false" @confirm="confirmLeave" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PosterCard from "@/components/PosterCard.vue";
import { CHECK_ICON, DELETE_ICON, LOGOUT_ICON } from "@/constants/icons";
import type { WatchTogetherInvite } from "@/models/season";
import { useSeason } from "@/composables/season";
import { computed, ref, type PropType } from "vue";

const props = defineProps({
    invites: { type: Array as PropType<WatchTogetherInvite[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
});

const emit = defineEmits<{
    refresh: []
}>();

const { respondToWatchedWith } = useSeason();

const leaving = ref(false);
const selected = ref<WatchTogetherInvite>();

const emptyCopy = computed(() => props.active
    ? {
        icon: "mdi-account-multiple-check-outline",
        title: "Aucun visionnage partagé actif",
        description: "Les saisons que vous regardez avec un ami apparaîtront ici.",
    }
    : {
        icon: "mdi-account-group-outline",
        title: "Aucune invitation",
        description: "Les invitations à regarder une saison ensemble apparaîtront ici.",
    });

const respond = async (invite: WatchTogetherInvite, accepted: boolean) => {
    await respondToWatchedWith(invite.userSeasonId, accepted);
    emit("refresh");
}

const startLeaving = (invite: WatchTogetherInvite) => {
    selected.value = invite;
    leaving.value = true;
}

const confirmLeave = async () => {
    leaving.value = false;
    if (!selected.value) return;
    await respond(selected.value, false);
    selected.value = undefined;
}
</script>

<style scoped>
.friend-quick-btn {
    box-shadow: 0 8px 18px rgba(108, 92, 224, 0.35);
}

.friend-initial {
    font-size: 56px;
    font-weight: 700;
    color: rgb(var(--v-theme-primary));
}
</style>
