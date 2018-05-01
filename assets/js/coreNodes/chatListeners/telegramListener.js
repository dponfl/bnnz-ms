"use strict";

const generalServices = require('../../../../api/services/general');
const messageGatewayServices = require('../../../../api/services/messageGateway');

const uuid = require('uuid-apikey');
const _ = require('lodash');

// const TelegramBot = require('node-telegram-bot-api');
//
// const bot = new TelegramBot(sails.config.TOKEN, {
//   polling: {
//     interval: 300,
//     autoStart: true,
//     params: {
//       timeout: 10
//     }
//   }
// });

const bot = messageGatewayServices.getTelegramBot();

onStartCommand();

onCallbackQuery();

onMessage();

/**
 * Functions
 */

function onStartCommand() {

  bot.onText(/start\s*ref(=|\s?)(.+)/, (msg, [source, match1, match2]) => {

    // source = 'start ref=ABC123' for '/start ref=ABC123' command
    // match2 = 'ABC123' for '/start ref=ABC123' or /start ref ABC123 command

    console.log('Bot got such message:');
    console.dir(msg);

    console.log('Bot got ref command with such source:');
    console.dir(source);

    console.log('Bot got ref command such match:');
    console.dir(match1);
    console.dir(match2);

    // collect info to be sent to proceedStartCommand
    let params = {
      messenger: 'telegram',
      guid: uuid.create().uuid,
      chatId: msg.chat.id,
      firstName: msg.chat.first_name || '',
      lastName: msg.chat.last_name || '',
      userName: msg.chat.username,
      date: msg.date,
      text: source,
      ref: match2,
    };

    (async () => {

      try {
        await makeNewSubscriptionRequest(params);
      } catch (err) {
        console.log('telegramListener::onStartCommand, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();
  });

  bot.onText(/start$/, (msg, [source]) => {

    // source = 'start' for '/start' command

    console.log('Bot got such message:');
    console.dir(msg);

    console.log('Bot got ref command with such source:');
    console.dir(source);


    // collect info to be sent to proceedStartCommand
    let params = {
      messenger: 'telegram',
      guid: uuid.create().uuid,
      chatId: msg.chat.id,
      firstName: msg.chat.first_name || '',
      lastName: msg.chat.last_name || '',
      userName: msg.chat.username,
      date: msg.date,
      text: source,
      ref: '',
    };

    (async () => {

      try {
        await makeNewSubscriptionRequest(params);
      } catch (err) {
        console.log('telegramListener::onStartCommand, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();

  });

} // onStartCommand

function onCallbackQuery() {

  bot.on('callback_query', query => {

    console.log('telegramListener::onCallbackQuery, query:');
    console.dir(query);

    (async () => {

      let html = `
    <b>We received from you the following reply:</b>
    <i>${query.data}</i>
`;

      await bot.answerCallbackQuery(query.id);

      if (query.data == 'instagram') {
        await bot.sendMessage(query.message.chat.id, 'Reply with your Instagram account', {
          reply_markup: {
            force_reply: true
          }
        })
      } else if (query.data == 'other') {
        await bot.sendMessage(query.message.chat.id, 'Other reply', {
          reply_markup: {
            force_reply: true
          }
        })
      } else {
        await bot.sendMessage(query.message.chat.id, html, {
          parse_mode: 'HTML'
        })
      }
    })();

  })

} // onCallbackQuery

function onMessage() {
  bot.on('message', (msg) => {
    console.log('telegramListener::onMessage, message:');
    console.dir(msg);

    (async () => {
      try {
        if (!_.isNil(msg.reply_to_message) && !_.isNil(msg.reply_to_message.text)) {
          switch (msg.reply_to_message.text) {
            case 'Reply with your Instagram account':
              await bot.sendMessage(msg.chat.id, 'Got a reply to Instagram account request: '
                + msg.text);
              break;
            case 'Other reply':
              await bot.sendMessage(msg.chat.id, 'Got other reply: '
                + msg.text);
              break;
            default:
              await bot.sendMessage(msg.chat.id, 'Got some reply: '
                + msg.text);
          }
        } else {
          await bot.sendMessage(msg.chat.id, 'Got message: '
            + msg.text);
        }
      } catch (err) {
        console.log('telegramListener::onMessage, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();



  })
} // onMessage

function makeNewSubscriptionRequest(params) {

      return generalServices.sendREST('POST', '/core/newsubscription/start', params);

} // makeNewSubscriptionRequest