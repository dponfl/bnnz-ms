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
};