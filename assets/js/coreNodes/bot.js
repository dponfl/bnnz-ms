(function () {
  'use strict';

  const rest = require('../../../api/services/general');

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
      });


    console.log('Requesting some controller...');


    // console.log('11111111111111111');



    (async () => {
      try {

        let results = await Promise.all([
          rest.sendREST('POST', '/core/newsubscription/start', '01 => ' + msg.text),
          rest.sendREST('POST', '/core/newsubscription/startone', '02 => ' + msg.text)
        ]);

        // let result01 = await rest.sendREST('POST', '/core/newsubscription/start', '01 => ' + msg.text);
        // let result02 = await rest.sendREST('POST', '/core/newsubscription/startone', '02 => ' + msg.text);
        // let results = [];
        // results.push(result01);
        // results.push(result02);

        // console.log('444444444444444');

        console.log('Results:');
        console.dir(results);

      } catch (err) {

        console.log('Error received:');
        console.error(err);

      }
    })();


    // console.log('55555555555555555');


  });

})();

