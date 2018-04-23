(function () {
  'use strict';

  const rp = require('request-promise');

  const host = 'http://localhost:1337';

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




    console.log('11111111111111111');


    var options02 = {
      method: 'POST',
      uri: host + '/core/newsubscription/startone',
      body: {
        param: '02 => ' + msg.text
      },
      json: true
    };

    console.log('2222222222222222');


    var options01 = {
      method: 'POST',
      uri: host + '/core/newsubscription/start',
      body: {
        param: '01 => ' + msg.text
      },
      json: true
    };

    console.log('333333333333333');


    (async () => {
      try {

        // let results = await Promise.all([rp(options01), rp(options02)]);
        let result01 = await rp(options01);
        let result02 = await rp(options02);

        let results = [];

        results.push(result01);
        results.push(result02);

        console.log('Results:');
        console.dir(results);

      } catch (err) {

        console.log('Error received:');
        console.error(err);

      }
    })();


    console.log('444444444444444444');


  });

})();

