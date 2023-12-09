import { WebSocketServer as WS } from 'ws';
import http from 'node:http';
import { MESSAGE_TYPES, WARNINGS } from '../types/types';

export class WebSocketServer {
    private ws: WS;
    private db: any;
    
    constructor(server: http.Server, db: any) {
        this.db = db;
        this.ws = new WS({ server });
        this.ws.on('connection', this.handleConnection.bind(this));
    }
  
    handleConnection(ws: any) {
        ws.on('message', this.handleMessage.bind(this, ws));
        ws.send('Hi there, I am a WebSocket server :)');
    }
  
    handleMessage(ws: any, message: any) {
        try {
            let { type, username, password, roomID, positionsArray, currentId } = JSON.parse(message.toString());
            const users = this.db.getUsers();
            const currUser = this.db.getUser(username);
            roomID = String(roomID);

            switch(type) {

                case MESSAGE_TYPES.ADD_USER:
                    const user = { 
                        username, password, 
                        status: 'online', score: 0, 
                        userSocket: ws
                    };
                    this.db.addUser(user);
                    ws.send(JSON.stringify({ message: 'User added' }));
                    break;

                case MESSAGE_TYPES.REMOVE_USER:
                    this.db.removeUser(username);
                    ws.send(JSON.stringify({ message: 'User removed' }));
                    break;

                case MESSAGE_TYPES.GET_NUMBER_OF_USERS:
                    this.ws.clients.forEach(client => {
                        if (client.readyState == 1) {
                            client.send(JSON.stringify({ 
                                message: this.db.getNumberOfUsers() 
                            }));
                        }
                    });
                    break;

                case MESSAGE_TYPES.GET_USERS:
                    const usersWithoutPasswords = users.map(({ password, userSocket, ...rest}: 
                        {password: string, userSocket: any, rest: any}) => rest);

                    this.ws.clients.forEach((client: any) => {
                        if (client.readyState === 1) {
                            client.send(JSON.stringify({ 
                                type: MESSAGE_TYPES.GET_USERS, 
                                message: usersWithoutPasswords 
                            }));
                        }
                    });
                    break;
                
                case MESSAGE_TYPES.UPDATE_TABLE:
                    this.ws.clients.forEach((client: any) => {
                        client.send(JSON.stringify({ 
                            type: MESSAGE_TYPES.UPDATE_TABLE, 
                            message: this.db.getUsers() 
                        }));
                    });
                    break;

                case MESSAGE_TYPES.JOIN_ROOM:
                    if (this.db.doesRoomExist(roomID)) {
                        if (this.db.joinRoom(currUser, roomID)) {
                            const currClients = this.db.getRoom(roomID).users.map((user: { 
                                userSocket: any; 
                            }) => user.userSocket);

                            currClients.forEach((client: any) => {
                                client.send(JSON.stringify({ message: 'Opponent found' }));
                            });
                        } else {
                            ws.send(JSON.stringify({ type: WARNINGS.FULL_ROOM, message: 'Room is full' }));
                        }
                    } else {
                        this.db.addRoom({ id: roomID, users: [], size: 2, whoseTurn: new Set() });
                        this.db.joinRoom(currUser, roomID);
                    }
                    this.db.setIsReady(username, false);
                    this.db.setUserRoomID(username, roomID);
                    break;
                
                case MESSAGE_TYPES.LEAVE_ROOM:
                    if (this.db.leaveRoom(currUser)) {
                        const currClients = this.db.getRoom(currUser.roomID).users.map((user: { userSocket: any; }) => user.userSocket);
                        currClients.forEach((client: any) => {
                            client.send(JSON.stringify({ message: 'Opponent left' }));
                        });
                    }

                    if (this.db.getRoom(currUser.roomID).users.length === 0) {
                        this.db.removeRoom(currUser.roomID);
                    }
                    break;

                case MESSAGE_TYPES.START_GAME:
                    this.db.setIsReady(username, true);
                    const currClients = this.db.getRoom(roomID).users.map((user: { userSocket: any; }) => user.userSocket);
                    if (!this.db.checkIfAllReady(roomID)) {
                        currClients.forEach((client: any) => {
                            client.send(JSON.stringify({ type: WARNINGS.WAITING_FOR_OPPONENT }));
                        });
                    } else {
                        currClients.forEach((client: any) => {
                            client.send(JSON.stringify({ type: WARNINGS.START_GAME }));
                        });
                    }
                    this.db.setShipPositions(username, new Set(positionsArray));
                    this.db.setBoardState(username, new Set());
                    break;

                case MESSAGE_TYPES.LEAVE_ROOM_DURING_GAME:
                    this.db.setIsReady(username, false);
                    const currClients2 = this.db.getRoom(currUser.roomID).users.map((user: { userSocket: any; }) => user.userSocket);
                    currClients2.forEach((client: any) => {
                        client.send(JSON.stringify({ type: WARNINGS.OPPONENT_LEFT }));
                    });
                    const currClients3 = this.db.getRoom(currUser.roomID).users.map((user: any) => user);
                    currClients3.forEach((client: any) => {
                        this.db.leaveRoom(client);
                    });

                    if (this.db.getRoom(currUser.roomID).users.length === 0) {
                        this.db.removeRoom(currUser.roomID);
                    }
                    break;
                
                case MESSAGE_TYPES.WHOSE_TURN:
                    this.db.addWhoseTurn(roomID, username);
                    if (this.db.getWhoseTurn(roomID).size == 1) {
                        ws.send(JSON.stringify({ type: MESSAGE_TYPES.WHOSE_TURN, turn: true }));
                    } else {
                        ws.send(JSON.stringify({ type: MESSAGE_TYPES.WHOSE_TURN, turn: false }));
                        this.db.getRoom(roomID).whoseTurn.clear();
                    }
                    break;

                case MESSAGE_TYPES.CHECK_IF_THERE_IS_SHIP:
                    const currClients5 = this.db.getRoom(currUser.roomID).users.map((user: { userSocket: any; }) => user.userSocket);
                    this.db.addPositionToBoardState(username, currentId);
                    if (this.db.checkIfThereIsShip(username, roomID, currentId)) {
                        const winner = this.db.checkIfThereIsWinner(roomID, username);
                        currClients5.forEach((client: any) => {
                            client.send(JSON.stringify({ 
                                type: WARNINGS.CHECK_IF_THERE_IS_SHIP, 
                                isShip: true, 
                                opponentName: username,
                                winner,
                                currentId }));
                        });
                    } else {
                        currClients5.forEach((client: any) => {
                            client.send(JSON.stringify({ 
                                type: WARNINGS.CHECK_IF_THERE_IS_SHIP, 
                                isShip: false, 
                                opponentName: username,
                                winner: false,
                                currentId }));
                        });
                    }
                    break;

                default:
                    ws.send(JSON.stringify({ message: 'Invalid request' }));
            }
        } catch(err) {
            console.log('Error parsing message: %s', err);
        }
    }
}