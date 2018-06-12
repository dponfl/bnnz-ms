"use strict";

let _ = require('lodash');
const PromiseBB = require('bluebird');

const uuid = require('uuid-apikey');

const moduleName = 'storageGateway::';

module.exports = {

  /**
   * Client storage
   */

  clientCreate: function (params) {

  }, // clientCreate

  /**
   * Message storage
   */

  messageCreate: function (params) {

  }, // messageCreate

  getRef: function (ref) {

    const methodName = 'getRef';

    console.log(moduleName + methodName + ', params:');
    console.dir(params);

    return new PromiseBB((resolve, reject) => {

      if (ref && uuid.isAPIKey(ref)) {
        console.log(moduleName + methodName + ', ref code: ' + ref);
        console.log(moduleName + methodName + ', ref is API Key');
      } else {
        console.log(moduleName + methodName + ', No ref code OR ref is NOT API Key');
        resolve(false);
      }

      Ref.findOne({
        key: ref
      }).exec((err, record) => {
        if (err) {
          reject(err);
        }

        let rec = (record) ? record.toObject() : null;

        if (!rec) {

          /**
           * record for the specified criteria was not found
           */

          console.log(moduleName + methodName + ', ref key was NOT FOUND');

          resolve(false);
        } else {

          /**
           * found record for the specified criteria
           */

          console.log(moduleName + methodName + ', ref key was FOUND, key: ' + rec.key);

          // todo: put flag "used" for this ref key

          resolve({
            guid: rec.guid,
            key: rec.key,
            service: rec.service,
          })

        }
      })
    });

  }, // getRef
};