"use strict";

module.exports = {
  t: function (useToken) {
    return token[lang][useToken];
  }, // T

  setLang: function (language) {
    lang = language;
  }, // setLang
};

var lang = 'en';

const token = {
  en: {

    // New registration, client was not signed up

    NEW_SUBS_WELCOME_01: 'Hi',
    NEW_SUBS_WELCOME_02: 'Welcome to BonanzaInst chat bot!',
    NEW_SUBS_WELCOME_03: 'By joining our program you will not only',
    NEW_SUBS_WELCOME_04: 'improve you Instagram account',
    NEW_SUBS_WELCOME_05: 'but also',
    NEW_SUBS_WELCOME_06: 'you can',
    NEW_SUBS_WELCOME_07: 'earn money',
    NEW_SUBS_WELCOME_08: 'inviting your friends!',

    // New registration, the client was signed up already

    NEW_SUBS_EXISTS_01: 'You already have been registered at BonanzaInst',
    NEW_SUBS_EXISTS_02: 'Pls use keyboard to upload info about new Instagram post, etc.',

    // General actions

    ACT_NEW_POST: 'Upload Instagram post',
    ACT_PAY: 'Make monthly payment',
    ACT_FAQ: 'FAQ',
    ACT_WEB: 'Web site',

    // Command actions

    CMD_LANG: 'You have changed the bot language to: ',
    CMD_LANG_EN: 'English',
    CMD_LANG_RU: 'Russian',

    // Other messages

    MSG_GENERAL: 'Got message',
  },
  ru: {

    // New registration, client was not signed up

    NEW_SUBS_WELCOME_01: 'Приветствуем',
    NEW_SUBS_WELCOME_02: 'Добро пожаловать в чат BonanzaInst',
    NEW_SUBS_WELCOME_03: 'Наша программа не только',
    NEW_SUBS_WELCOME_04: 'обеспечит продвижение твоего аккаунта Инстаграм',
    NEW_SUBS_WELCOME_05: 'но также',
    NEW_SUBS_WELCOME_06: 'ты сможешь',
    NEW_SUBS_WELCOME_07: 'получать деньги',
    NEW_SUBS_WELCOME_08: 'приглашая своих друзей!',

    // New registration, the client was signed up already

    NEW_SUBS_EXISTS_01: 'Вы уже зарегистрированы в BonanzaInst',
    NEW_SUBS_EXISTS_02: 'Используйте клавиатуру, чтобы загрузить информации о новом посте ' +
    'в Инстаграм и др.',

    // General actions

    ACT_NEW_POST: 'Загрузить пост Инстаграм',
    ACT_PAY: 'Внести платеж',
    ACT_FAQ: 'Помощь',
    ACT_WEB: 'Перейти на сайт',

    // Command actions

    CMD_LANG: 'Язык бота был изменен на: ',
    CMD_LANG_EN: 'Английский',
    CMD_LANG_RU: 'Русский',

    // Other messages

    MSG_GENERAL: 'Обычное сообщение',
  },
};
