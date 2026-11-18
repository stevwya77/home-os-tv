/* HOME//OS: the home screen. Plain ES5 for Samsung's browser. */
(function () {
  'use strict';

  // MARK: - Settings (kept on the TV)

  // The weather's place: New York City.
  var PLACE = {lat: 40.71, lon: -73.94};
  var DEFAULTS = {ps5: 4, sw: 3, saver: 10};
  var prefs = load();
  function load() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem('homeos.prefs') || '{}') || {}; } catch (e) {}
    for (var k in DEFAULTS) if (!(k in p)) p[k] = DEFAULTS[k];
    return p;
  }
  function save() { try { localStorage.setItem('homeos.prefs', JSON.stringify(prefs)); } catch (e) {} }

  // MARK: - The carousel's items

  var G = {
    youtube: '<svg viewBox="0 0 24 24"><path fill="#ff0033" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    music: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',
    ps: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="13" rx="2"/><path d="M8 2.5l4 4 4-4"/><circle cx="18.5" cy="16.5" r="1.3" fill="#ff2d1f" stroke="none"/></svg>',
    joycons: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M10.5 2.5H7a4.5 4.5 0 0 0-4.5 4.5v10A4.5 4.5 0 0 0 7 21.5h3.5z"/><path d="M13.5 2.5H17a4.5 4.5 0 0 1 4.5 4.5v10a4.5 4.5 0 0 1-4.5 4.5h-3.5z"/><circle cx="6.5" cy="8" r="1.6" fill="#fff"/><circle cx="17.5" cy="15" r="1.6" fill="#fff"/></svg>'
  };

  // match: how the app is found among the TV's apps; dial: the TV's DIAL name, a fallback for opening it.
  var ITEMS = [
    {key: 'youtube', name: 'YOUTUBE', kind: 'VIDEO', hue: '#ff0033', bg: '#ffffff', tile: G.youtube + '<b style="color:#141414">YouTube</b>', match: /^youtube$/i, dial: 'YouTube'},
    {key: 'prime', name: 'PRIME VIDEO', kind: 'STREAMING', hue: '#0a7fc2', bg: '#00a8e1', tile: '<img src="icons/prime.png" alt="">', match: /prime video|amazon/i, dial: 'Amazon'},
    {key: 'hulu', name: 'HULU', kind: 'STREAMING', hue: '#00a35c', bg: '#0b0c0f', tile: '<b style="color:#1ce783;font-family:JBM;font-weight:800;font-size:46px;letter-spacing:-0.04em">hulu</b>', match: /^hulu/i},
    {key: 'music', name: 'APPLE MUSIC', kind: 'MUSIC', hue: '#e0193a', bg: '#fa2d48', tile: G.music + '<b style="color:#fff">Music</b>', match: /apple music/i},
    {key: 'twitch', name: 'TWITCH', kind: 'LIVE STREAMS', hue: '#7b2fff', bg: '#9146ff', tile: G.twitch + '<b style="color:#fff">twitch</b>', match: /^twitch/i},
    {key: 'ps5', name: 'PS5', kind: 'HDMI · GAME CONSOLE', hue: '#1414ff', bg: '#0b1a8c', tile: G.ps + '<b style="color:#fff">PS5</b>', port: 'ps5'},
    {key: 'live', name: 'LIVE TV', kind: 'ANTENNA · SAMSUNG TV', hue: '#141414', bg: '#141414', tile: G.live + '<b style="color:#fff">Live TV</b>', live: true},
    {key: 'switch', name: 'SWITCH', kind: 'HDMI · GAME CONSOLE', hue: '#e60012', bg: '#e60012', tile: G.joycons + '<b style="color:#fff">Switch</b>', port: 'sw'}
  ];

  var $ = function (id) { return document.getElementById(id); };
  var focus = 0, moving = false;

  function wrap(i) { var n = ITEMS.length; return ((i % n) + n) % n; }

  function cellHtml(off) {
    var it = ITEMS[wrap(focus + off)];
    var cls = 'cell5' + (off === 0 ? ' on' : '') + (Math.abs(off) >= 2 ? ' far' : '') + (it.port || it.live || it.id ? '' : ' missing');
    var sub = it.port ? '<span class="sub" style="color:' + (off === 0 ? '#fff' : '#4a4a46') + '">HDMI ' + prefs[it.port] + '</span>' : '';
    return '<div class="' + cls + '"><div class="tile" style="background:' + it.bg + '">' + it.tile + '</div>' + sub + '</div>';
  }

  function renderRail() {
    var html = '';
    for (var off = -3; off <= 3; off++) html += cellHtml(off);
    var track = $('track');
    track.className = '';
    track.style.transform = 'translateX(0)';
    track.innerHTML = html;
  }

  function renderHero() {
    var it = ITEMS[focus];
    document.documentElement.style.setProperty('--hue', it.hue);
    var h = $('heroName');
    h.textContent = it.name;
    h.style.fontSize = Math.min(320, Math.floor(1760 / (it.name.length * 0.78))) + 'px';
    h.className = '';
    void h.offsetWidth;
    h.className = 'swap';
    $('heroKind').textContent = it.port ? 'HDMI ' + prefs[it.port] + ' · GAME CONSOLE' : it.kind;
  }

  function move(d) {
    if (moving) return;
    moving = true;
    var track = $('track');
    track.className = 'slide';
    track.style.transform = 'translateX(' + (-d * 384) + 'px)';
    focus = wrap(focus + d);
    renderHero();
    setTimeout(function () { renderRail(); moving = false; }, 230);
  }

  function toast(text) {
    $('toast').textContent = text;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { $('toast').textContent = ''; }, 4000);
  }

  function open() {
    var it = ITEMS[focus];
    if (it.port) {
      TV.hdmi(prefs[it.port], function (ok) { if (!ok) toast('COULDN’T SWITCH TO HDMI ' + prefs[it.port] + '. IS ' + it.name + ' ON?'); });
      return;
    }
    if (it.live) { TV.liveTv(function (ok) { if (!ok) toast('COULDN’T OPEN LIVE TV'); }); return; }
    if (!it.id) { toast(it.name + ' ISN’T INSTALLED ON THIS TV'); return; }
    TV.launch(it.id, it.dial || '', function (ok) { if (!ok) toast('COULDN’T OPEN ' + it.name); });
  }

  function findApps() {
    TV.apps(function (list) {
      ITEMS.forEach(function (it) {
        if (!it.match) return;
        var best = null;
        list.forEach(function (a) {
          if (/kids|music/i.test(a.title) && it.key === 'youtube') return;
          if (it.match.test(a.title) && (!best || (a.shown && !best.shown))) best = a;
        });
        it.id = best ? best.id : '';
      });
      renderRail();
    });
  }

  // MARK: - Clock, date, weather

  var DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  function clockText(now) {
    var h = now.getHours(), m = now.getMinutes();
    return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + '<small>' + (h < 12 ? 'AM' : 'PM') + '</small>';
  }

  var lastDay = -1;
  function tick() {
    var now = new Date();
    $('clock').innerHTML = clockText(now);
    $('saverClock').innerHTML = clockText(now);
    $('date').textContent = DAYS[now.getDay()] + ' ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
    if (now.getDate() !== lastDay) { lastDay = now.getDate(); daily(now); }
  }

  var W = {
    sun: '<circle cx="22" cy="18" r="11" fill="#ffe08a" stroke="#141414" stroke-width="2"/><g stroke="#141414" stroke-width="2" stroke-linecap="round"><path d="M22 1v4M5 18h4M10 6l3 3M34 6l-3 3M10 30l3-3"/></g>',
    sunFull: '<circle cx="29" cy="23" r="12" fill="#ffe08a" stroke="#141414" stroke-width="2"/><g stroke="#141414" stroke-width="2" stroke-linecap="round"><path d="M29 2v5M29 39v5M8 23h5M45 23h5M14 8l4 4M44 8l-4 4M14 38l4-4M44 38l-4-4"/></g>',
    moon: '<path d="M30 6a16 16 0 1 0 16 22A13 13 0 0 1 30 6z" fill="#e6e0ff" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>',
    moonSmall: '<path d="M20 3a11 11 0 1 0 12 15A9 9 0 0 1 20 3z" fill="#e6e0ff" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>',
    cloud: '<path d="M20 43h27a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-6 18z" fill="#d9e6ff" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>',
    cloudHigh: '<path d="M16 34h29a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-8 18z" fill="#d9e6ff" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>',
    rain: '<g stroke="#4c7bff" stroke-width="2.4" stroke-linecap="round"><path d="M22 38l-3 6M32 38l-3 6M42 38l-3 6"/></g>',
    snow: '<g fill="#9fd3ff" stroke="#141414" stroke-width="1.2"><circle cx="21" cy="41" r="2.4"/><circle cx="31" cy="43" r="2.4"/><circle cx="41" cy="41" r="2.4"/></g>',
    bolt: '<path d="M33 35l-6 9h5l-3 7 9-11h-5l3-5z" fill="#ffd23f" stroke="#141414" stroke-width="1.6" stroke-linejoin="round"/>',
    fog: '<g stroke="#141414" stroke-width="2" stroke-linecap="round"><path d="M10 20h38M6 28h44M12 36h36" stroke="#9aa7bd"/></g>'
  };

  function weatherSvg(code, day) {
    var s;
    if (code === 0) s = day ? W.sunFull : W.moon;
    else if (code <= 2) s = (day ? W.sun : W.moonSmall) + W.cloud;
    else if (code === 3) s = W.cloud;
    else if (code === 45 || code === 48) s = W.fog;
    else if (code >= 71 && code <= 77 || code === 85 || code === 86) s = W.cloudHigh + W.snow;
    else if (code >= 95) s = W.cloudHigh + W.bolt;
    else s = W.cloudHigh + W.rain;
    return '<svg viewBox="0 0 58 50" role="img" aria-label="Weather">' + s + '</svg>';
  }

  function getJson(url, done) {
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.timeout = 15000;
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      var j = null;
      if (x.status === 200) { try { j = JSON.parse(x.responseText); } catch (e) {} }
      done(j);
    };
    x.ontimeout = function () {};
    x.send();
  }

  function weather() {
    getJson('https://api.open-meteo.com/v1/forecast?latitude=' + PLACE.lat + '&longitude=' + PLACE.lon +
      '&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=auto', function (j) {
      if (!j || !j.current) return;
      $('weather').innerHTML = weatherSvg(j.current.weather_code, j.current.is_day === 1) + '<b>' + Math.round(j.current.temperature_2m) + '°F</b>';
    });
  }

  // MARK: - History and quotes

  function dayOfYear(m, d) { return Math.floor((Date.UTC(2001, m - 1, d) - Date.UTC(2001, 0, 1)) / 86400000); }

  function pickHistory(now) {
    var today = dayOfYear(now.getMonth() + 1, now.getDate()), best = null, bestGap = 999, exact = [];
    HISTORY.forEach(function (h) {
      var gap = dayOfYear(h.m, h.d) - today;
      if (gap === 0) exact.push(h);
      var abs = Math.min(Math.abs(gap), 365 - Math.abs(gap));
      if (abs < bestGap || (abs === bestGap && gap > 0)) { best = h; bestGap = abs; }
    });
    if (exact.length) return {h: exact[now.getFullYear() % exact.length], label: 'ON THIS DAY'};
    var when = MONTHS[best.m - 1] + ' ' + best.d;
    return {h: best, label: bestGap <= 7 ? 'THIS WEEK · ' + when : 'FROM THE ARCHIVE · ' + when};
  }

  function daily(now) {
    var p = pickHistory(now), h = p.h;
    $('histLabel').textContent = 'WORKERS’ HISTORY · ' + p.label + ' · ' + h.place;
    $('histYear').textContent = h.y;
    $('histText').textContent = h.text;
    photo(h);

    var q = QUOTES[(dayOfYear(now.getMonth() + 1, now.getDate()) + now.getFullYear()) % QUOTES.length];
    var b = $('quoteText');
    b.textContent = '“' + q.t + '”';
    b.className = q.t.length > 70 ? 'smaller' : q.t.length > 40 ? 'small' : '';
    $('quoteBy').textContent = q.by;
  }

  function photo(h) {
    var el = $('photo');
    el.className = 'photo';
    el.style.backgroundImage = '';
    $('photoCredit').textContent = 'FIG. ' + h.y + ' · ' + h.place;
    getJson('https://en.wikipedia.org/api/rest_v1/page/summary/' + h.wiki, function (j) {
      var src = j && j.thumbnail && j.thumbnail.source;
      if (!src) return;
      src = src.replace(/\/(\d+)px-/, '/640px-');
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url("' + src + '")';
        el.className = 'photo has';
        $('photoCredit').textContent = 'FIG. ' + h.y + ' · IMAGE: WIKIPEDIA';
      };
      img.src = src;
    });
  }

  // MARK: - Screensaver: public-domain paintings from the Art Institute of Chicago

  var idleAt = Date.now(), saverOn = false, art = [], artIdx = 0, artLayer = 0, artTimer = null, infoTimer = null;

  function loadArt(done) {
    var page = 1 + Math.floor(Math.random() * 30);
    getJson('https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&query[term][artwork_type_title]=Painting' +
      '&fields=id,title,artist_title,date_display,image_id&limit=40&page=' + page, function (j) {
      art = (j && j.data || []).filter(function (a) { return a.image_id; });
      for (var i = art.length - 1; i > 0; i--) { var r = Math.floor(Math.random() * (i + 1)), t = art[i]; art[i] = art[r]; art[r] = t; }
      artIdx = 0;
      done();
    });
  }

  function nextArt() {
    if (!saverOn) return;
    if (!art.length || artIdx >= art.length) { loadArt(function () { if (art.length) nextArt(); }); return; }
    var a = art[artIdx++];
    var url = 'https://www.artic.edu/iiif/2/' + a.image_id + '/full/1686,/0/default.jpg';
    var img = new Image();
    img.onload = function () {
      if (!saverOn) return;
      var show = $(artLayer ? 'artB' : 'artA'), hide = $(artLayer ? 'artA' : 'artB');
      artLayer = 1 - artLayer;
      show.style.backgroundImage = 'url("' + url + '")';
      show.className = 'art show drift';
      hide.className = 'art';
      $('saverCaption').textContent = (a.title || '').toUpperCase() + ' / ' + (a.artist_title || 'UNKNOWN ARTIST').toUpperCase() +
        (a.date_display ? ', ' + a.date_display : '') + ' / ART INSTITUTE OF CHICAGO, PUBLIC DOMAIN';
    };
    img.onerror = function () { setTimeout(nextArt, 1000); };
    img.src = url;
  }

  // The clock and caption move every minute, so nothing sits still on the OLED.
  function moveInfo() {
    var info = $('saverInfo');
    info.style.left = (64 + Math.floor(Math.random() * 1000)) + 'px';
    info.style.top = (64 + Math.floor(Math.random() * 860)) + 'px';
  }

  function startSaver() {
    if (saverOn) return;
    saverOn = true;
    $('saver').className = '';
    moveInfo();
    nextArt();
    artTimer = setInterval(nextArt, 90000);
    infoTimer = setInterval(moveInfo, 60000);
  }

  function stopSaver() {
    saverOn = false;
    $('saver').className = 'hidden';
    $('artA').className = $('artB').className = 'art';
    clearInterval(artTimer); clearInterval(infoTimer);
  }

  // MARK: - Settings panel

  var panelOpen = false, row = 0;
  var ROWS = [
    {label: 'PS5 IS ON', key: 'ps5', values: [1, 2, 3, 4], show: function (v) { return 'HDMI ' + v; }},
    {label: 'SWITCH IS ON', key: 'sw', values: [1, 2, 3, 4], show: function (v) { return 'HDMI ' + v; }},
    {label: 'ART SCREENSAVER AFTER', key: 'saver', values: [5, 10, 20, 30, 0], show: function (v) { return v ? v + ' MIN' : 'OFF'; }}
  ];

  function renderPanel() {
    $('settingsRows').innerHTML = ROWS.map(function (r, i) {
      return '<div class="row' + (i === row ? ' focus' : '') + '"><span>' + r.label + '</span><b>◀ ' + r.show(prefs[r.key]) + ' ▶</b></div>';
    }).join('');
  }

  function openPanel() { panelOpen = true; row = 0; $('settings').className = ''; renderPanel(); }
  function closePanel() { panelOpen = false; $('settings').className = 'hidden'; renderRail(); }

  function changeRow(d) {
    var r = ROWS[row], i = r.values.indexOf(prefs[r.key]);
    prefs[r.key] = r.values[(i + d + r.values.length) % r.values.length];
    save();
    renderPanel();
  }

  // MARK: - Remote

  var topFocus = false;
  function setTopFocus(on) { topFocus = on; $('settingsBtn').className = 'chamfer' + (on ? ' focus' : ''); }

  var KEY = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, OK: 13, BACK: 10009, ESC: 27, BACKSPACE: 8};

  document.addEventListener('keydown', function (e) {
    idleAt = Date.now();
    var k = e.keyCode;
    if (saverOn) { stopSaver(); e.preventDefault(); return; }
    if (panelOpen) {
      if (k === KEY.UP) row = (row + ROWS.length - 1) % ROWS.length;
      else if (k === KEY.DOWN) row = (row + 1) % ROWS.length;
      else if (k === KEY.LEFT) changeRow(-1);
      else if (k === KEY.RIGHT || k === KEY.OK) changeRow(1);
      else if (k === KEY.BACK || k === KEY.ESC || k === KEY.BACKSPACE) closePanel();
      if (panelOpen) renderPanel();
      e.preventDefault();
      return;
    }
    if (topFocus) {
      if (k === KEY.OK) { setTopFocus(false); openPanel(); }
      else if (k === KEY.DOWN || k === KEY.BACK || k === KEY.ESC) setTopFocus(false);
      e.preventDefault();
      return;
    }
    if (k === KEY.LEFT) move(-1);
    else if (k === KEY.RIGHT) move(1);
    else if (k === KEY.OK) open();
    else if (k === KEY.UP) setTopFocus(true);
    // Back on the home screen does nothing: this is home.
    e.preventDefault();
  });

  // Screensaver check, every 15 s.
  setInterval(function () {
    if (!saverOn && !panelOpen && prefs.saver && Date.now() - idleAt > prefs.saver * 60000) startSaver();
  }, 15000);

  // Coming back from an app: start fresh.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { idleAt = Date.now(); stopSaver(); tick(); weather(); }
  });

  // MARK: - Start

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    $('stage').style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  TV.registerKeys();
  renderHero();
  renderRail();
  findApps();
  tick();
  setInterval(tick, 10000);
  weather();
  setInterval(weather, 15 * 60000);
  if (/[?&]saver/.test(location.search)) startSaver();
})();
