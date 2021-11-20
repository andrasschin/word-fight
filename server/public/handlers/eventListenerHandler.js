import * as IOEvents from "../constants/IOEvents.js";
import { mainMenu, inGame, postGame } from "../constants/Elements.js";
import UI from "../UI/UI.js";

export default function registerEventListeners(socket, csm) {
    mainMenu.btnSearchGame.addEventListener("click", () => {      
        if (!csm.getIsInQueue()) {
            csm.setIsInQueue(true);
            socket.emit(IOEvents.gameSearch);
            UI.change(IOEvents.gameSearch);
        } else {
            csm.setIsInQueue(false);
            socket.emit(IOEvents.gameCancelSearch);
            UI.home();
        }
    });
    
    inGame.formGame.addEventListener("submit", e => {
        e.preventDefault();
        clearTimeout(csm.getTimeoutId());

        const data = new FormData(e.target);
        const solution = data.get("solution");
        const payload = {
            gameId: csm.getGameId(),
            solution
        }
        socket.emit(IOEvents.gameSubmitSolution, payload);
        socket.emit(IOEvents.gameRequestNextWord, csm.getGameId());
        UI.change(IOEvents.gameRequestNextWord);

        e.target.reset();
    });
    
    inGame.formChat.addEventListener("submit", e => {
        e.preventDefault();
    
        const data = new FormData(e.target);
        const payload = {
            message: data.get("message"),
            gameId: csm.getGameId()
        }
        socket.emit(IOEvents.gameSendMessage, payload);
        e.target.reset();
    });
    
    postGame.btnHome.addEventListener("click", () => {
        UI.home();
    })
}