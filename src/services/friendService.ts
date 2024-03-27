import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";
import { buildUrl } from "@/utils/format";

const getFriends = async (status?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/friends`, "status", status, "?");
    return fetch(url, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const acceptFriendRequest = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/friends/${userId}`, { 
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
    return fetch(`${ENDPOINT}/friends`, { 
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
    return fetch(`${ENDPOINT}/friends/${userId}`, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
        },
        method: "DELETE"
    });
}

const getFriendProfile = async (userId: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/friends/${userId}/profile`, { 
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