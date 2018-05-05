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
        }, 5000);

      } else {
        console.log('clientExists, false');
        setTimeout(() => {
          resolve({
          result: false,
        });
        }, 3000);

      }
    });
  }, // clientExists

  t: function (str) {

  } // t
};