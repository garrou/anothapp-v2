import type { Layout } from "@/models/layout";
import type { Serie } from "@/models/serie";
import { minsToStringHoursDays } from "@/utils/format";

export const SerieDetailsLayout = (serie: Serie): Layout[] => [
    {
        name: "Durée",
        value: minsToStringHoursDays(serie.duration * (serie.episodes ?? 0)),
    },
    {
        name: "Création",
        value: serie.creation,
        display: serie.creation !== undefined
    },
    {
        name: "Note",
        value: serie.note ? `${serie.note.toFixed(2)} / 5` : "",
        display: serie.note !== undefined
    },
    {
        name: "Synopsis",
        value: serie.description,
        display: !!serie.description,
        format: "text"
    },
    {
        name: "Genres",
        value: serie.kinds.join(" • "),
        display: !!serie.kinds.length,
        format: "text"
    }
]