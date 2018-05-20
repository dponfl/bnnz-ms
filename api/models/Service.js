/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'service',
  migrate: 'safe',
  attributes: {
    guid: {
      type: 'string',
      size: 36,
    },
    name: {
      type: 'string',
      size: 20,
    },
    rooms: {
      type: 'integer',
    },
    messages: {
      type: 'integer',
    },
    messages_to_stars: {
      type: 'integer',
    },
    user: {
      collection: 'client',
      via: 'service_link',
    }
  }
};

