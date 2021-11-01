const PORT = 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const IOEvents = require("./constants/IOEvents");
const Game = require("./classes/Game");

app.use(express.static("public"));

let numOfPlayersOnline = 0;
let playerinQueue = null;
let currentGames = [];

app.get("/", (req, res) => {
    res.sendFile("index.html");
})

io.on(IOEvents.connection, socket => {
    numOfPlayersOnline++;
    io.emit(IOEvents.updateNumOfPlayersOnline, numOfPlayersOnline);
    console.log(`${socket.id} has connected. ${numOfPlayersOnline} players are online.`);

    socket.on(IOEvents.gameSearch, async () => {
        if (playerinQueue === null) playerinQueue = socket;
        else {
            const gameId = "game_" + playerinQueue.id + socket.id;
            let game = new Game(gameId, playerinQueue.id, socket.id);
            currentGames.push(game);
            playerinQueue.join(gameId);
            socket.join(gameId);
            io.to(gameId).emit(IOEvents.gameInit);

            await game.init();
            io.to(gameId).emit(IOEvents.gameStart, gameId);
        };
    });

    socket.on(IOEvents.disconnect, () => {
        numOfPlayersOnline--;
        io.emit("updateNumOfPlayersOnline");
        console.log(`${socket.id} has disconnected.`)
    })
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));