const PORT = 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const IOEvents = require("./constants/IOEvents");
const StateManager = require("./StateManager");
const stateManager = new StateManager();

const { searchGame, 
    cancelSearch,
    requestNextWord,
    submitSolution,
    sendMessage } = require("./handlers/gameHandler")(io, stateManager);
const { onDisconnect } = require("./handlers/generalHandler")(io, stateManager);

app.use(express.static("public"));

app.get("/", (_, res) => {
    res.sendFile("index.html");
});

const onConnection = socket => {
    stateManager.increaseNumberOfPlayersOnline();
    io.emit(IOEvents.updateNumberOfPlayersOnline, stateManager.getNumberOfPlayersOnline());
    io.to(socket.id).emit(IOEvents.setupPlayer, socket.id);

    socket.on(IOEvents.gameSearch, searchGame);
    socket.on(IOEvents.gameCancelSearch, cancelSearch);
    socket.on(IOEvents.gameRequestNextWord, requestNextWord);
    socket.on(IOEvents.gameSubmitSolution, submitSolution);
    socket.on(IOEvents.gameSendMessage, sendMessage);

    socket.on(IOEvents.disconnect, onDisconnect);
}

io.on(IOEvents.connection, onConnection);

// TODO: limit games
// TODO: light and dark theme
// TODO: server side safety
// ? players array in game
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));