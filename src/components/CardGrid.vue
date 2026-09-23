<template>
    <v-container v-if="items.length || loading" ref="containerRef" fluid class="pa-0">
        <div class="virtual-spacer" :style="{ height: `${virtualizer.getTotalSize()}px` }">
            <v-row v-for="virtualRow in virtualizer.getVirtualItems()" :key="virtualRow.key" dense
                class="virtual-row" :data-index="virtualRow.index" :ref="measureRow"
                :style="{ transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)` }">
                <v-col v-for="(item, colIndex) in rows[virtualRow.index]"
                    :key="itemKey(item, virtualRow.index * itemsPerRow + colIndex)" :cols="cols" :sm="sm" :md="md"
                    :lg="lg">
                    <base-skeleton :loading="loading" type="card">
                        <slot :item="item" />
                    </base-skeleton>
                </v-col>
            </v-row>
        </div>
    </v-container>
    <slot v-else name="empty" />
</template>

<script setup lang="ts" generic="T">
import BaseSkeleton from "./BaseSkeleton.vue";
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import { useDisplay } from "vuetify";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{
    items: T[];
    loading: boolean;
    cols?: number | string;
    sm?: number | string;
    md?: number | string;
    lg?: number | string;
}>(), {
    cols: 6,
    md: 4,
    lg: 3,
});

const itemKey = (item: T, index: number): string | number =>
    (item as { id?: string | number })?.id ?? index;

// Mirrors Vuetify's own mobile-first cascade for v-col breakpoint props: the
// span used is the closest explicitly-set breakpoint prop at or below the
// current one, falling back to `cols`.
const BREAKPOINT_ORDER = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const display = useDisplay();

const spanAtBreakpoint = (breakpoint: string): number | undefined => {
    if (breakpoint === "sm" && props.sm !== undefined) return Number(props.sm);
    if (breakpoint === "md" && props.md !== undefined) return Number(props.md);
    if (breakpoint === "lg" && props.lg !== undefined) return Number(props.lg);
    return undefined;
};

const effectiveSpan = computed(() => {
    const currentIndex = BREAKPOINT_ORDER.indexOf(display.name.value as typeof BREAKPOINT_ORDER[number]);
    for (let i = currentIndex; i >= 1; i--) {
        const span = spanAtBreakpoint(BREAKPOINT_ORDER[i]);
        if (span !== undefined) return span;
    }
    return Number(props.cols);
});

const itemsPerRow = computed(() => Math.max(1, Math.floor(12 / effectiveSpan.value)));

const rows = computed<T[][]>(() => {
    const perRow = itemsPerRow.value;
    const chunks: T[][] = [];
    for (let i = 0; i < props.items.length; i += perRow) {
        chunks.push(props.items.slice(i, i + perRow));
    }
    return chunks;
});

// The grid can sit anywhere on the page (below a title, tabs, filters...),
// so the window virtualizer needs to know how far down the page it starts
// to translate its internal scroll offsets into on-screen positions.
const containerRef = ref<HTMLElement | null>(null);
const scrollMargin = ref(0);

const updateScrollMargin = (): void => {
    scrollMargin.value = containerRef.value?.offsetTop ?? 0;
};

onMounted(() => {
    updateScrollMargin();
    window.addEventListener("resize", updateScrollMargin);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScrollMargin);
});

// Cards in a row are made uniform height on purpose (single-line truncated
// titles), so once we've measured a single real row, that height is a much
// better estimate for every other row than a hardcoded guess — including
// ones never rendered yet.
const learnedRowHeight = ref(420);

const measureRow = (el: unknown): void => {
    const node = (el as { $el?: Element })?.$el ?? (el as Element | null);
    if (!node) return;
    virtualizer.value.measureElement(node);
    if (learnedRowHeight.value === 420) {
        const height = (node as Element).getBoundingClientRect().height;
        if (height > 0) learnedRowHeight.value = height;
    }
};

const virtualizer = useWindowVirtualizer(computed(() => ({
    count: rows.value.length,
    estimateSize: () => learnedRowHeight.value,
    overscan: 3,
    scrollMargin: scrollMargin.value,
})));

// Restores a scroll position saved as a raw pixel offset (e.g. from the
// app's generic per-route scroll store). A plain `window.scrollTo` would
// replay that pixel value against a freshly-mounted grid where nothing past
// the first screen has been measured yet, landing short by however much the
// still-estimated rows in between are off by. `scrollToIndex` instead
// targets a specific row and keeps re-deriving its real pixel position as
// rows get measured, converging on the row itself rather than a guessed
// pixel value.
const restoreScroll = (offsetY: number): void => {
    if (!rows.value.length) return;
    const targetIndex = Math.max(0, Math.min(
        Math.floor(offsetY / learnedRowHeight.value),
        rows.value.length - 1,
    ));
    virtualizer.value.scrollToIndex(targetIndex, { align: "start" });
};

defineExpose({ restoreScroll });
</script>

<style scoped>
.virtual-spacer {
    position: relative;
    width: 100%;
}

.virtual-row {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
</style>
