import type { Layout } from "@/models/layout";
import type { Actor } from "@/models/person";

export const ActorDetailsLayout = (actor: Actor): Layout[] => [
    {
        name: "Nom",
        value: actor.name,
    },
    {
        name: "Naissance",
        value: actor.birthday,
        display: !!actor.birthday
    },
    {
        name: "Mort",
        value: actor.deathday,
        display: !!actor.deathday
    },
    {
        name: "Nationalité",
        value: actor.nationality,
        display: !!actor.nationality
    },
    {
        name: "Description",
        value: actor.description,
        format: "text"
    }
]
