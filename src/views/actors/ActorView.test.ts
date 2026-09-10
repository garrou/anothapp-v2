// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ActorView from "./ActorView.vue";
import { vuetify } from "@/test/vuetify";
import type { Actor } from "@/models/person";

const searchComposableMocks = vi.hoisted(() => ({
    getActor: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const actor = (id: number, overrides: Partial<Actor> = {}): Actor =>
    ({ id, name: "Bryan Cranston", series: [], ...overrides } as Actor);

const mountView = async (id = 1, resolved: Actor = actor(1)) => {
    searchComposableMocks.getActor.mockResolvedValue(resolved);
    const wrapper = mount(ActorView, {
        global: { plugins: [vuetify], stubs: { ButtonFavoriteActor: true } },
        props: { id },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ActorView", () => {
    it("fetches and shows the actor for the given id", async () => {
        const wrapper = await mountView(42, actor(42, { name: "Aaron Paul" }));

        expect(searchComposableMocks.getActor).toHaveBeenCalledWith(42);
        expect(wrapper.text()).toContain("Aaron Paul");
    });

    it("re-fetches when the id prop changes", async () => {
        const wrapper = await mountView(1);
        searchComposableMocks.getActor.mockResolvedValue(actor(2, { name: "Aaron Paul" }));

        await wrapper.setProps({ id: 2 });
        await flushPromises();

        expect(searchComposableMocks.getActor).toHaveBeenCalledWith(2);
        expect(wrapper.text()).toContain("Aaron Paul");
    });

    it("navigates back to /discover when the hero's back button is used", async () => {
        const wrapper = await mountView();

        await wrapper.findComponent({ name: "SerieHero" }).vm.$emit("back");

        expect(routerMocks.push).toHaveBeenCalledWith("/discover");
    });
});
