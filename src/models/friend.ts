import type { User } from "./user";

export interface FriendResponse {

    sent: User[];

    received: User[];

    friends: User[];

    viewed: User[];
}