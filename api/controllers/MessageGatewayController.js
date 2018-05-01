/**
 * MessageGatewayController
 *
 * @description :: Server-side logic for managing Messagegateways
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const messageGatewayServices = require('../../api/services/messageGateway');

const botTelegram = messageGatewayServices.getTelegramBot();

module.exports = {
  sendInlineButtons: function (req, res) {
    let params = req.allParams();
    let bot;

    console.log('MessageGatewayController::sendInlineButtons, params:');
    console.dir(params);

    let html = `
    <b>Hello, ${params.firstName + ' ' + params.lastName}</b>
    <i>${params.text}</i>
    <b>guid of your message is: ${params.guid}</b>
    <a href="https://www.instagram.com/webstudiopro/">Have a look at this profile</a>
`;

    switch (params.messenger) {
      case 'telegram' :
        bot = botTelegram;
        break;
      case 'facebook':
        break;
    }

    (async () => {
      bot.sendMessage(params.chatId, html, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Google',
                url: 'https://google.com'
              }
            ],
            [
              {
                text: 'I like it :)',
                callback_data: 'like'
              },
              {
                text: 'I don\'t like it :(',
                callback_data: 'dislike'
              }
            ],
            [
              {
                text: 'Provide your Instagram account',
                callback_data: 'instagram'
              },
              {
                text: 'Other reply',
                callback_data: 'other'
              }
            ]
          ]
        }
      })
    })();

    res.json(200);

  }, // sendInlineButtons
};

