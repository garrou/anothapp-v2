import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";
import { buildUrlWithParams } from "@/utils/format";

const PREFIX = "friends";

const getFriends = async (status?: string, serieId?: number): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}`, [
        { name: "status", value: status },
        { name: "serieId", value: serieId }
    ]);
    return fetch(url, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const acceptFriendRequest = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${userId}`, { 
        body: JSON.stringify({
            "userId": userId
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    });
}

const sendFriendRequest = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, { 
        body: JSON.stringify({
            "userId": userId
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const deleteFriend = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${userId}`, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
        },
        method: "DELETE"
    });
}

const getFriendProfile = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${userId}`, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
        },
    });
}

export default {
    acceptFriendRequest,
    deleteFriend,
    getFriendProfile,
    getFriends,
    sendFriendRequest
}