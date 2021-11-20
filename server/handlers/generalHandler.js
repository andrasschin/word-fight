const StateManager = require("../ServerStateManager");
const IOEvents = require("../constants/IOEvents");

module.exports = (io, ssm) => {
    const onDisconnect = function() {
        ssm.decreaseNumberOfPlayersOnline();
        io.emit(IOEvents.updateNumberOfPlayersOnline, ssm.getNumberOfPlayersOnline());
    }
    
    return {
        onDisconnect
    }
}