import ytdl from "ytdl-core"
import ytpl from "ytpl"

const Play = async (client, message, args, state) => {
    const voiceChannel = message.member.voice.channel;
    const textChannel = message.channel;

    if (args.length == 0) return;
    if (!voiceChannel) return;

    const URL_params = new URLSearchParams(args[0])
    if (URL_params.has("list")) {
        const playlist_ID = URL_params.get("list");
        const playlist = await ytpl(playlist_ID);

        playlist.items.forEach(i => {
            state.audio.queue.push(i.shortUrl)
        })
    } else state.audio.queue.push(args[0]);

    if (args.length > 1)
        state.audio.queue = args;

    if (!state.audio.isPlaying) {
        voiceChannel.join().then(conn => {
            if (!state.audio.connection) {
                state.audio.connection = conn;
                textChannel.send(`:thumbsup: **Connecté à** \`${voiceChannel.name}\``);
            }

            state.audio.connection.on("disconnect", () => {
                state.audio.queue = []
                state.audio.isPlaying = false;
            });

            playQueue(message, state) ;  
        });  
        state.audio.isPlaying = true;
    } else {
        textChannel.send(`:thumbsup: **Ajouté(s) à la file d'attente**`);
    }
}

const playQueue = async (message, state) => {
    const textChannel = message.channel;
    const options = { quality: "highestaudio"};
    const videoURL = state.audio.queue[0];
    const download = ytdl(videoURL, options);

    state.audio.dispatcher = state.audio.connection.play(download);
    state.audio.dispatcher.setVolume(state.audio.volume / 100);

    textChannel.send(`**A la recherche de** :mag_right: \`${videoURL}\``);
    const videoInfo = await ytdl.getBasicInfo(videoURL);
   
    textChannel.send(`**Joue actuellement** :notes: \`${videoInfo.videoDetails.title}\``);
    console.log(`[BOT] Joue actuellement: ${videoInfo.videoDetails.title}`)
    
    state.audio.dispatcher.on("finish", () => {
        state.audio.queue.shift();
        state.audio.dispatcher.destroy();

        if (state.audio.queue.length > 0) 
            playQueue(message, state);
        else state.audio.isPlaying = false;
    });
}  

export default Play;