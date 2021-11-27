import * as IOEvents from "../constants/IOEvents.js";
import { views, mainMenu, inGame, postGame } from "../constants/Elements.js";

export default class UI {
    static currentView = views.mainMenu;
    static currentIntervalId = null;

    static home() {
        this.#changeViewTo(views.mainMenu);
    }

    static change(IOEvent, data) {
        switch(IOEvent) {
            case IOEvents.gameSearch: {
                mainMenu.btnSearchGame.innerText = "In Queue";
                mainMenu.divLoadingIconBox.style.visibility = "visible";
                mainMenu.divLoadingIconContent.style.animationPlayState = "running";
                
                break;
            }

            case IOEvents.gameInit: {
                mainMenu.pGameStarting.style.visibility = "visible";

                break;
            }

            case IOEvents.gameStart: {
                this.#changeViewTo(views.inGame);

                break;
            }

            case IOEvents.gameRequestNextWord: {
                clearInterval(this.currentIntervalId);
                inGame.pTimer.innerText = "Waiting for your opponent...";
                inGame.inputGame.disabled = true;
                
                break;
            }

            case IOEvents.gameSendNextWord: {
                inGame.pWordDefinition.innerText = data.definition;
                inGame.pWordHint.innerText = data.hint;
                inGame.inputGame.disabled = false;

                let secondsLeft = 15;
                inGame.pTimer.innerText = secondsLeft;
                this.currentIntervalId = setInterval(() => {
                    secondsLeft--;
                    inGame.pTimer.innerText = secondsLeft;
                }, 1000);
                
                break;
            }

            case IOEvents.gameEnd: {
                this.#changeViewTo(views.postGame);

                if (data.player.score > data.opponent.score) {
                    postGame.pResult.innerText = "You won!";
                    postGame.pResult.classList.add("result-win");
                }
                else if (data.player.score === data.opponent.score) {
                    postGame.pResult.innerText = "It's a tie!";
                }
                else if (data.player.score < data.opponent.score) {
                    postGame.pResult.innerText = "You lost!";
                    postGame.pResult.classList.add("result-lose");
                }
                else postGame.pResult.innerText = "Something went wrong and we don't know who won.";

                postGame.pPlayerScore.innerText = "Your score: " + data.player.score;
                postGame.pOpponentScore.innerText = "Opponent's score: " + data.opponent.score;

                for (let i = 0; i < data.words.length; i++) {
                    let row = postGame.tableSummary.insertRow(-1);
                    let definitionCell = row.insertCell(0);
                    let solutionCell = row.insertCell(1);
                    let yourAnswerCell = row.insertCell(2);
                    let opponentsAnswerCell = row.insertCell(3);

                    definitionCell.innerText = data.words[i].definition;
                    solutionCell.innerText = data.words[i].word;
                    yourAnswerCell.innerText = data.player.answers[i];
                    opponentsAnswerCell.innerText = data.opponent.answers[i];
                }
                
                break;
            }

            case IOEvents.gameReceiveMessage: {
                const pMessage = document.createElement("p");
                
                if (data.isSenderThisPlayer) {
                    pMessage.innerText = "You: " + data.message;
                    pMessage.classList.add("sent-by-player");
                } else {
                    pMessage.innerText = "Opponent: " + data.message;
                }
                inGame.divMessages.appendChild(pMessage);

                break;
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
            case views.mainMenu: {
                mainMenu.pGameStarting.style.visibility = "hidden";
                mainMenu.btnSearchGame.innerText = "Search game";
                mainMenu.divLoadingIconBox.style.visibility = "hidden";
                mainMenu.divLoadingIconContent.style.animationPlayState = "paused";
                
                break;
            }
            
            case views.inGame: {
                while (inGame.divMessages.lastElementChild) {
                    inGame.divMessages.removeChild(inGame.divMessages.lastElementChild);
                }

                break;
            }

            case views.postGame: {
                var rowCount = postGame.tableSummary.rows.length;
                for (let i = rowCount - 1; i > 0; i--) {
                    postGame.tableSummary.deleteRow(i);
                }
                
                break;
            }

            default:
                break;
        }
    }
}