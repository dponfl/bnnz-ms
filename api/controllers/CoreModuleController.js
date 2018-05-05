/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const generalServices = require('../services/general');
const t = require('../services/translate');


"use strict";


module.exports = {

  newSubscription: function (req, res) {
    proceedStartCommand(req, res);
  }, // newSubscription

};


/**
 * Functions
 */

function proceedStartCommand(req, res) {

  let client;
  let html;
  let messageParams;

  console.log('proceedStartCommand...');

  console.log('CoreModuleController::proceedStartCommand, req.url:');
  console.dir(req.url);

  let params = req.allParams();

  console.log('CoreModuleController::proceedStartCommand, params:');
  console.dir(params);

  (async () => {

    try {


      console.log('Check if the client already exists: ' + new Date());
      console.log('params:');
      console.dir(params);

      client = await checkClient(params);
      // client = await checkClient(false);

      console.log('Check finished, evaluating results: ' + new Date());
      console.log('Results:');
      console.dir(client);

      if (client && !client.result) {
        // client.result = false => client doesn't exist in out database
        // and we need to send a welcome message

        html = `
    <b>${t.t('NEW_SUBS_WELCOME_01')}, ${params.firstName + ' ' + params.lastName}</b>
    
    <i>${t.t('NEW_SUBS_WELCOME_02')}</i>
    
    ${t.t('NEW_SUBS_WELCOME_03')} 
    <b>${t.t('NEW_SUBS_WELCOME_04')}</b> ${t.t('NEW_SUBS_WELCOME_05')}
    ${t.t('NEW_SUBS_WELCOME_06')} <b>${t.t('NEW_SUBS_WELCOME_07')}</b> ${t.t('NEW_SUBS_WELCOME_08')}
`;

        messageParams = {
          messenger: params.messenger,
          chatId: params.chatId,
          html: html,
        };

        await sendSimpleMessage(messageParams);

//         html = `
//     <b>Hello, ${params.firstName + ' ' + params.lastName}</b>
//     <i>Some message text here...</i>
//     <a href="https://www.instagram.com/webstudiopro/">Have a look at this profile</a>
// `;
//
//         messageParams = {
//           messenger: params.messenger,
//           chatId: params.chatId,
//           html: html,
//           inline_keyboard: [
//             [
//               {
//                 text: 'Google',
//                 url: 'https://google.com'
//               }
//             ],
//             [
//               {
//                 text: 'I like it :)',
//                 callback_data: 'like'
//               },
//               {
//                 text: 'I don\'t like it :(',
//                 callback_data: 'dislike'
//               }
//             ],
//             [
//               {
//                 text: 'Provide your Instagram account',
//                 callback_data: 'instagram'
//               },
//             ],
//             [
//               {
//                 text: 'Other reply',
//                 callback_data: 'other'
//               }
//             ],
//           ],
//         };
//
//         await sendInlineButtons(messageParams);

        return res.json(200);

      } else if (client && client.result) {
        // client do exists in our database
        // and we need to send message with info about correct possible actions

        html = `
<b>${t.t('NEW_SUBS_EXISTS_01')}</b>
${t.t('NEW_SUBS_EXISTS_02')}
`;

        messageParams = {
          messenger: params.messenger,
          chatId: params.chatId,
          html: html,
          inline_keyboard: [
            [
              {
                text: t.t('ACT_NEW_POST'),
                callback_data: 'post'
              },
            ],
            [
              {
                text: t.t('ACT_PAY'),
                callback_data: 'payment'
              },
            ],
            [
              {
                text: t.t('ACT_FAQ'),
                callback_data: 'faq'
              },
              {
                text: t.t('ACT_WEB'),
                url: 'https://google.com'
              }
            ],
          ],
        };

        await sendInlineButtons(messageParams);

        // messageParams = {
        //   messenger: params.messenger,
        //   chatId: params.chatId,
        //   html: html,
        // };
        //
        // await sendSimpleMessage(messageParams);


        return res.badRequest({
          result: false,
          data: client,
          text: 'Client already exists',
        })
      } else {
        return res.badRequest({
          result: false,
          text: 'No info on the client received',
        })
      }

    } catch (err) {
      console.log('CoreModuleController::proceedStartCommand, Error:');
      console.log('statusCode: ' + err.statusCode);
      console.log('message: ' + err.message);
      console.log('error: ');
      console.dir(err.error);
      console.log('options: ');
      console.dir(err.options);
    }

  })();
} // proceedStartCommand

function checkClient(checkClientParams) {

    return generalServices.clientExists(checkClientParams);
} // checkClient

function sendInlineButtons(params) {

    return generalServices.sendREST('POST', '/mg/sendinlinebuttons', params);

} // sentInlineButtons

function sendSimpleMessage(params) {

    return generalServices.sendREST('POST', '/mg/sendsimplemessage', params);

} // sentInlineButtons

function sendForcedMessage(params) {

    return generalServices.sendREST('POST', '/mg/sendforcedmessage.r', params);

} // sentInlineButtons

