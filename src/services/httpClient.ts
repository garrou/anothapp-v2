import { ENDPOINT } from "@/constants/services";
import { buildUrlWithParams, type Param } from "@/utils/format";
import storageService from "./storageService";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
    params?: Param[];
    body?: unknown;
    auth?: boolean;
}

const buildHeaders = (hasBody: boolean): HeadersInit => {
    const headers: Record<string, string> = {};

    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

const request = (path: string, method: Method, options: RequestOptions = {}): Promise<Response> => {
    const { params, body } = options;
    const baseUrl = `${ENDPOINT}/${path}`;
    const url = params ? buildUrlWithParams(baseUrl, params) : baseUrl;

    return fetch(url, {
        method,
        headers: buildHeaders(body !== undefined),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: "include"
    });
}

const get = (path: string, params?: Param[]): Promise<Response> =>
    request(path, "GET", { params });

const post = (path: string, body?: unknown, options?: Omit<RequestOptions, "body">): Promise<Response> =>
    request(path, "POST", { ...options, body });

const patch = (path: string, body?: unknown, params?: Param[]): Promise<Response> =>
    request(path, "PATCH", { body, params });

const del = (path: string, params?: Param[]): Promise<Response> =>
    request(path, "DELETE", { params });

export default {
    get,
    post,
    patch,
    delete: del,
}
