const Untrack = async (client, message, args, state) => {
	if (args.length != 1) return;

	const textChannel = message.channel;
	const symbol = args[0] + state.crypto.currency;

	if (symbol in state.crypto.tracking) {
		clearInterval(state.crypto.tracking[symbol]);
		delete state.crypto.tracking[symbol]

		console.log(`[BOT] Tracking arrêté pour: ${args[0]}`)
		textChannel.send(`:no_bell: **Tracking sur le ${args[0]} désactivé!**`);
	}
}

export default Untrack;
