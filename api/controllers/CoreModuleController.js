/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const serviceGeneral = require('../services/general');
const messegeBrokerTelegramServices = require('../services/messegeBrokerTelegram');
const coreModuleServices = require('../services/coreModule');


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

  console.log('req.url:');
  console.dir(req.url);

  var params = req.allParams();

  console.log('params:');
  console.dir(params);

  console.log('before setTimeout short...');

  client = serviceGeneral.clientExists(false);

  if (client && client.result) {
    res.json(200, {result: true, data: client});
  } else {
    res.badRequest({
      result: false,
      text: 'Client was not found',
    })
  }

} // proceedStartCommand

