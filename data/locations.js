/* =========================================================================
   ЛОКАЦИИ
   =========================================================================
   id            — уникальный код локации, латиницей, без пробелов
   name          — название на странице
   type          — короткая подпись типа места
   image         — путь/ссылка на картинку, или "" для авто-заглушки
   short         — короткое описание (видно в карточке-превью)
   history       — полный текст истории места. Абзацы разделяйте ПУСТОЙ СТРОКОЙ
   characterIds  — список id персонажей (data/characters.js), отмечаются
                   галочками в админке
   mapX, mapY    — положение метки на карте, в ПРОЦЕНТАХ (0-100)
   Этот файл можно редактировать и через панель admin.html — она
   перезаписывает файл целиком (кавычки у ключей могут поменяться,
   на работу сайта это не влияет), и вручную, как обычно.
   ========================================================================= */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.locations = [
  {
    "id": "loc-london",
    "name": "Лондон",
    "type": "ландан из зе кепитан оф грейт британ",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lWyS-OZu-ZMW7qMd8Jfa-1puFbD2-zQm7UjEetcS0w&s=10",
    "short": "озхохохо",
    "history": "хихихэи",
    "characterIds": [
      "char-tomas",
      "char-dzheremi"
    ],
    "mapX": 63.6,
    "mapY": 18.9
  },
  {
    "id": "loc-pab-grinkrou",
    "name": "Паб \"Гринкроу\"",
    "type": "паб на каком-то трущобном острове",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lWyS-OZu-ZMW7qMd8Jfa-1puFbD2-zQm7UjEetcS0w&s=10",
    "short": "ооох",
    "history": "ухххх",
    "characterIds": [
      "char-logan"
    ],
    "mapX": 57.2,
    "mapY": 47.9
  },
  {
    "id": "loc-nassau",
    "name": "Нассау",
    "type": "обоссау",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lWyS-OZu-ZMW7qMd8Jfa-1puFbD2-zQm7UjEetcS0w&s=10",
    "short": "завзаыа",
    "history": "ну хз",
    "characterIds": [
      "char-logan",
      "char-tomas"
    ],
    "mapX": 25.4,
    "mapY": 41.7
  }
];
