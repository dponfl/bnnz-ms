/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'message',
  migrate: 'safe',
  attributes: {
    message: {
      type: 'text',
    },
    message_format: {
      type: 'string',
      size: 50,
    },
    message_buttons: {
      type: 'json',
    },
    messenger: {
      type: 'string',
      size: 36,
    },
    status: {
      type: 'string',
      size: 36,
    },
    status_text: {
      type: 'string',
      size: 100,
    },
    type: {
      type: 'string',
      size: 36,
    },
    message_originator: {
      type: 'string',
      size: 36,
    },
    owner: {
      model: 'client',
    }
  }
};

