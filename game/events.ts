import { GameEvent } from './types';

export const EVENTS: GameEvent[] = [
  // === FOOD ===
  {
    id: 'bread_price',
    title: 'Хлеб подорожал',
    description: 'Цена на любимый хлеб выросла с 45 до 62 ₽. Опять.',
    icon: '🍞',
    category: 'food',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Купить', description: 'Заплатить больше', effects: { money: -200, comfort: 1 }, resultText: 'Хлеб куплен. Дороже, но вкусно.' },
      { label: 'Выбрать аналог', description: 'Другой хлеб', effects: { money: -120, comfort: -1 }, resultText: 'Купили другой хлеб. Не такой вкусный, зато дешевле.' },
      { label: 'Отказаться', description: 'Без хлеба', effects: { comfort: -3, energy: -2 }, resultText: 'Решили обойтись. Гречка, всё-таки.' },
    ],
  },
  {
    id: 'impulse_buy',
    title: 'Зашёл за хлебом',
    description: 'Ты зашёл в магазин за хлебом. Вышел с пакетом на 4 827 ₽. Ну, просто посмотрел скидки.',
    icon: '🛒',
    category: 'absurd',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Оставить всё', effects: { money: -4827, comfort: 5, happiness: 3 }, resultText: 'Зато теперь есть всё на полке. И хлеб в том числе.' },
      { label: 'Вернуть лишнее', effects: { money: -150, comfort: -1 }, resultText: 'Вернул половину. Хлеб остался.' },
    ],
  },
  {
    id: 'delivery_food',
    title: 'Устал после работы',
    description: 'Ты устал. Готовить не хочется. Доставка еды смотрит на тебя с пониманием.',
    icon: '🍔',
    category: 'food',
    rarity: 'common',
    weight: 3,
    conditions: { minEnergy: 0, maxEnergy: 50 },
    choices: [
      { label: 'Заказать доставку', effects: { money: -1200, comfort: 8, energy: 5, stress: -3 }, resultText: 'Вкусно. Баланс смотрит на тебя с укоризной.' },
      { label: 'Приготовить', effects: { energy: -5, comfort: -2 }, resultText: 'Гречка. Опять. Но деньги целы.' },
    ],
  },
  {
    id: 'shrinkflation',
    title: 'Пачка стала меньше',
    description: 'Пачка кофе стоит 249 ₽, но вес — 900 г вместо 1 кг. Поздравляем. Теперь ты платишь почти столько же за немного меньше продукта.',
    icon: '📦',
    category: 'food',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Взять', effects: { money: -249, comfort: 1 }, resultText: 'Кофе есть. Чуть меньше, но есть.' },
      { label: 'Найти другой', effects: { money: -180, comfort: -1 }, resultText: 'Нашёл другой. Дешевле, но не тот.' },
    ],
  },
  {
    id: 'grocery_haul',
    title: 'Поход в магазин',
    description: 'Нужно купить продукты на неделю. Кофе, мясо, овощи, крупы, бытовая химия...',
    icon: '🥬',
    category: 'food',
    rarity: 'common',
    weight: 4,
    choices: [
      { label: 'Эконом', description: 'Гречка, макароны, яйца', effects: { money: -3500, comfort: -3, energy: -1 }, resultText: 'Эконом режим. Гречка спасёт.' },
      { label: 'Нормально', description: 'Обычная еда', effects: { money: -6500, comfort: 2 }, resultText: 'Нормальная корзина. Всё как обычно.' },
      { label: 'Комфорт', description: 'Доставка, кафе', effects: { money: -12000, comfort: 8, happiness: 4 }, resultText: 'Живём один раз. Доставка победила.' },
    ],
  },

  // === TRANSPORT ===
  {
    id: 'taxi_or_bus',
    title: 'Опоздаешь на работу?',
    description: 'Утро. Автобус задерживается. До работы 20 минут. Опоздание грозит проблемами.',
    icon: '🚕',
    category: 'transport',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Такси — 1 100 ₽', effects: { money: -1100, energy: 3, reputation: 2 }, resultText: 'Успел. Такси — ошибка, но вовремя.', flag: 'taxi' },
      { label: 'Автобус — 70 ₽', effects: { money: -70, energy: -2, stress: 3 }, resultText: 'Автобус. Толпа. Но доехал.' },
      { label: 'Пешком', effects: { energy: -8, stress: 2, comfort: -2 }, resultText: 'Пришёл потный, но вовремя. Бесплатно.' },
    ],
  },
  {
    id: 'bus_delay',
    title: 'Автобус не пришёл',
    description: 'Маршрутка должна была быть 10 минут назад. Следующая — через 25 минут.',
    icon: '🚌',
    category: 'transport',
    rarity: 'common',
    weight: 2,
    choices: [
      { label: 'Ждать', effects: { energy: -3, stress: 4 }, resultText: 'Ждали. Пришла. Переполнена.' },
      { label: 'Пойти пешком', effects: { energy: -6 }, resultText: 'Пешком. Здоровье дороже, но не сегодня.' },
      { label: 'Вызвать такси', effects: { money: -900, energy: 2 }, resultText: 'Такси. Опять.', flag: 'taxi' },
    ],
  },
  {
    id: 'transport_price',
    title: 'Проезд снова стоит дороже',
    description: 'Проезд в автобусе подорожал с 40 до 70 ₽. Метро — с 50 до 80 ₽. Ничего личного, просто тарифы.',
    icon: '🎫',
    category: 'transport',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ну отлично', effects: { money: -300, stress: 3 }, resultText: 'Тарифы изменились. Счёт оказался выше ожидаемого.' },
    ],
  },

  // === CAR ===
  {
    id: 'flat_tire',
    title: 'Прокол колеса',
    description: 'Утром обнаружил спущенное колесо. Нужно чинить.',
    icon: '🛞',
    category: 'car',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Починить — 3 000 ₽', effects: { money: -3000, carCondition: -5 }, resultText: 'Колесо починено. Дорого, но надо.' },
      { label: 'Докатить до шиномонтажа', effects: { carCondition: -15, stress: 5 }, resultText: 'Доехал. Но диск повреждён.' },
    ],
  },
  {
    id: 'oil_change',
    title: 'Замена масла',
    description: 'Давно пора поменять масло в двигателе. Сервис напоминает каждый день.',
    icon: '🛢️',
    category: 'car',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Заменить — 6 000 ₽', effects: { money: -6000, carCondition: 10 }, resultText: 'Масло заменено. Машина довольна.' },
      { label: 'Потом', effects: { carCondition: -8, stress: 2 }, resultText: 'Потом. Потом. Всё потом.' },
    ],
  },
  {
    id: 'alternator',
    title: 'Сломался генератор',
    description: 'Машина не заводится. Генератор умер. Автомобиль просит 15 000 ₽.',
    icon: '🔧',
    category: 'car',
    rarity: 'rare',
    weight: 1,
    conditions: { hasCar: true },
    choices: [
      { label: 'Починить — 15 000 ₽', effects: { money: -15000, carCondition: 5 }, resultText: 'Починили. Автомобиль съел зарплату.' },
      { label: 'Искать запчасть на разборке', effects: { money: -8000, carCondition: -5, stress: 5 }, resultText: 'Нашёл дешевле. Риск есть, но работает.' },
      { label: 'Пока без машины', effects: { carCondition: -30, stress: 8, comfort: -5 }, resultText: 'Машина стоит. Езжу на автобусе.' },
    ],
  },
  {
    id: 'part_shortage',
    title: 'Нужной детали нет в наличии',
    description: 'Нужной запчасти нет в наличии. Логистический центр временно приостановил работу.',
    icon: '⚙️',
    category: 'car',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Заказать — ждать 12 дней', effects: { stress: 5, carCondition: -5 }, resultText: 'Заказали. Ждём. Автомобиль пока отдыхает.' },
      { label: 'Купить аналог — +4 000 ₽', effects: { money: -4000, carCondition: 3 }, resultText: 'Аналог куплен. Дороже, но быстрее.' },
      { label: 'Искать на разборке', effects: { money: -2000, carCondition: -3, stress: 3 }, resultText: 'Нашёл. Качество под вопросом.' },
    ],
  },

  // === FUEL ===
  {
    id: 'fuel_queue',
    title: 'Очередь на АЗС',
    description: 'На ближайшей заправке большая очередь. Горит индикатор топлива.',
    icon: '⛽',
    category: 'fuel',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Ждать', effects: { money: -2500, fuel: 30, energy: -3, stress: 3 }, resultText: 'Дождались. Заправились.' },
      { label: 'Поехать дальше', effects: { money: -3000, fuel: 25, stress: 2 }, resultText: 'Нашли дальше. Больше бензина потратили.' },
      { label: 'Развернуться', effects: { fuel: -5, stress: 4 }, resultText: 'Развернулись. Топливо на нуле.' },
    ],
  },
  {
    id: 'fuel_limit',
    title: 'Ограничение на АЗС',
    description: 'На АЗС действует временное ограничение: не более 20 литров в руки.',
    icon: '⛽',
    category: 'fuel',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Заправить 20 л — 1 040 ₽', effects: { money: -1040, fuel: 20 }, resultText: 'Заправили 20 литров. Бак не полный, но хватит.' },
      { label: 'Искать другую АЗС', effects: { money: -1300, fuel: 30, stress: 3 }, resultText: 'Нашли без ограничений. Больше бензина потрачено.' },
    ],
  },
  {
    id: 'fuel_price_up',
    title: 'Бензин снова подорожал',
    description: 'Стоимость топлива увеличилась. Это автоматически влияет на транспортные расходы.',
    icon: '⛽',
    category: 'fuel',
    rarity: 'uncommon',
    weight: 2,
    conditions: { hasCar: true },
    choices: [
      { label: 'Заправиться по новой цене', effects: { money: -2800, fuel: 35 }, resultText: 'Заправились. Дороже, но надо.' },
      { label: 'Отложить', effects: { fuel: -3, stress: 3 }, resultText: 'Решили потом. Риск.' },
    ],
  },
  {
    id: 'fuel_decision',
    title: 'Заправиться сейчас или потом?',
    description: 'Бак: 25%. До зарплаты: 8 дней. Заправиться — 3 500 ₽ или рискнуть.',
    icon: '⛽',
    category: 'fuel',
    rarity: 'common',
    weight: 3,
    conditions: { hasCar: true },
    choices: [
      { label: 'Заправиться — 3 500 ₽', effects: { money: -3500, fuel: 35, stress: -3 }, resultText: 'Заправились. Спокойствие дороже.' },
      { label: 'Рискнуть', effects: { fuel: -10, stress: 8 }, resultText: 'Риск. Если бензин закончится — будут проблемы.' },
    ],
  },

  // === MARKETPLACE ===
  {
    id: 'marketplace_order',
    title: 'Заказ на Мегабоксе',
    description: 'Новые наушники на Мегабоксе за 4 990 ₽. Доставка 0 ₽. Ну почти.',
    icon: '📦',
    category: 'marketplace',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Заказать — 4 990 ₽', effects: { money: -4990, comfort: 5, happiness: 4 }, resultText: 'Заказал. Ждём доставку.', flag: 'order' },
      { label: 'Не надо', effects: { comfort: -1 }, resultText: 'Не заказал. Разум победил. На этот раз.' },
    ],
  },
  {
    id: 'delivery_delay',
    title: 'Доставка задерживается',
    description: 'Сортировочный центр перегружен. Твой заказ задерживается на 4 дня.',
    icon: '📦',
    category: 'delivery',
    rarity: 'uncommon',
    weight: 2,
    conditions: { minMoney: 0 },
    choices: [
      { label: 'Ждать', effects: { stress: 3, comfort: -2 }, resultText: 'Ждём. Ещё 4 дня.' },
      { label: 'Отменить заказ', effects: { money: 4990, stress: -2, comfort: -3 }, resultText: 'Отменили. Деньги вернулись. Настроение — нет.' },
    ],
  },
  {
    id: 'logistics_failure',
    title: 'Логистический сбой',
    description: 'Региональный логистический центр временно приостановил работу из-за чрезвычайной ситуации. Заказ задерживается на 5-10 дней.',
    icon: '📦',
    category: 'delivery',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Ждать', effects: { stress: 5, comfort: -3 }, resultText: 'Ждём. Из-за чрезвычайной ситуации логистика временно нарушена.' },
      { label: 'Отменить заказ', effects: { money: 4990, stress: -1, comfort: -4 }, resultText: 'Отменили. Деньги вернулись.' },
    ],
  },
  {
    id: 'pickup_closed',
    title: 'Пункт выдачи закрыт',
    description: 'Пункт выдачи временно не работает. Нужно выбрать: подождать или поехать в другой пункт.',
    icon: '📍',
    category: 'delivery',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Подождать', effects: { stress: 3, comfort: -1 }, resultText: 'Ждём открытия пункта.' },
      { label: 'Поехать в другой', effects: { money: -400, stress: 2, comfort: 2 }, resultText: 'Поехали дальше. Дополнительные транспортные расходы.' },
    ],
  },
  {
    id: 'return_item',
    title: 'Товар не подошёл',
    description: 'Заказал вещь онлайн. Не подошла. Возврат стоит денег.',
    icon: '↩️',
    category: 'marketplace',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Вернуть — 350 ₽', effects: { money: -350, comfort: -1 }, resultText: 'Вернули. Почти всё вернули.' },
      { label: 'Оставить', effects: { money: -4990, comfort: 1, happiness: 1 }, resultText: 'Оставили. Может пригодится. Может.' },
      { label: 'Продать знакомому', effects: { money: -1500, comfort: 1 }, resultText: 'Продали знакомому. Потеряли часть денег, но вещь не у тебя.' },
    ],
  },
  {
    id: 'night_order',
    title: 'Заказ в 2 часа ночи',
    description: 'Ты заказал вещь в 2 часа ночи. Утром посмотрел на неё. Теперь ты не понимаешь, зачем она тебе.',
    icon: '🌙',
    category: 'absurd',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Оставить — 4 500 ₽', effects: { money: -4500, comfort: 1, happiness: -1 }, resultText: 'Оставил. Стоит на полке. Напоминает о ночи.' },
      { label: 'Вернуть', effects: { money: -350, comfort: -1 }, resultText: 'Возвращаем. 350 ₽ за возврат.' },
      { label: 'Продать', effects: { money: -2000, comfort: 1 }, resultText: 'Продали. Потеряли 2 000 ₽, но вещь ушла.' },
    ],
  },

  // === UTILITIES ===
  {
    id: 'new_tariffs',
    title: 'Новые тарифы',
    description: 'С нового расчётного периода сумма платежа увеличилась. Коммунальные расходы выросли.',
    icon: '💡',
    category: 'utilities',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ну отлично', effects: { money: -2000, stress: 4 }, resultText: 'Тарифы изменились. Счёт оказался выше ожидаемого.' },
    ],
  },
  {
    id: 'leaky_faucet',
    title: 'Протёк кран',
    description: 'Кран на кухне начал капать. Сантехник просит 2 500 ₽.',
    icon: '🚰',
    category: 'utilities',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Починить — 2 500 ₽', effects: { money: -2500, comfort: 2 }, resultText: 'Починили. Тихо. Сухо.' },
      { label: 'Починить самому', effects: { money: -8500, comfort: -3, stress: 8 }, resultText: 'Стоимость ремонта: 0 ₽. Стоимость последствий: 8 500 ₽.' },
      { label: 'Подложить тряпку', effects: { comfort: -3, stress: 3 }, resultText: 'Капает. Но тише. И в тряпку.' },
    ],
  },
  {
    id: 'high_electricity',
    title: 'Счёт за электричество выше',
    description: 'Счёт за электричество оказался на 1 800 ₽ больше обычного. Наверное, обогреватель.',
    icon: '⚡',
    category: 'utilities',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Оплатить — 1 800 ₽', effects: { money: -1800, stress: 2 }, resultText: 'Оплатили. Свет не отключат.' },
      { label: 'Экономить в следующем месяце', effects: { comfort: -3, stress: 1 }, resultText: 'Будем экономить. Тёмные вечера обеспечены.' },
    ],
  },
  {
    id: 'need_heater',
    title: 'Нужен обогреватель',
    description: 'Отопление слабое. В квартире +16. Нужно срочно купить обогреватель.',
    icon: '🔥',
    category: 'utilities',
    rarity: 'uncommon',
    weight: 2,
    conditions: { minMonth: 10, maxMonth: 12 },
    choices: [
      { label: 'Купить — 5 500 ₽', effects: { money: -5500, comfort: 8, happiness: 3 }, resultText: 'Купили. Тепло. Комфорт вернулся.' },
      { label: 'Терпеть', effects: { comfort: -8, energy: -5, stress: 5, happiness: -5 }, resultText: 'Терпим. Мёрзнем. Гречка греет изнутри.' },
    ],
  },

  // === INTERNET ===
  {
    id: 'mobile_internet_down',
    title: 'Мобильный интернет недоступен',
    description: 'В вашем районе временно ограничена работа мобильной передачи данных.',
    icon: '📵',
    category: 'internet',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ждать', effects: { stress: 4, comfort: -2 }, resultText: 'Ждём. Без интернета грустно.' },
      { label: 'Искать Wi-Fi', effects: { energy: -3, stress: 2, comfort: 1 }, resultText: 'Нашли Wi-Fi в кафе. Чашка чая — бонус.' },
      { label: 'Домашний интернет', effects: { comfort: 1 }, resultText: 'Домашний интернет работает. Спасение.' },
      { label: 'Перенести задачу', effects: { reputation: -3, stress: 3 }, resultText: 'Перенесли рабочую задачу. Коллега недоволен.' },
    ],
  },
  {
    id: 'laptop_update',
    title: 'Ноутбук решил обновиться',
    description: 'Ноутбук решил обновиться именно сейчас. За 10 минут до созвона.',
    icon: '💻',
    category: 'internet',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ждать обновление', effects: { stress: 6, reputation: -2 }, resultText: 'Ждали. Обновление. Созвон прошёл без тебя.' },
      { label: 'С телефона', effects: { stress: 3, comfort: -2 }, resultText: 'С телефона. Неудобно, но созвон состоялся.' },
    ],
  },
  {
    id: 'vpn_slow',
    title: 'VPN работает как калькулятор',
    description: 'VPN сегодня работает со скоростью калькулятора. Рабочая задача не грузится.',
    icon: '🐢',
    category: 'internet',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Терпеть', effects: { stress: 5, energy: -3, reputation: -2 }, resultText: 'Терпим. Медленно, но работает.' },
      { label: 'Перенести на завтра', effects: { reputation: -3, stress: 2 }, resultText: 'Перенесли. Завтра будет лучше. Наверное.' },
    ],
  },

  // === WORK ===
  {
    id: 'friday_task',
    title: 'Срочная задача в пятницу вечером',
    description: 'Коллега написал: "Есть минутка?" В пятницу. Вечером.',
    icon: '💼',
    category: 'work',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Сделать', effects: { energy: -10, stress: 5, reputation: 5 }, resultText: 'Сделал. Репутация растёт. Энергия падает.' },
      { label: 'Отказаться', effects: { energy: 3, reputation: -4, stress: -2 }, resultText: 'Отказал. Свободное время сохранено. Коллега запомнил.' },
    ],
  },
  {
    id: 'colleague_minute',
    title: '«Есть минутка?»',
    description: 'Коллега подошёл. Опять. "Есть минутка?" Минутка длится уже 40 минут.',
    icon: '💬',
    category: 'work',
    rarity: 'common',
    weight: 2,
    choices: [
      { label: 'Помочь', effects: { energy: -5, reputation: 2 }, resultText: 'Помог. Минутка. 40 минут.' },
      { label: 'Сосредоточиться на своём', effects: { reputation: -2, energy: 2 }, resultText: 'Сказал занят. Работаю дальше.' },
    ],
  },
  {
    id: 'salary_delay',
    title: 'Задержка зарплаты',
    description: 'Зарплату задерживают на 5 дней. Бухгалтерия разводит руками.',
    icon: '📅',
    category: 'work',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Ждать', effects: { stress: 8, comfort: -3 }, resultText: 'Ждём. До зарплаты ещё 5 дней. Баланс: 1 283 ₽. Паники нет.' },
      { label: 'Подработать', effects: { energy: -8, money: 5000, stress: 3 }, resultText: 'Нашёл подработку. 5 000 ₽. Не густо, но на гречку хватит.', flag: 'gig' },
    ],
  },

  // === CREDIT ===
  {
    id: 'credit_offer',
    title: 'Предложение кредита',
    description: 'Банк Успех предлагает кредит: +30 000 ₽ сейчас. Но появится ежемесячный платёж.',
    icon: '💳',
    category: 'credit',
    rarity: 'common',
    weight: 3,
    conditions: { maxMoney: 15000 },
    choices: [
      { label: 'Взять кредит', effects: { money: 30000, debt: 30000, monthlyPayment: 6000 }, resultText: 'Ты не стал богаче. Ты просто перенёс проблему.', flag: 'credit' },
      { label: 'Отказаться', effects: { stress: 3 }, resultText: 'Отказал. Без долгов. Пока.' },
    ],
  },
  {
    id: 'installment_offer',
    title: 'Рассрочка',
    description: 'Купить сейчас — платить потом. 12 000 ₽ разбиты на 3 месяца. Удобно же.',
    icon: '🧾',
    category: 'credit',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Взять рассрочку', effects: { money: -4000, debt: 8000, monthlyPayment: 4000 }, resultText: 'Взял. Ты не стал богаче. Ты просто перенёс проблему.', flag: 'credit' },
      { label: 'Не надо', effects: { comfort: -1 }, resultText: 'Не взял. Разум.' },
    ],
  },

  // === SUBSCRIPTIONS ===
  {
    id: 'forgotten_sub',
    title: 'Забытая подписка',
    description: 'Ты обнаружил подписку на фитнес-приложение, которой не пользовался 8 месяцев. 799 ₽/мес.',
    icon: '🔁',
    category: 'subscription',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Отменить', effects: { comfort: 2, happiness: 1 }, resultText: 'Отменил. 799 ₽/мес снова твои. Ну, будут.', flag: 'cancel_sub' },
      { label: 'Оставить', effects: { comfort: -1 }, resultText: 'Оставил. Может, в следующем месяце займусь.' },
    ],
  },
  {
    id: 'cancel_all_subs',
    title: 'Отменил все подписки',
    description: 'Ты отменил все подписки. Через три дня тебе нечего смотреть.',
    icon: '📺',
    category: 'subscription',
    rarity: 'uncommon',
    weight: 1,
    conditions: { minStress: 50 },
    choices: [
      { label: 'Вернуть одну', effects: { money: -399, comfort: 5, happiness: 3 }, resultText: 'Вернул киносервис. Жизнь налаживается.' },
      { label: 'Терпеть', effects: { comfort: -5, happiness: -5, stress: 3 }, resultText: 'Терпим. Свободное время — для гречки.' },
    ],
  },

  // === REPAIR ===
  {
    id: 'phone_broken',
    title: 'Телефон начал жить своей жизнью',
    description: 'Телефон сам открывает приложения, звонит контактам и разряжается за час.',
    icon: '📱',
    category: 'repair',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ремонт — 6 000 ₽', effects: { money: -6000, comfort: 3 }, resultText: 'Починили. Телефон снова твой.' },
      { label: 'Новый — 45 000 ₽', effects: { money: -45000, comfort: 10, happiness: 8 }, resultText: 'Новый! Шикарный. Кредит на него, но какой телефон!' },
      { label: 'Потерпеть', effects: { comfort: -5, stress: 5, happiness: -3 }, resultText: 'Терпим. Телефон звонит маме в 3 ночи.' },
    ],
  },
  {
    id: 'fridge_broken',
    title: 'Сломался холодильник',
    description: 'Холодильник перестал морозить. Продукты портятся.',
    icon: '🧊',
    category: 'repair',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Починить — 8 000 ₽', effects: { money: -8000, comfort: 3 }, resultText: 'Починили. Холод вернулся.' },
      { label: 'Купить новый — 35 000 ₽', effects: { money: -35000, comfort: 8, happiness: 5 }, resultText: 'Новый холодильник! Морозит как зверь.' },
      { label: 'Починить самому', effects: { money: -12000, comfort: -5, stress: 8 }, resultText: 'Стоимость ремонта: 0 ₽. Стоимость последствий: 12 000 ₽.' },
    ],
  },

  // === SOCIAL ===
  {
    id: 'birthday_friend',
    title: 'День рождения друга',
    description: 'Друг пригласил на день рождения. Подарить или поздравить сообщением?',
    icon: '🎂',
    category: 'social',
    rarity: 'common',
    weight: 3,
    choices: [
      { label: 'Подарок — 3 000 ₽', effects: { money: -3000, happiness: 5, comfort: 2 }, resultText: 'Подарил. Друг доволен. Ты доволен.' },
      { label: 'Поздравить сообщением', effects: { happiness: -2, comfort: 1 }, resultText: 'Отправил стикер. Друг понял. Или нет.' },
    ],
  },
  {
    id: 'visit_parents',
    title: 'Поездка к родителям',
    description: 'Родители зовут на выходные. Билеты, подарок, продукты...',
    icon: '🏠',
    category: 'social',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Поехать — 5 000 ₽', effects: { money: -5000, happiness: 8, comfort: 5, stress: -5 }, resultText: 'Поехал. Мама накормила. Счастье.' },
      { label: 'В следующий раз', effects: { happiness: -3, stress: 2 }, resultText: 'Не поехал. Совесть тихо ворчит.' },
    ],
  },

  // === GIG ===
  {
    id: 'gig_freelance',
    title: 'Подработка: фриланс',
    description: 'Можно взять небольшой заказ на фрилансе. 8 000 ₽ за 2 вечера работы.',
    icon: '💵',
    category: 'gig',
    rarity: 'common',
    weight: 3,
    conditions: { maxMoney: 30000 },
    choices: [
      { label: 'Взять', effects: { money: 8000, energy: -15, stress: 5 }, resultText: 'Взял. Подработка. 8 000 ₽. Энергии нет.', flag: 'gig' },
      { label: 'Отдохнуть', effects: { energy: 5, stress: -3 }, resultText: 'Отдых. Деньги придут. Наверное.' },
    ],
  },
  {
    id: 'gig_delivery',
    title: 'Подработка: доставка',
    description: 'Можно покататься с доставкой еды. 5 000 ₽ за вечер.',
    icon: '🛵',
    category: 'gig',
    rarity: 'common',
    weight: 3,
    conditions: { maxMoney: 25000 },
    choices: [
      { label: 'Взять', effects: { money: 5000, energy: -12, stress: 4 }, resultText: 'Доставил 12 заказов. 5 000 ₽. Ноги гудят.', flag: 'gig' },
      { label: 'Не надо', effects: { energy: 3 }, resultText: 'Не взял. Отдыхаем.' },
    ],
  },
  {
    id: 'sell_stuff',
    title: 'Продать ненужное',
    description: 'У тебя есть старый телефон. Купил за 50 000 ₽. Можно продать за 17 000 ₽.',
    icon: '💰',
    category: 'gig',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Продать', effects: { money: 17000, comfort: 2 }, resultText: 'Продал. Потерял 33 000 ₽, получил 17 000 ₽. Поздравляем.' },
      { label: 'Оставить', effects: { comfort: -1 }, resultText: 'Оставил. Лежит в ящике. На всякий случай.' },
    ],
  },

  // === ABSURD ===
  {
    id: 'bank_app',
    title: 'Открыл банковское приложение',
    description: 'Баланс: 4 312 ₽. Лучше бы не открывал.',
    icon: '🏦',
    category: 'absurd',
    rarity: 'uncommon',
    weight: 2,
    conditions: { maxMoney: 5000 },
    choices: [
      { label: 'Закрыть', effects: { stress: 5, comfort: -2 }, resultText: 'Закрыл. До зарплаты 6 дней. Всё идёт по плану.' },
      { label: 'Проверить ещё раз', effects: { stress: 8, comfort: -3 }, resultText: 'Тот же баланс. Странно. Ещё раз. Тот же.' },
    ],
  },
  {
    id: 'decided_to_save',
    title: 'Ты решил экономить',
    description: 'Ты твёрдо решил экономить. Полный решимости. Через 3 минуты ты заказал доставку.',
    icon: '💸',
    category: 'absurd',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Ну, бывает', effects: { money: -1200, comfort: 5, happiness: 3, stress: -2 }, resultText: 'Доставка вкусная. Экономия подождёт.' },
      { label: 'Отменить заказ', effects: { money: -100, stress: 3, comfort: -2 }, resultText: 'Отменил. Отмена стоит 100 ₽. Экономия.' },
    ],
  },
  {
    id: 'parking_fine',
    title: 'Штраф за парковку',
    description: 'Пришёл штраф за парковку. 3 000 ₽. Стоял 5 минут. Камера не дремлет.',
    icon: '🅿️',
    category: 'general',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Оплатить — 3 000 ₽', effects: { money: -3000, stress: 4 }, resultText: 'Оплатил. 5 минут стоили 3 000 ₽.' },
      { label: 'Оплатить со скидкой', effects: { money: -1500, stress: 2 }, resultText: 'Оплатил со скидкой 50%. Нужно было успеть в 20 дней.' },
    ],
  },
  {
    id: 'lost_keys',
    title: 'Потерял ключи',
    description: 'Ключи от квартиры пропали. Где — непонятно. Нужно менять замок.',
    icon: '🔑',
    category: 'general',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Сменить замок — 4 500 ₽', effects: { money: -4500, stress: 6 }, resultText: 'Замок сменили. Ключи так и не нашлись.' },
      { label: 'Искать ещё', effects: { energy: -5, stress: 4, money: -500 }, resultText: 'Искал 2 часа. Нашёл в кармане куртки. Не той куртки.' },
    ],
  },
  {
    id: 'lost_card',
    title: 'Потерял банковскую карту',
    description: 'Банковская карта пропала. Нужно перевыпускать.',
    icon: '💳',
    category: 'general',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Перевыпустить — 500 ₽', effects: { money: -500, stress: 3 }, resultText: 'Перевыпустили. Ждать 5 дней.' },
      { label: 'Заблокировать и жить без карты', effects: { stress: 5, comfort: -3 }, resultText: 'Живём без карты. Наличные рулят.' },
    ],
  },
  {
    id: 'found_money',
    title: 'Случайная находка',
    description: 'Нашёл 2 000 ₽ в кармане старой куртки. Забытое богатство!',
    icon: '🧥',
    category: 'general',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Отлично!', effects: { money: 2000, happiness: 5, comfort: 2 }, resultText: '2 000 ₽! Куртка окупилась.' },
    ],
  },
  {
    id: 'doctor_visit',
    title: 'Поход к врачу',
    description: 'Что-то болит. Нужно сходить к врачу. Платная клиника или бесплатная?',
    icon: '🏥',
    category: 'general',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Платная клиника — 5 000 ₽', effects: { money: -5000, comfort: 3, energy: 3 }, resultText: 'Сходил. Всё нормально. Дорого, но быстро.' },
      { label: 'Бесплатная поликлиника', effects: { energy: -8, stress: 5, comfort: -2 }, resultText: 'Сидел 3 часа. Врач сказал "пейте больше воды".' },
      { label: 'Сам пройдёт', effects: { energy: -3, stress: 3, comfort: -2 }, resultText: 'Само не прошло. Но пока терпим.' },
    ],
  },
  {
    id: 'dentist',
    title: 'Стоматолог',
    description: 'Зуб ноет. Стоматолог — это всегда дорого.',
    icon: '🦷',
    category: 'general',
    rarity: 'rare',
    weight: 1,
    choices: [
      { label: 'Лечить — 12 000 ₽', effects: { money: -12000, comfort: 5, happiness: 3 }, resultText: 'Полечили. Зуб спасён. Кошелёк нет.' },
      { label: 'Терпеть', effects: { comfort: -5, stress: 8, happiness: -5 }, resultText: 'Терпим. Боль — бесплатная.' },
    ],
  },
  {
    id: 'bonus',
    title: 'Премия на работе',
    description: 'Начальник выписал премию! 15 000 ₽. Неожиданно и приятно.',
    icon: '🎉',
    category: 'work',
    rarity: 'rare',
    weight: 1,
    conditions: { minReputation: 55 },
    choices: [
      { label: 'Отлично!', effects: { money: 15000, happiness: 8, stress: -5, comfort: 3 }, resultText: 'Премия! 15 000 ₽. Редкий зверь в этих краях.' },
    ],
  },
  {
    id: 'car_buy',
    title: 'Купить автомобиль?',
    description: 'Сосед продаёт машину. 120 000 ₽. Думал сэкономить на такси. Автомобиль просит денег.',
    icon: '🚗',
    category: 'car',
    rarity: 'uncommon',
    weight: 2,
    conditions: { minMoney: 100000 },
    choices: [
      { label: 'Купить — 120 000 ₽', effects: { money: -120000, comfort: 10, happiness: 8 }, resultText: 'Купил! Своя машина. Через месяц она попросит 23 000 ₽ на ремонт.', flag: 'buy_car' },
      { label: 'Не надо', effects: { comfort: -1 }, resultText: 'Не купил. Такси и автобус — наши верные друзья.' },
    ],
  },
  {
    id: 'stress_coffee',
    title: 'Кофе за 700 ₽',
    description: 'Ты настолько устал, что купил кофе за 700 ₽ и даже не заметил.',
    icon: '☕',
    category: 'general',
    rarity: 'uncommon',
    weight: 2,
    conditions: { minStress: 70 },
    choices: [
      { label: 'Ну, бодрость же', effects: { money: -700, energy: 3, stress: -2 }, resultText: 'Кофе выпит. 700 ₽. Бодрость. Кратковременная.' },
    ],
  },
  {
    id: 'commission',
    title: 'Комиссия банка',
    description: 'Списали комиссию за обслуживание. 350 ₽. Мелочь, а неприятно.',
    icon: '🏦',
    category: 'general',
    rarity: 'common',
    weight: 2,
    conditions: { maxMoney: 10000 },
    choices: [
      { label: 'Ну ладно', effects: { money: -350, stress: 2 }, resultText: 'Комиссия списана. Банк знает, как взять своё.' },
    ],
  },
  {
    id: 'repair_price_up',
    title: 'Цена ремонта выросла',
    description: 'Мастер сказал, что запчасти подорожали. Ремонт обойдётся дороже.',
    icon: '🔨',
    category: 'repair',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Оплатить — 7 000 ₽', effects: { money: -7000, stress: 3 }, resultText: 'Оплатил. Дороже, чем ожидал.' },
      { label: 'Отложить ремонт', effects: { comfort: -3, stress: 2 }, resultText: 'Отложили. Подкопим. Может, само починится.' },
    ],
  },
  {
    id: 'random_discount',
    title: 'Случайная скидка',
    description: 'На маркетплейсе скидка на то, что тебе нужно. 2 000 ₽ вместо 4 000 ₽.',
    icon: '🏷️',
    category: 'marketplace',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Купить — 2 000 ₽', effects: { money: -2000, comfort: 3, happiness: 2 }, resultText: 'Купил по скидке. Умный ход.', flag: 'order' },
      { label: 'Не нужно', effects: { comfort: -1 }, resultText: 'Не купил. Скидка — не повод тратить.' },
    ],
  },
  {
    id: 'no_purchase_sale',
    title: 'Распродажа на Мегабоксе',
    description: 'Большая распродажа! Всё со скидкой! Ноутбук за 35 000 ₽ вместо 50 000 ₽!',
    icon: '🛍️',
    category: 'marketplace',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Купить! Скидка же!', effects: { money: -35000, comfort: 5, happiness: 5 }, resultText: 'Купил! Маркетплейс победил. Но зато со скидкой.', flag: 'order' },
      { label: 'Не купил ничего', effects: { comfort: -1, happiness: 1 }, resultText: 'Не купил ничего на распродаже. Сила воли.', flag: 'no_purchase' },
    ],
  },
  {
    id: 'internet_gone_call',
    title: 'Интернет пропал перед созвоном',
    description: 'За 10 минут до важного созвона интернет исчез. Полностью.',
    icon: '📡',
    category: 'internet',
    rarity: 'uncommon',
    weight: 2,
    choices: [
      { label: 'Раздать с телефона', effects: { money: -200, stress: 3, reputation: 1 }, resultText: 'Раздал. Созвон прошёл. Трафик кончается.' },
      { label: 'Перенести созвон', effects: { reputation: -4, stress: 4 }, resultText: 'Перенесли. Коллега недоволен.' },
      { label: 'Идти в кафе', effects: { money: -500, stress: 2, comfort: -1 }, resultText: 'Кафе. Wi-Fi. Созвон. Кофе за 500 ₽.' },
    ],
  },
];

export function getAvailableEvents(state: any): GameEvent[] {
  return EVENTS.filter(event => {
    const cond = event.conditions;
    if (!cond) return true;
    if (cond.minMoney !== undefined && state.money < cond.minMoney) return false;
    if (cond.maxMoney !== undefined && state.money > cond.maxMoney) return false;
    if (cond.minStress !== undefined && state.stress < cond.minStress) return false;
    if (cond.maxStress !== undefined && state.stress > cond.maxStress) return false;
    if (cond.minEnergy !== undefined && state.energy < cond.minEnergy) return false;
    if (cond.maxEnergy !== undefined && state.energy > cond.maxEnergy) return false;
    if (cond.minMonth !== undefined && state.month < cond.minMonth) return false;
    if (cond.maxMonth !== undefined && state.month > cond.maxMonth) return false;
    if (cond.hasCar !== undefined && state.hasCar !== cond.hasCar) return false;
    if (cond.hasDebt !== undefined && (state.debt > 0) !== cond.hasDebt) return false;
    if (cond.hasCredit !== undefined && (state.credits.length > 0) !== cond.hasCredit) return false;
    if (cond.minDebt !== undefined && state.debt < cond.minDebt) return false;
    if (cond.minReputation !== undefined && state.reputation < cond.minReputation) return false;
    if (cond.difficulty !== undefined && !cond.difficulty.includes(state.difficulty)) return false;
    return true;
  });
}

export function pickRandomEvent(state: any): GameEvent | null {
  const available = getAvailableEvents(state);
  if (available.length === 0) return null;
  const weighted: GameEvent[] = [];
  for (const event of available) {
    const weight = event.weight || 1;
    for (let i = 0; i < weight; i++) weighted.push(event);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}
