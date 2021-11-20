import * as IOEvents from "./constants/IOEvents.js";
import ClientStateManager from "./ClientStateManager.js";

import generalHandlers from "./handlers/generalHandler.js";
import gameHandlers from "./handlers/gameHandler.js";
import registerEventListeners from "./handlers/eventListenerHandler.js";

const socket = io();
const csm = new ClientStateManager();

registerEventListeners(socket, csm);

const {
    setupPlayer,
    updateNumberOfPlayersOnline } = generalHandlers(csm);

const { 
    initGame,
    startGame,
    sendNextWord,
    recieveMessage,
    endGame } = gameHandlers(socket, csm);

socket.on(IOEvents.setupPlayer, setupPlayer);
socket.on(IOEvents.updateNumberOfPlayersOnline, updateNumberOfPlayersOnline);

socket.on(IOEvents.gameInit, initGame);
socket.on(IOEvents.gameStart, startGame);
socket.on(IOEvents.gameSendNextWord, sendNextWord);
socket.on(IOEvents.gameReceiveMessage, recieveMessage);
socket.on(IOEvents.gameEnd, endGame)