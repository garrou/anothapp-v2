import { isSuccess } from "@/utils/response";
import { ENDPOINT } from "./constants";
import storageService from "./storageService";

const login = async (email: string, password: string): Promise<boolean> => {
    const resp = await fetch(`${ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    });
    const data = await resp.json();

    if (isSuccess(resp.status)) {
        storageService.storeJwt(data.token);
        return true;
    }
    throw new Error(data.message);
}

const register = async (email: string, password: string, confirm: string): Promise<boolean> => {
    const resp = await fetch(`${ENDPOINT}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
            "confirm": confirm
        })
    });
    const data = await resp.json();

    if (isSuccess(resp.status))
        return true;

    throw new Error(data.message);
}

const isLoggedIn = async (): Promise<boolean> => {
    const resp = await fetch(`${ENDPOINT}/users/me`, { 
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
    return isSuccess(resp.status);
}


export default {
    isLoggedIn,
    login,
    register,
}