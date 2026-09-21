export interface AdminHealthCheck {

    reachable: boolean;

    configured?: boolean;

    latencyMs?: number;

    error?: string;
}

export interface AdminHealth {

    betaseries: AdminHealthCheck;

    mailer: AdminHealthCheck;
}

export interface AdminNewUsersByDay {

    day: string;

    count: number;
}

export interface AdminLoginAttemptLimitEntry {

    userId: string;

    username: string;

    maxedOutCount: number;

    lastAttemptAt: string;
}

export interface AdminAction {

    id: string;

    adminUserId: string;

    action: string;

    targetUserId: string | null;

    createdAt: string;
}

export interface AdminUsersSummary {

    total: number;

    newByDay: AdminNewUsersByDay[];

    pendingDeletions: number;

    anonymized: number;
}

export interface AdminSessionsSummary {

    active: number;

    loginAttemptLimit: AdminLoginAttemptLimitEntry[];
}

export interface AdminDatabaseSummary {

    size: string;
}

export interface AdminDashboard {

    users: AdminUsersSummary;

    sessions: AdminSessionsSummary;

    database: AdminDatabaseSummary;

    health: AdminHealth;

    recentActions: AdminAction[];
}

export interface AdminUserSearchResult {

    id: string;

    username: string;

    email: string;
}
