import { ENDPOINT } from "@/constants/services";
import { buildUrlWithParams, type Param } from "@/utils/format";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
    params?: Param[];
    body?: unknown;
    skipRefresh?: boolean;
}

const REFRESH_PATH = "auth/refresh";

let pendingRefresh: Promise<boolean> | null = null;

const buildHeaders = (hasBody: boolean): HeadersInit => {
    const headers: Record<string, string> = {};

    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

const rawFetch = (path: string, method: Method, options: RequestOptions = {}): Promise<Response> => {
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

const refreshToken = (): Promise<boolean> => {
    if (!pendingRefresh) {
        pendingRefresh = rawFetch(REFRESH_PATH, "POST")
            .then((resp) => resp.ok)
            .catch(() => false)
            .finally(() => {
                pendingRefresh = null;
            });
    }
    return pendingRefresh;
}

const request = async (path: string, method: Method, options: RequestOptions = {}): Promise<Response> => {
    const resp = await rawFetch(path, method, options);

    if (resp.status !== 401 || options.skipRefresh) {
        return resp;
    }
    const refreshed = await refreshToken();

    if (!refreshed) {
        return resp;
    }
    return rawFetch(path, method, options);
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
