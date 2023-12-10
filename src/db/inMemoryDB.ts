import { User, Room } from "../types/types";
    
export class InMemoryDatabase {
    private users: Map<string, User> = new Map();
    private rooms: Map<string, Room> = new Map();

    constructor() {}

    public addUser(user: User) {
        this.users.set(user.username, user);
    }

    public getUser(username: string): User | undefined {
        return this.users.get(username);
    }

    public removeUser(username: string) {
        this.users.delete(username);
    }

    public getUsers(): Array<User> {
        return Array.from(this.users.values());
    }

    public getNumberOfUsers(): number {
        return this.users.size;
    }
    
    public setUserRoomID(username: string, roomID: string) {
        this.users.get(username)!.roomID = roomID;
    }

    public setIsReady(username: string, isReady: boolean) {
        this.users.get(username)!.isReady = isReady;
    }

    public doesRoomExist(roomID: string): boolean {
        return this.rooms.has(roomID);
    }

    public addRoom(room: Room) {
        this.rooms.set(room.id, room);
    }

    public getRoom(roomID: string): Room | undefined {
        return this.rooms.get(roomID);
    }

    public removeRoom(roomID: string) {
        this.rooms.delete(roomID);
    }

    public getRooms(): Array<Room> {
        return Array.from(this.rooms.values());
    }

    public joinRoom(user: User, roomID: string): boolean {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }

        if (room.users.length >= 2) {
            return false;
        }

        room.users.push(user);
        return true;
    }

    public checkIfAllReady(roomID: string): boolean | undefined {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        return (room.users.length >= 2 && room.users[0].isReady && room.users[1].isReady);
    }

    public leaveRoom(currUser: User): boolean {
        const roomID = currUser.roomID;
        if (!roomID) {
            return false;
        }

        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        
        room.users = room.users.filter((user) => currUser.username !== user.username);
        return true;
    }

    public setShipPositions(username: string, shipPositions: Set<number>) {
        this.users.get(username)!.shipPositions = shipPositions;
    }

    public setBoardState(username: string, boardState: Set<string>) {
        this.users.get(username)!.boardState = boardState;
    }

    public getShipPositions(username: string): Set<number> | undefined {
        return this.users.get(username)!.shipPositions;
    }

    public getBoardState(username: string): Set<string> | undefined {
        return this.users.get(username)!.boardState;
    }

    public addWhoseTurn(roomID: string, username: string) {
        const room = this.getRoom(roomID);
        if (!room) {
            return;
        }
        room.whoseTurn.add(username);
    }

    public getWhoseTurn(roomID: string): Set<string> | undefined {
        return this.getRoom(roomID)!.whoseTurn;
    }

    public checkIfThereIsShip(username: string, roomID: string, position: number): boolean {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        
        const opponentUsername = room.users.filter((user) => user.username !== username)[0].username;
        const opponentShipPositions = this.getShipPositions(opponentUsername);
        if (!opponentShipPositions) {
            return false;
        }
        
        return opponentShipPositions.has(Number(position));
    }

    public addPositionToBoardState(username: string, position: number) {
        const boardState = this.getBoardState(username);
        
        if (!boardState) {
            return;
        }
        boardState.add(position.toString());
    }

    public checkIfThereIsWinner(roomID: string, name: string): boolean {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        
        const boardState = this.getBoardState(name);
        const opponentUsername = room.users.filter((user) => user.username !== name)[0].username;
        const opponentShipPositions = this.getShipPositions(opponentUsername);
        let winner = [...opponentShipPositions!].every((position) => {
            return boardState?.has(position.toString());
        });
        
        if (winner) {
            this.removeRoom(roomID);
        }
        return winner;
    }

    public clearDatabase() {
        this.users.clear();
        this.rooms.clear();
    }    
}
