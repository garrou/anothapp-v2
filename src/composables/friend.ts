import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";
import friendService from "@/services/friendService"
import type { FriendStatus } from "@/types/types";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";

export function useFriend() {

    const { showSuccess } = useSnackbar();

    const acceptFriendRequest = async (user: User): Promise<void> => {
        const resp = await friendService.acceptFriendRequest(user.id);
        const data = await resp.json();
        
        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess(`Demande de ${user.username} acceptée`);
    }

    const sendFriendRequest = async (user: User): Promise<void> => {
        const resp = await friendService.sendFriendRequest(user.id);
        const data = await resp.json();
        
        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess(`Demande d"ami envoyé à ${user.username}`);
    }

    const getFriends = async (status?: FriendStatus, serieId?: number): Promise<FriendResponse> => {
        const resp = await friendService.getFriends(status, serieId);
        const data = await resp.json();
        
        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const deleteFriend = async (user: User): Promise<void> => {
        const resp = await friendService.deleteFriend(user.id);
        const data = await resp.json();
        
        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess(`Amitié avec ${user.username} supprimée`);
    }

    return { acceptFriendRequest, deleteFriend, getFriends, sendFriendRequest }
}