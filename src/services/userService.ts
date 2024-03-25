import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const checkAuth = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/users/me`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const login = async (email: string, password: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/users/login`, {
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const register = async (email: string, password: string, confirm: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/users/register`, {
        body: JSON.stringify({
            "email": email,
            "password": password,
            "confirm": confirm
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

export default {
    checkAuth,
    login,
    register,
}