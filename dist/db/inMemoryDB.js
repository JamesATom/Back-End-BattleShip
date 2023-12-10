"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDatabase = void 0;
class InMemoryDatabase {
    constructor() {
        this.users = new Map();
        this.rooms = new Map();
    }
    addUser(user) {
        this.users.set(user.username, user);
    }
    getUser(username) {
        return this.users.get(username);
    }
    removeUser(username) {
        this.users.delete(username);
    }
    getUsers() {
        return Array.from(this.users.values());
    }
    getNumberOfUsers() {
        return this.users.size;
    }
    setUserRoomID(username, roomID) {
        this.users.get(username).roomID = roomID;
    }
    setIsReady(username, isReady) {
        this.users.get(username).isReady = isReady;
    }
    doesRoomExist(roomID) {
        return this.rooms.has(roomID);
    }
    addRoom(room) {
        this.rooms.set(room.id, room);
    }
    getRoom(roomID) {
        return this.rooms.get(roomID);
    }
    removeRoom(roomID) {
        this.rooms.delete(roomID);
    }
    getRooms() {
        return Array.from(this.rooms.values());
    }
    joinRoom(user, roomID) {
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
    checkIfAllReady(roomID) {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        return (room.users.length >= 2 && room.users[0].isReady && room.users[1].isReady);
    }
    leaveRoom(currUser) {
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
    setShipPositions(username, shipPositions) {
        this.users.get(username).shipPositions = shipPositions;
    }
    setBoardState(username, boardState) {
        this.users.get(username).boardState = boardState;
    }
    getShipPositions(username) {
        return this.users.get(username).shipPositions;
    }
    getBoardState(username) {
        return this.users.get(username).boardState;
    }
    addWhoseTurn(roomID, username) {
        const room = this.getRoom(roomID);
        if (!room) {
            return;
        }
        room.whoseTurn.add(username);
    }
    getWhoseTurn(roomID) {
        return this.getRoom(roomID).whoseTurn;
    }
    checkIfThereIsShip(username, roomID, position) {
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
    addPositionToBoardState(username, position) {
        const boardState = this.getBoardState(username);
        if (!boardState) {
            return;
        }
        boardState.add(position.toString());
    }
    checkIfThereIsWinner(roomID, name) {
        const room = this.getRoom(roomID);
        if (!room) {
            return false;
        }
        const boardState = this.getBoardState(name);
        const opponentUsername = room.users.filter((user) => user.username !== name)[0].username;
        const opponentShipPositions = this.getShipPositions(opponentUsername);
        let winner = [...opponentShipPositions].every((position) => {
            return boardState === null || boardState === void 0 ? void 0 : boardState.has(position.toString());
        });
        if (winner) {
            this.removeRoom(roomID);
        }
        return winner;
    }
}
exports.InMemoryDatabase = InMemoryDatabase;
