import type { Layout } from "@/models/layout";
import type { Serie } from "@/models/serie";
import { minsToStringHoursDays } from "@/utils/format";

export const SerieDetailsLayout = (serie: Serie): Layout[] => [
    {
        name: "Durée",
        value: minsToStringHoursDays(serie.duration * (serie.episodes ?? 0)),
    },
    {
        name: "Episodes",
        value: serie.episodes
    },
    {
        name: "Création",
        value: serie.creation,
        display: !!serie.creation
    },
    {
        name: "Note",
        value: serie.note ? `${serie.note.toFixed(2)} / 5` : "",
        display: !!serie.note
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
    },
    {
        name: "Plateformes",
        value: serie.platforms,
        display: !!serie.platforms?.length,
        format: "array"
    }
]
