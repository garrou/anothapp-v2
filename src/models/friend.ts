import type { User } from "./user";

export interface FriendResponse {

    send: User[];

    receive: User[];

    friend: User[];
}