import { mainMenu } from "../constants/Elements.js";

export default function generalHandlers(csm) {
    const setupPlayer = playerId => {
        csm.setPlayerId(playerId);
    }

    const updateNumberOfPlayersOnline = playersOnline => {
        mainMenu.spanNumberOfPlayersOnline.innerText = playersOnline; // TODO: UI's job
    }

    return {
        setupPlayer,
        updateNumberOfPlayersOnline
    }
}