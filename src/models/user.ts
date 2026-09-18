export interface User {
    
    id: string;

    username: string;

    email?: string;

    emailVerified?: boolean;

    current: boolean;

    picture?: string;

    episodeTrackingEnabled?: boolean;

    createdAt?: string;
}