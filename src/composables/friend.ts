import type { FriendResponse } from "@/models/friend";
import friendService from "@/services/friendService"
import type { FriendStatus } from "@/types/friend";
import { isError } from "@/utils/response";

export function useFriend() {

    const getFriends = async (status?: FriendStatus): Promise<FriendResponse> => {
        const resp = await friendService.getFriends(status);
        const data = await resp.json();
        
        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { getFriends }
}