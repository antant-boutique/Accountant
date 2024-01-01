import logging, json
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

async def upname(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text_caps = 'Materials have been uploaded'
    await context.bot.send_message(chat_id=update.effective_chat.id, text=text_caps)

async def send_matform(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print('send_matform')
    pdict = {'quantity':3,'price':600}
    jdict = json.dumps(pdict)
    await update.message.reply_text(
        "Material upload",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Open Form",
                web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/matform?color=red&price=120&color=black&price=550&",api_kwargs=pdict),
            )
        ),
    )

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None :
    print('web_app_data')
    data = json.loads(update.effective_message.web_app_data.data)
    print(data)
    await update.message.reply_text("Your data was:")
    for result in data:
        await update.message.reply_text(data[result])

if __name__ == '__main__':
    application = ApplicationBuilder().token('5783157460:AAH6gKOGQCJgS_sQg5W9piRtRRMaUkBDS7I').build()

    caps_handler = CommandHandler('upname', upname)
    application.add_handler(caps_handler)
    form_handler = CommandHandler('matform', send_matform)
    application.add_handler(form_handler)
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    application.run_polling()
