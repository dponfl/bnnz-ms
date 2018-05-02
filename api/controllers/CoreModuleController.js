/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const generalServices = require('../services/general');


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

  console.log('proceedStartCommand...');

  console.log('CoreModuleController::proceedStartCommand, req.url:');
  console.dir(req.url);

  let params = req.allParams();

  console.log('CoreModuleController::proceedStartCommand, params:');
  console.dir(params);

  (async () => {

    try {
      client = await checkClient(params);

      if (client && !client.result) {
        // client.result = false => client doesn't exist in out database
        // and we need to send a welcome message

        let html = `
    <b>Hi, ${params.firstName + ' ' + params.lastName}</b>
    
    <i>Welcome to BonanzaInst chat bot!</i>
    
    By joining our program you will not only 
    <b>improve you Instagram account</b> but also
    you can <b>earn money</b> inviting your friends!
`;

        let messageParams = {
          messenger: params.messenger,
          chatId: params.chatId,
          html: html,
        };

        await sendSimpleMessage(messageParams);

        return res.json(200);

      } else if (client && client.result) {
        // client do exists in our database
        // and we need to send message with info about correct possible actions

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

  // return generalServices.clientExists(checkClientParams);

  // todo: delete - used to mockup situation when client does not exist yet

    return generalServices.clientExists(false);
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

