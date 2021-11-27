const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const IOEvents = require("./constants/IOEvents");
const ServerStateManager = require("./ServerStateManager");
const ssm = new ServerStateManager();

const { searchGame, 
    cancelSearch,
    requestNextWord,
    submitSolution,
    sendMessage } = require("./handlers/gameHandler")(io, ssm);
const { onDisconnect } = require("./handlers/generalHandler")(io, ssm);

app.use(express.static("public"));

app.get("/", (_, res) => {
    res.sendFile("index.html");
});

const onConnection = socket => {
    ssm.increaseNumberOfPlayersOnline();
    io.emit(IOEvents.updateNumberOfPlayersOnline, ssm.getNumberOfPlayersOnline());
    io.to(socket.id).emit(IOEvents.setupPlayer, socket.id);

    socket.on(IOEvents.gameSearch, searchGame);
    socket.on(IOEvents.gameCancelSearch, cancelSearch);
    socket.on(IOEvents.gameRequestNextWord, requestNextWord);
    socket.on(IOEvents.gameSubmitSolution, submitSolution);
    socket.on(IOEvents.gameSendMessage, sendMessage);

    socket.on(IOEvents.disconnect, onDisconnect);
}

io.on(IOEvents.connection, onConnection);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));