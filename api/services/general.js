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

    console.log('_.some: ' + _.some(possibleMethods, (val, index, collection) => {
      // console.log('method: ');
      // console.dir(method);
      // console.log('val: ');
      // console.dir(val);
      // console.log('index: ');
      // console.dir(index);
      // console.log('collection: ');
      // console.dir(collection);

        return val === method;
      }));

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
        body: {
          param: params
        },
        json: true
      };

      resolve(rp(options));
    });



  }, // sendREST
};