"use strict";

const rp = require('request-promise');
const _ = require('lodash');

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

    // dummy function
    // in reality must request DB for client info and return

    return new Promise((resolve) => {

      console.log('clientExists, client:');
      console.dir(client);

      if (client) {
        console.log('clientExists, true');
        setTimeout(() => {
          resolve({
            result: true,
            data: {
              messenger: client.messenger,
              chatId: client.chatId,
              guid: client.guid,
              firstName: client.firstName || '',
              lastName: client.lastName || '',
              userName: client.userName || '',
              ref: client.ref,
            },
          });
        }, 1000);

      } else {
        console.log('clientExists, false');
        setTimeout(() => {
          resolve({
          result: false,
        });
        }, 1000);

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

      trueInstagram: '^https:\/\/www\.instagram\.com\/',
    }
  }, // RESTLinks

};