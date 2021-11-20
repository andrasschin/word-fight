const Game = require("./classes/Game");

class StateManager {
    #games = [];
    #playerInQueue = null;
    #numberOfPlayersOnline = 0;

    getGames() {
        return [...this.#games];
    }

    addGame(game) {
        if (game instanceof Game) {
            this.#games.push(game);
            return true;
        } else {
            return false;
        }
    }

    removeGame(game) {
        if (game instanceof Game) {
            const index = this.#games.findIndex(g => g.equals(game));
            this.#games.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    findGame(gameId) {
        return this.#games.find(game => game.id === gameId);
    }

    getPlayerInQueue() {
        return this.#playerInQueue;
    }

    addPlayerToQueue(player) {
        this.#playerInQueue = player;
    }

    removePlayerInQueue() {
        this.#playerInQueue = null;
    }

    isQueueEmpty() {
        return this.#playerInQueue === null;
    }

    increaseNumberOfPlayersOnline() {
        this.#numberOfPlayersOnline++;
    }

    decreaseNumberOfPlayersOnline() {
        this.#numberOfPlayersOnline--;
    }

    getNumberOfPlayersOnline() {
        return this.#numberOfPlayersOnline;
    }
}

module.exports = StateManager;