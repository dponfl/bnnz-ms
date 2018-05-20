"use strict";

let rp = require('request-promise');
let _ = require('lodash');
const moduleName = 'general::';

module.exports = {
  sendREST: function (method, url, params) {
    const name = 'sendREST';

    const possibleMethods = ['POST', 'GET'];

    console.log(name + ', params:');
    console.dir(method);
    console.dir(url);
    console.dir(params);

    return new Promise((resolve, reject) => {
      if (!_.some(possibleMethods, (val) => {
        return val === method;
        })) {
        reject(name + ': No method or wrong method');
      }

      if (!url) {
        reject(name + ': No url');
      }

      let options = {
        method: method,
        uri: sails.config.HOST + url,
        body: params,
        json: true
      };

      resolve(rp(options));
    });

  }, // sendREST

  clientExists: function (client) {

    const methodName = 'clientExists';

    // dummy function
    // in reality must request DB for client info and return

    return new Promise((resolve, reject) => {

      console.log(moduleName + methodName + ', client:');
      console.dir(client);

      if (client) {
        console.log(moduleName + methodName + ', client parameter passed');

        /**
         * check if such client already exists
         */

        Client.findOne({
          chat_id: client.chatId
        })
          .exec(function (err, rec) {
            if (err) {
              reject(err);
            }

            if (!rec) {

              /**
               * record for the specified criteria was not found
               */

              console.log(moduleName + methodName + ', client was NOT FOUND');

              resolve({
                result: false
              });
            } else {

              /**
               * found record for the specified criteria
               */

              console.log(moduleName + methodName + ', client was FOUND');

              resolve({
                result: true,
                data: rec,
              });
            }
          });

        // setTimeout(() => {
        //   resolve({
        //     result: true,
        //     data: {
        //       messenger: client.messenger,
        //       chatId: client.chatId,
        //       guid: client.guid,
        //       firstName: client.firstName || '',
        //       lastName: client.lastName || '',
        //       userName: client.userName || '',
        //       ref: client.ref,
        //     },
        //   });
        // }, 1000);

      } else {
        console.log(moduleName + methodName + ', no client parameter');
        reject({message: moduleName + methodName + ', no client parameter'})
      }
    });
  }, // clientExists

  clientCodes: function () {
    return {
      /**
       * New client
       */

      newClient: {
        code: 200,
        ext_code: 100,
        text: 'New client',
      },

      /**
       * Existing client
       */

      existingClient: {
        code: 200,
        ext_code: 101,
        text: 'Existing client',
      },

      /**
       * Error and no info about client
       */

      noClient: {
        code: 200,
        ext_code: 103,
        text: 'No info about client',
      },

      /**
       * New client used the wrong command
       */

      wrongCommand: {
        code: 200,
        ext_code: 104,
        text: 'Wrong command for new client',
      },


    }
  }, // clientCodes

  RESTLinks: function () {
    return {
      start: '/core/start',
      help: '/core/help',


      mgSendInlineButtons: '/mg/sendinlinebuttons',
      mgSendForcedMessage: '/mg/sendforcedmessage',
      mgSendSimpleMessage: '/mg/sendsimplemessage',

      trueInstagram: '^https:\/\/www\.instagram\.com\/|^https:\/\/instagram\.com\/',
    }
  }, // RESTLinks

};