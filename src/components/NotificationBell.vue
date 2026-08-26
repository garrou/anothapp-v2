<template>
    <v-menu v-model="menu" location="bottom end" :close-on-content-click="false">
        <template #activator="{ props: menuProps }">
            <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error">
                <v-btn v-bind="menuProps" icon="mdi-bell-outline" density="compact" size="small" variant="text" />
            </v-badge>
        </template>

        <v-card class="notification-panel" max-width="380" min-width="320">
            <div class="notification-header">
                <span class="text-subtitle-2 font-weight-bold">Notifications</span>
                <v-btn v-if="unreadCount > 0" density="compact" size="small" variant="text"
                    @click="markAllRead">Tout marquer comme lu</v-btn>
            </div>

            <v-divider />

            <div v-if="loading" class="notification-loading">
                <v-progress-circular color="primary" indeterminate size="24" />
            </div>

            <div v-else-if="!notifications.length" class="notification-empty">
                <v-icon icon="mdi-bell-off-outline" size="28" class="mb-2" />
                <div class="text-body-2">Aucune notification</div>
            </div>

            <v-list v-else class="notification-list" density="compact">
                <v-list-item v-for="item in notifications" :key="item.id" class="notification-item"
                    :class="{ 'notification-item--unread': !item.read }" @click="openNotification(item)">
                    <template #prepend>
                        <v-avatar v-if="item.actor?.picture" :image="item.actor.picture" size="36" />
                        <v-avatar v-else color="surface-variant" size="36">
                            <v-icon icon="mdi-account" />
                        </v-avatar>
                    </template>

                    <v-list-item-title class="notification-text">{{ describe(item) }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(item.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "@/composables/notification";
import { useSearch } from "@/composables/search";
import type { Notification } from "@/models/notification";
import { formatDate, buildPlural } from "@/utils/format";

const router = useRouter();
const { getNotifications, markAsRead, markAllAsRead } = useNotification();
const { getNotes } = useSearch();

const menu = ref(false);
const loading = ref(false);
const notifications = ref<Notification[]>([]);
const unreadCount = ref(0);
const noteNames = ref<Record<number, string>>({});

const describe = (item: Notification): string => {
    const actor = item.actor?.username ?? "Quelqu'un";
    const show = item.show?.title ?? "une série";
    const meta = item.metadata ?? {};

    switch (item.type) {
        case "show_started":
            return `${actor} a commencé "${show}"`;
        case "show_rated": {
            const noteName = noteNames.value[Number(meta.noteId)];
            return noteName ? `${actor} a noté "${show}" : ${noteName}` : `${actor} a noté "${show}"`;
        }
        case "season_watched":
            return `${actor} a vu la saison ${meta.seasonNumber} de "${show}"`;
        case "episode_watched":
            return `${actor} a vu l'épisode ${meta.episodeCode} de "${show}"`;
        case "episode_bulk_watched":
            return `${actor} a vu ${buildPlural("épisode", Number(meta.count))} de la saison ${meta.seasonNumber} de "${show}"`;
        case "friend_request":
            return `${actor} vous a envoyé une demande d'ami`;
        case "friend_accepted":
            return `${actor} a accepté votre demande d'ami`;
        case "friend_declined":
            return `${actor} a refusé votre demande d'ami`;
        default:
            return actor;
    }
}

const openNotification = async (item: Notification) => {
    menu.value = false;

    if (!item.read) {
        item.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
        await markAsRead(item.id);
    }
    if (item.show) {
        router.push(`/discover/${item.show.id}`);
    } else if (item.type.startsWith("friend_")) {
        router.push("/friends");
    }
}

const markAllRead = async () => {
    notifications.value.forEach((n) => n.read = true);
    unreadCount.value = 0;
    await markAllAsRead();
}

onBeforeMount(async () => {
    loading.value = true;
    try {
        const [response, notes] = await Promise.all([getNotifications(), getNotes()]);
        notifications.value = response.notifications;
        unreadCount.value = response.unreadCount;
        noteNames.value = Object.fromEntries(notes.map((note) => [note.id, note.name]));
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
}

.notification-loading,
.notification-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
    color: rgb(var(--v-theme-on-surface-variant));
}

.notification-list {
    max-height: 400px;
    overflow-y: auto;
}

.notification-item {
    cursor: pointer;
}

.notification-item--unread {
    background: rgba(var(--v-theme-primary), 0.06);
}

.notification-text {
    white-space: normal;
    font-size: 13.5px;
}
</style>
