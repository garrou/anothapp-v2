import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";
import friendService from "@/services/friendService"
import type { FriendStatus } from "@/types/types";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useFriendsStore } from "@/stores/friends";
import { currentEpoch, invalidateLoad, loadOnce } from "@/utils/loadOnce";

export function useFriend() {

    const { showSuccess } = useSnackbar();
    const friendsStore = useFriendsStore();

    const acceptFriendRequest = async (user: User): Promise<void> => {
        const resp = await friendService.acceptFriendRequest(user.id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        invalidateLoad("friends");
        showSuccess(`Demande de ${user.username} acceptée`);
    }

    const sendFriendRequest = async (user: User): Promise<void> => {
        const resp = await friendService.sendFriendRequest(user.id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess(`Demande d'ami envoyé à ${user.username}`);
    }

    const getFriends = async (status?: FriendStatus, serieId?: number): Promise<FriendResponse> => {
        const resp = await friendService.getFriends(status, serieId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const deleteFriend = async (user: User, context: "friend" | "received" | "sent" = "friend"): Promise<void> => {
        const resp = await friendService.deleteFriend(user.id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        if (context === "friend") {
            invalidateLoad("friends");
        }
        const messages = {
            friend: `Amitié avec ${user.username} supprimée`,
            received: `Demande de ${user.username} refusée`,
            sent: `Demande envoyée à ${user.username} annulée`,
        };
        showSuccess(messages[context]);
    }

    const getCachedFriends = async (): Promise<User[]> => {
        await loadOnce("friends", () => friendsStore.loaded, async () => {
            const epoch = currentEpoch("friends");
            const resp = await friendService.getFriends();
            const data = await resp.json();

            if (isError(resp.status)) {
                throw new Error(data.message);
            }
            if (currentEpoch("friends") === epoch) {
                friendsStore.setAll(data.friends);
            }
        });
        return friendsStore.friends;
    }

    return { acceptFriendRequest, deleteFriend, getCachedFriends, getFriends, sendFriendRequest }
}