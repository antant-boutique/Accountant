import asyncio
import telegram
from telegram.ext import ApplicationBuilder

# using telegram.Bot
async def send(chat, msg):
    await telegram.Bot('5783157460:AAH6gKOGQCJgS_sQg5W9piRtRRMaUkBDS7I').sendMessage(chat_id=chat, text=msg)

asyncio.run(send('<chat-id>', 'Hello there!'))

# using ApplicationBuilder
async def send_more(chat, msg):
    application = ApplicationBuilder().token('<bot-token>').build()
    await application.bot.sendMessage(chat_id=chat, text=msg)

asyncio.run(send_more('<chat-id>', 'Hello there!'))

