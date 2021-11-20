export const views = {
    mainMenu: getElem("#main-menu"),
    inGame: getElem("#in-game"),
    postGame: getElem("#post-game")
}

export const mainMenu = {
    btnSearchGame: getMainMenuElem("#btn-search-game"),
    spanNumberOfPlayersOnline: getMainMenuElem("#number-of-players-online"),
    divLoadingIconBox: getMainMenuElem("#loading-icon-box"),
    divLoadingIconContent: getMainMenuElem("#loading-icon-content"),
    pGameStarting: getMainMenuElem("#game-starting")
}

export const inGame = {
    pTimer: getInGameElem("#timer"),
    pWordDefinition: getInGameElem("#word-definition"),
    pWordHint: getInGameElem("#word-hint"),
    formGame: getInGameElem("#form-game"),
    inputGame: getInGameElem("#input-game"), // TODO: Refactor
    divMessages: getInGameElem("#messages"),
    formChat: getInGameElem("#form-chat"),
    inputChat: getInGameElem("#input-chat")
}

export const postGame = {
    pPlayerScore: getPostGameElem("#player-score"),
    pOpponentScore: getPostGameElem("#opponent-score"),
    pResult: getPostGameElem("#result"),
    tableSummary: getPostGameElem("#summary"),
    btnHome: getPostGameElem("#btn-home")
}

function getElem(selector) {
    return document.querySelector(selector);
}

function getMainMenuElem(selector) {
    return views.mainMenu.querySelector(selector);
}

function getInGameElem(selector) {
    return views.inGame.querySelector(selector);
}

function getPostGameElem(selector) {
    return views.postGame.querySelector(selector);
}

/* 
Rewritten variables:
    - form-game
    - input-game
    - player-score
    - opponent-score
*/