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
