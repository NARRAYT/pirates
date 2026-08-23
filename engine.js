/* =========================================================================
   КОДЕКС ЧЁРНОГО ПРИЛИВА — движок сайта
   =========================================================================
   Этот файл менять НЕ нужно, чтобы добавить контент — весь текст сайта
   лежит в файлах data/*.js. Здесь только логика: роутинг и рендер страниц.

   К моменту запуска этого файла глобальный объект window.SITE_DATA уже
   собран из файлов data/site-info.js, data/locations.js, data/ships.js,
   data/characters.js, data/history.js и data/notes.js (они подключены
   в index.html раньше этого файла).
   ========================================================================= */

const DATA = window.SITE_DATA;

/* =========================================================================
   Вспомогательные функции
   ========================================================================= */

function escapeHTML(str){
  return String(str ?? "").replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[s]));
}

function paragraphize(text){
  if(!text) return "";
  return text.split(/\n\s*\n/).map(p =>
    `<p>${escapeHTML(p).replace(/\n/g,"<br>")}</p>`
  ).join("");
}

function hashStringToHue(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) % 360; }
  return Math.abs(h);
}

function placeholderImage(seed, label){
  const hue = 24 + (hashStringToHue(seed || label || "x") % 30);
  const c1 = `hsl(${hue},14%,19%)`;
  const c2 = `hsl(${hue+6},16%,29%)`;
  const initials = (label||"?").trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(234,217,179,0.25)" stroke-width="2"/>
    <text x="200" y="215" font-family="Georgia, serif" font-size="120" fill="rgba(234,217,179,0.85)" text-anchor="middle">${escapeHTML(initials)}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function imgTag(src, seed, label, cls){
  const fallback = placeholderImage(seed, label);
  const real = src && src.trim() ? escapeHTML(src) : fallback;
  return `<img class="${cls||''}" src="${real}" alt="${escapeHTML(label||'')}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}';">`;
}

function findLocation(id){ return DATA.locations.find(l => l.id === id); }
function findShip(id){ return DATA.ships.find(s => s.id === id); }
function findCharacter(id){ return DATA.characters.find(c => c.id === id); }

function charactersFor(ids){
  return (ids||[]).map(findCharacter).filter(Boolean);
}

function rosterHTML(chars){
  if(!chars.length) return `<p class="empty">Пока никто не привязан к этой записи.</p>`;
  return `<div class="roster">${chars.map(c => `
    <a class="roster-item" href="#character/${c.id}">
      ${imgTag(c.image, c.id, c.name)}
      <span>
        <span class="ri-name">${escapeHTML(c.name)}</span>
        <span class="ri-role">${escapeHTML(c.role)}</span>
      </span>
    </a>
  `).join("")}</div>`;
}

/* =========================================================================
   Навигация / роутинг
   ========================================================================= */

const ICONS = {
  anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v13"/><path d="M7 13c0 4 2.5 6.5 5 7 2.5-.5 5-3 5-7"/><path d="M4 13h4M16 13h4"/></svg>',
  scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a2 2 0 0 1 2 2v13a1 1 0 0 1-1.6.8L15 18"/><path d="M6 4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9"/><path d="M6 8h8M6 11h8"/></svg>',
  wheel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2"/><path d="M12 4.5V8M12 16v3.5M4.5 12H8M16 12h3.5M6.6 6.6l2.5 2.5M14.9 14.9l2.5 2.5M6.6 17.4l2.5-2.5M14.9 9.1l2.5-2.5"/></svg>',
  blades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"/><circle cx="4" cy="4" r="1.3" fill="currentColor" stroke="none"/><circle cx="20" cy="4" r="1.3" fill="currentColor" stroke="none"/></svg>',
  hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12"/><path d="M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>',
  quill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-7 1-12 6-13 13l-2 3 3-2C15 17 20 12 21 5"/><path d="M9 15l6-6"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L4 6.2v13.6L9 17.6l6 2.2 5-2.2V4L15 6.2 9 4z"/><path d="M9 4v13.6M15 6.2v13.6"/></svg>'
};

const NAV_TABS = [
  { route: "home", label: "Начало", icon: "anchor" },
  { route: "map", label: "Карта", icon: "map" },
  { route: "locations", label: "Локации", icon: "scroll" },
  { route: "ships", label: "Корабли", icon: "wheel" },
  { route: "characters", label: "Персонажи", icon: "blades" },
  { route: "history", label: "История", icon: "hourglass" },
  { route: "notes", label: "Заметки", icon: "quill" }
];

function buildSpineTabs(){
  const el = document.getElementById("spine-tabs");
  el.innerHTML = NAV_TABS.map(t => `
    <li class="spine-tab" data-route="${t.route}">
      <a href="#${t.route}">
        <span class="tab-icon" aria-hidden="true">${ICONS[t.icon]}</span>
        <span class="tab-label">${t.label}</span>
      </a>
    </li>
  `).join("");
}

function setActiveTab(route){
  document.querySelectorAll(".spine-tab").forEach(li => {
    li.classList.toggle("active", li.dataset.route === route);
  });
}

function parseHash(){
  const raw = location.hash.replace(/^#\/?/, "");
  const [route, id] = raw.split("/");
  return { route: route || "home", id: id ? decodeURIComponent(id) : null };
}

/* =========================================================================
   Рендер представлений
   ========================================================================= */

function renderHome(){
  return `
  <section class="view">
    <div class="log-hero">
      <h1>${escapeHTML(DATA.siteTitle)}</h1>
      ${DATA.siteTagline ? `<p class="lede">${escapeHTML(DATA.siteTagline)}</p>` : ""}
    </div>

    <div class="registry">
      <div class="cell"><span class="n">${DATA.locations.length}</span><span class="l">Локации</span></div>
      <div class="cell"><span class="n">${DATA.ships.length}</span><span class="l">Корабли</span></div>
      <div class="cell"><span class="n">${DATA.characters.length}</span><span class="l">Персонажи</span></div>
      <div class="cell"><span class="n">${DATA.historyTimeline.length}</span><span class="l">Вехи истории</span></div>
      <div class="cell"><span class="n">${DATA.notes.length}</span><span class="l">Заметки</span></div>
    </div>

    <h2>Общие сведения</h2>
    <div class="prose">${paragraphize(DATA.aboutInfo)}</div>
  </section>`;
}

// ---- карта архипелага ----
let mapSearchQuery = "";

function renderMap(){
  const pinned = DATA.locations.filter(l => typeof l.mapX === "number" && typeof l.mapY === "number");
  const hasImage = !!(DATA.mapImage && DATA.mapImage.trim());
  return `
  <section class="view">
    <h1>Карта архипелага</h1>
    <p class="section-intro">Нажать на метку, чтобы увидеть досье и перейти на её страницу.</p>

    <div class="map-search">
      <input type="search" id="map-search" placeholder="Поиск по названию" value="${escapeHTML(mapSearchQuery)}" aria-label="Поиск локации на карте">
    </div>

    <div class="map-wrap" id="map-wrap">
      ${hasImage
        ? `<img class="map-image" src="${escapeHTML(DATA.mapImage)}" alt="Карта" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='flex');">
           <div class="map-placeholder" style="display:none;">Не удалось загрузить картинку карты.</div>`
        : `<div class="map-placeholder">Картинки вообще нет.</div>`
      }
      <div class="map-pins">
        ${pinned.map(loc => `
          <div class="map-pin" data-id="${loc.id}" data-name="${escapeHTML(loc.name.toLowerCase())}" style="left:${loc.mapX}%; top:${loc.mapY}%;">
            <button class="map-pin-dot" type="button" aria-label="${escapeHTML(loc.name)} — открыть карточку"></button>
            <span class="map-pin-label">${escapeHTML(loc.name)}</span>
            <div class="map-pin-card">
              ${imgTag(loc.image, loc.id, loc.name, "thumb")}
              <div class="map-pin-card-body">
                <span class="card-type">${escapeHTML(loc.type)}</span>
                <h3>${escapeHTML(loc.name)}</h3>
                <p class="card-desc">${escapeHTML(loc.short)}</p>
                <a class="btn btn-ghost" href="#location/${loc.id}">Открыть досье &rarr;</a>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    ${!pinned.length ? `<p class="empty">Ни у одной локации не заданы координаты на карте (поля mapX / mapY в data/locations.js).</p>` : ""}
  </section>`;
}

let mapDocClickAttached = false;

function filterMapPins(query){
  const q = query.trim().toLowerCase();
  document.querySelectorAll(".map-pin").forEach(pin => {
    const name = pin.dataset.name || "";
    const match = !q || name.includes(q);
    pin.classList.toggle("dimmed", !match);
    pin.classList.toggle("highlight", !!q && match);
  });
}

function attachMapHandlers(){
  const wrap = document.getElementById("map-wrap");
  if(!wrap) return;
  wrap.addEventListener("click", e => {
    const dot = e.target.closest(".map-pin-dot");
    if(!dot) return;
    e.stopPropagation();
    const pin = dot.closest(".map-pin");
    const wasOpen = pin.classList.contains("open");
    wrap.querySelectorAll(".map-pin.open").forEach(p => p.classList.remove("open"));
    if(!wasOpen) pin.classList.add("open");
  });
  if(!mapDocClickAttached){
    document.addEventListener("click", () => {
      document.querySelectorAll(".map-pin.open").forEach(p => p.classList.remove("open"));
    });
    mapDocClickAttached = true;
  }
  const search = document.getElementById("map-search");
  if(search){
    search.addEventListener("input", e => {
      mapSearchQuery = e.target.value;
      filterMapPins(mapSearchQuery);
    });
  }
  filterMapPins(mapSearchQuery);
}

function renderLocationsList(){
  return `
  <section class="view">
    <h1>Локации</h1>
    <p class="section-intro">Сборник всех мест.</p>
    <div class="grid">
      ${DATA.locations.map(loc => `
        <a class="card" href="#location/${loc.id}">
          ${imgTag(loc.image, loc.id, loc.name, "thumb")}
          <span class="card-type">${escapeHTML(loc.type)}</span>
          <h3>${escapeHTML(loc.name)}</h3>
          <p class="card-desc">${escapeHTML(loc.short)}</p>
        </a>
      `).join("")}
    </div>
  </section>`;
}

function renderLocationDetail(id){
  const loc = findLocation(id);
  if(!loc) return renderNotFound();
  const chars = charactersFor(loc.characterIds);
  return `
  <section class="view">
    <a class="back-link" href="#locations">&larr; Все локации</a>
    <div class="detail-head">
      ${imgTag(loc.image, loc.id, loc.name, "portrait")}
      <div class="detail-facts">
        <span class="card-type">${escapeHTML(loc.type)}</span>
        <h1>${escapeHTML(loc.name)}</h1>
        <p class="prose">${escapeHTML(loc.short)}</p>
      </div>
    </div>
    <h2>История места</h2>
    <div class="prose">${paragraphize(loc.history)}</div>
    <h2>Персонажи</h2>
    ${rosterHTML(chars)}
  </section>`;
}

function renderShipsList(){
  return `
  <section class="view">
    <h1>Корабли</h1>
    <p class="section-intro">Всё, что держится на плаву.</p>
    <div class="grid">
      ${DATA.ships.map(sh => `
        <a class="card" href="#ship/${sh.id}">
          ${imgTag(sh.image, sh.id, sh.name, "thumb")}
          <span class="card-type">${escapeHTML(sh.type)}</span>
          <h3>${escapeHTML(sh.name)}</h3>
          <p class="card-desc">${escapeHTML(sh.short)}</p>
        </a>
      `).join("")}
    </div>
  </section>`;
}

function renderShipDetail(id){
  const sh = findShip(id);
  if(!sh) return renderNotFound();
  const chars = charactersFor(sh.characterIds);
  return `
  <section class="view">
    <a class="back-link" href="#ships">&larr; Все корабли</a>
    <div class="detail-head">
      ${imgTag(sh.image, sh.id, sh.name, "portrait")}
      <div class="detail-facts">
        <span class="card-type">${escapeHTML(sh.type)}</span>
        <h1>${escapeHTML(sh.name)}</h1>
        <p class="prose">${escapeHTML(sh.short)}</p>
      </div>
    </div>
    <h2>История корабля</h2>
    <div class="prose">${paragraphize(sh.history)}</div>
    <h2>Экипаж</h2>
    ${rosterHTML(chars)}
  </section>`;
}

// ---- персонажи: фильтр + поиск ----
let charFilterState = { q: "", role: "all", faction: "all", ship: "all", tag: "all" };

function uniqueValues(arr, key){
  return [...new Set(arr.map(x => x[key]).filter(Boolean))].sort();
}
function uniqueTags(arr){
  return [...new Set(arr.flatMap(x => x.tags||[]))].sort();
}
function uniqueShips(){
  return [...DATA.ships].sort((a,b) => a.name.localeCompare(b.name, "ru"));
}

function renderCharactersList(){
  const roles = uniqueValues(DATA.characters, "role");
  const factions = uniqueValues(DATA.characters, "faction");
  const ships = uniqueShips();
  const tags = uniqueTags(DATA.characters);
  return `
  <section class="view characters-view">
    <h1>Персонажи</h1>
    <p class="section-intro">Досье персов.</p>

    <div class="char-filters">
      <input type="search" id="char-search" placeholder="Поиск по имени" value="${escapeHTML(charFilterState.q)}" aria-label="Поиск персонажа по имени">
      <select id="filter-role" aria-label="Фильтр по роли">
        <option value="all">Все роли</option>
        ${roles.map(r => `<option value="${escapeHTML(r)}" ${charFilterState.role===r?'selected':''}>${escapeHTML(r)}</option>`).join("")}
      </select>
      <select id="filter-faction" aria-label="Фильтр по фракции">
        <option value="all">Все фракции</option>
        ${factions.map(f => `<option value="${escapeHTML(f)}" ${charFilterState.faction===f?'selected':''}>${escapeHTML(f)}</option>`).join("")}
      </select>
      <select id="filter-ship" aria-label="Фильтр по кораблю">
        <option value="all">Все корабли</option>
        <option value="none" ${charFilterState.ship==='none'?'selected':''}>Без корабля</option>
        ${ships.map(s => `<option value="${escapeHTML(s.id)}" ${charFilterState.ship===s.id?'selected':''}>${escapeHTML(s.name)}</option>`).join("")}
      </select>
      <select id="filter-tag" aria-label="Фильтр по метке">
        <option value="all">Все метки</option>
        ${tags.map(t => `<option value="${escapeHTML(t)}" ${charFilterState.tag===t?'selected':''}>${escapeHTML(t)}</option>`).join("")}
      </select>
      <button class="btn btn-ghost" id="filter-reset" type="button">Сбросить</button>
    </div>

    <p class="filter-count" id="char-count"></p>
    <div class="grid" id="char-grid"></div>
  </section>`;
}

function filterCharacters(){
  const q = charFilterState.q.trim().toLowerCase();
  return DATA.characters.filter(c => {
    if(q && !c.name.toLowerCase().includes(q)) return false;
    if(charFilterState.role !== "all" && c.role !== charFilterState.role) return false;
    if(charFilterState.faction !== "all" && c.faction !== charFilterState.faction) return false;
    if(charFilterState.ship === "none"){ if(c.shipId) return false; }
    else if(charFilterState.ship !== "all" && c.shipId !== charFilterState.ship) return false;
    if(charFilterState.tag !== "all" && !(c.tags||[]).includes(charFilterState.tag)) return false;
    return true;
  });
}

function renderCharacterCard(c){
  return `
    <a class="card" href="#character/${c.id}">
      ${imgTag(c.image, c.id, c.name, "thumb")}
      <span class="card-type">${escapeHTML(c.role)}</span>
      <h3>${escapeHTML(c.name)}</h3>
      <p class="card-desc">${escapeHTML(c.shortBio)}</p>
      <div class="card-tags">${(c.tags||[]).slice(0,3).map(t=>`<span class="chip">${escapeHTML(t)}</span>`).join("")}</div>
    </a>`;
}

function updateCharGrid(){
  const list = filterCharacters();
  document.getElementById("char-grid").innerHTML = list.length
    ? list.map(renderCharacterCard).join("")
    : `<p class="empty">По этим условиям никто не найден. Попробуйте сбросить фильтры.</p>`;
  document.getElementById("char-count").textContent = `Показано: ${list.length} из ${DATA.characters.length}`;
}

function attachCharacterFilterHandlers(){
  document.getElementById("char-search").addEventListener("input", e => {
    charFilterState.q = e.target.value; updateCharGrid();
  });
  document.getElementById("filter-role").addEventListener("change", e => {
    charFilterState.role = e.target.value; updateCharGrid();
  });
  document.getElementById("filter-faction").addEventListener("change", e => {
    charFilterState.faction = e.target.value; updateCharGrid();
  });
  document.getElementById("filter-ship").addEventListener("change", e => {
    charFilterState.ship = e.target.value; updateCharGrid();
  });
  document.getElementById("filter-tag").addEventListener("change", e => {
    charFilterState.tag = e.target.value; updateCharGrid();
  });
  document.getElementById("filter-reset").addEventListener("click", () => {
    charFilterState = { q:"", role:"all", faction:"all", ship:"all", tag:"all" };
    document.getElementById("app").innerHTML = renderCharactersList();
    attachCharacterFilterHandlers();
  });
  updateCharGrid();
}

function renderCharacterDetail(id){
  const c = findCharacter(id);
  if(!c) return renderNotFound();
  const loc = c.locationId ? findLocation(c.locationId) : null;
  const ship = c.shipId ? findShip(c.shipId) : null;

  const refs = (c.references||[]);
  const arts = (c.arts||[]);

  return `
  <section class="view">
    <a class="back-link" href="#characters">&larr; Все персонажи</a>
    <div class="detail-head">
      ${imgTag(c.image, c.id, c.name, "portrait")}
      <div class="detail-facts">
        <span class="card-type">${escapeHTML(c.role)}</span>
        <h1>${escapeHTML(c.name)}</h1>
        <table class="facts-table">
          <tr><td class="k">Фракция</td><td>${escapeHTML(c.faction)}</td></tr>
          <tr><td class="k">Локация</td><td>${loc ? `<a href="#location/${loc.id}">${escapeHTML(loc.name)}</a>` : "&mdash;"}</td></tr>
          <tr><td class="k">Корабль</td><td>${ship ? `<a href="#ship/${ship.id}">${escapeHTML(ship.name)}</a>` : "&mdash;"}</td></tr>
        </table>
        <div class="card-tags">${(c.tags||[]).map(t=>`<span class="chip">${escapeHTML(t)}</span>`).join("")}</div>
      </div>
    </div>

    ${refs.length ? `
      <h2>Референсы</h2>
      <div class="gallery">
        ${refs.map(r => `<figure>${imgTag(r.src, c.id+r.caption, r.caption)}<figcaption>${escapeHTML(r.caption||"")}</figcaption></figure>`).join("")}
      </div>` : ""}

    ${arts.length ? `
      <h2>Арты</h2>
      <div class="gallery">
        ${arts.map(a => `<figure>${imgTag(a.src, c.id+a.caption, a.caption)}<figcaption>${escapeHTML(a.caption||"")}</figcaption></figure>`).join("")}
      </div>` : ""}

    <h2>Биография</h2>
    <div class="prose">${paragraphize(c.biography)}</div>

    <h2>История персонажа</h2>
    <div class="prose">${paragraphize(c.historyNotes)}</div>
  </section>`;
}

function renderHistory(){
  return `
  <section class="view">
    <h1>История</h1>
    <p class="section-intro">Ключевые вехи мира в хронологическом порядке.</p>
    <div class="timeline">
      ${DATA.historyTimeline.map(h => `
        <div class="timeline-entry">
          <span class="t-date">${escapeHTML(h.date)}</span>
          <h3>${escapeHTML(h.title)}</h3>
          <p>${escapeHTML(h.text)}</p>
        </div>
      `).join("")}
    </div>
  </section>`;
}

// ---- заметки: простой фильтр по меткам ----
let noteTagFilter = "all";

function renderNotes(){
  const tags = uniqueTags(DATA.notes.map(n => ({tags:n.tags})));
  return `
  <section class="view">
    <h1>Заметки</h1>
    <p class="section-intro">Мелкие идеи, нестыковки и зацепки на будущее — то, что ещё не оформилось в полноценную статью.</p>
    <div class="note-filters" id="note-filters">
      <button class="chip-btn ${noteTagFilter==='all'?'active':''}" data-tag="all">Все</button>
      ${tags.map(t => `<button class="chip-btn ${noteTagFilter===t?'active':''}" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</button>`).join("")}
    </div>
    <div id="notes-list"></div>
  </section>`;
}

function updateNotesList(){
  const list = noteTagFilter === "all" ? DATA.notes : DATA.notes.filter(n => (n.tags||[]).includes(noteTagFilter));
  document.getElementById("notes-list").innerHTML = list.length ? list.map(n => `
    <div class="note-card">
      <h3>${escapeHTML(n.title)}</h3>
      <p>${n.text}</p>
      
      <div class="card-tags">${(n.tags||[]).map(t=>`<span class="chip">${escapeHTML(t)}</span>`).join("")}</div>
    </div>
  `).join("") : `<p class="empty">Заметок с такой меткой пока нет.</p>`;
}

function attachNotesHandlers(){
  document.getElementById("note-filters").addEventListener("click", e => {
    const btn = e.target.closest(".chip-btn");
    if(!btn) return;
    noteTagFilter = btn.dataset.tag;
    document.querySelectorAll("#note-filters .chip-btn").forEach(b => b.classList.toggle("active", b===btn));
    updateNotesList();
  });
  updateNotesList();
}

function renderNotFound(){
  return `
  <section class="view">
    <h1>Запись не найдена</h1>
    <p>Похоже, эта страница смыло за борт. <a href="#home">Вернуться на главную</a>.</p>
  </section>`;
}

/* =========================================================================
   Главный роутер
   ========================================================================= */

function render(){
  const { route, id } = parseHash();
  setActiveTab(route);
  const app = document.getElementById("app");

  switch(route){
    case "home":
      app.innerHTML = renderHome(); break;
    case "map":
      app.innerHTML = renderMap();
      attachMapHandlers();
      break;
    case "locations":
      app.innerHTML = renderLocationsList(); break;
    case "location":
      app.innerHTML = renderLocationDetail(id); break;
    case "ships":
      app.innerHTML = renderShipsList(); break;
    case "ship":
      app.innerHTML = renderShipDetail(id); break;
    case "characters":
      app.innerHTML = renderCharactersList();
      attachCharacterFilterHandlers();
      break;
    case "character":
      app.innerHTML = renderCharacterDetail(id); break;
    case "history":
      app.innerHTML = renderHistory(); break;
    case "notes":
      app.innerHTML = renderNotes();
      attachNotesHandlers();
      break;
    default:
      app.innerHTML = renderNotFound();
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

buildSpineTabs();
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
if(document.readyState !== "loading"){ render(); }
