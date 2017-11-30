import http from 'http';

const serverRequestHandlers = {};
let sockets                 = [];
let server                  = null;

export function implementServer () {
    server = http.createServer((req, res) => {
        let body = '';

        req.on('data', data => {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1  Math.pow(10, 6) === 1  1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end', async () => {
            const { type } = JSON.parse(body);

            return serverRequestHandlers[type](JSON.parse(body))
                .then(response => {
                    res.end(JSON.stringify({
                        res: response,
                        err: null
                    }));
                })
                .catch(err => {
                    res.end(JSON.stringify({
                        res: null,
                        err: err
                    }));
                });
        });
    });

    server.listen(1888);

    const handler = socket => {
        sockets.push(socket);
        socket.on('close', () => sockets.splice(sockets.indexOf(socket), 1));
    };

    server.on('connection', handler);
}

export function destroyServer () {
    server.close();
    sockets.forEach(socket => socket.destroy());
}

export function setServerRequestHandler (type, handler) {
    serverRequestHandlers[type] = handler;
}

export function sendToServer (data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);

        const post_req = http.request({
            method:   'POST',
            protocol: 'http:',
            hostname: 'localhost',
            port:     1888,
            headers:  {
                'Content-Type':   'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, function (res) {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (!body)
                    resolve('');

                const { res, err } = JSON.parse(body);

                if (err) {
                    delete err.callsite;
                    reject(err);
                }

                resolve(res);
            });
        });

        post_req.write(postData);
        post_req.end();
    });
}

