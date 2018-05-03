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
    NEW_SUBS_WELCOME_01: 'Hi',
    NEW_SUBS_WELCOME_02: 'Welcome to BonanzaInst chat bot!',
    NEW_SUBS_WELCOME_03: 'By joining our program you will not only',
    NEW_SUBS_WELCOME_04: 'improve you Instagram account',
    NEW_SUBS_WELCOME_05: 'but also',
    NEW_SUBS_WELCOME_06: 'you can',
    NEW_SUBS_WELCOME_07: 'earn money',
    NEW_SUBS_WELCOME_08: 'inviting your friends!',
  },
  ru: {
    NEW_SUBS_WELCOME_01: 'Приветствуем',
    NEW_SUBS_WELCOME_02: 'Добро пожаловать в чат BonanzaInst',
    NEW_SUBS_WELCOME_03: 'Наша программа не только',
    NEW_SUBS_WELCOME_04: 'обеспечит продвижение твоего аккаунта Инстаграм',
    NEW_SUBS_WELCOME_05: 'но также',
    NEW_SUBS_WELCOME_06: 'ты сможешь',
    NEW_SUBS_WELCOME_07: 'получать деньги',
    NEW_SUBS_WELCOME_08: 'приглашая своих друзей!',
  },
};
