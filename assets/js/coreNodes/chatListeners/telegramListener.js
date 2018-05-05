"use strict";

const generalServices = require('../../../../api/services/general');
const t = require('../../../../api/services/translate');

const messageGatewayServices = require('../../../../api/services/messageGateway');

const uuid = require('uuid-apikey');
const _ = require('lodash');

const bot = messageGatewayServices.getTelegramBot();

t.setLang('ru');

onCallbackQuery();

onMessage();

/**
 * Functions
 */

function onCallbackQuery() {

  bot.on('callback_query', query => {

    t.setLang('ru');

    let route;
    let params;
    let sendREST = false;

    console.log('telegramListener::onCallbackQuery, query:');
    console.dir(query);

    let html = `
    <b>We received from you the following reply:</b>
    <i>${query.data}</i>
`;

    if (query.data == 'instagram') {

      route = '/mbt/sendforcedmessage';
      params = {
        chatId: query.message.chat.id,
        html: 'Reply with your Instagram account',
      };

      sendREST = true;

    } else if (query.data == 'other') {

      route = '/mbt/sendforcedmessage';
      params = {
        chatId: query.message.chat.id,
        html: 'Other reply',
      };
      sendREST = true;

    } else {

      route = '/mbt/sendsimplemessage';
      params = {
        chatId: query.message.chat.id,
        html: html,
      };

      sendREST = true;

    }

    (async () => {

      try {

        await bot.answerCallbackQuery(query.id);

        if (sendREST) {
          await generalServices.sendREST('POST', route, params);
        }

      } catch (err) {
        console.log('telegramListener::onCallbackQuery, Error:');
        console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        console.log('error: ');
        console.dir(err.error);
        console.log('options: ');
        console.dir(err.options);
      }
    })();

  })

} // onCallbackQuery

function onMessage() {
  bot.on('message', (msg) => {

    let route;
    let params;
    let sendREST = false;

    console.log('telegramListener::onMessage, message:');
    console.dir(msg);



    if (/\/start/i.test(_.trim(msg.text))) {

      /**
       * Start command
       */

      console.log('telegramListener::onMessage, got start command');

      sendREST = true;

      let result = _.trim(msg.text).match(/\/start\s*ref(=|\s?)(.+)/i);

      if (result) {

        // with referral code

        params = {
          messenger: 'telegram',
          guid: uuid.create().uuid,
          chatId: msg.chat.id,
          firstName: msg.chat.first_name || '',
          lastName: msg.chat.last_name || '',
          userName: msg.chat.username,
          date: msg.date,
          text: result[0],
          ref: result[2],
        };

      } else {

        // w/o referral code

        params = {
          messenger: 'telegram',
          guid: uuid.create().uuid,
          chatId: msg.chat.id,
          firstName: msg.chat.first_name || '',
          lastName: msg.chat.last_name || '',
          userName: msg.chat.username,
          date: msg.date,
          text: '/start',
          ref: '',
        };

      }

      route = '/core/newsubscription/start';

    } else if (/\/lang/i.test(_.trim(msg.text))) {
      let result = _.trim(msg.text).match(/\/lang(=|\s?)(en|ru)/i);

      console.log('telegramListener, check /lang, result:');
      console.dir(result);

      if (result) {
        t.setLang(result[2]);

        route = '/mbt/sendsimplemessage';
        params = {
          chatId: msg.chat.id,
          html: `${t.t('CMD_LANG')}` + `${t.t('CMD_LANG_' + result[2].toUpperCase())}`,
        };

        sendREST = true;
      }
    } else if (!_.isNil(msg.reply_to_message)
      && !_.isNil(msg.reply_to_message.text)) {

      /**
       * Reply to message
       */

      switch (msg.reply_to_message.text) {
        case 'Reply with your Instagram account':

          route = '/mbt/sendsimplemessage';
          params = {
            chatId: msg.chat.id,
            html: 'Got a reply to Instagram account request: '
            + msg.text,
          };

          sendREST = true;

          break;
        case 'Other reply':

          route = '/mbt/sendsimplemessage';
          params = {
            chatId: msg.chat.id,
            html: 'Got other reply: '
            + msg.text,
          };

          sendREST = true;

          break;
        default:

          route = '/mbt/sendsimplemessage';
          params = {
            chatId: msg.chat.id,
            html: 'Got some reply: '
            + msg.text,
          };

          sendREST = true;

      }

    } else {

      /**
       * Generic message
       */

      route = '/mbt/sendsimplemessage';
      params = {
        chatId: msg.chat.id,
        html: `${t.t('MSG_GENERAL')}: `
        + msg.text,
      };

      sendREST = true;


    }

    if (sendREST) {
      (async () => {
        try {

          await generalServices.sendREST('POST', route, params);

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
    }
  })
} // onMessage
