const Join = async (client, message, args, state) => {
    const {channel} = message.member.voice;

    if (!channel) return;

    channel.join().then(connection => {
        state.audioConnection = connection;
    });
}

export default Join;