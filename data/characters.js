/* =========================================================================
   ПЕРСОНАЖИ
   =========================================================================
   id            — уникальный код персонажа, латиницей, без пробелов
   name          — имя на странице
   role          — роль/должность
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
    "faction": "Испания",
    "locationId": "loc-pab-grinkrou",
    "shipId": "ship-subbota",
    "tags": [
      "канонир"
    ],
    "image": "https://bugaga.ru/uploads/posts/2016-08/1470756070_koshki-piraty-4.jpg",
    "references": [
      {
        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLXYtJs1VEL4u-N6CNZZy_9Uni9fspdzJJonBl9RdMK0NlyaQjVdfQr83y&s=10",
        "caption": "Референс"
      }
    ],
    "arts": [],
    "shortBio": "сяусяуся",
    "biography": "мимуимиуи",
    "historyNotes": "инфо инфо инфо"
  },
  {
    "id": "char-tomas",
    "name": "Томас Уэйнрайт",
    "role": "Капитан",
    "faction": "Британия",
    "locationId": "loc-london",
    "shipId": "ship-subbota",
    "tags": [
      "капитан"
    ],
    "image": "https://bugaga.ru/uploads/posts/2016-08/1470756070_koshki-piraty-4.jpg",
    "references": [
      {
        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLXYtJs1VEL4u-N6CNZZy_9Uni9fspdzJJonBl9RdMK0NlyaQjVdfQr83y&s=10",
        "caption": "референс"
      }
    ],
    "arts": [],
    "shortBio": "руруру",
    "biography": "оуоуоуо",
    "historyNotes": "изизизи"
  },
  {
    "id": "char-dzheremi",
    "name": "Джереми",
    "role": "Капитан",
    "faction": "Британия",
    "locationId": "loc-pab-grinkrou",
    "shipId": "ship-meri",
    "tags": [
      "говноед",
      "капитан"
    ],
    "image": "https://bugaga.ru/uploads/posts/2016-08/1470756070_koshki-piraty-4.jpg",
    "references": [
      {
        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLXYtJs1VEL4u-N6CNZZy_9Uni9fspdzJJonBl9RdMK0NlyaQjVdfQr83y&s=10",
        "caption": "референс"
      }
    ],
    "arts": [],
    "shortBio": "авыаыва",
    "biography": "жваыжажы",
    "historyNotes": "авыывьы"
  }
];
