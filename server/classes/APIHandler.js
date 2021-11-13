const fetch = require("node-fetch");

class APIHandler {
    static randomWordsAPIBase = "https://random-word-api.herokuapp.com/word?swear=0&number=1";
    static dictionaryAPIBase = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    static badRequestMessage = "No Definitions Found";

    static fetchRandomWord() {
        const path = this.randomWordsAPIBase;
        
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(res => {
                    const word = res.json();
                    resolve(word);
                })
                .catch(err => {
                    console.log("[ERROR] fetchRandomWord: ", err);
                    reject(err);
                })
        });
    }

    static fetchDefiniton(word) {
        const path = this.dictionaryAPIBase + word;

        return new Promise((resolve, reject) => {
            fetch(path)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    if (data.title && data.title === APIHandler.badRequestMessage) {
                        resolve(-1);
                    } else {
                        const definition = data[0].meanings[0].definitions[0].definition;
                        resolve(definition);
                    }
                })
                .catch(err => {
                    console.log("[ERROR] fetchDefiniton: ", err);
                    reject(err);
                })
            }
        )
    }

    static async getWordWithDefinition() {
        const word = await this.fetchRandomWord();
        const definition = await this.fetchDefiniton(word);
        
        if (definition === -1) return this.getWordWithDefinition();

        return {
            word,
            definition
        };
    }

    static async getWordsWithDefinitions(n) {
        let wordsWithDefinitionsArr = [];

        for (let i = 0; i < n; i++) {
            wordsWithDefinitionsArr.push(this.getWordWithDefinition());
        }

        return Promise.all(wordsWithDefinitionsArr);
    }
}

module.exports = APIHandler;