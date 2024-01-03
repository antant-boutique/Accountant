import pickle
import logging, json
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters, PollAnswerHandler, PollHandler
from telegram.constants import ParseMode
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import os

import AntantManager as AM

DriveFolder = {'bill':'1rJHRewitYJ1luUIrOSYXVz1sJIAKtF8F','product':'120Dq0RsLV2IrwMLiErnILVGURbeONlS1','invoice':'1QT7ipOqopPn8Ri_ZgZjYnjPx25qc2yUp'}
SpreadSheet = {'finance':'1pRqwos74q7zpk1kGc6DB_ZpzWRQ0OKQjzqg0-moPy48','materials':'1rv5koHjoPW9fm2Y8ql4QVLBTz6O5mRGnah2IS6n1NYM','products':'1JiNGR9dn-FEkAG13mUND6DEVijpcc8IuGFLbp78Iuz8','designs':'18XI5XZj4JjzvVMCyF6qyAv9ggQHSa2b7kbAhiDMFd5M'}
Scopes = ['https://www.googleapis.com/auth/drive']

SAMPLE_SPREADSHEET_ID = '1Biing8a_2ZqOPQd4k1Vec00rANom83oZtraQJT-Imfc'
SAMPLE_RANGE_NAME = 'Cash!A1:G'
EDIT_RANGE_NAME = 'Cash!A1:E'

creds = None

async def authenticate(update: Update, context: ContextTypes.DEFAULT_TYPE):
        global creds
        if os.path.exists('./token.json'):
            try:
                creds = Credentials.from_authorized_user_file('token.json', Scopes)
                print(creds)
            except:
                creds = None
                os.remove('token.json')
                print('token removed')
        if not creds or not creds.valid:
            #if creds and creds.expired and creds.refresh_token:
            #    try:
            #        creds.refresh(Request())
            #    except:
            #        os.remove('token.json')
            #else:
            if True:
                #flow = InstalledAppFlow.from_client_secrets_file(
                #    'Antant_credentials.json', Scopes, redirect_uri='urn:ietf:wg:oauth:2.0:oob')
                #auth_url, _ = flow.authorization_url(prompt='consent')
                #LINK = "{}".format(auth_url)
                #txt="Click here!"
                #HTML = "<a href='%s'>%s</a>"%(LINK,txt)
                #await context.bot.send_message(chat_id=update.effective_chat.id, text=HTML ,parse_mode=ParseMode.HTML)
                await update.message.reply_text(
                    "Authentication required!",
                    reply_markup=ReplyKeyboardMarkup.from_button(
                        KeyboardButton(
                            text="Authenticate",
                            web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/authcred"),
                        )
                    ),
                )

async def savetoken(update: Update, context: ContextTypes.DEFAULT_TYPE):
        global creds
        CODE = context.args[0]
        flow = InstalledAppFlow.from_client_secrets_file(
                    'Antant_credentials.json', Scopes, redirect_uri='urn:ietf:wg:oauth:2.0:oob')
        token = flow.fetch_token(code=CODE)
        creds = flow.credentials
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
        creds = Credentials.from_authorized_user_file('token.json', Scopes)
        await context.bot.send_message(chat_id=update.effective_chat.id, text='authentication successful')

async def upname(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text_caps = 'Materials have been uploaded'
    await context.bot.send_message(chat_id=update.effective_chat.id, text=text_caps)

async def send_matform(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print('send_matform')
    #pdict = {'quantity':3,'price':600}
    #jdict = json.dumps(pdict)
    await update.message.reply_text(
        "Material upload",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Add Materials",
                #web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/matform?color=red&price=120&color=black&price=550&",api_kwargs=pdict),
                web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/matForm/matform"),
            )
        ),
    )

async def send_desform(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print('send_desform')
    #pdict = {'quantity':3,'price':600}
    #jdict = json.dumps(pdict)
    await update.message.reply_text(
        "Material design",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Design Materials",
                #web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/matform?color=red&price=120&color=black&price=550&",api_kwargs=pdict),
                web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/desForm/desform"),
            )
        ),
    )

async def send_billform(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print('send_billform')
    if len(context.args) >= 1:
        PhoneNo = context.args[0]
        extender = f"?customerContact={PhoneNo}&"
        ffr = open('custdata.dict','rb')
        custdata = pickle.load(ffr)
        ffr.close()
        try:
            Name = custdata[PhoneNo].replace(' ','%20')
            extender += f"customerName={Name}"
        except KeyError:
            pass
    else:
        extender = ''
    #pdict = {'quantity':3,'price':600}
    #jdict = json.dumps(pdict)
    await update.message.reply_text(
        "Billing Form",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Billing Form",
                #web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/matform?color=red&price=120&color=black&price=550&",api_kwargs=pdict),
                web_app=WebAppInfo(url="https://antant-boutique.github.io/Accountant/customerForm/custform"+extender),
            )
        ),
    )

async def receive_poll_answer(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Summarize a users poll vote"""
    answer = update.poll_answer
    answered_poll = context.bot_data[answer.poll_id]
    ModelNo = answered_poll["model_no"]
    ChatId = answered_poll["chat_id"]
    try:
        prices = answered_poll["prices"]
    # this means this poll answer update is from an old poll, we can't do our answering then
    except KeyError:
        return
    selected_option = answer.option_ids[0]
    price = prices[selected_option]
    txt=AM.setProdPrice(ModelNo,price)
    await context.bot.send_message(chat_id=ChatId, text=txt, parse_mode='Markdown')

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None :
    print('web_app_data')
    data = json.loads(update.effective_message.web_app_data.data)
    formname = data['formname']
    if formname == 'Login Form':
        if data['username']=='admin' and data['password']=='entente':
            flow = InstalledAppFlow.from_client_secrets_file(
                'Antant_credentials.json', Scopes, redirect_uri='urn:ietf:wg:oauth:2.0:oob')
            auth_url, _ = flow.authorization_url(prompt='consent')
            LINK = "{}".format(auth_url)
            txt="Login to authenticate!"
            HTML = "<a href='%s'>%s</a>"%(LINK,txt)
            await context.bot.send_message(chat_id=update.effective_chat.id, text=HTML ,parse_mode=ParseMode.HTML)
        else:
            txt="Username or Password incorrect!"
            await context.bot.send_message(chat_id=update.effective_chat.id, text=txt)
    if formname == 'Material Entry':
        txt=AM.addtxtl(data)
        await context.bot.send_message(chat_id=update.effective_chat.id, text=txt, parse_mode='Markdown')
    if formname == 'Textile Design':
        txt,poll=AM.design(data)
        if poll:
            """Sends a predefined poll"""
            ModelNo = poll[0]
            options = poll[1]
            prices = poll[2]
            questions = [str(opt)+' INR' for opt in options]#["Good", "Really good", "Fantastic", "Great"]
            message = await context.bot.send_poll(
                update.effective_chat.id,
                f"Decide product {ModelNo} price (INR)",
                questions,
                is_anonymous=False,
                allows_multiple_answers=False,
            )
            # Save some info about the poll the bot_data for later use in receive_poll_answer
            payload = {
                message.poll.id: {
                    "model_no": ModelNo,
                    "prices": prices,
                    "message_id": message.message_id,
                    "chat_id": update.effective_chat.id,
                    "answers": 0,
                }
            }
            context.bot_data.update(payload)
        else:
            await context.bot.send_message(chat_id=update.effective_chat.id, text=txt, parse_mode='Markdown')
    if formname == 'Billing':
        OUTPUT = AM.bill(data)
        print(OUTPUT)
        if len(OUTPUT)>2:
            fileTemp = OUTPUT[0]
            ffr = open(fileTemp,'rb')
            await context.bot.send_photo(chat_id=update.effective_chat.id, photo=ffr)
            ffr.close()
            os.remove(fileTemp)
        for txt in OUTPUT[-2:]:
            await context.bot.send_message(chat_id=update.effective_chat.id, text=txt, parse_mode=ParseMode.HTML)
    else:
        await update.message.reply_text("Your data was:")
        for result in data:
            await update.message.reply_text(data[result])

if __name__ == '__main__':
    # TOKEN = '5783157460:AAH6gKOGQCJgS_sQg5W9piRtRRMaUkBDS7I'
    TOKEN_test = '6522402041:AAGaikrK7awj87--4hxadpxe9HpmBdz8qvA'
    application = ApplicationBuilder().token(TOKEN_test).build()

    caps_handler = CommandHandler('upname', upname)
    application.add_handler(caps_handler)
    form1_handler = CommandHandler('matform', send_matform)
    application.add_handler(form1_handler)
    form2_handler = CommandHandler('desform', send_desform)
    application.add_handler(form2_handler)
    form3_handler = CommandHandler('geninvc', send_billform)
    application.add_handler(form3_handler)
    auth_handler = CommandHandler('authenticate', authenticate)
    application.add_handler(auth_handler)
    token_handler = CommandHandler('token', savetoken)
    application.add_handler(token_handler)
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    application.add_handler(PollAnswerHandler(receive_poll_answer))
    application.run_polling()
