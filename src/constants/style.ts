export const ELEVATION = 0;

export const DENSITY = "compact";

export const TOOLTIP_LOCATION = "bottom";

export const MAIN_COLOR = "primary";

// One hue (violet, matching the app's primary), monotone light -> dark: an
// ordinal scale where color intensity tracks note quality (1 = décevant, 5 = excellent).
export const NOTE_COLORS: Record<number, string> = {
    1: "#CDA6FF",
    2: "#B48DF4",
    3: "#9871D5",
    4: "#7A53B4",
    5: "#5B3291"
}

// Fixed hue order for identity charts (multi-slice pies): never reorder or cycle.
export const CATEGORICAL_COLORS = [
    "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"
];

// One hue (violet), light -> dark: for magnitude/heatmap encodings (e.g. the world map).
export const SEQUENTIAL_COLORS = [
    "#F7F2FF", "#E4D6FF", "#C8AEFA", "#A780E6", "#8156C0", "#5B3291", "#38185F"
];
