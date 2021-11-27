const { v4: uuidv4 } = require("uuid");
const Player = require("./Player");
const Word = require("./Word");
const APIHandler = require("./APIHandler");

class Game {
    static NUM_OF_WORDS = 10;
    static STATE = {
        INSTANTIATED: "INSTANTIATED",
        INITIALIZING: "INITIALIZING",
        STARTED: "STARTED",
        WAITING_FOR_PLAYER: "WAITING_FOR_PLAYER",
        NEXT_WORD_READY: "NEXT_WORD_READY",
        ENDED: "ENDED"
    }

    constructor(playerOneId, playerTwoId) {
        this.id = uuidv4();
        this.player1 = new Player(playerOneId);
        this.player2 = new Player(playerTwoId);
        this.words = [];
        this.nextWordIndex = 0;
        this.state = Game.STATE.INSTANTIATED;
    }

    async init() {
        this.state = Game.STATE.INITIALIZING;
        
        return new Promise((resolve, reject) => {
            APIHandler.getWordsWithDefinitions(Game.NUM_OF_WORDS)
                .then(wordsObjArr => {
                    this.words = wordsObjArr.map(element => {
                        return new Word(element.word[0].toLowerCase(), element.definition);
                    });
                    this.state = Game.STATE.STARTED;
                    console.log(this.words);
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

    setPlayerNextWordReady(playerId) {
        const player = this.getPlayerById(playerId);

        if (player !== -1) {
            player.isNextWordReady = true;
            
            if (this.player1.isNextWordReady && this.player2.isNextWordReady) {
                this.state = Game.STATE.NEXT_WORD_READY;
                if (this.isGameEnd()) {
                    this.state = Game.STATE.ENDED;
                }
            } else {
                this.state = Game.STATE.WAITING_FOR_PLAYER;
            }
        }
    }

    nextWord() {
        const word = this.words[this.nextWordIndex];
        this.nextWordIndex++;
        this.player1.isNextWordReady = false;
        this.player2.isNextWordReady = false;
        return {
            definition: word.definition,
            hint: word.getHint()
        };
    }

    submitSolution(playerId, solution) {
        const player = this.getPlayerById(playerId);
        if (player !== -1) {
            player.answers.push(solution);
            if (solution.toLowerCase() === this.words[this.nextWordIndex - 1].word) player.score++;
        }
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

    equals(game) {
        if (this.id === game.id) return true;
        else return false;
    }
}

module.exports = Game;