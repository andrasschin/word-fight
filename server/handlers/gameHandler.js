const Game = require("../classes/Game");
const IOEvents = require("../constants/IOEvents");

module.exports = (io, ssm) => {
    const searchGame = async function() {
        const socket = this;

        if (ssm.isQueueEmpty()) {
            ssm.addPlayerToQueue(socket);
        }
        else {
            const playerInQueue = ssm.getPlayerInQueue();
            
            if (ssm.getPlayerInQueue().id !== socket.id) {
                let game = new Game(playerInQueue.id, socket.id);
                ssm.addGame(game);
                playerInQueue.join(game.id);
                socket.join(game.id);
                io.to(game.id).emit(IOEvents.gameInit, game.id);
                ssm.removePlayerInQueue();
    
                await game.init();
                io.to(game.id).emit(IOEvents.gameStart);
            }
        };
    }

    const cancelSearch = function() {
        const socket = this;
        if (!ssm.isQueueEmpty() && ssm.getPlayerInQueue().id === socket.id) {
            ssm.removePlayerInQueue();
        }
    }

    const requestNextWord = function(gameId) {
        const socket = this;
        const game = ssm.findGame(gameId);
        game.setPlayerNextWordReady(socket.id);
        
        switch (game.state) {
            case Game.STATE.NEXT_WORD_READY: {
                const nextWord = game.nextWord();
                io.to(game.id).emit(IOEvents.gameSendNextWord, nextWord);
                break;
            }
            
            case Game.STATE.ENDED: {
                io.to(game.id).emit(IOEvents.gameEnd, game.getResults());
                ssm.removeGame(game);
                break;
            }
            
            default:
                break;
        }
    }

    const submitSolution = function(payload) {
        const socket = this;
        const game = ssm.findGame(payload.gameId);
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