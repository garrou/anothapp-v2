export const ELEVATION = 0;

export const DENSITY = "compact";

export const TOOLTIP_LOCATION = "bottom";

export const MAIN_COLOR = "primary";

// Distinct hues (from the categorical palette below) so each note reads apart
// at a glance, bad (red) -> good (green), validated all-pairs CVD-safe.
export const NOTE_COLORS: Record<number, string> = {
    1: "#e34948",
    2: "#2a78d6",
    3: "#eda100",
    4: "#1baf7a",
    5: "#008300"
}

// Fixed hue order for identity charts (multi-slice pies): never reorder or cycle.
export const CATEGORICAL_COLORS = [
    "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"
];

// One hue (violet), light -> dark: for magnitude/heatmap encodings (e.g. the world map).
export const SEQUENTIAL_COLORS = [
    "#F7F2FF", "#E4D6FF", "#C8AEFA", "#A780E6", "#8156C0", "#5B3291", "#38185F"
];
