import { FIRE_ICON, PLAY_ICON, TIME_ICON } from "@/constants/icons"
import type { Layout } from "@/models/layout";
import type { GlobalStat } from "@/models/stat"
import { minsToStringHoursDays } from "@/utils/format"

export const DashboardLayout = (stat: GlobalStat): Layout[] => [
    {
        icon: "mdi-timer-sand",
        name: "Ce mois",
        value: minsToStringHoursDays(stat.monthTime),
    },
    {
        icon: TIME_ICON,
        name: "Temps total",
        value: minsToStringHoursDays(stat.totalTime),
    },
    {
        icon: PLAY_ICON,
        name: "Séries",
        value: stat.nbSeries,
    },
    {
        icon: PLAY_ICON,
        name: "Saisons",
        value: stat.nbSeasons,
    },
    {
        icon: PLAY_ICON,
        name: "Episodes",
        value: stat.nbEpisodes,
    },
    {
        icon: "mdi-crown",
        name: minsToStringHoursDays(stat.bestMonth?.value),
        value: stat.bestMonth?.label,
        display: !!stat.bestMonth
    },
    {
        icon: FIRE_ICON,
        name: "Jours d'affilés",
        value: stat.currentStreak,
    },
    {
        icon: "mdi-trophy",
        name: "Jours d'affilés record",
        value: stat.longestStreak,
    }
];