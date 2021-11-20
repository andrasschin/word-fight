const Game = require("../classes/Game");
const IOEvents = require("../constants/IOEvents");

module.exports = (io, stateManager) => {
    const searchGame = async function() {
        const socket = this;

        if (stateManager.isQueueEmpty()) {
            stateManager.addPlayerToQueue(socket);
        }
        else {
            const playerInQueue = stateManager.getPlayerInQueue();
            
            if (stateManager.getPlayerInQueue().id !== socket.id) {
                let game = new Game(playerInQueue.id, socket.id);
                stateManager.addGame(game);
                playerInQueue.join(game.id);
                socket.join(game.id);
                io.to(game.id).emit(IOEvents.gameInit, game.id);
                stateManager.removePlayerInQueue();
    
                await game.init();
                io.to(game.id).emit(IOEvents.gameStart);
            }
        };
    }

    const cancelSearch = function() {
        const socket = this;
        if (!stateManager.isQueueEmpty() && stateManager.getPlayerInQueue().id === socket.id) {
            stateManager.removePlayerInQueue();
        }
    }

    const requestNextWord = function(gameId) {
        const socket = this;
        const game = stateManager.findGame(gameId);
        game.setPlayerNextWordReady(socket.id);
        
        switch (game.state) {
            case Game.STATE.NEXT_WORD_READY: {
                const nextWord = game.nextWord();
                io.to(game.id).emit(IOEvents.gameSendNextWord, nextWord);
                break;
            }
            
            case Game.STATE.ENDED: {
                io.to(game.id).emit(IOEvents.gameEnd, game.getResults());
                stateManager.removeGame(game);
                break;
            }
            
            default:
                break;
        }
    }

    const submitSolution = function(payload) {
        const socket = this;
        const game = stateManager.findGame(payload.gameId);
        game.submitSolution(socket.id, payload.solution);
    }

    const sendMessage = function(payload) {
        const socket = this;
        io.to(payload.gameId).emit(IOEvents.gameReceiveMessage, { 
            sender: socket.id,
            message: payload.message 
        });
    }
    
    return {
        searchGame,
        cancelSearch,
        requestNextWord,
        submitSolution,
        sendMessage
    }
}