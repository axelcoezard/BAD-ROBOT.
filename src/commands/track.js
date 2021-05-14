import { MessageEmbed } from "discord.js"
import axios from "axios";

const ITERATIONS_LAST = 5;
const PRICE_CHANGE = 2.5; // percentage

const Track = async (client, message, args, state) => {
	if (args.length != 1) return;

	const textChannel = message.channel;

	const { currency } = state.crypto;
	const symbol = args[0] + currency;
	const params = { symbol };
	const target = "https://api.binance.com/api/v3/ticker/price";

	let lastPrice;
	let time = 0;
	const interval_id = setInterval(async () => {
		const { data }  = await axios.get(target, { params });

		const currentPrice = parseFloat(data.price);
		if (!lastPrice) lastPrice = currentPrice;

		const diff = currentPrice - lastPrice;
		const perc = (diff * 100 / lastPrice).toFixed(3);

		console.log(`[BOT] Tracking ${symbol}: ${perc}%`);

		if (Math.abs(perc) >= PRICE_CHANGE) {
			// Conversion des secondes en heures:minutes/secondes
			const seconds = Math.round(time % 60);
			const minutes = Math.round(time / 60);
			const hours = Math.round(time / 3600)

			// Préparation du message type EMBED
			const embed = new MessageEmbed()
			.setColor("GREEN")
			.setTitle(`ALERTE PRIX`)
			.setURL(`https://www.binance.com/fr/trade/${args[0]}_${currency}`)
			.addField("Monnaie", args[0], true)
			.addField("Devise", currency, true)
			.addField("Valeur", currentPrice + " " + currency, true)
			.addField("Fluctuation", perc + "%", true)
			.addField("Temps requis", hours + "h " + minutes + "m " + seconds + "s", true)
			.setTimestamp();

			message.reply({
				content: `le **${args[0]}** a subit une forte variation!`,
				embed: embed
			});

			lastPrice = data.price;
			time = 0;
		}
		time += ITERATIONS_LAST;
	}, ITERATIONS_LAST * 1000);

	state.crypto.tracking[symbol] = interval_id;

	console.log(`[BOT] Tracking commencé pour: ${args[0]}`)
	textChannel.send(`:bell: **Tracking sur le ${args[0]} activé!**`);
}

export default Track;
