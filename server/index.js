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
let playerInQueue = null;
let currentGames = [];

app.get("/", (req, res) => {
    res.sendFile("index.html");
})

io.on(IOEvents.connection, socket => {
    io.to(socket.id).emit(IOEvents.setupPlayer, socket.id);
    numOfPlayersOnline++;
    io.emit(IOEvents.updateNumOfPlayersOnline, numOfPlayersOnline);
    console.log(`${socket.id} has connected. ${numOfPlayersOnline} players are online.`);

    socket.on(IOEvents.gameSearch, async () => {
        if (playerInQueue === null) playerInQueue = socket;
        else {
            if (playerInQueue.id !== socket.id) {
                const gameId = Game.createGameId(playerInQueue.id, socket.id);
                let game = new Game(gameId, playerInQueue.id, socket.id);
                currentGames.push(game);
                playerInQueue.join(gameId);
                socket.join(gameId);
                io.to(gameId).emit(IOEvents.gameInit, gameId);
                playerInQueue = null;
    
                await game.init();
                io.to(gameId).emit(IOEvents.gameStart);
            }
        };
    });

    socket.on(IOEvents.gameCancelSearch, () => {
        if (playerInQueue && socket.id === playerInQueue.id) playerInQueue = null;
    });

    socket.on(IOEvents.gameRequestNextWord, gameId => {
        const game = currentGames.find(game => game.gameId === gameId);
        const nextWord = game.nextWord(socket.id);
        if (nextWord === Game.STATE.END) {
            io.to(game.gameId).emit(IOEvents.gameEnd, game.getResults());
            const index = currentGames.findIndex(g => g.gameId === game.gameId);
            currentGames.splice(index, 1);
        } else if (nextWord !== Game.STATE.WAITING) {
            io.to(game.gameId).emit(IOEvents.gameSendNextWord, nextWord);
        }
    });

    socket.on(IOEvents.gameSubmitSolution, payload => {
        const game = currentGames.find(game => game.gameId === payload.gameId);
        game.submitSolution(socket.id, payload.solution);
    });

    socket.on(IOEvents.gameSendMessage, payload => {
        io.to(payload.gameId).emit(IOEvents.gameReceiveMessage, { message: payload.message });
    });

    socket.on(IOEvents.disconnect, () => {
        numOfPlayersOnline--;
        io.emit(IOEvents.updateNumOfPlayersOnline, numOfPlayersOnline);
        console.log(`${socket.id} has disconnected.`)
    });
})


// TODO: chat, limit games, Page elrendezés, light and dark theme, upper/lower, form -> submit, socket code structure
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));