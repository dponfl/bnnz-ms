"use strict";

const generalServices = require('../../../../api/services/general');
const messageGatewayServices = require('../../../../api/services/messageGateway');

const uuid = require('uuid-apikey');

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

    makeNewSubscriptionRequest(params);

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

    makeNewSubscriptionRequest(params);

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

      await bot.answerCallbackQuery(query.id, `${query.data}`);

      await bot.sendMessage(query.message.chat.id, html, {
        parse_mode: 'HTML'
      })

    })();

  })

} // onCallbackQuery

async function makeNewSubscriptionRequest(params) {
    try {

      let results = await generalServices.sendREST('POST', '/core/newsubscription/start', params);
      console.log('Results:');
      console.dir(results);

    } catch (err) {

      console.log('Error received:');
      console.log('statusCode: ' + err.statusCode);
      console.log('message: ' + err.message);
      console.log('error: ');
      console.dir(err.error);
      console.log('options: ');
      console.dir(err.options);
    }

} // makeNewSubscriptionRequest