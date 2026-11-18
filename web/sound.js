/* Small retro sounds, synthesized on the fly (no sound files). Sound.enabled turns them off. */
var Sound = (function () {
  'use strict';
  var ctx = null, master = null;

  function audio() {
    if (ctx) return ctx;
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    try {
      ctx = new A();
      master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  // One note: wave, start and end pitch (Hz), when (s from now), length (s), loudness.
  function note(type, f1, f2, at, len, vol) {
    var c = ctx, t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t);
    if (f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + len + 0.02);
  }

  var SOUNDS = {
    move: function () { note('square', 740, 620, 0, 0.045, 0.22); },
    tick: function () { note('square', 1320, 1320, 0, 0.03, 0.18); },
    open: function () { note('triangle', 523, 523, 0, 0.06, 0.5); note('triangle', 784, 784, 0.055, 0.06, 0.5); note('triangle', 1047, 1047, 0.11, 0.12, 0.5); },
    back: function () { note('triangle', 784, 784, 0, 0.06, 0.45); note('triangle', 523, 523, 0.06, 0.1, 0.45); },
    nope: function () { note('square', 196, 196, 0, 0.08, 0.25); note('square', 165, 165, 0.1, 0.12, 0.25); }
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
