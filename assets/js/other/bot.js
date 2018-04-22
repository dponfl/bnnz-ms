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

    // console.log('111111111111');
    //
    // var p1 = new Promise(function (resolve, reject) {
    //   sails.request('POST /core/newsubscription/start', {param: 'start'},
    //     function (err, res, body) {
    //
    //       if (err) {
    //         reject(err);
    //       }
    //
    //       resolve(body);
    //     });
    // });
    //
    //
    // var p2 = new Promise(function (resolve, reject) {
    //   sails.request('POST /core/newsubscription/startone', {param: 'startone'},
    //     function (err, res, body) {
    //
    //       if (err) {
    //         reject(err);
    //       }
    //
    //       resolve(body);
    //     });
    // });
    //
    // console.log('2222222222222222');
    //
    //
    //
    // console.log('333333333333333');
    //
    // p1
    //   .then(function (resolve) {
    //     console.log('p1: resolve');
    //     console.dir(resolve);
    //   })
    //   .catch(function (err) {
    //     console.log('p1: reject');
    //     console.dir(err);
    //   });
    //
    // console.log('44444444444444444');
    //
    //
    // p2
    //   .then(function (resolve) {
    //     console.log('p2: resolve');
    //     console.dir(resolve);
    //   })
    //   .catch(function (err) {
    //     console.log('p2: reject');
    //     console.dir(err);
    //   });
    //
    // console.log('555555555555555555');
    //
    // Promise.race([p1, p2])
    //   .then(function (results) {
    //     console.log('results:');
    //     console.dir(results);
    //   });


    console.log('11111111111111111');


    var options02 = {
      method: 'POST',
      uri: host + '/core/newsubscription/startone',
      body: {
        param: 'startone'
      },
      json: true
    };

    console.log('2222222222222222');


    var options01 = {
      method: 'POST',
      uri: host + '/core/newsubscription/start',
      body: {
        param: 'start'
      },
      json: true
    };

    console.log('333333333333333');


    // rp(options01)
    //   .then(function (body) {
    //     console.log('body 01:');
    //     console.dir(body);
    //   })
    //   .catch(function (err) {
    //     console.log('err 01:');
    //     console.dir(err);
    //   });
    //
    // console.log('44444444444444');
    //
    //
    // rp(options02)
    //   .then(function (body) {
    //     console.log('body 02:');
    //     console.dir(body);
    //   })
    //   .catch(function (err) {
    //     console.log('err 02:');
    //     console.dir(err);
    //   });


    Promise.all([rp(options01), rp(options02)])
      .then(function (results) {
        console.log('results:');
        console.dir(results);
      })
      .catch(function (err) {
        console.log('Error received:');
        console.dir(err.message);
      });


    console.log('555555555555555');




  });



})();

