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

    let route ='';
    let params = {};
    let sendREST = false;
    let html = '';

    console.log('telegramListener::onCallbackQuery, query:');
    console.dir(query);

    if (query.data == 'instagram_profile_yes') {

      // route = '/mg/sendsimplemessage';
      // params = {
      //   messenger: 'telegram',
      //   chatId: query.message.chat.id,
      //   html: t.t('NEW_SUBS_INST_03'),
      // };

      html = `
${t.t('NEW_SUBS_INST_05')}

${t.t('NEW_SUBS_INST_06')}
`;

      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('PLAN_PLATINUM'),
              callback_data: 'instagram_plan_platinum'
            },
          ],
          [
            {
              text: t.t('PLAN_GOLD'),
              callback_data: 'instagram_plan_gold'
            },
          ],
          [
            {
              text: t.t('PLAN_BRONZE'),
              callback_data: 'instagram_plan_bronze'
            },
          ],
        ],
      };

      sendREST = true;

    } else if (query.data == 'instagram_profile_no') {

    // Request to enter Instagram profile

      html = `
${t.t('NEW_SUBS_INST_01')} 
`;
      route = '/mg/sendforcedmessage';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
      };

      sendREST = true;

    } else if (query.data == 'instagram_plan_platinum') {

      // Subscription to Platinum payment plan

      html = `
${t.t('PLAN_PLATINUM_THANKS_MSG')} 

${t.t('PLAN_THANKS_MSG')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('PLAN_PAY_BUTTON'),
              callback_data: 'make_payment_plan_platinum'
            },
            {
              text: t.t('PLAN_TC_BUTTON'),
              url: 'https://policies.google.com/terms'
            },
          ],
        ],
      };

      sendREST = true;

    } else if (query.data == 'instagram_plan_gold') {

      // Subscription to Gold payment plan

      html = `
${t.t('PLAN_GOLD_THANKS_MSG')} 

${t.t('PLAN_THANKS_MSG')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('PLAN_PAY_BUTTON'),
              callback_data: 'make_payment_plan_gold'
            },
            {
              text: t.t('PLAN_TC_BUTTON'),
              url: 'https://policies.google.com/terms'
            },
          ],
        ],
      };

      sendREST = true;

    } else if (query.data == 'instagram_plan_bronze') {

      // Subscription to Bronze payment plan

      html = `
${t.t('PLAN_BRONZE_THANKS_MSG')} 

${t.t('PLAN_THANKS_MSG')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('PLAN_PAY_BUTTON'),
              callback_data: 'make_payment_plan_bronze'
            },
            {
              text: t.t('PLAN_TC_BUTTON'),
              url: 'https://policies.google.com/terms'
            },
          ],
        ],
      };

      sendREST = true;

    } else if (query.data == 'make_payment_plan_platinum') {

      // Confirmation of Platinum plan payment

      html = `
${t.t('PLAN_PLATINUM_THANKS_MSG_02')} 

${t.t('PLAN_THANKS_MSG_02')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('POST_UPLOAD_BUTTON'),
              callback_data: 'upload_post'
            },
          ],
        ],

      };

      sendREST = true;

    } else if (query.data == 'make_payment_plan_gold') {

      // Confirmation of Gold plan payment

      html = `
${t.t('PLAN_GOLD_THANKS_MSG_02')} 

${t.t('PLAN_THANKS_MSG_02')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('POST_UPLOAD_BUTTON'),
              callback_data: 'upload_post'
            },
          ],
        ],

      };

      sendREST = true;

    } else if (query.data == 'make_payment_plan_bronze') {

      // Confirmation of Bronze plan payment

      html = `
${t.t('PLAN_BRONZE_THANKS_MSG_02')} 

${t.t('PLAN_THANKS_MSG_02')} 
`;
      route = '/mg/sendinlinebuttons';
      params = {
        messenger: 'telegram',
        chatId: query.message.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t('POST_UPLOAD_BUTTON'),
              callback_data: 'upload_post'
            },
          ],
        ],

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

      /**
       * lang command
       */

      let result = _.trim(msg.text).match(/\/lang(=|\s?)(en|ru)/i);

      console.log('telegramListener, check /lang, result:');
      console.dir(result);

      if (result) {
        t.setLang(result[2]);

        route = '/mg/sendsimplemessage';
        params = {
          messenger: 'telegram',
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
        // case 'Reply with your Instagram account':
        case t.t('NEW_SUBS_INST_01'):

          // Check that the client provided Instagram account

          let instUrl = 'https://www.instagram.com/' + _.trim(msg.text);
          let instConfHtml = `
${t.t('NEW_SUBS_INST_02')}
<a href="${instUrl}">${instUrl}</a>
`;

          route = '/mg/sendinlinebuttons';
          params = {
            messenger: 'telegram',
            chatId: msg.chat.id,
            html: instConfHtml,
            inline_keyboard: [
              [
                {
                  text: t.t('ACT_YES'),
                  callback_data: 'instagram_profile_yes'
                },
                {
                  text: t.t('ACT_NO'),
                  callback_data: 'instagram_profile_no'
                }
              ],
            ],
          };

          sendREST = true;

          break;
        case 'Other reply':

          route = '/mg/sendsimplemessage';
          params = {
            messenger: 'telegram',
            chatId: msg.chat.id,
            html: 'Got other reply: '
            + msg.text,
          };

          sendREST = true;

          break;
        default:

          route = '/mg/sendsimplemessage';
          params = {
            messenger: 'telegram',
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

      route = '/mg/sendsimplemessage';
      params = {
        messenger: 'telegram',
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
