import logging
import requests
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Replace this with your actual Telegram bot token
BOT_TOKEN = "7591787009:AAH2N4nsPGEaskLHVeWC0qZqW58clGo0WkE"

# Your token contract address
MY_TOKEN_CONTRACT = "2oxhcZyjSGtvcYHJ8ThqEaVEQGaY4Aq4SKk5HHNwCXri"

# Solana API Endpoint (Example using Birdeye)
SOLANA_API_URL = "https://public-api.birdeye.so"

# Your Birdeye API Key (replace with actual key)
BIRDEYE_API_KEY = "a9c7a1890d754fb09e7aeeae040c7f16"

# Start command function
async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("🚀 Welcome to the AI GIRL Bot!\n\n"
                                    "Use /predict to see the next meme coin,\n"
                                    "/scan to check new Solana tokens,\n"
                                    "/buy to purchase our token,\n"
                                    "/contest to join giveaways!")

# Predict the next Solana meme coin
async def predict_meme_coin(update: Update, context: CallbackContext):
    await update.message.reply_text("🔍 Scanning for the next potential meme coin on Solana...")

    try:
        response = requests.get(f"{SOLANA_API_URL}/tokens/trending?api_key={BIRDEYE_API_KEY}")
        data = response.json()

        top_token = data['data'][0] if data['data'] else None

        if top_token:
            name = top_token['name']
            symbol = top_token['symbol']
            price = top_token['price']
            market_cap = top_token['marketCap']
            volume = top_token['volume']
            
            message = (f"🔥 **Potential Next Meme Coin** 🔥\n"
                       f"📌 Name: {name}\n"
                       f"💰 Symbol: {symbol}\n"
                       f"💲 Price: ${price:.6f}\n"
                       f"📈 Market Cap: ${market_cap}\n"
                       f"📊 24h Volume: ${volume}")
        else:
            message = "❌ No trending meme coins found right now."

        await update.message.reply_text(message)
    
    except Exception as e:
        logger.error(f"Error fetching meme coins: {e}")
        await update.message.reply_text("⚠️ Error fetching meme coin predictions.")

# Scan new Solana tokens
async def scan_solana_tokens(update: Update, context: CallbackContext):
    await update.message.reply_text("🔍 Scanning newly launched Solana tokens...")

    try:
        response = requests.get(f"{SOLANA_API_URL}/tokens/new?api_key={BIRDEYE_API_KEY}")
        data = response.json()

        tokens = data['data'][:5]  # Show top 5 new tokens

        message = "**🚀 New Solana Tokens:**\n"
        for token in tokens:
            name = token['name']
            symbol = token['symbol']
            message += f"📌 {name} ({symbol})\n"

        await update.message.reply_text(message)
    
    except Exception as e:
        logger.error(f"Error scanning new tokens: {e}")
        await update.message.reply_text("⚠️ Error fetching new tokens.")

# Allow users to buy your token
async def buy_token(update: Update, context: CallbackContext):
    buy_link ="https://dexscreener.com/solana/2oxhczyjsgtvcyhj8thqeaveqgay4aq4skk5hhnwcxri"
    await update.message.reply_text(f"💰 Buy our token securely here: [Buy Now]({buy_link})", parse_mode="Markdown")

# Add a contest
async def contest(update: Update, context: CallbackContext):
    await update.message.reply_text("🎉 **Join Our Crypto Contest!** 🎉\n\n"
                                    "Participate and win rewards in $TAGL tokens!\n"
                                    "To enter, simply:\n"
                                    "1️⃣ Follow our Twitter\n"
                                    "2️⃣ Join our Telegram group\n"
                                    "3️⃣ Share this bot with friends!\n\n"
                                    "🎁 Winners announced weekly!")

# Handle text messages
async def handle_message(update: Update, context: CallbackContext):
    text = update.message.text.lower()
    logger.debug(f"Received message: {text}")
    if "hi" in text or "hello" in text:
        await update.message.reply_text("Hey there! 😄 How can I assist you today?")
    else:
        await update.message.reply_text("I didn’t quite catch that, try again! 🙃")

# Main function to start the bot
def main():
    app = Application.builder().token(BOT_TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("predict", predict_meme_coin))
    app.add_handler(CommandHandler("scan", scan_solana_tokens))
    app.add_handler(CommandHandler("buy", buy_token))
    app.add_handler(CommandHandler("contest", contest))

    # Handle text messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Start the Bot
    app.run_polling()

if __name__ == '__main__':
    main()