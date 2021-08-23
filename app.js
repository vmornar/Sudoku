var express = require('express');
var app = express();
//var ws = require('ws');
var router = express.Router();
var fs = require("fs");
var http = require('http');
var httpserver = http.createServer(app);
var result;
var webSockets = {};
const {
    execSync
} = require('child_process');

// ws.prototype.sendJSON = function sendJSON(o) {
//     this.send(JSON.stringify(o));
// }

var fs = require("fs");

const port = process.env.PORT || 8080;

function sendAll(o) {
    var command = JSON.stringify(o);
    for (var userId in webSockets) {
        webSockets[userId].send(command);
    }
}

router.use(function (req, res, next) {
    if (!req.url.startsWith("/sudoku")) req.url = "/sudoku" + req.url;
    next();
})

router.get("/sudoku", function (request, response) {
    response.sendFile(__dirname + "/sudoku/index.html");
});

router.get("/sudoku/puzzle", function (request, response) {
    if (request.query["gen"] > 0) {
        execSync("main.exe " + request.query["gen"], {
            cwd: __dirname
        });
    }
    puzzle = fs.readFileSync("puzzle.txt");
    response.send(puzzle);
});

app.use(express.static('sudoku'));
app.use(express.static('.'));
app.use(express.static('public'));
app.use('/', router);

var webServer = httpserver.listen(port, function () {
    var webSocketServer = new (require('ws')).Server({
        server: webServer
    });
    webSockets = {};
    result = {};
    webSocketServer.on('connection', function (webSocket, req) {
        let userId = req.url.substr(1).replace("sudokusocket/", "");

        webSockets[userId] = webSocket;
        webSocket["userId"] = userId;
        webSocket.on('message', function (message) {
            var cmd = JSON.parse(message);
            var o = {};
            console.dir("Message", cmd)
            if (cmd.command == 'gen') {
                result = {};
                execSync("main.exe " + cmd.difficulty, {
                    cwd: __dirname
                });
                puzzle = fs.readFileSync("puzzle.txt");
                o["command"] = "gen";
                o["puzzle"] = JSON.parse(puzzle.toString());
            } else {
                result[userId] = cmd.res;
                o["command"] = "res";
                o["res"] = result;
            }
            sendAll(o);
        });
        webSocket.on('close', function () {
            delete webSockets[userId];
        })
    });
});