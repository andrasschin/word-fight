import * as IOEvents from "./IOEvents.js";

export class UI {
    createElement(type, text, attributes){

    }

    static changeUI(IOEvent, data) {
        switch(IOEvent) {
            case IOEvents.gameInit: {
                const p = document.createElement("p");
                p.innerText = "Starting game... Please wait.";
                document.body.appendChild(p);
            }

            case IOEvents.gameStart: {
                const header = document.createElement("h2");
                header.innerText = `Game has started! (id: ${data.gameId})`;
                document.body.appendChild(header);
            }
        }
    }
}