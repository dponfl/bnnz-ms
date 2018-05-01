/**
 * MessageGatewayController
 *
 * @description :: Server-side logic for managing Messagegateways
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const generalServices = require('../../api/services/general');


module.exports = {
  sendInlineButtons: function (req, res) {
    let params = req.allParams();

    console.log('MessageGatewayController::sendInlineButtons, params:');
    console.dir(params);

    switch (params.messenger) {
      case 'telegram' :
        callTelegram('sendinlinebuttons', params);
        break;
      case 'facebook':
        break;
    }

    res.json(200);

  }, // sendInlineButtons
};

async function callTelegram(route, callTelegramParams) {

  try {
    await generalServices.sendREST('POST', '/mbt/' + route, callTelegramParams);
  } catch (err) {
    console.log('MessageGatewayController::callTelegram, Error:');
    console.log('statusCode: ' + err.statusCode);
    console.log('message: ' + err.message);
    console.log('error: ');
    console.dir(err.error);
    console.log('options: ');
    console.dir(err.options);
  }

} // callTelegram

