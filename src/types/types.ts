export enum MESSAGE_TYPES {
    ADD_USER = 'ADD_USER',
    REMOVE_USER = 'REMOVE_USER',
    GET_USERS = 'GET_USERS',
    GET_NUMBER_OF_USERS = 'GET_NUMBER_OF_USERS',
    UPDATE_TABLE = 'UPDATE_TABLE',
    JOIN_ROOM = 'JOIN_ROOM',
    START_GAME = 'START_GAME',
    LEAVE_ROOM = 'LEAVE_ROOM',
    LEAVE_ROOM_DURING_GAME = 'LEAVE_ROOM_DURING_GAME',
    BOARD_STATE_READY = 'BOARD_STATE_READY',
    OPPONENT_FOUND = 'OPPONENT_FOUND',
    PLAYER_MOVE = 'PLAYER_MOVE',
    GAME_OVER = 'GAME_OVER',
    GET_ROOM_ID = 'GET_ROOM_ID',
    WHOSE_TURN = 'WHOSE_TURN',
    CHECK_IF_THERE_IS_SHIP = 'CHECK_IF_THERE_IS_SHIP',
    CHANGE_TURN = 'CHANGE_TURN',
};

export enum WARNINGS {
    FULL_ROOM = 'FULL_ROOM',
    WAITING_FOR_OPPONENT = 'WAITING_FOR_OPPONENT',
    START_GAME = 'START_GAME',
    OPPONENT_LEFT = 'OPPONENT_LEFT',
    LEAVE_ROOM_DURING_GAME = 'LEAVE_ROOM_DURING_GAME',
    YOU_ARE_LEAVING = 'YOU_ARE_LEAVING',
    CHECK_IF_THERE_IS_SHIP = 'CHECK_IF_THERE_IS_SHIP',
    CHANGE_TURN = 'CHANGE_TURN',
}

export interface User {
    username: string;
    password: string;
    status: string;
    score: number;
    userSocket: any;
    shipPositions?: Set<number>;
    boardState?: Set<string>;
    roomID?: string;
    isReady?: boolean;
}
    
export interface Room {
    id: string;
    users: Array<User>;
    size: number;
    whoseTurn: Set<string>;
}