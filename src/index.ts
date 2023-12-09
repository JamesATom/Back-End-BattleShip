import http from 'node:http';
import * as dotenv from 'dotenv';

import { Router } from './router/router';
import { InMemoryDatabase } from './db/inMemoryDB';
import { WebSocketServer } from './wsServer/web-socket';

dotenv.config();
const database = new InMemoryDatabase();
const router = new Router();

const server = http.createServer((req, res) => {
    router.route(req, res);
});

const wsServer = new WebSocketServer(server, database);

server.listen(process.env.PORT, () => {
    console.log('Server listening on port: =>', process.env.PORT);
});