import { useFavoriteStore } from "@/stores/favorite";
import { storeToRefs } from "pinia";

export function useFavorite() {

    const favoriteStore = useFavoriteStore();

    const { deleted } = storeToRefs(favoriteStore);

    const increment = () => {
        deleted.value++;
    }

    return { deleted, increment }
}