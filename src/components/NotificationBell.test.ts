// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import NotificationBell from "./NotificationBell.vue";
import { vuetify } from "@/test/vuetify";
import type { Notification } from "@/models/notification";

const notificationComposableMocks = vi.hoisted(() => ({
    getNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getNotes: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("@/composables/notification", () => ({ useNotification: () => notificationComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const notif = (id: number, overrides: Partial<Notification> = {}): Notification => ({
    id,
    type: "friend_request",
    actor: { id: "a1", username: "Dexter" },
    createdAt: "2024-01-01T10:00:00.000Z",
    read: false,
    ...overrides,
});

const mountBell = async (notifications: Notification[], notes: { id: number; name: string }[] = []) => {
    notificationComposableMocks.getNotifications.mockResolvedValue({ notifications });
    searchComposableMocks.getNotes.mockResolvedValue(notes);
    const wrapper = mount(NotificationBell, { global: { plugins: [vuetify] } });
    await flushPromises();
    return wrapper;
};

const openMenu = async (wrapper: Awaited<ReturnType<typeof mountBell>>) => {
    await wrapper.find("button").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("NotificationBell", () => {
    it("shows the unread count as a badge", async () => {
        const wrapper = await mountBell([notif(1, { read: false }), notif(2, { read: true }), notif(3, { read: false })]);

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(2);
    });

    it("describes a friend_request notification", async () => {
        const wrapper = await openMenu(await mountBell([notif(1, { type: "friend_request" })]));

        expect(wrapper.text()).toContain("Dexter vous a envoyé une demande d'ami");
    });

    it("describes a show_started notification", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "show_started", show: { id: 5, title: "Breaking Bad" } }),
        ]));

        expect(wrapper.text()).toContain('Dexter a commencé "Breaking Bad"');
    });

    it("describes a show_rated notification, resolving the note name", async () => {
        const wrapper = await openMenu(await mountBell(
            [notif(1, { type: "show_rated", show: { id: 5, title: "Breaking Bad" }, metadata: { noteId: 7 } })],
            [{ id: 7, name: "Chef d'oeuvre" }],
        ));

        expect(wrapper.text()).toContain('Dexter a noté "Breaking Bad" : Chef d\'oeuvre');
    });

    it("describes a show_rated notification without a matching note", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "show_rated", show: { id: 5, title: "Breaking Bad" }, metadata: { noteId: 999 } }),
        ]));

        expect(wrapper.text()).toContain('Dexter a noté "Breaking Bad"');
        expect(wrapper.text()).not.toContain(":");
    });

    it("describes an episode_bulk_watched notification with pluralization", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "episode_bulk_watched", show: { id: 5, title: "Breaking Bad" }, metadata: { count: 3, seasonNumber: 2 } }),
        ]));

        expect(wrapper.text()).toContain('Dexter a vu 3 épisodes de la saison 2 de "Breaking Bad"');
    });

    it("describes an achievement_unlocked notification with its league and sub-tier", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "achievement_unlocked", metadata: { code: "streak", name: "Série de visionnage", league: 3, subTier: 2 } }),
        ]));

        expect(wrapper.text()).toContain("Nouveau succès : Série de visionnage — Or II");
    });

    it("degrades gracefully when an achievement_unlocked notification has no sub-tier", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "achievement_unlocked", metadata: { code: "streak", name: "Série de visionnage", league: 3 } }),
        ]));

        expect(wrapper.text()).toContain("Nouveau succès : Série de visionnage — Or");
        expect(wrapper.text()).not.toContain("undefined");
    });

    it("falls back to a generic label when an achievement_unlocked notification carries no name", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "achievement_unlocked", metadata: { code: "streak", league: 3, subTier: 2 } }),
        ]));

        expect(wrapper.text()).toContain("Nouveau succès : un succès — Or II");
    });

    it("falls back to the actor's name for unknown notification types", async () => {
        const wrapper = await openMenu(await mountBell([
            { ...notif(1), type: "unknown_type" as never },
        ]));

        expect(wrapper.find(".notification-text").text()).toBe("Dexter");
    });

    it("shows a loading state before the notifications resolve", () => {
        notificationComposableMocks.getNotifications.mockReturnValue(new Promise(() => {}));
        searchComposableMocks.getNotes.mockReturnValue(new Promise(() => {}));
        const wrapper = mount(NotificationBell, { global: { plugins: [vuetify] } });

        return wrapper.find("button").trigger("click").then(() => {
            expect(wrapper.find(".notification-loading").exists()).toBe(true);
        });
    });

    it("shows an empty message when there are no notifications", async () => {
        const wrapper = await openMenu(await mountBell([]));

        expect(wrapper.text()).toContain("Aucune notification");
    });

    it("filters notifications by group when a tab is selected, and badges the tab with the group's unread count", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "friend_request" }),
            notif(2, { type: "show_started", show: { id: 5, title: "X" } }),
        ]));

        const tabs = wrapper.findComponent({ name: "PillTabs" });
        expect(tabs.props("tabs")).toEqual([
            { value: 0, label: "Tout", badge: undefined },
            { value: 1, label: "Amis", badge: 1 },
            { value: 2, label: "Activité", badge: 1 },
            { value: 3, label: "Rappels", badge: undefined },
        ]);

        await tabs.vm.$emit("update:modelValue", 1);

        expect(wrapper.findAllComponents({ name: "VListItem" })).toHaveLength(1);
        expect(wrapper.text()).toContain("Dexter vous a envoyé une demande d'ami");
    });

    it("navigates to the show's page and marks the notification read when clicked", async () => {
        notificationComposableMocks.markAsRead.mockResolvedValue(undefined);
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "show_started", show: { id: 5, title: "X" }, read: false }),
        ]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(notificationComposableMocks.markAsRead).toHaveBeenCalledWith(1);
        expect(routerMocks.push).toHaveBeenCalledWith("/discover/5");
    });

    it("navigates to the actor's page for an actor_favorited notification", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "actor_favorited", metadata: { actorId: 42 } }),
        ]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(routerMocks.push).toHaveBeenCalledWith("/actor/42");
    });

    it("navigates to the friends page for a friend_* notification without a show", async () => {
        const wrapper = await openMenu(await mountBell([notif(1, { type: "friend_accepted" })]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(routerMocks.push).toHaveBeenCalledWith("/friends");
    });

    it("navigates to the dashboard for an achievement_unlocked notification", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "achievement_unlocked", metadata: { code: "streak", league: 3, subTier: 2 } }),
        ]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(routerMocks.push).toHaveBeenCalledWith("/dashboard");
    });

    it("does not call markAsRead again for an already-read notification", async () => {
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "friend_accepted", read: true }),
        ]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(notificationComposableMocks.markAsRead).not.toHaveBeenCalled();
    });

    it("marks every notification read when 'Tout marquer comme lu' is clicked on the 'Tout' tab", async () => {
        notificationComposableMocks.markAllAsRead.mockResolvedValue(undefined);
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "friend_request", read: false }),
            notif(2, { type: "show_started", show: { id: 5, title: "X" }, read: false }),
        ]));

        const markAllBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Tout marquer comme lu");
        await markAllBtn!.trigger("click");
        await flushPromises();

        expect(notificationComposableMocks.markAllAsRead).toHaveBeenCalled();
        expect(wrapper.findComponent({ name: "VBadge", }).props("content")).toBe(0);
    });

    it("marks only the filtered group's notifications read when a specific tab is active", async () => {
        notificationComposableMocks.markAsRead.mockResolvedValue(undefined);
        const wrapper = await openMenu(await mountBell([
            notif(1, { type: "friend_request", read: false }),
            notif(2, { type: "show_started", show: { id: 5, title: "X" }, read: false }),
        ]));

        await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 1);
        const markAllBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Tout marquer comme lu");
        await markAllBtn!.trigger("click");
        await flushPromises();

        expect(notificationComposableMocks.markAsRead).toHaveBeenCalledWith(1);
        expect(notificationComposableMocks.markAsRead).not.toHaveBeenCalledWith(2);
        expect(notificationComposableMocks.markAllAsRead).not.toHaveBeenCalled();
    });
});
