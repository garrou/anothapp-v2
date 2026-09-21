export interface User {
    
    id: string;

    username: string;

    email?: string;

    emailVerified?: boolean;

    current: boolean;

    picture?: string;

    createdAt?: string;

    isAdmin?: boolean;
}