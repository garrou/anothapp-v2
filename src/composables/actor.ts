import actorService from "@/services/actorService";
import { useActorStore } from "@/stores/actor";
import { useSnackbar } from "./snackbar";
import type { Actor } from "@/models/person";
import { isError } from "@/utils/response";

export function useActor() {

    const actorStore = useActorStore();
    const { showSuccess } = useSnackbar();

    const getFavoriteActors = async (): Promise<Actor[]> => {
        const resp = await actorService.getFavorites();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        actorStore.setFavoriteActorIds(data.map((actor: Actor) => actor.id));
        return data;
    }

    const loadFavoriteActorIds = async (): Promise<void> => {
        if (actorStore.loaded) return;
        await getFavoriteActors();
    }

    const addFavoriteActor = async (id: number, name: string): Promise<void> => {
        const resp = await actorService.addFavorite(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        actorStore.addFavoriteActorId(id);
        showSuccess(`"${name}" ajouté aux acteurs favoris`);
    }

    const removeFavoriteActor = async (id: number, name: string): Promise<void> => {
        const resp = await actorService.removeFavorite(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        actorStore.removeFavoriteActorId(id);
        showSuccess(`"${name}" supprimé des acteurs favoris`);
    }

    return {
        addFavoriteActor,
        getFavoriteActors,
        loadFavoriteActorIds,
        removeFavoriteActor
    }
}
