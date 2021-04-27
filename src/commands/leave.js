const Leave = async (client, message, args, state) => {     
    if (state.audio.dispatcher) {
        state.audio.dispatcher.destroy();
        state.audio.dispatcher = null;
    }

    if (state.audio.connection) {
        state.audio.connection.disconnect();
        state.audio.connection = null;
    }

    state.audio.isPlaying = false;
}

export default Leave;