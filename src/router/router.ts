import http from 'node:http';

export class Router {
    private UserNamesDB: Set<string>;

    constructor() {
        this.UserNamesDB = new Set<string>();
    }

    public route(req: http.IncomingMessage, res: http.ServerResponse) {
        const { method, url } = req;
        
        res.setHeader('Access-Control-Allow-Origin', 'https://front-end-battle-ship-2nef.vercel.app'); 
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        if (method === 'POST') {
            if (url == '/api/users') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    const { username } = JSON.parse(body);
                    if (this.UserNamesDB.has(username)) {
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ data: false }));
                    } else {
                        this.UserNamesDB.add(username);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ data: true }));
                    }
                    res.end();
                });
            }
        } else if (method === 'DELETE') {
            if (url == '/api/users') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
            
                req.on('end', () => {
                    const { username } = JSON.parse(body);
                    if (this.UserNamesDB.has(username)) {
                        this.UserNamesDB.delete(username);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ data: true }));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ data: false }));
                    }
                    res.end();
                });
            }
        }
    }
}
