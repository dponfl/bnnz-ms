/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const generalServices = require('../services/general');
const clientCodes = generalServices.clientCodes();
const restLinks = generalServices.RESTLinks();

const _ = require('lodash');

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

      // todo: check special subscription groups and

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

      (async () => {

        try {

          let saveComandRecord = await saveCommand(client, params);

          let clientStatus = await checkClientStatus(client);

          await proceedClientStatus(clientStatus, client);


          // if (!checkProfileProvided()) {
          //   let existingClientNoProfileSendMessage01Record = await existingClientNoProfileSendMessage01(client);
          // } else if (checkDeleted()) {
          //
          // } else if (checkBanned()) {
          //
          // } else if (!checkPaymentPlanSelected()) {
          //   let existingClientNoPaymentPlanSendMessage01Record = await existingClientNoPaymentPlanSendMessage01(client);
          // } else if (!checkPaymentMade()) {
          //   let existingClientNoPaymentMadeSendMessage01Record = await existingClientNoPaymentMadeSendMessage01(client);
          // } else if (!checkSubscriptionMade()) {
          //   let existingClientNoSubscriptionMadeSendMessage01Record = await existingClientNoSubscriptionMadeSendMessage01(client);
          // } else if (!checkSubscriptionFinalized()) {
          //   let existingClientNoSubscriptionFinalizedSendMessage01Record = await existingClientNoSubscriptionFinalizedSendMessage01(client);
          // } else if (!checkSubscriptionPeriodValid()) {
          //   let existingClientProlongSubscriptionSendMessage01Record = await existingClientProlongSubscriptionSendMessage01(client);
          // } else {
          //   let existingClientSendMessage01Record = await existingClientValidSubscriptionSendMessage01(client);
          // }

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

function checkClientStatus(client) {

  let methodName = 'checkClientStatus';

  return new PromiseBB((resolve, reject) => {

    // console.log(moduleName + methodName);

    // todo: check current client's status and resolve with respective reply

    resolve({
      deletedFlag: client.deleted,
      bannedFlag: client.banned,
      noProfileProvidedFlag: !client.profile_provided,
      noProfileConfirmedFlag: !client.profile_confirmed,
      noPaymentPlanSelectedFlag: !client.payment_plan_selected,
      noPaymentFlag: !client.payment_made,
      noSubscriptionFlag: !client.subscription_made,
      noSubscriptionFinalizedFlag: !client.service_subscription_finalized,
    });

    // console.log(new Date());
    // setTimeout(() => {
    //   console.log(moduleName + methodName);
    //   console.log(new Date());
    //   resolve('deleted');
    // }, 2000);
  });
} // checkClientStatus

function proceedClientStatus(statusObj, client) {

  let methodName = 'proceedClientStatus';

  return new PromiseBB((resolve, reject) => {

    // console.log(moduleName + methodName);
    let {deletedFlag, bannedFlag, noProfileProvidedFlag,
    noProfileConfirmedFlag, noPaymentPlanSelectedFlag,
    noPaymentFlag, noSubscriptionFlag, noSubscriptionFinalizedFlag} = statusObj;

    (async () => {

      try {

        if (deletedFlag) {
          // console.log('before proceedDeleted: ' + new Date());
          await proceedDeleted(client);
          // console.log('after proceedDeleted: ' + new Date());
          resolve();
        } else if (bannedFlag) {
          await proceedBanned(client);
          resolve();
        } else if (noProfileProvidedFlag) {
          await newClientSendMessage02(client);
          resolve();
        } else if (noProfileConfirmedFlag) {
          await clientConfirmProfile(client);
        } else if (noPaymentPlanSelectedFlag) {
          await clientSelectPaymentPlan(client);
        } else if (noPaymentFlag) {
          switch (client.service_link.name) {
            case 'bronze':
              await clientBronzePlanSelected(client);
              break;
            case 'gold':
              await clientGoldPlanSelected(client);
              break;
            case 'platinum':
              await clientPlatinumPlanSelected(client);
              break;
          }
        } else if (noSubscriptionFlag) {
          await clientConfirmSubscription(client);
        } else if (noSubscriptionFinalizedFlag) {
          await clientConfirmSubscriptionNotConfirmed(client);
        } else {
          await clientConfirmSubscriptionConfirmed(client);
        }

      } catch (err) {
        reject({
          err_location: moduleName + methodName,
          err_statusCode: err.statusCode,
          err_message: err.message,
          err_options: err.options,
        });
      }
    })();
  });
} // proceedClientStatus

function proceedDeleted(params) {

  let methodName = 'proceedDeleted';

  return new PromiseBB((resolve, reject) => {

    // console.log(moduleName + methodName);

    let html = `
<b>${t.t(lang, 'EXISTING_DELETED')}</b>
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
    };

    sendSimpleMessage(messageParams);

    resolve();

    // console.log(new Date());
    // setTimeout(() => {
    //   console.log(moduleName + methodName);
    //   console.log(new Date());
    //   resolve();
    // }, 5000);
  });
} // proceedDeleted

function proceedBanned(params) {

  let methodName = 'proceedBanned';

  return new PromiseBB((resolve, reject) => {

    // console.log(moduleName + methodName);

    let html = `
<b>${t.t(lang, 'EXISTING_BANNED')}</b>
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
    };

    sendSimpleMessage(messageParams);

    resolve();

    // console.log(new Date());
    // setTimeout(() => {
    //   console.log(moduleName + methodName);
    //   console.log(new Date());
    //   resolve();
    // }, 5000);
  });
} // proceedBanned

function clientConfirmProfile(params) {

  let methodName = 'clientConfirmProfile';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let instUrl = 'https://www.instagram.com/' + _.trim(params.inst_profile);
    let instConfHtml = `
${t.t(lang, 'NEW_SUBS_INST_02')}
<a href="${instUrl}">${instUrl}</a>
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
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
} // clientConfirmProfile

function clientSelectPaymentPlan(params) {

  let methodName = 'clientSelectPaymentPlan';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let html = `
${t.t(lang, 'NEW_SUBS_INST_05')}

${t.t(lang, 'NEW_SUBS_INST_06')}
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
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
} // clientSelectPaymentPlan

function clientBronzePlanSelected(params) {

  let methodName = 'clientBronzePlanSelected';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let html = `
${t.t(lang, 'PLAN_BRONZE_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
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
} // clientBronzePlanSelected

function clientGoldPlanSelected(params) {

  let methodName = 'clientGoldPlanSelected';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let html = `
${t.t(lang, 'PLAN_GOLD_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
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
} // clientGoldPlanSelected

function clientPlatinumPlanSelected(params) {

  let methodName = 'clientPlatinumPlanSelected';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let html = `
${t.t(lang, 'PLAN_PLATINUM_THANKS_MSG')} 

${t.t(lang, 'PLAN_THANKS_MSG')} 
`;

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: html,
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
} // clientPlatinumPlanSelected

function clientConfirmSubscription(params) {

  let methodName = 'clientConfirmSubscription';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let listProfiles = '';

    _.forEach(sails.config.superProfiles, (el) => {
      let listElem = `"https://instagram.com/${el}"`;
      listProfiles = listProfiles +
        `<a href=${listElem}>${el}</a>
`;
    });

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: `
${t.t(lang, 'NEW_SUBS_INST_08')} 
${listProfiles}

${t.t(lang, 'NEW_SUBS_INST_09')} 
`,
      inline_keyboard: [
        [
          {
            text: t.t(lang, 'ACT_SUBSCRIBE'),
            callback_data: 'subscribed'
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
} // clientConfirmSubscription

function clientConfirmSubscriptionNotConfirmed(params) {

  let methodName = 'clientConfirmSubscriptionNotConfirmed';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: `
${t.t(lang, 'PLAN_THANKS_MSG_02')} 
`,
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
} // clientConfirmSubscriptionNotConfirmed

function clientConfirmSubscriptionConfirmed(params) {

  let methodName = 'clientConfirmSubscriptionConfirmed';

  console.log(moduleName + methodName + ', params:');
  console.dir(params);

  return new PromiseBB((resolve, reject) => {

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chat_id,
      html: `
${t.t(lang, 'PLAN_THANKS_MSG_03')} 
`,
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
} // clientConfirmSubscriptionConfirmed

function fakeMethod() {

  return new PromiseBB((resolve, reject) => {

    console.log('fakeMethod: ' + new Date());
    resolve();
  });
} // fakeMethod

