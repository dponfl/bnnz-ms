"use strict";

const generalServices = require('../../../../api/services/general');
const storageGatewayServices = require('../../../../api/services/storageGateway');

const t = require('../../../../api/services/translate');

const messageGatewayServices = require('../../../../api/services/messageGateway');

const convScript = require('./telegramListenerConvScript');

const uuid = require('uuid-apikey');
const _ = require('lodash');

const bot = messageGatewayServices.getTelegramBot();

const moduleName = 'telegramListener:: ';

let useLang = 'en';

onCallbackQuery();

onMessage();

/**
 * Functions
 */

function getUserLang(data) {

  const methodName = 'getUserLang';

  if (!_.isNil(data.from.language_code)) {

    // console.log('getUserLang, data.from.language_code: ' + data.from.language_code);

    let res = data.from.language_code.match(/ru|en/i);

    // console.log('getUserLang, res:');
    // console.dir(res);

    if (res && res[0]) {
      useLang = res[0];
    }

  }

} // getUserLang

function onCallbackQuery() {

  const methodName = 'onCallbackQuery';

  bot.on('callback_query', query => {

    let route ='';
    let params = {};
    let sendREST = false;

    console.log(moduleName + methodName + ', query:');
    console.dir(query);

    getUserLang(query);

    (async () => {

      // console.log('inside async...');
      // console.log('useLang: ' + useLang);
      // console.log('query:');
      // console.dir(query);

      try {

        await bot.answerCallbackQuery(query.id);

        let queryScript = {};

        if (query.data == 'make_payment_plan_platinum'
          || query.data == 'make_payment_plan_gold'
          || query.data == 'make_payment_plan_bronze'
          || query.data == 'instagram_profile_yes') {

          let listProfiles = '';

          _.forEach(sails.config.superProfiles, (el) => {
            let listElem = `"https://instagram.com/${el}"`;
            listProfiles = listProfiles +
              `<a href=${listElem}>${el}</a>
`;
          });

          queryScript = await convScript.onCallbackQueryScript(useLang, query.message.chat.id, listProfiles);

        } else {

          queryScript = await convScript.onCallbackQueryScript(useLang, query.message.chat.id);

        }

        queryScript.map((elem) => {
          if (elem.req == query.data) {
            route = elem.route;
            params = elem.params;
            sendREST = true;
          }
        });

        if (sendREST) {
          await generalServices.sendREST('POST', route, params);
        }

      } catch (err) {
        console.log(moduleName + methodName + ', Error:');
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

  const methodName = 'onMessage';

  bot.on('message', (msg) => {

    let result;
    let sendREST = false;
    let REST = {
      route: '',
      params: {},
    };

    console.log(moduleName + methodName + ', message:');
    console.dir(msg);

    getUserLang(msg);

    (async () => {

      try {

        /**
         * Start command
         */

        if (/\/start/i.test(_.trim(msg.text))) {

          console.log(moduleName + methodName + ', got start command');

          REST = convScript.onMessageStart(msg, useLang);

          sendREST = true;

        }

        /**
         * Set language
         */

        // else if (/\/lang/i.test(_.trim(msg.text))) {
        //
        //   /**
        //    * lang command
        //    */
        //
        //   let result = _.trim(msg.text).match(/\/lang(=|\s?)(en|ru)/i);
        //
        //   console.log(moduleName + methodName + ', check /lang, result:');
        //   console.dir(result);
        //
        //   if (result) {
        //     // t.setLang(result[2]);
        //
        //     useLang = result[2];
        //
        //     REST.route = '/mg/sendsimplemessage';
        //     REST.params = {
        //       messenger: 'telegram',
        //       chatId: msg.chat.id,
        //       html: `${t.t(useLang, 'CMD_LANG')}` + `${t.t(useLang, 'CMD_LANG_' + result[2].toUpperCase())}`,
        //     };
        //
        //     sendREST = true;
        //   }
        // }

        /**
         * Help command
         */

        else if (/\/help/i.test(_.trim(msg.text))) {

          console.log(moduleName + methodName + ', got help command');

          REST = convScript.onMessageHelp(msg, useLang);

          sendREST = true;

        }

        /**
         * Reply to forced messages
         */

        else if (!_.isNil(msg.reply_to_message)
          && !_.isNil(msg.reply_to_message.text)) {

          switch (msg.reply_to_message.text) {

            /**
             * case 'Reply with your Instagram account'
             */

            case t.t(useLang, 'NEW_SUBS_INST_01'):

              console.log(moduleName + methodName + ', got reply with Instagram account');

              sails.log.info(moduleName + methodName + ', got reply with Instagram account', msg);

              (async () => {

                let clientExistsResult = await generalServices.clientExists({chatId: msg.chat.id});

                if (!_.isNil(clientExistsResult.code) && clientExistsResult.code == 200) {
                  sails.log.warn('!!!!!!!!!!!!!! clientExistsResult.data: ', clientExistsResult.data);

                  let clientUpdateResult = await storageGatewayServices.clientUpdate({id: clientExistsResult.data.id}, {inst_profile: msg.text, profile_provided: true});

                  sails.log.warn('!!!!!!!!!!!!!!!! clientUpdateResult: ', clientUpdateResult);

                  if (!_.isNil(clientUpdateResult.code) && clientUpdateResult.code == 200) {

                    sails.log.warn('111111111111111111111111111111111111111');
                    REST = convScript.onMessageNewInstagramAccount(msg, useLang);
                    sendREST = true;

                    result = await generalServices.sendREST('POST', REST.route, REST.params);

                    console.log('REST request and result:');
                    console.log('Request:');
                    console.dir(REST);
                    console.log('Response:');
                    console.dir(result);
                  }

                }

              })();
              break;

            case t.t(useLang, 'POST_UPLOAD'):

              /**
               * case 'Place your Instagram post'
               */

              REST = convScript.onMessageNewInstagramPost(msg, useLang);

              console.log('<<<<<<< REST:');
              console.dir(REST);

              if (!REST) {
                sendREST = false;
              } else {
                sendREST = true;
              }



              break;
            default:

              console.log(moduleName + methodName + ', got wrong forced message');

              REST = convScript.onMessageHelp(msg, useLang);

              sendREST = true;

          }

        }

        else {

          /**
           * Generic message
           */

          console.log(moduleName + methodName + ', got general message');

          REST = convScript.onMessageHelp(msg, useLang);

          sendREST = true;

        }

        if (sendREST) {

          result = await generalServices.sendREST('POST', REST.route, REST.params);

          console.log('REST request and result:');
          console.log('Request:');
          console.dir(REST);
          console.log('Response:');
          console.dir(result);

        }

      } catch (err) {
        console.log(moduleName + methodName + ', Error:');
        // console.log('statusCode: ' + err.statusCode);
        console.log('message: ' + err.message);
        // console.log('error: ');
        // console.dir(err.error);
        // console.log('options: ');
        // console.dir(err.options);
      }

    })();

  })
} // onMessage
