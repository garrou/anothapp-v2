import { config } from "@vue/test-utils";

// Components that mount <router-link>/<router-view> without a real Vue
// Router instance (most component tests don't need actual navigation,
// just the ability to render) would otherwise fail to resolve these tags.
// Stubbing them globally avoids repeating this in every test file.
config.global.stubs = {
    ...config.global.stubs,
    RouterLink: true,
    RouterView: true,
};

// Polyfills Vuetify needs when mounting components under jsdom, which
// doesn't implement these browser APIs. No-ops under the "node" test
// environment (nothing calls them there), so this file is safe to load
// for every test regardless of environment.
if (typeof window !== "undefined") {
    if (!("ResizeObserver" in window)) {
        class ResizeObserverStub {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
        // @ts-expect-error minimal stub, not a full ResizeObserver implementation
        window.ResizeObserver = ResizeObserverStub;
    }

    if (!("IntersectionObserver" in window)) {
        class IntersectionObserverStub {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() { return []; }
        }
        // @ts-expect-error minimal stub, not a full IntersectionObserver implementation
        window.IntersectionObserver = IntersectionObserverStub;
    }

    if (!window.matchMedia) {
        window.matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList;
    }
}
