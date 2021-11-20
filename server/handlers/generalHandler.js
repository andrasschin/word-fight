const StateManager = require("../StateManager");
const IOEvents = require("../constants/IOEvents");

module.exports = (io, stateManager) => {
    const onDisconnect = function() {
        stateManager.decreaseNumberOfPlayersOnline();
        io.emit(IOEvents.updateNumberOfPlayersOnline, stateManager.getNumberOfPlayersOnline());
    }
    
    return {
        onDisconnect
    }
}