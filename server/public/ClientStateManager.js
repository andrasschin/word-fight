export default class ClientStateManager {
    #playerId = null;
    #gameId = null;
    #timeoutId = null;
    #isInQueue = false;

    getPlayerId() {
        return this.#playerId;
    }

    setPlayerId(value) {
        this.#playerId = value;
    }

    getGameId() {
        return this.#gameId;
    }

    setGameId(value) {
        this.#gameId = value;
    }

    getTimeoutId() {
        return this.#timeoutId;
    }

    setTimeoutId(value) {
        this.#timeoutId = value;
    }

    getIsInQueue() {
        return this.#isInQueue;
    }

    setIsInQueue(value) {
        this.#isInQueue = value;
    }
}