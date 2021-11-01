import { setupUpdateEvents } from "./updateEvents.js";
import * as IOEvents from "./IOEvents.js";
import { UI } from "./UI.js";

const socket = io();
const btn = document.getElementById('btn');

setupUpdateEvents(socket);

btn.addEventListener("click", function() {      
    socket.emit(IOEvents.gameSearch);
});

socket.on(IOEvents.gameInit, gameId => {
    UI.changeUI(IOEvents.gameInit);
});

socket.on(IOEvents.gameStart, gameId => {
    UI.changeUI(IOEvents.gameStart, { gameId });
});