import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "auth";

const checkAuth = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const login = async (identifier: string, password: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/login`, {
        body: JSON.stringify({
            identifier,
            password
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const updateLogin = async (email: string, newEmail: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        body: JSON.stringify({
            email,
            newEmail
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    })
}


const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    })
}

const register = async (email: string, password: string, confirm: string, username: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/register`, {
        body: JSON.stringify({
            email,
            confirm,
            username,
            password,
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
    updateLogin,
    updatePassword,
    register,
}