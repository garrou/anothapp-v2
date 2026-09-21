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

export interface AdminSuspiciousLogin {

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

export interface AdminDashboard {

    userCount: number;

    databaseSize: string;

    newUsersByDay: AdminNewUsersByDay[];

    pendingDeletions: number;

    anonymizedAccounts: number;

    activeSessions: number;

    suspiciousLogins: AdminSuspiciousLogin[];

    recentActions: AdminAction[];

    health: AdminHealth;
}

export interface AdminUserSearchResult {

    id: string;

    username: string;

    email: string;
}
