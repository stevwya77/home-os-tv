/*
 * Keyboard sounds, synthesized on the fly (no sound files). Sound.enabled turns them off.
 *  - tap: a tactile "brown switch" key, a soft thock with a little bump and no click (moving).
 *  - click: a clicky "blue switch" key, a sharp click on the way down and a lighter one back up (opening).
 *  - back: the same click, a little lower and duller (going back).
 */
var Sound = (function () {
  'use strict';
  var ctx = null, master = null, noise = null;

  function audio() {
    if (ctx) return ctx;
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    try {
      ctx = new A();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      // Half a second of white noise, reused by every key.
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      var d = noise.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ctx = null; }
    return ctx;
  }

  function vary(x, amount) { return x * (1 + (Math.random() * 2 - 1) * amount); }

  /** A burst of filtered noise: the contact and the plastic of a key. */
  function burst(at, len, type, freq, q, vol) {
    var t = ctx.currentTime + at, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise;
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.4, len + 0.02);
  }

  /** A short falling tone: the body of the keyboard ringing ("thock"). */
  function body(at, from, to, len, vol) {
    var t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + len + 0.02);
  }

  function tap() {
    burst(0, 0.018, 'bandpass', vary(1500, 0.12), 0.9, 0.35);     // the soft bump
    body(0.004, vary(230, 0.08), 120, 0.05, 0.28);                // the bottom-out thock
    burst(0.006, 0.03, 'lowpass', 700, 0.7, 0.18);                // a little low rattle
  }

  function click(pitch) {
    burst(0, 0.008, 'highpass', 3800 * pitch, 0.8, 0.55);         // the click jacket snapping down
    burst(0.002, 0.012, 'bandpass', vary(5200, 0.06) * pitch, 2, 0.35);
    body(0.006, 260 * pitch, 130 * pitch, 0.06, 0.3);             // bottoming out
    burst(0.07, 0.007, 'highpass', 3200 * pitch, 0.8, 0.28);      // the lighter click on the way back up
  }

  var SOUNDS = {
    move: tap,
    tick: tap,
    open: function () { click(1); },
    back: function () { click(0.72); },
    nope: function () { tap(); setTimeout(function () { if (ctx) tap(); }, 90); }
  };

  var api = {
    enabled: true,
    play: function (name) {
      if (!api.enabled || !SOUNDS[name] || !audio()) return;
      try {
        if (ctx.state === 'suspended') ctx.resume();
        SOUNDS[name]();
      } catch (e) {}
    }
  };
  return api;
})();
