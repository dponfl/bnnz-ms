/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const generalServices = require('../services/general');
const clientCodes = generalServices.clientCodes();
const restLinks = generalServices.RESTLinks();

const t = require('../services/translate');

const moduleName = 'CoreModuleController:: ';

let lang = 'en';

"use strict";


module.exports = {

  proceedStartCommand: function (req, res) {
    const methodName = 'proceedStartCommand';
    let client;
    let html;
    let messageParams;

    console.log(moduleName + methodName + ', req.url:');
    console.dir(req.url);

    let params = req.allParams();

    console.log(moduleName + methodName + ', params:');
    console.dir(params);

    lang = params.lang;

    (async () => {

      try {

        // console.log('Check if the client already exists: ' + new Date());
        // console.log('params:');
        // console.dir(params);

        /**
         * Check if this client already exists
         */

        // client = await checkClient(params);
        client = await checkClient(false);

        // console.log('Check finished, evaluating results: ' + new Date());
        // console.log('Results:');
        // console.dir(client);

        if (client && !client.result) {

          /**
           * client.result = false => client doesn't exist in out database
           * and we need to create record about this new client in DB
           * and we need to send a welcome message
           */

          // todo: create record for the new client in DB

          html = `
<b>${t.t(lang, 'NEW_SUBS_WELCOME_01')}, ${params.firstName + ' ' + params.lastName}</b>

<b>${t.t(lang, 'NEW_SUBS_WELCOME_02')}</b>

${t.t(lang, 'NEW_SUBS_WELCOME_03')} 
`;

          messageParams = {
            messenger: params.messenger,
            chatId: params.chatId,
            html: html,
          };

          await sendSimpleMessage(messageParams);

          /**
           * Request to enter Instagram profile
           */

          html = `
${t.t(lang, 'NEW_SUBS_INST_01')} 
`;

          messageParams = {
            messenger: params.messenger,
            chatId: params.chatId,
            html: html,
          };

          await sendForcedMessage(messageParams);


          return res.json(clientCodes.newClient.code, {
            code: clientCodes.newClient.ext_code,
            text: clientCodes.newClient.text,
          });

        } else if (client && client.result) {

          /**
           * client do exists in our database
           * and we need to send message with info about correct possible actions
           */

          html = `
<b>${t.t(lang, 'NEW_SUBS_EXISTS_01')}</b>

${t.t(lang, 'NEW_SUBS_EXISTS_02')}
`;

          messageParams = {
            messenger: params.messenger,
            chatId: params.chatId,
            html: html,
            inline_keyboard: [
              [
                {
                  text: t.t(lang, 'POST_UPLOAD_BUTTON'),
                  callback_data: 'upload_post'
                },
              ],
            ],
          };

          await sendInlineButtons(messageParams);

          return res.json(clientCodes.existingClient.code, {
            code: clientCodes.existingClient.ext_code,
            text: clientCodes.existingClient.text,
          })
        } else {
          return res.json(clientCodes.noClient.code, {
            code: clientCodes.noClient.ext_code,
            text: clientCodes.noClient.text,
          })
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
  }, // proceedStartCommand

  proceedHelpCommand: function (req, res) {
    const methodName = 'proceedHelpCommand';
    let client;
    let html;
    let messageParams;

    console.log(moduleName + methodName + ', req.url:');
    console.dir(req.url);

    let params = req.allParams();

    console.log(moduleName + methodName + ', params:');
    console.dir(params);

    lang = params.lang;

    (async () => {

      try {

        /**
         * Check of the client already exists
         */

        client = await checkClient(params);
        // client = await checkClient(false);


        if (client && !client.result) {

          /**
           * client.result = false => client doesn't exist in out database
           * and we need to propose enter /start command
           */

          html = `
<b>${t.t(lang, 'NEW_SUBS_ERROR_COMMAND')}</b>
`;

          messageParams = {
            messenger: params.messenger,
            chatId: params.chatId,
            html: html,
          };

          await sendForcedMessage(messageParams);

          return res.json(clientCodes.wrongCommand.code, {
            code: clientCodes.wrongCommand.ext_code,
            text: clientCodes.wrongCommand.text,
          });

        } else if (client && client.result) {

          /**
           * client do exists in our database
           * and we need to send help info
           */

          html = `${t.t(lang, 'MSG_HELP')}`;

          messageParams = {
            messenger: params.messenger,
            chatId: params.chatId,
            html: html,
            inline_keyboard: [
              [
                {
                  text: t.t(lang, 'ACT_NEW_POST'),
                  callback_data: 'upload_post'
                },
              ],
              [
                {
                  text: t.t(lang, 'ACT_PAY'),
                  callback_data: 'make_next_payment',
                },
              ],
              [
                {
                  text: t.t(lang, 'ACT_FAQ'),
                  url: 'https://policies.google.com/terms',
                },
                {
                  text: t.t(lang, 'ACT_WEB'),
                  url: 'https://policies.google.com/terms',
                },
              ],
            ],
          };

          await sendInlineButtons(messageParams);

          return res.json(clientCodes.wrongCommand.code, {
            code: clientCodes.wrongCommand.ext_code,
            text: clientCodes.wrongCommand.text,
          })
        } else {
          return res.json(clientCodes.noClient.code, {
            code: clientCodes.noClient.ext_code,
            text: clientCodes.noClient.text,
          })
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
  }, // proceedHelpCommand




};


/**
 * Functions
 */

function checkClient(checkClientParams) {
    return generalServices.clientExists(checkClientParams);
} // checkClient

function sendInlineButtons(params) {
    return generalServices.sendREST('POST', restLinks.mgSendInlineButtons, params);
} // sentInlineButtons

function sendSimpleMessage(params) {
    return generalServices.sendREST('POST', restLinks.mgSendSimpleMessage, params);
} // sentInlineButtons

function sendForcedMessage(params) {
    return generalServices.sendREST('POST', restLinks.mgSendForcedMessage, params);
} // sentInlineButtons

