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
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    });
}

const register = async (email: string, password: string, confirm: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/users/register`, {
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
}

export default {
    checkAuth,
    login,
    register,
}