/**
 * MessageBrokerTelegramController
 *
 * @description :: Server-side logic for managing messegebrokertelegrams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const messageGatewayServices = require('../../api/services/messageGateway');

const bot = messageGatewayServices.getTelegramBot();

module.exports = {
	sendSimpleMessage: function (req, res) {

    let params = req.allParams();

    console.log('MessageBrokerTelegramController::sendSimpleMessage, params:');
    console.dir(params);

    (async () => {
      try {
        await bot.sendMessage(params.chatId, params.html, {
          parse_mode: 'HTML',
        });
      } catch (err) {
        console.log('MessageBrokerTelegramController::sendSimpleMessage, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();

    res.json(200);

  }, // sendSimpleMessage

	sendForceMessage: function (req, res) {

    let params = req.allParams();

    console.log('MessageBrokerTelegramController::sendForceMessage, params:');
    console.dir(params);

    (async () => {
      try {
        await bot.sendMessage(params.chatId, params.html, {
          parse_mode: 'HTML',
          reply_markup: {
            force_reply: true
          }
        });
      } catch (err) {
        console.log('MessageBrokerTelegramController::sendForceMessage, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();

    res.json(200);

  }, // sendForceMessage

  sendInlineButtons: function (req, res) {

    let params = req.allParams();

    console.log('MessageBrokerTelegramController::sendInlineButtons, params:');
    console.dir(params);

    let html = `
    <b>Hello, ${params.firstName + ' ' + params.lastName}</b>
    <i>${params.text}</i>
    <b>guid of your message is: ${params.guid}</b>
    <a href="https://www.instagram.com/webstudiopro/">Have a look at this profile</a>
`;

    (async () => {
      try {
        await bot.sendMessage(params.chatId, html, {
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
        });
      } catch (err) {
        console.log('MessageBrokerTelegramController::sendInlineButtons, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();

    res.json(200);

  }, // sendInlineButtons
};

