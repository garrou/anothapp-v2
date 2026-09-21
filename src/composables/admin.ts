import adminService from "@/services/adminService";
import { isError } from "@/utils/response";
import type { AdminDashboard, AdminUserSearchResult } from "@/models/admin";

export function useAdmin() {

    const getDashboard = async (): Promise<AdminDashboard> => {
        const resp = await adminService.getDashboard();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const searchUsers = async (query: string): Promise<AdminUserSearchResult[]> => {
        const resp = await adminService.searchUsers(query);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const revokeUserSessions = async (userId: string): Promise<number> => {
        const resp = await adminService.revokeUserSessions(userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.revokedCount;
    }

    return { getDashboard, searchUsers, revokeUserSessions };
}
