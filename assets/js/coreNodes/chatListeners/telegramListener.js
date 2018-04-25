"use strict";

const serviceGeneral = require('../../../../api/services/general');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(sails.config.TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

onStartCommand();

/**
 * Functions
 */

function onStartCommand() {

  bot.onText(/ref(=|\s?)(.+)/, (msg, [source, match1, match2]) => {

    // source = 'ref ABC=123' for '/ref ABC=123' command
    // match = 'ABC=123' for '/ref ABC=123' command

    console.log('Bot got the following message:');
    console.dir(msg);

    console.log('Bot got ref command with source:');
    console.dir(source);

    console.log('Bot got ref command with match:');
    console.dir(match1);
    console.dir(match2);

    // collect info to be sent to proceedStartCommand
    let params = {
      chatId: msg.chat.id,
      firstName: msg.chat.first_name || '',
      lastName: msg.chat.last_name || '',
      userName: msg.chat.username,
      date: msg.date,
      text: source,
      ref: match2,
    };

    console.log('11111111111111111111111111111111111111111111111111');

    (async () => {
      try {

        let results = await serviceGeneral.sendREST('POST', '/core/newsubscription/start', params);
        console.log('Results:');
        console.dir(results);

      } catch (err) {

        console.log('Error received:');
        console.error(err);

      }

      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    })();

    console.log('22222222222222222222222222222222222222222222222222');

  });

} // onStartCommand