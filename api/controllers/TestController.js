/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

"use strict";


module.exports = {
  someOne: function (req, res) {
    console.log('TestController::someOne...');


    console.log('req.url:');
    console.dir(req.url);

    var params = req.allParams();

    console.log('params:');
    console.dir(params);

    console.log('before setTimeout long...');

    setTimeout(function () {
      console.log('within setTimeout long...');
      res.json(200, {result: 'ok', data: {a: 'A', b: 'B'}});
    },7000);

    // return res.json(200, {result: 'ok', data: {a: 'A', b: 'B'}});

  },
};

