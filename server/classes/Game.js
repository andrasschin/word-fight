const Player = require("./Player");
const Word = require("./Word");
const APIHandler = require("./APIHandler");

class Game {
    static NUM_OF_WORDS = 10;

    constructor(gameId, playerOneId, playerTwoId) {
        this.gameId = gameId;
        this.player1 = new Player(playerOneId);
        this.player2 = new Player(playerTwoId);
        this.words = [];
    }

    async init() {
        return new Promise((resolve, reject) => {
            APIHandler.getWordsWithDefinitions(Game.NUM_OF_WORDS)
                .then(wordsObjArr => {
                    this.words = wordsObjArr/* .map(element => {
                        return new Word(element.word, element.definiton);
                    }) */;
                    console.log(this.words);
                    resolve();
                })
                .catch(err => {
                    console.log("[ERROR] init: ", err);
                    reject();
                })
        });
    }
}

module.exports = Game;