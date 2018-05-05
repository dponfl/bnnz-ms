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
    NEW_SUBS_WELCOME_03: 'By joining our program you will not only ' +
    'improve you Instagram account but also you can ' +
    'earn money inviting your friends!',
    NEW_SUBS_INST_01: 'Please enter your Instagram login:',
    NEW_SUBS_INST_02: 'Please confirm that this is your Instagram login:',
    NEW_SUBS_INST_03: 'Your Instagram login was confirmed',
    NEW_SUBS_INST_04: 'Your Instagram login was not confirmed',
    NEW_SUBS_INST_05: 'You are about to start promoting your account. ',
    NEW_SUBS_INST_06: 'Just one final step left - please select your service plan and make payment',

    // New registration, the client was signed up already

    NEW_SUBS_EXISTS_01: 'You already have been registered at BonanzaInst',
    NEW_SUBS_EXISTS_02: 'Pls use keyboard to upload info about new Instagram post, etc.',

    // General actions

    ACT_NEW_POST: 'Upload Instagram post',
    ACT_PAY: 'Make monthly payment',
    ACT_FAQ: 'FAQ',
    ACT_WEB: 'Web site',
    ACT_YES: 'Yes',
    ACT_NO: 'No',

    // Command actions

    CMD_LANG: 'You have changed the bot language to: ',
    CMD_LANG_EN: 'English',
    CMD_LANG_RU: 'Russian',

    // Callback query

    CB_GEN: 'We received from you the following reply:',

    // Other messages

    MSG_GENERAL: 'Got message',

    // Payment plans

    PLAN_BRONZE: 'Bronze: 2000 RUB/month',
    PLAN_GOLD: 'Gold: 3500 RUB/month',
    PLAN_PLATINUM: 'Platinum: 5000 RUB/month',

    PLAN_BRONZE_THANKS_MSG: 'Congratulations! Plan "Bronze" is a really good decision!',
    PLAN_GOLD_THANKS_MSG: 'Congratulations! Plan "Gold" is a really perfect decision!',
    PLAN_PLATINUM_THANKS_MSG: 'Congratulations! Plan "Platinum" is a really awesome decision!',

    PLAN_BRONZE_THANKS_MSG_02: 'Congratulations! You just paid plan "Bronze"!',
    PLAN_GOLD_THANKS_MSG_02: 'Congratulations! You just paid plan "Gold"!',
    PLAN_PLATINUM_THANKS_MSG_02: 'Congratulations! You just paid plan "Platinum"!',

    PLAN_THANKS_MSG: 'By pressing "Make payment" button you accept ' +
    'Service Terms and Conditions and will be redirected to the payment system',

    PLAN_THANKS_MSG_02: 'Now you can upload your posts using the below button',


    PLAN_PAY_BUTTON: '>>> Make payment <<<',
    PLAN_TC_BUTTON: 'Terms & Conditions',

    POST_UPLOAD_BUTTON: 'Upload Instagram post',

  },
  ru: {

    // New registration, client was not signed up

    NEW_SUBS_WELCOME_01: 'Приветствуем',
    NEW_SUBS_WELCOME_02: 'Добро пожаловать в чат BonanzaInst',
    NEW_SUBS_WELCOME_03: 'Наша программа не только ' +
    'обеспечит продвижение твоего аккаунта Инстаграм, ' +
    'но также ты сможешь получать деньги приглашая своих друзей!',
    NEW_SUBS_INST_01: 'Введите свой логин в Инстаграм:',
    NEW_SUBS_INST_02: 'Подтвердите, что это твой профиль Инстаграм:',
    NEW_SUBS_INST_03: 'Твой профиль Инстаграм подтвержден',
    NEW_SUBS_INST_04: 'Твой профиль Инстаграм не подтвержден',
    NEW_SUBS_INST_05: 'Еще немного и ты сможешь получить продвижение твоего аккаунта. ',
    NEW_SUBS_INST_06: 'Остался всего один шаг - выбери план обслуживания и внеси платеж',

    // New registration, the client was signed up already

    NEW_SUBS_EXISTS_01: 'Вы уже зарегистрированы в BonanzaInst',
    NEW_SUBS_EXISTS_02: 'Используйте клавиатуру, чтобы загрузить информации о новом посте ' +
    'в Инстаграм и др.',

    // General actions

    ACT_NEW_POST: 'Загрузить пост Инстаграм',
    ACT_PAY: 'Внести платеж',
    ACT_FAQ: 'Помощь',
    ACT_WEB: 'Перейти на сайт',
    ACT_YES: 'Да',
    ACT_NO: 'Нет',

    // Command actions

    CMD_LANG: 'Язык бота был изменен на: ',
    CMD_LANG_EN: 'Английский',
    CMD_LANG_RU: 'Русский',

    // Callback query

    CB_GEN: 'От вас получен следующий ответ::',

    // Other messages

    MSG_GENERAL: 'Обычное сообщение',

    // Payment plans

    PLAN_BRONZE: 'Брозовый: 2000 руб/месяц',
    PLAN_GOLD: 'Золотой: 3500 руб/месяц',
    PLAN_PLATINUM: 'Платиновый: 5000 руб/месяц',

    PLAN_BRONZE_THANKS_MSG: 'Поздравляем! План "Бронзовый" - это хороший выбор!',
    PLAN_GOLD_THANKS_MSG: 'Поздравляем! План "Золотой" - это отличный выбор!',
    PLAN_PLATINUM_THANKS_MSG: 'Поздравляем! План "Платиновый" - это прекрасный выбор!',

    PLAN_BRONZE_THANKS_MSG_02: 'Поздравляем! Ты оплатил план "Бронзовый"!',
    PLAN_GOLD_THANKS_MSG_02: 'Поздравляем! Ты оплатил план "Золотой"!',
    PLAN_PLATINUM_THANKS_MSG_02: 'Поздравляем! Ты оплатил план "Платиновый"!',

    PLAN_THANKS_MSG: 'Нажимая кнопку "Оплатить" ты соглашаешся с ' +
    'Условиями оказания услуг и будешь перенаправлен на платежную систему',
    PLAN_THANKS_MSG_02: 'Теперь ты можешь загрузить свои посты используя кнопку ниже',

    PLAN_PAY_BUTTON: '>>> Оплатить <<<',
    PLAN_TC_BUTTON: 'Условиями оказания услуг',

    POST_UPLOAD_BUTTON: 'Загрузить пост Инстаграм',
  },
};
