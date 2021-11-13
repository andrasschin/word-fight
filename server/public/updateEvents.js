import { updateNumOfPlayersOnline } from "./IOEvents.js";
const numOfPlayersOnlineElement = document.querySelector("#number-of-players-online");

export function setupUpdateEvents(socket) {
    socket.on(updateNumOfPlayersOnline, numOfPlayersOnline => {
        numOfPlayersOnlineElement.innerText = numOfPlayersOnline;
    });
}