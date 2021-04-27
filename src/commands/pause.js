const Pause = async (client, message, args, state) => {
    const {dispatcher} = state.audio;

    if (!dispatcher) return;

    dispatcher.pause();

    message.channel.send(
        `:pause_button: **Lecture mise en pause dans** \`${message.member.voice.channel.name}\``
    );        
}

export default Pause;