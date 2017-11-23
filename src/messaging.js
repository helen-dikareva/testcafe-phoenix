import http from 'http';

const serverRequestHandlers = {};

export function implementServer () {
    const server = http.createServer((req, res) => {
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
            const response = await serverRequestHandlers[type](JSON.parse(body));

            res.end(JSON.stringify(response));
        });
    });

    server.listen(1888);
}

export function setServerRequestHandler (type, handler) {
    serverRequestHandlers[type] = handler;
}

export function sendToServer (data) {
    return new Promise(function (resolve) {
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
                resolve(body ? JSON.parse(body) : '');
            });
        });

        post_req.write(postData);
        post_req.end();
    });
}

