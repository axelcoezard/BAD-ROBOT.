import axios from "axios";

const Price = async (client, message, args, state) => {
	if (args.length != 1) return;

	const textChannel = message.channel;

	const { currency } = state.crypto;
	const symbol = args[0] + currency;
	const params = { symbol };
	const target = "https://api.binance.com/api/v3/ticker/price";

	const { data }  = await axios.get(target, { params });
	const currentPrice = parseFloat(data.price);

	console.log(`[BOT] Prix du ${args[0]}: ${currentPrice}%`);
	textChannel.send(`:coin: **Prix actuel du ${args[0]}**: \`${currentPrice} ${currency}\``);
}

export default Price;
