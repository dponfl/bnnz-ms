/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'client',
  migrate: 'safe',
  attributes: {
    guid: {
      type: 'string',
      size: 36,
      unique: true,
    },
    first_name: {
      type: 'string',
      size: 50,
    },
    last_name: {
      type: 'string',
      size: 50,
    },
    chat_id: {
      type: 'string',
      size: 20,
      unique: true,
    },
    username: {
      type: 'string',
      size: 30,
    },
    ref_guid: {
      type: 'string',
      size: 36,
    },
    is_ref: {
      type: 'boolean',
    },
    subscription_active: {
      type: 'boolean',
    },
    subscription_from: {
      type: 'datetime',
    },
    subscription_until: {
      type: 'datetime',
    },
    service: {
      type: 'string',
      size: 20,
    },
    subscription_url: {
      type: 'string',
      size: 100,
    },
    tos_accepted: {
      type: 'boolean',
    },
    messenger: {
      type: 'string',
      size: 36,
    },
    password: {
      type: 'string',
      size: 100,
    },
    deleted: {
      type: 'boolean',
    },
    banned: {
      type: 'boolean',
    },
    admin: {
      type: 'boolean',
    },
    messages: {
      collection: 'message',
      via: 'owner',
    },
    rooms: {
      collection: 'room',
      via: 'user',
    },
    service_link: {
      model: 'service',
    },
    lang: {
      type: 'string',
      size: 2,
    },
    inst_profile: {
      type: 'string',
      size: 50,
    },

    // Override the default toJSON method

    // toJSON: function() {
    //   var obj = this.toObject();
    //   return obj;
    // },
  }
};

