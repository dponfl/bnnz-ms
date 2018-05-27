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

const PromiseBB = require('bluebird');

let lang = 'en';

let passResult;

"use strict";


module.exports = {

  proceedStartCommand: function (req, res) {
    const methodName = 'proceedStartCommand';
    let client;
    let html;
    let message01Params;
    let message02Params;
    let message03Params;
    let clientRec;
    let message01Rec;
    let message02Rec;
    let message03Rec;
    let clientRecId;

    console.log(moduleName + methodName + ', req.url:');
    console.dir(req.url);

    let params = req.allParams();

    console.log(moduleName + methodName + ', params:');
    console.dir(params);

    lang = params.lang;



    // console.log('Check if the client already exists: ' + new Date());
    // console.log('params:');
    // console.dir(params);

    /**
     * Check if this client already exists
     */

    (async () => {

      try {

        client = await checkClient(params);

        await proceedClient(client, params);

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

function proceedClient(client, params) {

  return new PromiseBB((resolve, reject) => {

    const methodName = 'proceedClient';

    if (!client) {

      /**
       * Proceed with new client
       */

      console.log('proceedClient, client does not exists, params:');
      console.dir(params);

      (async () => {

        try {

          let clientRec = {
            guid: params.guid,
            first_name: params.firstName,
            last_name: params.lastName,
            chat_id: params.chatId,
            username: params.userName,
            ref_guid: params.ref,
            messenger: params.messenger,
            lang: params.lang,
          };

          let saveNewClientRecord = await saveNewClient(clientRec);

          // await ((p) => {
          //   console.log('!!!!!!!!!!!!!!!!!!!!!!');
          //   console.dir(p);
          // })(saveNewClientResult);

          let saveComandRecord = await saveCommand(saveNewClientRecord, params);
          let newClientSendMessage01Record = await newClientSendMessage01(saveNewClientRecord);
          let newClientSendMessage02Record = await newClientSendMessage02(saveNewClientRecord);

          resolve();

        } catch (err) {
          // console.log(moduleName + methodName + ', Error:');
          // console.log('statusCode: ' + err.statusCode);
          // console.log('message: ' + err.message);
          // console.log('error: ');
          // console.dir(err.error);
          // console.log('options: ');
          // console.dir(err.options);

          reject({
            err_location: moduleName + methodName,
            err_statusCode: err.statusCode,
            err_message: err.message,
            err_options: err.options,
          });
        }

      })();
    } else if (client && client.code == 200) {

      /**
       * Proceed with existing client
       */

      client = client.data;

      console.log('proceedClient, client do exists, client:');
      console.dir(client);

      // todo: check information about existing client
      // todo: and based on it send him different messages

      (async () => {

        try {

          let saveComandRecord = await saveCommand(client, params);
          let existingClientSendMessage01Record = await existingClientValidSubscriptionSendMessage01(client);
          // let existingClientSendMessage01Record = await existingClientProlongSubscriptionSendMessage01(client);

          resolve();

        } catch (err) {
          // console.log(moduleName + methodName + ', Error:');
          // console.log('statusCode: ' + err.statusCode);
          // console.log('message: ' + err.message);
          // console.log('error: ');
          // console.dir(err.error);
          // console.log('options: ');
          // console.dir(err.options);

          reject({
            err_location: moduleName + methodName,
            err_statusCode: err.statusCode,
            err_message: err.message,
            err_options: err.options,
          });
        }
      })();
    }
  });
} // proceedClient

function saveNewClient(rec) {

  return new PromiseBB((resolve, reject) => {

    Client.create(rec).exec((err, record) => {

      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record.toObject());
      }
    });
  });
} // saveNewClient

function saveCommand(command, params) {

  console.log('saveCommand, command:');
  console.dir(command);
  console.log('saveCommand, params:');
  console.dir(params);


  return new PromiseBB((resolve, reject) => {

    let commandRec = {
      guid: command.guid,
      message: params.text,
      message_format: 'command',
      messenger: command.messenger,
      message_originator: 'client',
      owner: command.id,
    };

    Message.create(commandRec).exec((err, record) => {
      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record);
      }
    })

  });
} // saveCommand

function newClientSendMessage01(params) {

  console.log('sendMessage01, params:');
  console.dir(params);


  return new PromiseBB((resolve, reject) => {

    let html = `
<b>${t.t(lang, 'NEW_SUBS_WELCOME_01')}, ${params.first_name + ' ' + params.last_name}</b>

<b>${t.t(lang, 'NEW_SUBS_WELCOME_02')}</b>

${t.t(lang, 'NEW_SUBS_WELCOME_03')} 
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
    };

    let messageRec = {
      guid: params.guid,
      message: messageParams.html,
      message_format: 'simple',
      messenger: params.messenger,
      message_originator: 'bot',
      owner: params.id,
    };

    sendSimpleMessage(messageParams);

    Message.create(messageRec).exec((err, record) => {

      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record);
      }
    });
  });

} // newClientSendMessage01

function newClientSendMessage02(params) {

  console.log('sendMessage02, params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let html = `
${t.t(lang, 'NEW_SUBS_INST_01')} 
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
    };

    let messageRec = {
      guid: params.guid,
      message: messageParams.html,
      message_format: 'forced',
      messenger: params.messenger,
      message_originator: 'bot',
      owner: params.id,
    };

    sendForcedMessage(messageParams);

    Message.create(messageRec).exec((err, record) => {

      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record);
      }
    });
  });
} // newClientSendMessage02

function existingClientValidSubscriptionSendMessage01(params) {

  return new PromiseBB((resolve, reject) => {

    let html = `
<b>${t.t(lang, 'NEW_SUBS_EXISTS_01')}</b>

${t.t(lang, 'NEW_SUBS_EXISTS_02')}
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
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

    let messageRec = {
      guid: params.guid,
      message: messageParams.html,
      message_format: 'inline_keyboard',
      message_buttons: JSON.stringify(messageParams.inline_keyboard),
      messenger: params.messenger,
      message_originator: 'bot',
      owner: params.id,
    };

    sendInlineButtons(messageParams);

    Message.create(messageRec).exec((err, record) => {

      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record);
      }
    });
  });

} // existingClientValidSubscriptionSendMessage01

function existingClientProlongSubscriptionSendMessage01(params) {

  return new PromiseBB((resolve, reject) => {

    let html = `
<b>${t.t(lang, 'NEW_SUBS_EXISTS_01')}</b>

${t.t(lang, 'NEW_SUBS_EXISTS_03')}
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
      inline_keyboard: [
        [
          {
            text: t.t(lang, 'ACT_PAY'),
            callback_data: 'make_next_payment'
          },
        ],
      ],
    };

    let messageRec = {
      guid: params.guid,
      message: messageParams.html,
      message_format: 'inline_keyboard',
      message_buttons: JSON.stringify(messageParams.inline_keyboard),
      messenger: params.messenger,
      message_originator: 'bot',
      owner: params.id,
    };

    sendInlineButtons(messageParams);

    Message.create(messageRec).exec((err, record) => {

      if (err) {
        reject(err);
      }

      if (record) {
        resolve(record);
      }
    });
  });

} // existingClientProlongSubscriptionSendMessage01

