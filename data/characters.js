/* =========================================================================
   ПЕРСОНАЖИ
   =========================================================================
   id            — уникальный код персонажа, латиницей, без пробелов
   name          — имя на странице
   role          — роль/должность
   status        — один из: "alive" | "dead" | "unknown"
   statusLabel   — подпись статуса, которая видна пользователю ("Жив" и т.п.)
   faction       — фракция/принадлежность
   locationId    — id локации из data/locations.js, или null
   shipId        — id корабля из data/ships.js, или null
   tags          — список коротких меток-чипов
   image         — путь/ссылка на портрет, или "" для авто-заглушки
   references    — список { src, caption } для референсов дизайна
   arts          — список { src, caption } для готовых артов
   shortBio      — короткая биография (видна в карточке-превью и списке)
   biography     — полная биография. Абзацы разделяйте ПУСТОЙ СТРОКОЙ
   historyNotes  — предыстория/бэкграунд, тем же образом абзацами
   Этот файл можно редактировать и через панель admin.html — она
   перезаписывает файл целиком (кавычки у ключей могут поменяться,
   на работу сайта это не влияет), и вручную, как обычно.
   ========================================================================= */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.characters = [
  {
    "id": "char-logan",
    "name": "Логан Лорец",
    "role": "Канонир",
    "status": "alive",
    "statusLabel": "Жив",
    "faction": "Испания",
    "locationId": "loc-siren-cove",
    "shipId": "ship-crimson-maw",
    "tags": [
      "канонир"
    ],
    "image": "",
    "references": [
      {
        "src": "",
        "caption": "Референс костюма — капитанский плащ"
      },
      {
        "src": "",
        "caption": "Референс — абордажная сабля с гравировкой"
      }
    ],
    "arts": [
      {
        "src": "",
        "caption": "Портрет за штурвалом"
      }
    ],
    "shortBio": "сяусяуся",
    "biography": "мимуимиуи",
    "historyNotes": "инфо инфо инфо"
  },
  {
    "id": "char-tomas",
    "name": "Томас Уэйнрайт",
    "role": "Капитан",
    "status": "alive",
    "statusLabel": "Жив",
    "faction": "Британия",
    "locationId": "loc-port-noire",
    "shipId": "ship-crimson-maw",
    "tags": [
      "Капитан"
    ],
    "image": "",
    "references": [],
    "arts": [],
    "shortBio": "руруру",
    "biography": "оуоуоуо",
    "historyNotes": "изизизи"
  },
  {
    "id": "char-dzheremi",
    "name": "Джереми",
    "role": "Говноед",
    "status": "alive",
    "statusLabel": "Жив",
    "faction": "Британия",
    "locationId": "loc-port-noire",
    "shipId": "ship-storm-wren",
    "tags": [
      "Говноед",
      "капитан"
    ],
    "image": "",
    "references": [],
    "arts": [],
    "shortBio": "авыаыва",
    "biography": "жваыжажы",
    "historyNotes": "авыывьы"
  }
];
