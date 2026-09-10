// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Profile from "./Profile.vue";
import { vuetify } from "@/test/vuetify";
import type { User } from "@/models/user";
import type { Serie } from "@/models/serie";

const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const serieComposableMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getSerieImages: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));

const profile = (overrides: Partial<User> = {}): User =>
    ({ id: "1", username: "Dexter", email: "dexter@example.com", ...overrides } as User);

const serie = (id: number, title: string): Partial<Serie> => ({ id, title });

const mountView = async () => {
    userComposableMocks.getProfile.mockResolvedValue(profile());
    const wrapper = mount(Profile, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, Email: true, Password: true, ImagesRow: true } },
    });
    await flushPromises();
    return wrapper;
};

const openMenuItem = async (wrapper: Awaited<ReturnType<typeof mountView>>, label: string) => {
    const item = wrapper.findAllComponents({ name: "VListItem" }).find((i) => i.text().includes(label));
    await item!.trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Profile", () => {
    it("shows the profile's username and email on mount", async () => {
        const wrapper = await mountView();

        expect(wrapper.text()).toContain("Dexter");
        expect(wrapper.text()).toContain("dexter@example.com");
    });

    it("opens the email form when 'Modifier l'email' is clicked", async () => {
        const wrapper = await openMenuItem(await mountView(), "Modifier l'email");

        expect(wrapper.findComponent({ name: "Email" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "Password" }).exists()).toBe(false);
    });

    it("opens the password form when 'Modifier le mot de passe' is clicked", async () => {
        const wrapper = await openMenuItem(await mountView(), "Modifier le mot de passe");

        expect(wrapper.findComponent({ name: "Password" }).exists()).toBe(true);
    });

    it("fetches series and opens the images tab when 'Changer la photo de profil' is clicked", async () => {
        serieComposableMocks.getSeries.mockResolvedValue([serie(1, "Breaking Bad")]);
        const wrapper = await openMenuItem(await mountView(), "Changer la photo de profil");

        expect(serieComposableMocks.getSeries).toHaveBeenCalled();
        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("filters the series list by title, accent- and case-insensitively", async () => {
        serieComposableMocks.getSeries.mockResolvedValue([serie(1, "Élémentaire"), serie(2, "Breaking Bad")]);
        const wrapper = await openMenuItem(await mountView(), "Changer la photo de profil");

        await wrapper.find('input[type="text"]').setValue("elementaire");

        expect(wrapper.text()).toContain("Élémentaire");
        expect(wrapper.text()).not.toContain("Breaking Bad");
    });

    it("loads a serie's images only once, the first time its panel is opened", async () => {
        searchComposableMocks.getSerieImages.mockResolvedValue(["img1.jpg"]);
        serieComposableMocks.getSeries.mockResolvedValue([serie(1, "Breaking Bad")]);
        const wrapper = await openMenuItem(await mountView(), "Changer la photo de profil");

        const panel = wrapper.findComponent({ name: "VExpansionPanel" });
        await panel.vm.$emit("group:selected", { value: true });
        await panel.vm.$emit("group:selected", { value: true });
        await flushPromises();

        expect(searchComposableMocks.getSerieImages).toHaveBeenCalledTimes(1);
        expect(searchComposableMocks.getSerieImages).toHaveBeenCalledWith(1);
    });

    it("does not fetch images when a panel is closed", async () => {
        serieComposableMocks.getSeries.mockResolvedValue([serie(1, "Breaking Bad")]);
        const wrapper = await openMenuItem(await mountView(), "Changer la photo de profil");

        const panel = wrapper.findComponent({ name: "VExpansionPanel" });
        await panel.vm.$emit("group:selected", { value: false });

        expect(searchComposableMocks.getSerieImages).not.toHaveBeenCalled();
    });

    it("closes the modal and reloads the profile when the email form emits refresh", async () => {
        const wrapper = await openMenuItem(await mountView(), "Modifier l'email");
        userComposableMocks.getProfile.mockResolvedValue(profile({ username: "NewName" }));

        await wrapper.findComponent({ name: "Email" }).vm.$emit("refresh");
        await flushPromises();

        expect(userComposableMocks.getProfile).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain("NewName");
        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(false);
    });
});
