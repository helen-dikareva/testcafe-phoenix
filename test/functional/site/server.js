var express = require('express');
var http    = require('http');
var fs      = require('fs');
var path    = require('path');
var Promise = require('promise');

//Consts
var DEFAULT_PAGE_MARKUP = '<!DOCTYPE html>' +
                          '<html>' +
                          '<head lang="en"><meta charset="UTF-8"><title></title></head>' +
                          '<body></body>' +
                          '</html>';

var CONTENT_TYPES = {
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.html': 'text/html',
    '.png':  'image/png'
};

//Utils
var readFile = Promise.denodeify(fs.readFile);

//Server
var Server = function (port, basePath) {
    this.app       = express();
    this.appServer = http.createServer(this.app).listen(port);

    this.basePath = basePath;

    this._setupRoutes();
};

Server.prototype._setupRoutes = function () {
    var server = this;

    this.app.get('/index.html', function (req, res) {
        res.setHeader('content-type', CONTENT_TYPES['.html']);
        res.send(DEFAULT_PAGE_MARKUP);
    });

    this.app.get('*', function (req, res) {
        var reqPath      = req.params[0] || '';
        var resourcePath = path.join(server.basePath, reqPath);

        readFile(resourcePath)
            .then(function (content) {
                res.setHeader('content-type', CONTENT_TYPES[path.extname(resourcePath)]);
                res.send(content);
            })
            .catch(function () {
                res.sendStatus(404);
            });
    });
};

Server.prototype.close = function () {
    this.appServer.close();
};

module.exports = Server;
