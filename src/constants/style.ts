export const ELEVATION = 0;

export const DENSITY = "compact";

export const TOOLTIP_LOCATION = "bottom";

export const MAIN_COLOR = "primary";

export const NOTE_COLORS: Record<number, string> = {
    1: "#e34948",
    2: "#2a78d6",
    3: "#eda100",
    4: "#1baf7a",
    5: "#008300"
}

export const CATEGORICAL_COLORS = [
    "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"
];

export const CATEGORICAL_COLORS_DARK = [
    "#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"
];

export const getCategoricalColor = (index: number, dark: boolean): string =>
    (dark ? CATEGORICAL_COLORS_DARK : CATEGORICAL_COLORS)[index];

export const SEQUENTIAL_COLORS = [
    "#F7F2FF", "#E4D6FF", "#C8AEFA", "#A780E6", "#8156C0", "#5B3291", "#38185F"
];

export const SEQUENTIAL_COLORS_DARK = [...SEQUENTIAL_COLORS].reverse();

export const getSequentialColors = (dark: boolean): string[] =>
    dark ? SEQUENTIAL_COLORS_DARK : SEQUENTIAL_COLORS;

export const HEATMAP_COLORS = [
    "#F3EEFF", "#DCC9FF", "#C09EFF", "#9A6EF5", "#7440DE", "#4F1FB0", "#2A0F66"
];

export const HEATMAP_COLORS_DARK = [...HEATMAP_COLORS].reverse();

export const getHeatmapColors = (dark: boolean): string[] =>
    dark ? HEATMAP_COLORS_DARK : HEATMAP_COLORS;
