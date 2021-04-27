const Queue = async (client, message, args, state) => {
    const textChannel = message.channel;
    const {queue} = state.audio;

    if  (queue.length == 0) {
        return textChannel.send(`:x: **La file d'attente est actuellement vide**...`);
    }
    
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`Contenu de la file d'attente`)
    .setDescription("Voici tous les titres qui sont dans la file d'attente:")
    .setTimestamp();

    queue.forEach(async (videoURL, i) => {
        const videoInfo = await ytdl.getBasicInfo(videoURL);
        const videoName = await videoInfo.videoDetails.title;
        const videoDuration = await videoInfo.videoDetails.length_seconds;
        embed.addField(
            "\u200b",
            `**○** \`${videoName.substring(0, 250)}...\``,
        );
        if (i == queue.length - 1) {
            embed.addField("\u200b", `**${queue.length} titres dans la file d'attente**`, "");
            textChannel.send(embed)
        }
    });
}

export default Queue;