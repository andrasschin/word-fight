import { setupUpdateEvents } from "./updateEvents.js";
import * as IOEvents from "./IOEvents.js";
import { UI } from "./UI.js";

const socket = io();
const btnSearchGame = document.getElementById("btn-search-game");
const btnSubmitSolution = document.getElementById("btn-submit-solution");
const btnHome = document.getElementById("btn-home");
const inputSolution = document.getElementById("input-solution");

setupUpdateEvents(socket);

let currentGameId = "";
let currentTimeoutId;
let playerId;
let inQueue = false;

btnSearchGame.addEventListener("click", () => {      
    if (!inQueue) {
        inQueue = true;
        socket.emit(IOEvents.gameSearch);
        UI.changeUI(IOEvents.gameSearch);
    } else {
        inQueue = false;
        socket.emit(IOEvents.gameCancelSearch);
        UI.home();
    }
});

socket.on(IOEvents.setupPlayer, socketId => {
    playerId = socketId;
})

socket.on(IOEvents.gameInit, gameId => {
    currentGameId = gameId;
    UI.changeUI(IOEvents.gameInit);
});

socket.on(IOEvents.gameStart, () => {
    UI.changeUI(IOEvents.gameStart);
    socket.emit(IOEvents.gameRequestNextWord, currentGameId);
    UI.changeUI(IOEvents.gameRequestNextWord);
});

socket.on(IOEvents.gameSendNextWord, payload => {
    UI.changeUI(IOEvents.gameSendNextWord, payload);
    inputSolution.disabled = false;
    currentTimeoutId = setTimeout(() => {
        inputSolution.disabled = true;
        sendSolution(inputSolution.value);
    }, 1500000);
});

document.querySelector("#form-word-game").addEventListener("submit", e => {
    e.preventDefault();
    inputSolution.disabled = true;
    const solution = inputSolution.value;
    sendSolution(solution);
});

document.querySelector("#form-chat").addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = {
        message: data.get("message"),
        gameId: currentGameId
    }
    socket.emit(IOEvents.gameSendMessage, payload);
    e.target.reset();
});

socket.on(IOEvents.gameReceiveMessage, payload => {
    UI.changeUI(IOEvents.gameReceiveMessage, payload);
})

socket.on(IOEvents.gameEnd, payload => {
    if (payload.player1.id === playerId) {
        renameKeyInObj(payload, "player1", "you");
        renameKeyInObj(payload, "player2", "opponent");
    } else {
        renameKeyInObj(payload, "player1", "opponent");
        renameKeyInObj(payload, "player2", "you");
    }
    console.log(payload);

    UI.changeUI(IOEvents.gameEnd, payload);
})

btnHome.addEventListener("click", () => {
    UI.home();
})

function sendSolution(solution) {
    clearTimeout(currentTimeoutId);
    const payload = {
        gameId: currentGameId,
        solution
    }
    socket.emit(IOEvents.gameSubmitSolution, payload);
    socket.emit(IOEvents.gameRequestNextWord, currentGameId);
    UI.changeUI(IOEvents.gameRequestNextWord);
    inputSolution.value = "";
}

function renameKeyInObj(obj, oldKey, newKey) {
    Object.defineProperty(obj, newKey,
        Object.getOwnPropertyDescriptor(obj, oldKey));
    delete obj[oldKey];
}