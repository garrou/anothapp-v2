import actorService from "@/services/actorService";
import { useActorStore } from "@/stores/actor";
import { useSnackbar } from "./snackbar";
import type { FavoriteActor } from "@/models/person";
import { isError } from "@/utils/response";
import { currentEpoch, loadOnce } from "@/utils/loadOnce";

export function useActor() {

    const actorStore = useActorStore();
    const { showSuccess } = useSnackbar();

    const getFavoriteActors = async (): Promise<FavoriteActor[]> => {
        const resp = await actorService.getFavorites();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        actorStore.setFavoriteActorIds(data.map((actor: FavoriteActor) => actor.id));
        return data;
    }

    const getFriendFavoriteActors = async (friendId: string): Promise<FavoriteActor[]> => {
        const resp = await actorService.getFavorites(friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const loadFavoriteActorIds = (): Promise<void> => loadOnce("favoriteActorIds", () => actorStore.loaded, async () => {
        const epoch = currentEpoch("favoriteActorIds");
        const resp = await actorService.getFavorites();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        if (currentEpoch("favoriteActorIds") === epoch) {
            actorStore.setFavoriteActorIds(data.map((actor: FavoriteActor) => actor.id));
        }
    });

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
        getFriendFavoriteActors,
        loadFavoriteActorIds,
        removeFavoriteActor
    }
}
