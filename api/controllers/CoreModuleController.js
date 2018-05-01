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

  // client = generalServices.clientExists(params);

  // todo: delete - used to mockup situation when client does not exist yet
  client = generalServices.clientExists(false);

  if (client && !client.result) {
    // client.result = false => client doesn't exist in out database
    // and we need to send a welcome message

    let messageParams = {
      messenger: params.messenger,
      chatId: params.chatId,
      guid: params.guid,
      firstName: params.firstName || '',
      lastName: params.lastName ||'',
      text: 'Some bla-bla text here...',
    };

    sendInlineBottons(messageParams);

    return res.json(200);
  } else {
    // client do exists in our database
    // and we need to send message with info about correct possible actions

    return res.badRequest({
      result: false,
      data: client,
      text: 'Client already exists or null',
    })
  }

} // proceedStartCommand

async function sendInlineBottons(params) {
  try {

    let results = await generalServices.sendREST('POST', '/mg/sendinlinebuttons', params);
    console.log('CoreModuleController::sendInlineBottons, results:');
    console.dir(results);

  } catch (err) {

    console.log('Error received:');
    console.log('statusCode: ' + err.statusCode);
    console.log('message: ' + err.message);
    console.log('error: ');
    console.dir(err.error);
    console.log('options: ');
    console.dir(err.options);
  }

} // sentInlineBottons

