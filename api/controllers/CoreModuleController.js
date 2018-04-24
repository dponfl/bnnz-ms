/**
 * CoreModuleController
 *
 * @description :: Server-side logic for managing coremodules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const messegeBrokerTelegramServices = require('../services/messegeBrokerTelegram');
const coreModuleServices = require('../services/coreModule');

"use strict";


module.exports = {

  newSubscription: function (req, res) {

    proceedStartCommand();

    /**
     * Functions
     */

    function proceedStartCommand() {

      console.log('proceedStartCommand...');

      console.log('req.url:');
      console.dir(req.url);

      var params = req.allParams();

      console.log('params:');
      console.dir(params);

      console.log('before setTimeout short...');

      setTimeout(function () {
        console.log('within setTimeout short...');
        res.json(200, {result: 'ok', data: params});
        // return res.badRequest('bla-bla-bla');
      },2000);

      // return res.json(200, {result: 'ok', data: {a: 'A2', b: 'B2'}});
      // return res.badRequest('bla-bla-bla');

    } // proceedStartCommand

  }, // newSubscription

  someOne: function (req, res) {
    console.log('someOne...');


    console.log('req.url:');
    console.dir(req.url);

    var params = req.allParams();

    console.log('params:');
    console.dir(params);

    // var promise = new Promise(function (resolve, reject) {
    //   var ttt='';
    //
    //   console.log('starting long loop...');
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   for (var i=0; i < 1000000000; i++) {
    //     ttt = i;
    //   }
    //
    //   console.log('end of long loop...');
    //
    //   resolve('1111111111');
    // });
    //
    // promise
    //   .then(function (res) {
    //     console.log(res);
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });



    var ttt='';

    console.log('starting long loop...');

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    for (var i=0; i < 1000000000; i++) {
      ttt = i;
    }

    console.log('end of long loop...');

    return res.json(200, {result: 'ok', data: {a: 'A', b: 'B'}});

  },

};

