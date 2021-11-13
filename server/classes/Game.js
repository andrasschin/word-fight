const Player = require("./Player");
const Word = require("./Word");
const APIHandler = require("./APIHandler");

class Game {
    static NUM_OF_WORDS = 3;
    static STATE = {
        WAITING: "WAITING",
        END: "END"
    }

    static createGameId(player1Id, player2Id) {
        return "game_" + player1Id + player2Id;
    }

    constructor(gameId, playerOneId, playerTwoId) {
        this.gameId = gameId;
        this.player1 = new Player(playerOneId); // TODO: make players an array
        this.player2 = new Player(playerTwoId);
        this.words = [];
        this.nextWordIndex = 0;
    }

    async init() {
        return new Promise((resolve, reject) => {
            APIHandler.getWordsWithDefinitions(Game.NUM_OF_WORDS)
                .then(wordsObjArr => {
                    this.words = wordsObjArr.map(element => {
                        return new Word(element.word[0], element.definition);
                    });
                    console.log(this);
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] init: ", err);
                    reject();
                })
        });
    }

    getPlayerById(playerId) {
        if (this.player1.id === playerId) return this.player1;
        else if (this.player2.id === playerId) return this.player2;
        else return -1;
    }

    nextWord(playerId) {
        const player = this.getPlayerById(playerId);
        if (playerId !== -1) {
            player.isNextWordReady = true;

            if (this.player1.isNextWordReady && this.player2.isNextWordReady) {
                if (this.isGameEnd()) return Game.STATE.END;

                const word = this.words[this.nextWordIndex];
                this.nextWordIndex++;
                this.player1.isNextWordReady = false;
                this.player2.isNextWordReady = false;
                return {
                    definition: word.definition,
                    hint: word.getHint()
                };
            } else {
                return Game.STATE.WAITING;
            }
        } else {
            return {
                definition: "Player not found in match."
            };
        }
    }

    submitSolution(playerId, solution) {
        const player = this.getPlayerById(playerId);
        if (player !== -1) {
            player.answers.push(solution);
            if (solution === this.words[this.nextWordIndex - 1].word) player.score++;
        }
        console.log(this);
    }

    isGameEnd() {
        return this.words.length === this.nextWordIndex;
    }

    getResults() {
        return {
            words: this.words,
            player1: this.player1.toObject(),
            player2: this.player2.toObject()
        }
    }

    toString() {
        return `
            Game id: ${this.gameId}
            Player 1: ${this.player1}
            Player 2: ${this.player2}
            Next Word Index: ${this.nextWordIndex}
            Words: ${this.words}
        `
    }
}

module.exports = Game;