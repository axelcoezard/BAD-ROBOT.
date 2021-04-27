const Volume = async (client, message, args, state) => {
    const textChannel = message.channel;

    if (args.length < 1) {
        textChannel.send(`:warning:  **Veuillez indiquer un volume entre 0 et 100**`);
        return console.log("[BOT] Aucune volume indiqué")
    }

    let {isPlaying, dispatcher} = state.audio;

    if (!isPlaying && !dispatcher) {
        textChannel.send(`:warning:  **Aucune lecture en cours**`);
        return console.log("[BOT] Aucune lecture en cours")
    }

    dispatcher.setVolume(args[0] / 100);
    state.audio.volume = args[0];

    textChannel.send(`:level_slider:  **Volume mis à ${args[0]}%**`);
    console.log(`[BOT] Volume mit à ${args[0]}%`)
}

export default Volume;