const Resume = async (client, message, args, state) => {
    const textChannel = message.channel;
    const {dispatcher} = state.audio;
    
    if (!dispatcher) return;

    dispatcher.resume();

    textChannel.send(`:arrow_forward:  **Lecture en cours dans** \`${voiceChannel.name}\``);   
}

export default Resume;