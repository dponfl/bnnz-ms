/**
 * Ref.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ref',
  migrate: 'safe',
  attributes: {
    guid: {
      type: 'string',
      size: 36,
    },
    key: {
      type: 'string',
      size: 31,
    },
    service: {
      type: 'string',
      size: 30,
    },
    used: {
      type: 'boolean',
    },
    deleted: {
      type: 'boolean',
    },
  }
};

