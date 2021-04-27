import Play from "./play";

const Skip = async (client, message, args, state) => {
    const voiceChannel = message.member.voice.channel;
    const textChannel = message.channel;
    
    if (!state.audio.playing && !state.audio.dispatcher) {
        message.channel.send(
            `:warning:  **Aucune lecture en cours**`
        );
        return console.log("[BOT] Aucune lecture en cours")
    }

    state.audio.dispatcher.destroy();
    state.audio.isPlaying = false;
    state.audio.queue.shift();

    if (state.audio.queue.length == 0) {
        console.log("[BOT] Aucun son dans la liste de lecture")
        return state.audio.dispatcher.destroy();
    }

    const tmpQueue = state.audio.queue;

    message.channel.send(`:fast_forward: **Lecture du son suivant...**`);
    console.log("[BOT] Lecture du son suivant...")
 
    Play(client, message, tmpQueue, state)
}

export default Skip;