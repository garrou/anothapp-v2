// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Dashboard from "./Dashboard.vue";
import { vuetify } from "@/test/vuetify";
import type { AdminDashboard, AdminUserSearchResult } from "@/models/admin";

const adminComposableMocks = vi.hoisted(() => ({
    getDashboard: vi.fn(),
    searchUsers: vi.fn(),
    revokeUserSessions: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/composables/admin", () => ({ useAdmin: () => adminComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const stubs = {
    BaseAppBar: true,
    Chart: true,
};

const dashboard = (overrides: Partial<AdminDashboard> = {}): AdminDashboard => ({
    users: { total: 12, newByDay: [{ day: "2024-01-01", count: 3 }], pendingDeletions: 1, anonymized: 2 },
    sessions: { active: 5, loginAttemptLimit: [] },
    database: { size: "42 MB" },
    recentActions: [],
    health: {
        betaseries: { reachable: true, latencyMs: 120 },
        mailer: { reachable: true, configured: true, latencyMs: 40 },
    },
    ...overrides,
});

const mountView = async (resolvedDashboard: AdminDashboard = dashboard()) => {
    adminComposableMocks.getDashboard.mockResolvedValue(resolvedDashboard);
    const wrapper = mount(Dashboard, {
        global: { plugins: [vuetify], stubs },
    });
    await flushPromises();
    return wrapper;
}

describe("Dashboard.vue", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("loads and displays the key metrics", async () => {
        const wrapper = await mountView();

        expect(wrapper.text()).toContain("12");
        expect(wrapper.text()).toContain("42 MB");
        expect(wrapper.text()).toContain("5");
    });

    it("shows an error via the snackbar when the dashboard fails to load", async () => {
        adminComposableMocks.getDashboard.mockRejectedValue(new Error("Accès refusé"));

        mount(Dashboard, { global: { plugins: [vuetify], stubs } });
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalled();
    });

    it("shows suspicious login entries when present", async () => {
        const wrapper = await mountView(dashboard({
            sessions: {
                active: 5,
                loginAttemptLimit: [{ userId: "user-1", username: "bob", maxedOutCount: 2, lastAttemptAt: "2024-01-01T00:00:00.000Z" }],
            },
        }));

        expect(wrapper.text()).toContain("bob");
    });

    it("shows recent admin actions when present", async () => {
        const wrapper = await mountView(dashboard({
            recentActions: [{ id: "action-1", adminUserId: "admin-1", action: "revoke_sessions", targetUserId: "user-1", createdAt: "2024-01-01T00:00:00.000Z" }],
        }));

        expect(wrapper.text()).toContain("revoke_sessions");
    });

    it("searches users on submit, not on every keystroke", async () => {
        const results: AdminUserSearchResult[] = [{ id: "user-1", username: "bob", email: "bob@test.fr" }];
        adminComposableMocks.searchUsers.mockResolvedValue(results);
        const wrapper = await mountView();

        const input = wrapper.find("input[placeholder=\"Nom d'utilisateur ou email\"]");
        await input.setValue("bob");
        await flushPromises();
        expect(adminComposableMocks.searchUsers).not.toHaveBeenCalled();

        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(adminComposableMocks.searchUsers).toHaveBeenCalledWith("bob");
        expect(wrapper.text()).toContain("bob@test.fr");
    });

    it("does not search when the submitted query is shorter than 2 characters", async () => {
        const wrapper = await mountView();

        await wrapper.find("input[placeholder=\"Nom d'utilisateur ou email\"]").setValue("b");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(adminComposableMocks.searchUsers).not.toHaveBeenCalled();
    });

    it("shows an error via the snackbar when the search fails, instead of an unhandled rejection", async () => {
        adminComposableMocks.searchUsers.mockRejectedValue(new Error("Erreur serveur"));
        const wrapper = await mountView();

        await wrapper.find("input[placeholder=\"Nom d'utilisateur ou email\"]").setValue("bob");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalled();
    });

    it("disables the search input and button while a search is in flight, re-enabling once it resolves", async () => {
        let resolveSearch!: (value: AdminUserSearchResult[]) => void;
        adminComposableMocks.searchUsers.mockReturnValue(new Promise((resolve) => { resolveSearch = resolve; }));
        const wrapper = await mountView();

        const input = wrapper.find("input[placeholder=\"Nom d'utilisateur ou email\"]");
        await input.setValue("bob");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(input.attributes("disabled")).toBeDefined();

        resolveSearch([]);
        await flushPromises();

        expect(input.attributes("disabled")).toBeUndefined();
    });

    it("opens the confirmation dialog when revoke is clicked, and revokes on confirm", async () => {
        adminComposableMocks.searchUsers.mockResolvedValue([{ id: "user-1", username: "bob", email: "bob@test.fr" }]);
        adminComposableMocks.revokeUserSessions.mockResolvedValue(3);
        const wrapper = await mountView();

        await wrapper.find("input[placeholder=\"Nom d'utilisateur ou email\"]").setValue("bob");
        await wrapper.find("form").trigger("submit");
        await flushPromises();
        const revokeButton = wrapper.findAll("button").find((btn) => btn.text().includes("Révoquer les sessions"));
        expect(revokeButton).toBeDefined();
        await revokeButton!.trigger("click");
        await flushPromises();

        // BaseConfirm emits "confirm" - simulate that directly rather than digging into the
        // teleported v-dialog's DOM
        const confirmDialog = wrapper.findComponent({ name: "BaseConfirm" });
        await confirmDialog.vm.$emit("confirm");
        await flushPromises();

        expect(adminComposableMocks.revokeUserSessions).toHaveBeenCalledWith("user-1");
        expect(snackbarMocks.showSuccess).toHaveBeenCalled();
    });
});
