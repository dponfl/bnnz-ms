/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'room',
  migrate: 'safe',
  attributes: {
    guid: {
      type: 'string',
      size: 36,
    },
    room: {
      type: 'integer',
    },
    user: {
      model: 'client',
    },
  }
};
