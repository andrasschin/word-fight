import * as IOEvents from "./IOEvents.js";

export class UI {
    static mainMenu = document.querySelector("#main-menu");
    static inGame = document.querySelector("#in-game");
    static postGame = document.querySelector("#post-game");
    static currentView = this.mainMenu;
    static currentIntervalId = null;

    static home() {
        this.#changeViewTo(this.mainMenu);
    }

    static changeUI(IOEvent, data) {
        switch(IOEvent) {
            case IOEvents.gameSearch: {
                const btnGameSearch = this.mainMenu.querySelector("#btn-search-game");
                const loadingIconBox = this.mainMenu.querySelector("#loading-icon-box");
                const loadingIconContent = this.mainMenu.querySelector("#loading-icon-content");

                btnGameSearch.innerText = "In Queue";
                loadingIconBox.style.visibility = "visible";
                loadingIconContent.style.animationPlayState = "running";
                
                break;
            }

            case IOEvents.gameInit: {
                const gameStartingElement = this.mainMenu.querySelector("#game-starting");
                gameStartingElement.style.visibility = "visible";

                break;
            }

            case IOEvents.gameStart: {
                this.#changeViewTo(this.inGame);

                break;
            }

            case IOEvents.gameRequestNextWord: {
                clearInterval(this.currentIntervalId);
                const timerElement = this.inGame.querySelector("#timer");
                timerElement.innerText = "Waiting for your opponent...";
                
                break;
            }

            case IOEvents.gameSendNextWord: {
                const definitonElement = this.inGame.querySelector("#word-definition");
                const hintElement = this.inGame.querySelector("#word-hint");
                definitonElement.innerText = data.definition;
                hintElement.innerText = data.hint;
                
                const timerElement = this.inGame.querySelector("#timer");
                let secondsLeft = 15;
                timerElement.innerText = secondsLeft;
                this.currentIntervalId = setInterval(() => {
                    secondsLeft--;
                    timerElement.innerText = secondsLeft;
                }, 1000);
                
                break;
            }

            case IOEvents.gameEnd: {
                this.#changeViewTo(this.postGame);
                const table = this.postGame.querySelector("#post-game-summary tbody");
                const result = this.postGame.querySelector("#result");
                const yourScore = this.postGame.querySelector("#your-score");
                const opponentsScore = this.postGame.querySelector("#opponents-score");

                if (data.you.score > data.opponent.score) result.innerText = "You won!";
                else if (data.you.score === data.opponent.score) result.innerText = "It's a tie!";
                else if (data.you.score < data.opponent.score) result.innerText = "You lost!";
                else result.innerText = "Something went wrong and we don't know who won.";

                yourScore.innerText = "Your score: " + data.you.score;
                opponentsScore.innerText = "Opponent's score: " + data.opponent.score;

                for (let i = 0; i < data.words.length; i++) {
                    let row = table.insertRow(-1);
                    let definitionCell = row.insertCell(0);
                    let solutionCell = row.insertCell(1);
                    let yourAnswerCell = row.insertCell(2);
                    let opponentsAnswerCell = row.insertCell(3);

                    definitionCell.innerText = data.words[i].definition;
                    solutionCell.innerText = data.words[i].word;
                    yourAnswerCell.innerText = data.you.answers[i];
                    opponentsAnswerCell.innerText = data.opponent.answers[i];
                }
                
                break;
            }

            case IOEvents.gameReceiveMessage: {
                const p = document.createElement("p");
                p.innerText = data.message;
                this.inGame.querySelector("#messages").appendChild(p);

            }

            default:
                break;
        }
    }
    
    static #changeViewTo(toView) {
        this.#garbageCleaner(toView);
        this.currentView.style.display = "none";
        toView.style.display = "flex";
        this.currentView = toView;
    }

    static #garbageCleaner(view) {
        switch(view) {
            case this.mainMenu: {
                const gameStartingElement = view.querySelector("#game-starting");
                const btnSearchGame = view.querySelector("#btn-search-game");
                const loadingIconBox = this.mainMenu.querySelector("#loading-icon-box");
                const loadingIconContent = this.mainMenu.querySelector("#loading-icon-content");

                gameStartingElement.style.visibility = "hidden";
                btnSearchGame.innerText = "Search game";
                loadingIconBox.style.visibility = "hidden";
                loadingIconContent.style.animationPlayState = "paused";
                
                break;
            }
            
            case this.inGame: {
                // TODO: Clear messages
                break;
            }

            case this.postGame: {
                const postGameSummaryTable = view.querySelector("#post-game-summary");
                var rowCount = postGameSummaryTable.rows.length;
                for (let i = rowCount - 1; i > 0; i--) {
                    postGameSummaryTable.deleteRow(i);
                }
                
                break;
            }

            default:
                break;
        }
    }
}