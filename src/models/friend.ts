export interface Friend {

    id: string;

    email: string;

    picture?: string;
}

export interface FriendResponse {

    send: Friend[];

    receive: Friend[];

    friend: Friend[];
}