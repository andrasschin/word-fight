import UI from "../UI/UI.js";
import * as IOEvents from "../constants/IOEvents.js";
import { inGame } from "../constants/Elements.js";

export default function gameHandlers(socket, csm) {
    const initGame = gameId => {
        csm.setGameId(gameId);
        csm.setIsInQueue(false);
        UI.change(IOEvents.gameInit);
    }

    const startGame = () => {
        UI.change(IOEvents.gameStart);
        socket.emit(IOEvents.gameRequestNextWord, csm.getGameId());
        UI.change(IOEvents.gameRequestNextWord);
    }

    const sendNextWord = payload => {
        UI.change(IOEvents.gameSendNextWord, payload);
        
        
        const timeoutId = setTimeout(() => {
            const event = new Event("submit", {
                "bubbles": true,
                "cancelable": true
            });
            inGame.formGame.dispatchEvent(event);
        }, 15000);
        csm.setTimeoutId(timeoutId);
    }

    const recieveMessage = payload => {
        UI.change(IOEvents.gameReceiveMessage, {
            ...payload,
            isSenderThisPlayer: payload.sender === csm.getPlayerId()
        });
    }

    const endGame = payload => {
        if (payload.player1.id === csm.getPlayerId()) {
            renameKeyInObj(payload, "player1", "player");
            renameKeyInObj(payload, "player2", "opponent");
        } else {
            renameKeyInObj(payload, "player1", "opponent");
            renameKeyInObj(payload, "player2", "player");
        }
    
        UI.change(IOEvents.gameEnd, payload);
    }

    return {
        initGame,
        startGame,
        sendNextWord,
        recieveMessage,
        endGame
    }
}

function renameKeyInObj(obj, oldKey, newKey) {
    Object.defineProperty(obj, newKey,
        Object.getOwnPropertyDescriptor(obj, oldKey));
    delete obj[oldKey];
}