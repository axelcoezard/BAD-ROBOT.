const Leave = async (client, message, args, state) => {  
    let {dispatcher, connection} = state.audio;
    
    if (dispatcher) {
        dispatcher.destroy();
        dispatcher = null;
    }

    if (connection) {
        connection.disconnect();
        connection = null;
    }

    state.audio.isPlaying = false;
}

export default Leave;