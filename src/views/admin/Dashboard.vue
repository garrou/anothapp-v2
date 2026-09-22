<template>
    <base-app-bar />

    <v-container fluid class="px-0 px-sm-4">
        <v-card v-if="dashboard" class="kpi-strip mb-6">
            <div class="kpi-row">
                <div class="kpi-cell">
                    <stat-tile icon="mdi-account-group" label="Utilisateurs" :value="dashboard.users.total" />
                </div>
                <div class="kpi-cell">
                    <stat-tile icon="mdi-database" label="Taille de la base" :value="dashboard.database.size" />
                </div>
                <div class="kpi-cell">
                    <stat-tile icon="mdi-shield-key" label="Sessions actives" :value="dashboard.sessions.active" />
                </div>
                <div class="kpi-cell">
                    <stat-tile icon="mdi-account-clock" label="Suppressions en attente"
                        :value="dashboard.users.pendingDeletions" />
                </div>
                <div class="kpi-cell">
                    <stat-tile icon="mdi-account-off" label="Comptes anonymisés" :value="dashboard.users.anonymized" />
                </div>
            </div>
        </v-card>

        <v-card class="pa-4" v-if="dashboard">
            <div class="text-subtitle-1 font-weight-bold mb-4">
                Dépendances externes
            </div>

            <v-row>
                <v-col cols="12" sm="6">
                    <v-list-item :prepend-icon="healthIcon(dashboard.health.betaseries)" title="BetaSeries"
                        :subtitle="serviceSubtitle(dashboard.health.betaseries, dashboard.serviceCalls.betaseries.total)" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-list-item :prepend-icon="healthIcon(dashboard.health.mailer)" title="Email (SMTP)"
                        :subtitle="serviceSubtitle(dashboard.health.mailer, dashboard.serviceCalls.mailer.total)" />
                </v-col>
            </v-row>
        </v-card>

        <v-card v-if="dashboard" class="kpi-strip mt-6">
            <div class="kpi-row kpi-row-2">
                <div class="kpi-cell">
                    <stat-tile icon="mdi-database-export" label="Exports demandés" :value="dashboard.serviceCalls.export.total" />
                </div>
                <div class="kpi-cell">
                    <stat-tile icon="mdi-database-import" label="Imports demandés" :value="dashboard.serviceCalls.import.total" />
                </div>
            </div>
        </v-card>

        <v-row class="mt-3" v-if="dashboard">
            <v-col cols="12">
                <chart :data="newUsersChartData" :type="ChartType.Bar" chart-id="admin-new-users"
                    :default-color="CATEGORICAL_COLORS[0]" title="Nouveaux comptes (14 derniers jours)" />
            </v-col>
        </v-row>

        <v-row class="mt-3" v-if="dashboard">
            <v-col cols="12" md="6">
                <chart :data="dbSizeChartData" :type="ChartType.Line" chart-id="admin-database-size"
                    :default-color="CATEGORICAL_COLORS[1]" title="Taille de la base (Mo)" />
            </v-col>
            <v-col cols="12" md="6">
                <base-multi-line-chart v-if="serviceCallsChartSeries.length" :series="serviceCallsChartSeries"
                    title="Appels de services (30 derniers jours)" />
            </v-col>
        </v-row>

        <v-row class="mt-3" v-if="dashboard">
            <v-col cols="12">
                <base-multi-line-chart v-if="catalogSizeChartSeries.length" :series="catalogSizeChartSeries"
                    title="Évolution du catalogue" />
            </v-col>
        </v-row>

        <v-card v-if="dashboard" class="pa-4 mt-6">
            <div class="text-subtitle-1 font-weight-bold mb-2">Rechercher un compte</div>
            <v-form @submit.prevent="onSearch">
                <v-text-field v-model="searchQuery" density="compact" hide-details :disabled="searchLoading"
                    placeholder="Nom d'utilisateur ou email">
                    <template #append-inner>
                        <v-btn :icon="SEARCH_ICON" density="compact" size="small" variant="text"
                            :loading="searchLoading" :disabled="searchLoading" @click="onSearch" />
                    </template>
                </v-text-field>
            </v-form>

            <empty-state v-if="searchDone && searchResults.length === 0" class="mt-4" :icon="ACCOUNT_ICON"
                title="Aucun compte trouvé" />

            <v-list v-else-if="searchResults.length > 0" class="mt-2" lines="two">
                <v-list-item v-for="user in searchResults" :key="user.id" :title="user.username" :subtitle="user.email">
                    <template #append>
                        <v-btn color="error" size="small" variant="tonal" @click="openRevokeConfirm(user)">
                            Révoquer les sessions
                        </v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <v-row v-if="dashboard">
            <v-col cols="12" md="6">
                <v-card class="pa-4 mt-6 h-100">
                    <div class="text-subtitle-1 font-weight-bold mb-2">Activité de connexion suspecte</div>
                    <empty-state v-if="dashboard.sessions.loginAttemptLimit.length === 0" :icon="CHECK_CIRCLE_ICON"
                        title="Rien à signaler"
                        description="Aucun compte n'a atteint le nombre maximal de tentatives récemment." />
                    <v-list v-else density="compact">
                        <v-list-item v-for="entry in dashboard.sessions.loginAttemptLimit" :key="entry.userId"
                            :title="entry.username"
                            :subtitle="`${entry.maxedOutCount} challenge(s) épuisé(s) · dernier essai le ${formatDateTime(entry.lastAttemptAt)}`" />
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-4 mt-6 h-100">
                    <div class="text-subtitle-1 font-weight-bold mb-2">Actions admin récentes</div>
                    <empty-state v-if="dashboard.recentActions.length === 0" :icon="CLOSE_CIRCLE_ICON"
                        title="Aucune action enregistrée" />
                    <v-list v-else density="compact">
                        <v-list-item v-for="action in dashboard.recentActions" :key="action.id" :title="action.action"
                            :subtitle="formatDateTime(action.createdAt)" />
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <base-confirm v-model="revokeConfirmOpen" title="Révoquer les sessions"
        :text="`Toutes les sessions de ${userToRevoke?.username} seront immédiatement invalidées`"
        confirm-text="Révoquer" @cancel="revokeConfirmOpen = false" @confirm="confirmRevoke" />
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import BaseAppBar from "@/components/BaseAppBar.vue";
import Chart from "@/components/stats/Chart.vue";
import BaseMultiLineChart, { type MultiLineSeries } from "@/components/BaseMultiLineChart.vue";
import StatTile from "@/components/StatTile.vue";
import EmptyState from "@/components/EmptyState.vue";
import BaseConfirm from "@/components/BaseConfirm.vue";
import { useAdmin } from "@/composables/admin";
import { useSnackbar } from "@/composables/snackbar";
import { ChartType } from "@/types/types";
import { CATEGORICAL_COLORS } from "@/constants/style";
import { SEARCH_ICON, ACCOUNT_ICON, CHECK_CIRCLE_ICON, CLOSE_CIRCLE_ICON } from "@/constants/icons";
import type { AdminDashboard, AdminHealthCheck, AdminUserSearchResult } from "@/models/admin";
import type { Stat } from "@/models/stat";

const { getDashboard, searchUsers, revokeUserSessions } = useAdmin();
const { showSuccess, showError } = useSnackbar();

const dashboard = ref<AdminDashboard>();
const searchQuery = ref("");
const searchResults = ref<AdminUserSearchResult[]>([]);
const searchDone = ref(false);
const searchLoading = ref(false);
const revokeConfirmOpen = ref(false);
const userToRevoke = ref<AdminUserSearchResult>();

const newUsersChartData = computed((): Stat[] => (dashboard.value?.users.newByDay ?? []).map((entry, index): Stat => ({
    id: index,
    label: new Date(entry.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    value: entry.count
})));

const dbSizeChartData = computed((): Stat[] => (dashboard.value?.database.history ?? []).map((entry, index): Stat => ({
    id: index,
    label: new Date(entry.recordedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    value: Math.round((entry.sizeBytes / (1024 * 1024)) * 10) / 10,
})));

const dayLabel = (day: string): string => new Date(day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });

const serviceCallsChartSeries = computed((): MultiLineSeries[] => {
    const calls = dashboard.value?.serviceCalls;

    if (!calls || Object.values(calls).every((stat) => stat.history.length === 0)) {
        return [];
    }
    return [
        { name: "Email (SMTP)", data: calls.mailer.history.map((e) => ({ label: dayLabel(e.day), value: e.count })) },
        { name: "BetaSeries", data: calls.betaseries.history.map((e) => ({ label: dayLabel(e.day), value: e.count })) },
        { name: "Export", data: calls.export.history.map((e) => ({ label: dayLabel(e.day), value: e.count })) },
        { name: "Import", data: calls.import.history.map((e) => ({ label: dayLabel(e.day), value: e.count })) },
    ];
});

const catalogSizeChartSeries = computed((): MultiLineSeries[] => {
    const history = dashboard.value?.catalog.history ?? [];

    if (!history.length) {
        return [];
    }
    const label = (recordedAt: string) => new Date(recordedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });

    return [
        { name: "Séries", data: history.map((e) => ({ label: label(e.recordedAt), value: e.shows })) },
        { name: "Saisons", data: history.map((e) => ({ label: label(e.recordedAt), value: e.seasons })) },
        { name: "Épisodes", data: history.map((e) => ({ label: label(e.recordedAt), value: e.episodes })) },
    ];
});

const formatDateTime = (iso: string): string => new Date(iso).toLocaleString("fr-FR");

const healthIcon = (check: AdminHealthCheck): string =>
    check.reachable ? "mdi-check-circle" : check.configured === false ? "mdi-help-circle" : "mdi-alert-circle";

const healthSubtitle = (check: AdminHealthCheck): string => {
    if (check.configured === false) return "Non configuré";
    if (check.reachable) return `Joignable${check.latencyMs !== undefined ? ` (${check.latencyMs} ms)` : ""}`;
    return check.error ?? "Injoignable";
}

const serviceSubtitle = (check: AdminHealthCheck, totalCalls: number): string =>
    `${healthSubtitle(check)} · ${totalCalls} appel(s)`;

const onSearch = async () => {
    const query = searchQuery.value.trim();

    if (query.length < 2) {
        searchResults.value = [];
        searchDone.value = false;
        return;
    }
    searchLoading.value = true;

    try {
        searchResults.value = await searchUsers(query);
        searchDone.value = true;
    } catch (e) {
        searchResults.value = [];
        showError(e as Error);
    } finally {
        searchLoading.value = false;
    }
}

const openRevokeConfirm = (user: AdminUserSearchResult) => {
    userToRevoke.value = user;
    revokeConfirmOpen.value = true;
}

const confirmRevoke = async () => {
    revokeConfirmOpen.value = false;

    if (!userToRevoke.value) return;

    try {
        const revokedCount = await revokeUserSessions(userToRevoke.value.id);
        showSuccess(`${revokedCount} session(s) révoquée(s) pour ${userToRevoke.value.username}`);
    } catch (e) {
        showError(e as Error);
    }
}

onBeforeMount(async () => {
    try {
        dashboard.value = await getDashboard();
    } catch (e) {
        showError(e as Error);
    }
});
</script>

<style scoped>
.kpi-strip {
    display: flex;
    flex-direction: column;
}

.kpi-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
}

@media (min-width: 960px) {
    .kpi-row {
        grid-template-columns: repeat(5, 1fr);
    }

    .kpi-row-2 {
        grid-template-columns: repeat(2, 1fr);
    }
}

.kpi-cell {
    padding: 16px 20px;
    border-right: 1px solid rgb(var(--v-border-color));
}

.kpi-cell:last-child {
    border-right: none;
}
</style>
