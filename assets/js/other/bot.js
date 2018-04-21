(function () {
  'use strict';

  console.log('bot.js is running...');
  console.dir(sails.config.TOKEN);

  const TelegramBot = require('node-telegram-bot-api');

  const bot = new TelegramBot(sails.config.TOKEN, {
    polling: true
  });



  bot.on('message', (msg) => {

    const html = `
    <b>Hello, ${msg.from.first_name}</b>
    <i>Some text here...</i>
    <a href="https://www.instagram.com/webstudiopro/">Have a look at this profile</a>
`;

    console.log('Bot got message:');
    console.dir(msg);

    bot.sendMessage(msg.chat.id, html, {
      parse_mode: 'HTML'
    })
      .then(() => {
        console.log('Message has been sent...');
      })
      .catch((err) => {
        console.error(err);
      })
  });



})();

