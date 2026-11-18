/*
 * The TV's side: the installed apps, opening one, and switching to an HDMI input.
 * Samsung Tizen through its web APIs; in a desktop browser, a stand-in so the screen can be previewed.
 *
 * The Samsung calls follow Free My TV's web/tv.js (github.com/simbasjungles/free-my-tv),
 * MIT License, Copyright (c) 2026 Free My TV contributors.
 */
var TV = (function () {
  'use strict';

  var samsung = typeof window.tizen !== 'undefined' && !!window.tizen.application;
  var VIEWER = 'org.tizen.tv-viewer';   // Samsung's viewer shows whichever source the TV is on
  var self = '';
  if (samsung) { try { self = window.tizen.application.getCurrentApplication().appInfo.id; } catch (e) {} }

  var SAMPLE = [
    {id: 'sample.youtube', title: 'YouTube'}, {id: 'sample.prime', title: 'Prime Video'}, {id: 'sample.hulu', title: 'Hulu'},
    {id: 'sample.music', title: 'Apple Music'}, {id: 'sample.twitch', title: 'Twitch'}
  ];

  function apps(done) {
    if (!samsung) { setTimeout(function () { done(SAMPLE); }, 0); return; }
    try {
      window.tizen.application.getAppsInfo(function (list) {
        var out = [];
        for (var i = 0; i < list.length; i++) {
          var a = list[i];
          if (!a.id || a.id === self) continue;
          var icon = a.iconPath || '';
          if (icon && icon.indexOf('://') < 0) icon = 'file://' + icon;
          out.push({id: a.id, title: a.name || a.id, icon: icon, shown: a.show !== false});
        }
        done(out);
      }, function () { done([]); });
    } catch (e) { done([]); }
  }

  /** A POST to the TV's own server on port 8001 (DIAL), the fallback for apps launch() doesn't open. */
  function dial(name, done) {
    var x = new XMLHttpRequest(), over = false;
    x.open('POST', 'http://127.0.0.1:8001/ws/apps/' + name, true);
    x.timeout = 8000;
    x.onreadystatechange = function () { if (x.readyState === 4 && !over) { over = true; done(x.status === 200 || x.status === 201); } };
    x.ontimeout = x.onerror = function () { if (!over) { over = true; done(false); } };
    x.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    x.send('');
  }

  function launch(id, dialName, done) {
    if (!samsung) { done(true); return; }
    function failed() { if (dialName) dial(dialName, done); else done(false); }
    try { window.tizen.application.launch(id, function () { done(true); }, failed); } catch (e) { failed(); }
  }

  function sources(done) {
    try {
      window.tizen.systeminfo.getPropertyValue('VIDEOSOURCE', function (v) {
        done(v && v.connected ? v.connected.concat(v.disconnected || []) : null);
      }, function () { done(null); });
    } catch (e) { done(null); }
  }

  /** Puts the TV on HDMI <number>, then brings up Samsung's viewer to show it. */
  function hdmi(number, done) {
    if (!samsung) { done(true); return; }
    function show(ok) {
      if (!ok) { done(false); return; }
      launch(VIEWER, '', function (shown) {
        if (!shown) { try { window.tizen.application.getCurrentApplication().hide(); } catch (e) {} }
        done(true);
      });
    }
    sources(function (list) {
      var src = null;
      for (var i = 0; list && i < list.length; i++) if (list[i].type === 'HDMI' && list[i].number === number) src = list[i];
      if (!src) { show(false); return; }
      try { window.tizen.tvwindow.setSource(src, function () { show(true); }, function () { show(false); }); } catch (e) { show(false); }
    });
  }

  /** Live TV: the TV's tuner source, then Samsung's viewer (which plays the antenna, or Samsung TV Plus without one). */
  function liveTv(done) {
    if (!samsung) { done(true); return; }
    function show() {
      launch(VIEWER, '', function (shown) {
        if (!shown) { try { window.tizen.application.getCurrentApplication().hide(); } catch (e) {} }
        done(true);
      });
    }
    sources(function (list) {
      var src = null;
      for (var i = 0; list && i < list.length; i++) if (list[i].type === 'TV') src = list[i];
      if (!src) { show(); return; }
      try { window.tizen.tvwindow.setSource(src, show, show); } catch (e) { show(); }
    });
  }

  /** The remote's keys this page wants beyond the arrows, OK and Back. */
  function registerKeys() {
    if (!samsung || !window.tizen.tvinputdevice) return;
    ['MediaPlayPause', 'Info', 'ColorF0Red'].forEach(function (k) {
      try { window.tizen.tvinputdevice.registerKey(k); } catch (e) {}
    });
  }

  return {samsung: samsung, apps: apps, launch: launch, hdmi: hdmi, liveTv: liveTv, registerKeys: registerKeys};
})();
