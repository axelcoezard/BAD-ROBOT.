const Pause = async (client, message, args, state) => {
    const {dispatcher} = state.audio;

    if (!dispatcher) return;

    dispatcher.pause();
}

export default Pause;