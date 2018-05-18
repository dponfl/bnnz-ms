"use strict";

const t = require('../../../../api/services/translate');
const generalServices = require('../../../../api/services/general');
const restLinks = require('../../../../api/services/general').RESTLinks();
const uuid = require('uuid-apikey');
const _ = require('lodash');

const moduleName = 'CoreModuleController:: ';


module.exports = {
  onCallbackQueryScript: function (lang, chatId) {

    const methodName = 'onCallbackQueryScript';

    // console.log('from inside onCallbackQueryScript...');
    // console.log('lang: ' + lang);
    // console.log('chatId: ' + chatId);

    return [

      /**
       * instagram_profile_yes
       */

      {
        req: 'instagram_profile_yes',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'NEW_SUBS_INST_05')}

${t.t(lang, 'NEW_SUBS_INST_06')}
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'PLAN_PLATINUM'),
                callback_data: 'instagram_plan_platinum'
              },
            ],
            [
              {
                text: t.t(lang, 'PLAN_GOLD'),
                callback_data: 'instagram_plan_gold'
              },
            ],
            [
              {
                text: t.t(lang, 'PLAN_BRONZE'),
                callback_data: 'instagram_plan_bronze'
              },
            ],
          ],
        },
      },

      /**
       * instagram_profile_no
       */

      {
        req: 'instagram_profile_no',
        route: restLinks.mgSendForcedMessage,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'NEW_SUBS_INST_01')} 
`,
        },
      },

      /**
       * instagram_plan_platinum: Subscription to Platinum payment plan
       */

      {
        req: 'instagram_plan_platinum',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_PLATINUM_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'PLAN_PAY_BUTTON'),
                callback_data: 'make_payment_plan_platinum'
              },
              {
                text: t.t(lang, 'PLAN_TC_BUTTON'),
                url: 'https://policies.google.com/terms'
              },
            ],
          ],
        },
      },

      /**
       * instagram_plan_gold: Subscription to Gold payment plan
       */

      {
        req: 'instagram_plan_gold',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_GOLD_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'PLAN_PAY_BUTTON'),
                callback_data: 'make_payment_plan_gold'
              },
              {
                text: t.t(lang, 'PLAN_TC_BUTTON'),
                url: 'https://policies.google.com/terms'
              },
            ],
          ],
        },
      },

      /**
       * instagram_plan_bronze - Subscription to Bronze payment plan
       */

      {
        req: 'instagram_plan_bronze',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_BRONZE_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'PLAN_PAY_BUTTON'),
                callback_data: 'make_payment_plan_bronze'
              },
              {
                text: t.t(lang, 'PLAN_TC_BUTTON'),
                url: 'https://policies.google.com/terms'
              },
            ],
          ],
        },
      },

      /**
       * make_payment_plan_platinum - Confirmation of Platinum plan payment
       */

      {
        req: 'make_payment_plan_platinum',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_PLATINUM_THANKS_MSG_02')} 

${t.t(lang, 'PLAN_THANKS_MSG_02')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'POST_UPLOAD_BUTTON'),
                callback_data: 'upload_post'
              },
            ],
          ],
        },
      },

      /**
       * make_payment_plan_gold - Confirmation of Gold plan payment
       */

      {
        req: 'make_payment_plan_gold',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_GOLD_THANKS_MSG_02')} 

${t.t(lang, 'PLAN_THANKS_MSG_02')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'POST_UPLOAD_BUTTON'),
                callback_data: 'upload_post'
              },
            ],
          ],
        },
      },

      /**
       * make_payment_plan_bronze - Confirmation of Bronze plan payment
       */

      {
        req: 'make_payment_plan_bronze',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'PLAN_BRONZE_THANKS_MSG_02')} 

${t.t(lang, 'PLAN_THANKS_MSG_02')} 
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'POST_UPLOAD_BUTTON'),
                callback_data: 'upload_post'
              },
            ],
          ],
        },
      },

      /**
       * make_next_payment
       */

      {
        req: 'make_next_payment',
        route: restLinks.mgSendInlineButtons,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'NEW_SUBS_INST_07')}
`,
          inline_keyboard: [
            [
              {
                text: t.t(lang, 'PLAN_PLATINUM'),
                callback_data: 'instagram_plan_platinum'
              },
            ],
            [
              {
                text: t.t(lang, 'PLAN_GOLD'),
                callback_data: 'instagram_plan_gold'
              },
            ],
            [
              {
                text: t.t(lang, 'PLAN_BRONZE'),
                callback_data: 'instagram_plan_bronze'
              },
            ],
          ],        },
      },

      /**
       * upload_post - Load Instagram post
       */

      {
        req: 'upload_post',
        route: restLinks.mgSendForcedMessage,
        params: {
          messenger: 'telegram',
          chatId: chatId,
          html: `
${t.t(lang, 'POST_UPLOAD')} 
`,
        },
      },

      // /**
      //  * _____
      //  */
      //
      // {
      //   req: '',
      //   route: '',
      //   params: {
      //
      //   },
      // },

    ];
  }, // onCallbackQueryScript

  onMessageStart: function (msg, lang) {

    const methodName = 'onMessageStart';

    let res = {};

    let result = _.trim(msg.text).match(/\/start\s*ref(=|\s?)(.+)/i);

    if (result) {

      res.params = {
        messenger: 'telegram',
        guid: uuid.create().uuid,
        chatId: msg.chat.id,
        firstName: msg.chat.first_name || '',
        lastName: msg.chat.last_name || '',
        userName: msg.chat.username,
        date: msg.date,
        text: result[0],
        ref: result[2],
        lang: lang,
      };

    } else {

      // w/o referral code

      res.params = {
        messenger: 'telegram',
        guid: uuid.create().uuid,
        chatId: msg.chat.id,
        firstName: msg.chat.first_name || '',
        lastName: msg.chat.last_name || '',
        userName: msg.chat.username,
        date: msg.date,
        text: '/start',
        ref: '',
        lang: lang,
      };

    }

    res.route = restLinks.start;

    return res;

  }, // onMessageStart

  onMessageHelp: function (msg, lang) {

    const methodName = 'onMessageHelp';

    let res = {};

    res.params = {
      messenger: 'telegram',
      chatId: msg.chat.id,
      lang: lang,
    };

    res.route = restLinks.help;

    return res;

  }, // onMessageHelp

  onMessageNewInstagramAccount: function (msg, lang) {

    const methodName = 'onMessageNewInstagramAccount';

    let res = {};

    let instUrl = 'https://www.instagram.com/' + _.trim(msg.text);
    let instConfHtml = `
${t.t(lang, 'NEW_SUBS_INST_02')}
<a href="${instUrl}">${instUrl}</a>
`;

    res.params = {
      messenger: 'telegram',
      chatId: msg.chat.id,
      html: instConfHtml,
      inline_keyboard: [
        [
          {
            text: t.t(lang, 'ACT_YES'),
            callback_data: 'instagram_profile_yes'
          },
          {
            text: t.t(lang, 'ACT_NO'),
            callback_data: 'instagram_profile_no'
          }
        ],
      ],
    };

    res.route = restLinks.mgSendInlineButtons;

    return res;

  }, // onMessageNewInstagramAccount

  onMessageNewInstagramPost: function (msg, lang) {

    const methodName = 'onMessageNewInstagramPost';

    let res = {};

    /**
     * check that the provided Instagram link is correct
     */

    let instagramRegexp = new RegExp(restLinks.trueInstagram);

    if (!instagramRegexp.test(_.trim(msg.text.toLowerCase()))) {

      let html = `${t.t(lang, 'MSG_FORCED_WRONG_INST')}`;

      res.params = {
        messenger: 'telegram',
        chatId: msg.chat.id,
        html: html,
        inline_keyboard: [
          [
            {
              text: t.t(lang, 'ACT_NEW_POST'),
              callback_data: 'upload_post'
            },
          ],
        ],
      };

      res.route = restLinks.mgSendInlineButtons;

      return res;
    }

    /**
     * As the link is OK we can proceed with sending post to the chat
     */

    let instPostUrl = _.trim(msg.text);
    let instPostHtml = `
${t.t(lang, 'POST_UPLOAD_MSG')}
<a href="${instPostUrl}">${instPostUrl}</a>
`;

    res.route = restLinks.mgSendSimpleMessage;
    res.params = {
      messenger: 'telegram',
      html: instPostHtml,
    };
    let postSenderChatId = msg.chat.id;

    // Send messages to all superClients except the one who made Inst post

    _.forEach(sails.config.superClients, async (c) => {

      // console.log('c.chatId: ' + c.chatId +
      // ' postSenderChatId: ' + postSenderChatId);

      if (c.chatId != postSenderChatId) {

        // console.log('c.chatId != postSenderChatId');

        try {
          res.params.chatId = c.chatId;

          // console.log('sending message to ' + res.params.chatId);
          // console.log('res.params:');
          // console.dir(res.params);

          await generalServices.sendREST('POST', res.route, res.params);

        }
        catch (err) {
          console.log(moduleName + methodName + ', Error:');
          console.log('statusCode: ' + err.statusCode);
          console.log('message: ' + err.message);
          console.log('error: ');
          console.dir(err.error);
          console.log('options: ');
          console.dir(err.options);
        }
      }
    });

    (async () => {

      // Sending inline keyboard

      let keyboardMsgHtml = `
${t.t(lang, 'MSG_KEYBOARD')}
`;

      res.route = restLinks.mgSendInlineButtons;
      res.params = {
        messenger: 'telegram',
        chatId: msg.chat.id,
        html: keyboardMsgHtml,
        inline_keyboard: [
          [
            {
              text: t.t(lang, 'POST_UPLOAD_BUTTON'),
              callback_data: 'upload_post'
            },
          ],
          [
            {
              text: t.t(lang, 'ACT_PAY'),
              callback_data: 'make_next_payment'
            },
          ],
        ],
      };

      await generalServices.sendREST('POST', res.route, res.params);
    })();

    return false;

  }, // onMessageNewInstagramPost


};