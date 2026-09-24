/**
 * AIF-C01 Exam Sim — exam engine.
 *
 * A full-exam simulator rather than a practice quiz: it draws a 65-question
 * paper, runs a 90-minute countdown, withholds all feedback until you submit,
 * then reports a scaled 100–1000 score against the 700 pass mark plus a
 * per-domain breakdown.
 *
 * Views:  intro → exam → report → review
 *
 * An in-progress paper is checkpointed to localStorage on every answer and
 * every timer tick, so a reload or a closed tab resumes where you left off
 * with the clock still honest (it is derived from a wall-clock deadline, not
 * from a counter that pauses when the tab sleeps).
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------- exam spec */
  var SPEC = {
    questions: 65,          // items on a real AIF-C01 paper
    minutes: 90,            // official time limit
    passScaled: 700,        // scaled pass mark, on a 100–1000 range
    scaleMin: 100,
    scaleMax: 1000,
    readyLine: 70,          // per-domain % below which we suggest review
  };

  var KEY_SESSION = "aifc01sim.session.v1";  // the in-progress paper
  var KEY_RESULTS = "aifc01sim.results.v1";  // past attempts
  var KEY_THEME   = "aifc01sim.theme.v1";
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  var DOMAINS = window.EXAM_DOMAINS || {};
  var BANK = window.EXAM_QUESTIONS || [];

  /* ------------------------------------------------------------- utilities */
  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /** mm:ss, or h:mm:ss once we're over an hour. */
  function fmtClock(ms) {
    var total = Math.max(0, Math.round(ms / 1000));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    return h > 0 ? h + ":" + pad(m) + ":" + pad(s) : pad(m) + ":" + pad(s);
  }

  /** "1 h 12 min", for prose rather than a countdown. */
  function fmtDuration(ms) {
    var mins = Math.round(ms / 60000);
    if (mins < 60) return mins + " min";
    return Math.floor(mins / 60) + " h " + (mins % 60) + " min";
  }

  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        " · " + new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (e) { return ""; }
  }

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  function drop(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------- app state */
  var state = {
    view: "intro",       // intro | exam | report | review
    session: null,       // the paper being sat, or the one just submitted
    index: 0,
    reviewFilter: "all", // all | wrong | flagged
    dialog: null,        // { title, body, confirmLabel, danger, onConfirm }
    tick: null,
  };

  /* ----------------------------------------------------------- paper build */
  /**
   * Draw a paper. The bank is larger than one paper, so each attempt sees a
   * different subset in a different order, with each question's options
   * shuffled too — which is why no explanation may refer to an option letter.
   */
  function buildPaper() {
    var count = Math.min(SPEC.questions, BANK.length);
    var picked = shuffle(BANK).slice(0, count);

    var items = picked.map(function (q) {
      var opts = shuffle(q.options).map(function (o) {
        return { text: o.text, correct: !!o.correct };
      });
      return {
        id: q.id,
        domain: q.domain,
        prompt: q.prompt,
        explanation: q.explanation,
        options: opts,
        multi: opts.filter(function (o) { return o.correct; }).length > 1,
        picked: [],      // indexes into options
        flagged: false,
      };
    });

    var now = Date.now();
    return {
      startedAt: now,
      deadline: now + SPEC.minutes * 60000,
      submittedAt: null,
      timedOut: false,
      items: items,
    };
  }

  function remaining() {
    if (!state.session) return 0;
    if (state.session.submittedAt) return Math.max(0, state.session.deadline - state.session.submittedAt);
    return Math.max(0, state.session.deadline - Date.now());
  }

  function answeredCount(s) {
    return s.items.filter(function (i) { return i.picked.length > 0; }).length;
  }

  function flaggedCount(s) {
    return s.items.filter(function (i) { return i.flagged; }).length;
  }

  function isRight(item) {
    var key = [];
    item.options.forEach(function (o, i) { if (o.correct) key.push(i); });
    if (item.picked.length !== key.length) return false;
    return key.every(function (i) { return item.picked.indexOf(i) !== -1; });
  }

  function persist() {
    if (state.session && !state.session.submittedAt) save(KEY_SESSION, state.session);
  }

  /* ---------------------------------------------------------------- scoring */
  /**
   * AWS reports AIF-C01 on a scaled 100–1000 range with a 700 pass mark, and
   * does not publish the raw-to-scaled mapping. We use the straightforward
   * linear interpolation that puts 70% correct exactly on the 700 line, which
   * makes the number comparable to the real report without pretending to
   * reproduce AWS's actual (undisclosed) equating.
   */
  function scaledFrom(pct) {
    var scaled;
    if (pct <= 70) {
      scaled = SPEC.scaleMin + (pct / 70) * (SPEC.passScaled - SPEC.scaleMin);
    } else {
      scaled = SPEC.passScaled + ((pct - 70) / 30) * (SPEC.scaleMax - SPEC.passScaled);
    }
    return Math.round(clamp(scaled, SPEC.scaleMin, SPEC.scaleMax));
  }

  function grade(s) {
    var correct = 0;
    var byDomain = {};
    Object.keys(DOMAINS).forEach(function (k) { byDomain[k] = { right: 0, total: 0 }; });

    s.items.forEach(function (item) {
      var ok = isRight(item);
      if (ok) correct++;
      if (!byDomain[item.domain]) byDomain[item.domain] = { right: 0, total: 0 };
      byDomain[item.domain].total++;
      if (ok) byDomain[item.domain].right++;
    });

    var pct = s.items.length ? (correct / s.items.length) * 100 : 0;
    var scaled = scaledFrom(pct);

    var weak = Object.keys(byDomain).filter(function (k) {
      var d = byDomain[k];
      return d.total > 0 && (d.right / d.total) * 100 < SPEC.readyLine;
    });

    return {
      correct: correct,
      total: s.items.length,
      pct: pct,
      scaled: scaled,
      passed: scaled >= SPEC.passScaled,
      byDomain: byDomain,
      weak: weak,
      elapsed: (s.submittedAt || Date.now()) - s.startedAt,
      unanswered: s.items.length - answeredCount(s),
    };
  }

  /* ------------------------------------------------------------- lifecycle */
  function startExam(fresh) {
    state.session = fresh;
    state.index = 0;
    state.view = "exam";
    persist();
    startTick();
    render();
  }

  function submitExam(timedOut) {
    if (!state.session || state.session.submittedAt) return;
    stopTick();
    state.session.submittedAt = Date.now();
    state.session.timedOut = !!timedOut;
    drop(KEY_SESSION);

    var g = grade(state.session);
    var results = load(KEY_RESULTS, []);
    results.unshift({
      at: state.session.submittedAt,
      scaled: g.scaled,
      correct: g.correct,
      total: g.total,
      passed: g.passed,
      elapsed: g.elapsed,
      timedOut: !!timedOut,
    });
    save(KEY_RESULTS, results.slice(0, 20));

    state.view = "report";
    state.dialog = null;
    window.scrollTo(0, 0);
    render();
  }

  function abandonExam() {
    stopTick();
    drop(KEY_SESSION);
    state.session = null;
    state.index = 0;
    state.view = "intro";
    state.dialog = null;
    window.scrollTo(0, 0);
    render();
  }

  function goIntro() {
    state.session = null;
    state.view = "intro";
    state.reviewFilter = "all";
    window.scrollTo(0, 0);
    render();
  }

  /* ------------------------------------------------------------------ timer */
  function startTick() {
    stopTick();
    state.tick = setInterval(function () {
      if (!state.session || state.session.submittedAt) { stopTick(); return; }
      if (remaining() <= 0) { submitExam(true); return; }
      paintClock();
      // Cheap checkpoint so a crash loses at most a few seconds of the clock.
      if (Math.round(remaining() / 1000) % 15 === 0) persist();
    }, 1000);
  }

  function stopTick() {
    if (state.tick) { clearInterval(state.tick); state.tick = null; }
  }

  /** Repaint just the clock and counter, so we don't rebuild the DOM each second. */
  function paintClock() {
    var host = el("status");
    if (!host || !state.session || state.session.submittedAt) return;
    var left = remaining();
    var clock = host.querySelector(".clock");
    if (clock) {
      clock.textContent = fmtClock(left);
      clock.className = "clock" + (left <= 60000 ? " clock--danger" : left <= 300000 ? " clock--warn" : "");
      clock.setAttribute("aria-label", fmtClock(left) + " remaining");
    }
    var counter = host.querySelector(".counter");
    if (counter) counter.textContent = answeredCount(state.session) + "/" + state.session.items.length;
  }

  /* -------------------------------------------------------------- answering */
  function pick(optIndex) {
    var item = state.session.items[state.index];
    if (!item || state.session.submittedAt) return;
    if (item.multi) {
      var at = item.picked.indexOf(optIndex);
      if (at === -1) item.picked.push(optIndex); else item.picked.splice(at, 1);
      item.picked.sort();
    } else {
      item.picked = item.picked.length === 1 && item.picked[0] === optIndex ? [] : [optIndex];
    }
    persist();
    render();
  }

  function toggleFlag() {
    var item = state.session.items[state.index];
    if (!item) return;
    item.flagged = !item.flagged;
    persist();
    render();
  }

  function goTo(i) {
    state.index = clamp(i, 0, state.session.items.length - 1);
    window.scrollTo(0, 0);
    render();
  }

  function askSubmit() {
    var s = state.session;
    var blank = s.items.length - answeredCount(s);
    var flags = flaggedCount(s);
    var lines = [];
    if (blank > 0) lines.push("<li><b>" + blank + "</b> question" + (blank === 1 ? "" : "s") + " still unanswered — " + (blank === 1 ? "it counts" : "they count") + " as wrong.</li>");
    if (flags > 0) lines.push("<li><b>" + flags + "</b> flagged for review.</li>");
    lines.push("<li><b>" + fmtClock(remaining()) + "</b> still on the clock.</li>");

    state.dialog = {
      title: "Submit your exam?",
      body: "You can't change answers afterwards." + "<ul>" + lines.join("") + "</ul>",
      confirmLabel: "Submit exam",
      danger: blank > 0,
      onConfirm: function () { submitExam(false); },
    };
    render();
  }

  function askAbandon() {
    state.dialog = {
      title: "End this attempt?",
      body: "This attempt will be discarded without being scored, and it won't appear in your attempt history.",
      confirmLabel: "Discard attempt",
      danger: true,
      onConfirm: abandonExam,
    };
    render();
  }

  function askResume(saved) {
    var left = Math.max(0, saved.deadline - Date.now());
    state.dialog = {
      title: "Resume your exam?",
      body: "You have a paper in progress: <b>" + answeredCount(saved) + " of " + saved.items.length +
        "</b> answered, <b>" + fmtClock(left) + "</b> left on the clock. The clock kept running while you were away.",
      confirmLabel: "Resume",
      cancelLabel: "Discard it",
      onConfirm: function () {
        state.dialog = null;
        state.session = saved;
        state.index = saved.items.findIndex(function (i) { return i.picked.length === 0; });
        if (state.index < 0) state.index = 0;
        state.view = "exam";
        startTick();
        render();
      },
      onCancel: function () { drop(KEY_SESSION); state.dialog = null; render(); },
    };
  }

  /* --------------------------------------------------------------- rendering */
  function renderBar() {
    var host = el("status");
    if (!host) return;
    if (state.view === "exam" && state.session) {
      var left = remaining();
      var cls = left <= 60000 ? " clock--danger" : left <= 300000 ? " clock--warn" : "";
      host.innerHTML =
        '<span class="counter">' + answeredCount(state.session) + "/" + state.session.items.length + "</span>" +
        '<span class="clock' + cls + '" role="timer" aria-live="off" aria-label="' + fmtClock(left) + ' remaining">' + fmtClock(left) + "</span>";
    } else {
      host.innerHTML = "";
    }
  }

  function render() {
    renderBar();
    var main = el("app");
    if (!main) return;
    var html = "";
    if (state.view === "intro") html = viewIntro();
    else if (state.view === "exam") html = viewExam();
    else if (state.view === "report") html = viewReport();
    else if (state.view === "review") html = viewReview();
    main.innerHTML = '<div class="view">' + html + "</div>";
    renderDialog();
  }

  function renderDialog() {
    var host = el("dialog");
    if (!host) return;
    var d = state.dialog;
    if (!d) { host.innerHTML = ""; return; }
    host.innerHTML =
      '<div class="scrim" data-act="dialog-cancel">' +
        '<div class="dialog" role="dialog" aria-modal="true" aria-label="' + esc(d.title) + '" data-stop="1">' +
          '<h2 class="dialog__title">' + esc(d.title) + "</h2>" +
          '<div class="dialog__body">' + d.body + "</div>" +
          '<div class="row row--end">' +
            '<button class="btn btn--ghost" data-act="dialog-cancel">' + esc(d.cancelLabel || "Keep going") + "</button>" +
            '<button class="btn ' + (d.danger ? "btn--danger" : "btn--primary") + '" data-act="dialog-confirm">' + esc(d.confirmLabel) + "</button>" +
          "</div>" +
        "</div>" +
      "</div>";
    var btn = host.querySelector('[data-act="dialog-confirm"]');
    if (btn) btn.focus();
  }

  /* -------------------------------------------------------------- view: intro */
  function viewIntro() {
    var results = load(KEY_RESULTS, []);
    var best = results.reduce(function (m, r) { return Math.max(m, r.scaled); }, 0);
    var papers = Math.min(SPEC.questions, BANK.length);

    var out = "";

    out +=
      '<div class="hero">' +
        '<p class="hero__eyebrow">Unofficial exam simulation</p>' +
        '<h1 class="hero__title">AWS Certified AI Practitioner</h1>' +
        '<p class="hero__sub">A full-length, timed AIF-C01 paper under exam conditions: no feedback until you submit, then a scaled score against the real 700 pass mark.</p>' +
      "</div>";

    out +=
      '<div class="specs">' +
        '<div class="spec"><div class="spec__k">Questions</div><div class="spec__v">' + papers + "</div></div>" +
        '<div class="spec"><div class="spec__k">Time limit</div><div class="spec__v">' + SPEC.minutes + '<small> min</small></div></div>' +
        '<div class="spec"><div class="spec__k">Pass mark</div><div class="spec__v">' + SPEC.passScaled + '<small>/1000</small></div></div>' +
        '<div class="spec"><div class="spec__k">Your best</div><div class="spec__v">' + (best ? best : "—") + (best ? '<small>/1000</small>' : "") + "</div></div>" +
      "</div>";

    out +=
      '<div class="card" style="margin-top:14px">' +
        '<h2 class="card__title">How this differs from a practice quiz</h2>' +
        '<p class="card__sub">The simulator is built to rehearse the pressure of the real thing, not to teach you one question at a time.</p>' +
        '<ul class="rules">' +
          '<li><span class="rules__mark">·</span><span><b>Nothing is revealed until you submit.</b> No per-question verdicts, no explanations mid-paper — exactly as on exam day.</span></li>' +
          '<li><span class="rules__mark">·</span><span><b>One ' + SPEC.minutes + '-minute clock</b> for the whole paper. It keeps running if you close the tab, and the exam auto-submits when it hits zero.</span></li>' +
          '<li><span class="rules__mark">·</span><span><b>Flag and come back.</b> Jump around freely with the navigator, flag anything you want a second look at, and change answers until you submit.</span></li>' +
          '<li><span class="rules__mark">·</span><span><b>A scaled ' + SPEC.scaleMin + "–" + SPEC.scaleMax + ' score</b> plus a per-domain breakdown against each domain\'s official exam weight.</span></li>' +
          '<li><span class="rules__mark">·</span><span><b>Full review afterwards</b> — every question with the answer key and an explanation, filterable to just what you got wrong.</span></li>' +
        "</ul>" +
      "</div>";

    var bp = Object.keys(DOMAINS).map(function (k) {
      var d = DOMAINS[k];
      var n = BANK.filter(function (q) { return q.domain === k; }).length;
      return '<div class="bp">' +
        '<div class="bp__icon">' + d.icon + "</div>" +
        "<div><div class=\"bp__code\">" + esc(d.code) + '</div><div class="bp__name">' + esc(d.name) + "</div>" +
        '<div class="bp__blurb">' + esc(d.blurb) + "</div></div>" +
        '<div><span class="bp__w">' + d.weight + '%</span><span class="bp__n">' + n + " in bank</span></div>" +
      "</div>";
    }).join("");

    out +=
      '<div class="card">' +
        '<h2 class="card__title">The five content domains</h2>' +
        '<p class="card__sub">Weights are from the official AIF-C01 Exam Guide; the scored paper is drawn from a ' + BANK.length + '-question bank.</p>' +
        '<div class="blueprint">' + bp + "</div>" +
      "</div>";

    out +=
      '<div class="card">' +
        '<button class="btn btn--primary btn--lg btn--block" data-act="start">Start the ' + SPEC.minutes + "-minute exam</button>" +
        '<p class="card__sub" style="text-align:center;margin:12px 0 0">Keyboard: <b>A–D</b> or <b>1–4</b> to answer · <b>←/→</b> to move · <b>F</b> to flag</p>' +
      "</div>";

    if (results.length) {
      var rows = results.slice(0, 5).map(function (r) {
        return "<li>" +
          '<span class="history__score" style="color:var(--' + (r.passed ? "good" : "low") + ')">' + r.scaled + "</span>" +
          '<span class="pill ' + (r.passed ? "pill--good" : "pill--low") + '">' + (r.passed ? "Pass" : "Fail") + "</span>" +
          "<span>" + r.correct + "/" + r.total + " correct · " + fmtDuration(r.elapsed) +
            (r.timedOut ? " · ran out of time" : "") + "</span>" +
          '<span class="history__when">' + fmtDate(r.at) + "</span>" +
        "</li>";
      }).join("");
      out +=
        '<div class="card">' +
          '<h2 class="card__title">Recent attempts</h2>' +
          '<p class="card__sub">' + results.length + " attempt" + (results.length === 1 ? "" : "s") + " recorded in this browser.</p>" +
          '<ul class="history">' + rows + "</ul>" +
          '<div class="row row--end" style="margin-top:12px"><button class="btn btn--ghost" data-act="clear-history">Clear history</button></div>' +
        "</div>";
    }

    return out;
  }

  /* --------------------------------------------------------------- view: exam */
  function viewExam() {
    var s = state.session;
    var item = s.items[state.index];
    var d = DOMAINS[item.domain] || { name: item.domain, icon: "•", code: "" };
    var pct = ((state.index + 1) / s.items.length) * 100;

    var opts = item.options.map(function (o, i) {
      var on = item.picked.indexOf(i) !== -1;
      return '<button class="opt' + (on ? " opt--on" : "") + '" data-act="pick" data-i="' + i + '"' +
        ' role="' + (item.multi ? "checkbox" : "radio") + '" aria-checked="' + (on ? "true" : "false") + '">' +
        '<span class="opt__key' + (item.multi ? " opt__key--box" : "") + '">' + LETTERS[i] + "</span>" +
        '<span class="opt__body">' + esc(o.text) + "</span>" +
      "</button>";
    }).join("");

    var out = "";
    out += '<div class="track" aria-hidden="true"><span style="width:' + pct.toFixed(1) + '%"></span></div>';

    out +=
      '<div class="card" style="margin-top:16px">' +
        '<div class="qhead">' +
          '<span class="qhead__n">Question ' + (state.index + 1) + " of " + s.items.length + "</span>" +
          '<span class="pill pill--mute">' + d.icon + " " + esc(d.name) + "</span>" +
          (item.flagged ? '<span class="pill pill--flag">⚑ Flagged</span>' : "") +
        "</div>" +
        '<h1 class="qprompt">' + esc(item.prompt) + "</h1>" +
        '<p class="qhint">' + (item.multi ? "Select all that apply." : "Select one answer.") + "</p>" +
        '<div class="opts" role="' + (item.multi ? "group" : "radiogroup") + '">' + opts + "</div>" +
        '<div class="navrow">' +
          '<button class="btn btn--outline" data-act="prev"' + (state.index === 0 ? " disabled" : "") + ">← Previous</button>" +
          '<button class="btn ' + (item.flagged ? "btn--primary" : "btn--outline") + '" data-act="flag">⚑ ' + (item.flagged ? "Unflag" : "Flag") + "</button>" +
          '<span class="grow"></span>' +
          (state.index === s.items.length - 1
            ? '<button class="btn btn--primary" data-act="ask-submit">Review &amp; submit</button>'
            : '<button class="btn btn--primary" data-act="next">Next →</button>') +
        "</div>" +
      "</div>";

    out +=
      '<div class="row row--between" style="margin-bottom:6px">' +
        '<button class="btn btn--ghost" data-act="ask-abandon">End attempt</button>' +
        '<button class="btn btn--outline" data-act="ask-submit">Submit exam</button>' +
      "</div>";

    // navigator
    var dots = s.items.map(function (it, i) {
      var cls = "dot";
      if (it.picked.length) cls += " dot--done";
      if (it.flagged) cls += " dot--flag";
      if (i === state.index) cls += " dot--now";
      return '<button class="' + cls + '" data-act="goto" data-i="' + i + '" aria-label="Question ' + (i + 1) +
        (it.picked.length ? ", answered" : ", not answered") + (it.flagged ? ", flagged" : "") + '">' + (i + 1) + "</button>";
    }).join("");

    out +=
      '<div class="navstrip">' +
        '<div class="navstrip__head">' +
          "<span>" + answeredCount(s) + " answered · " + flaggedCount(s) + " flagged</span>" +
          '<span class="navstrip__legend">' +
            '<span class="lg lg--done"><i></i>answered</span>' +
            '<span class="lg lg--flag"><i></i>flagged</span>' +
          "</span>" +
        "</div>" +
        '<div class="grid">' + dots + "</div>" +
      "</div>";

    return out;
  }

  /* ------------------------------------------------------------- view: report */
  function viewReport() {
    var s = state.session;
    var g = grade(s);
    var ringPct = clamp(((g.scaled - SPEC.scaleMin) / (SPEC.scaleMax - SPEC.scaleMin)) * 100, 0, 100);
    var ring = g.passed ? "var(--good)" : "var(--low)";

    var out = "";

    out +=
      '<div class="card">' +
        '<div class="report">' +
          '<div class="gauge" style="--pct:' + ringPct.toFixed(1) + ";--ring:" + ring + '" role="img" aria-label="Scaled score ' + g.scaled + ' out of 1000">' +
            '<div class="gauge__in"><div class="gauge__score">' + g.scaled + '</div><div class="gauge__of">of ' + SPEC.scaleMax + "</div></div>" +
          "</div>" +
          "<div>" +
            '<h1 class="verdict verdict--' + (g.passed ? "pass" : "fail") + '">' + (g.passed ? "Pass" : "Did not pass") + "</h1>" +
            '<p class="report__line"><b>' + g.correct + " of " + g.total + "</b> correct (" + g.pct.toFixed(0) + "%) · pass mark is " + SPEC.passScaled + "</p>" +
            '<p class="report__line">Finished in <b>' + fmtDuration(g.elapsed) + "</b> of " + SPEC.minutes + " min" +
              (s.timedOut ? " — <b>time expired</b>" : "") + "</p>" +
            '<div class="report__pills">' +
              (g.unanswered ? '<span class="pill pill--low">' + g.unanswered + " left blank</span>" : '<span class="pill pill--good">All answered</span>') +
              (flaggedCount(s) ? '<span class="pill pill--flag">⚑ ' + flaggedCount(s) + " flagged</span>" : "") +
              (g.weak.length ? '<span class="pill pill--mute">' + g.weak.length + " domain" + (g.weak.length === 1 ? "" : "s") + " under " + SPEC.readyLine + "%</span>" : "") +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";

    out +=
      '<div class="card">' +
        '<h2 class="card__title">Where the points went</h2>' +
        '<p class="card__sub">Each bar is your score in that domain; the tick mark is the ' + SPEC.readyLine + "% readiness line.</p>" +
        '<div class="bars">' +
          Object.keys(DOMAINS).map(function (k) {
            var d = DOMAINS[k];
            var r = g.byDomain[k] || { right: 0, total: 0 };
            if (!r.total) return "";
            var p = (r.right / r.total) * 100;
            var fill = p >= 85 ? "good" : p >= SPEC.readyLine ? "mid" : "low";
            return '<div class="barrow">' +
              '<div class="barrow__top">' +
                '<span class="barrow__name">' + d.icon + " " + esc(d.name) + "</span>" +
                '<span class="barrow__w">' + d.weight + "% of exam</span>" +
                '<span class="barrow__val">' + r.right + "/" + r.total + " · " + p.toFixed(0) + "%</span>" +
              "</div>" +
              '<div class="barrow__track"><span class="fill--' + fill + '" style="width:' + p.toFixed(1) + '%"></span></div>' +
            "</div>";
          }).join("") +
        "</div>" +
        '<p class="bars__key">A weak domain costs you more the heavier its weight, so a gap in ' +
          esc(DOMAINS.d3.name) + " (" + DOMAINS.d3.weight + "%) hurts more than the same gap in " +
          esc(DOMAINS.d5.name) + " (" + DOMAINS.d5.weight + "%).</p>" +
      "</div>";

    if (g.weak.length) {
      var blocks = g.weak.map(function (k) {
        var d = DOMAINS[k];
        var r = g.byDomain[k];
        return '<div class="weakdom">' +
          '<h3 class="weakdom__h">' + d.icon + " " + esc(d.name) + " — " + Math.round((r.right / r.total) * 100) + "%</h3>" +
          '<ul class="reslinks">' + d.docs.map(function (l) {
            return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) +
              '<span class="reslinks__src">' + esc(l.src) + "</span></a></li>";
          }).join("") + "</ul>" +
        "</div>";
      }).join("");
      out +=
        '<div class="card">' +
          '<h2 class="card__title">Study these next</h2>' +
          '<p class="card__sub">Official AWS documentation for every domain that came in under ' + SPEC.readyLine + "%.</p>" +
          blocks +
        "</div>";
    } else {
      out +=
        '<div class="card" style="text-align:center">' +
          '<h2 class="card__title">Every domain cleared ' + SPEC.readyLine + "%</h2>" +
          '<p class="card__sub" style="margin:0">No weak domain to single out. Sit another paper to confirm it holds on a different draw from the bank.</p>' +
        "</div>";
    }

    out +=
      '<div class="card">' +
        '<div class="row">' +
          '<button class="btn btn--primary grow" data-act="review">Review all ' + g.total + " questions</button>" +
          '<button class="btn btn--outline grow" data-act="restart">Sit another paper</button>' +
        "</div>" +
        '<div class="row" style="margin-top:10px"><button class="btn btn--ghost btn--block" data-act="home">Back to start</button></div>' +
      "</div>";

    return out;
  }

  /* ------------------------------------------------------------- view: review */
  function viewReview() {
    var s = state.session;
    var g = grade(s);

    var wrongIdx = [], flagIdx = [];
    s.items.forEach(function (it, i) {
      if (!isRight(it)) wrongIdx.push(i);
      if (it.flagged) flagIdx.push(i);
    });

    var showing = s.items.map(function (it, i) { return i; });
    if (state.reviewFilter === "wrong") showing = wrongIdx;
    if (state.reviewFilter === "flagged") showing = flagIdx;

    var out = "";

    out +=
      '<div class="card">' +
        '<div class="row row--between">' +
          "<div>" +
            '<h1 class="card__title">Answer review</h1>' +
            '<p class="card__sub" style="margin:0">Scaled ' + g.scaled + " · " + g.correct + "/" + g.total + " correct · " + wrongIdx.length + " to revisit</p>" +
          "</div>" +
          '<button class="btn btn--outline" data-act="back-report">← Score report</button>' +
        "</div>" +
        '<div class="filters" style="margin-top:14px">' +
          '<button class="filters__b' + (state.reviewFilter === "all" ? " filters__b--on" : "") + '" data-act="filter" data-v="all">All ' + s.items.length + "</button>" +
          '<button class="filters__b' + (state.reviewFilter === "wrong" ? " filters__b--on" : "") + '" data-act="filter" data-v="wrong"' + (wrongIdx.length ? "" : " disabled") + ">Incorrect " + wrongIdx.length + "</button>" +
          '<button class="filters__b' + (state.reviewFilter === "flagged" ? " filters__b--on" : "") + '" data-act="filter" data-v="flagged"' + (flagIdx.length ? "" : " disabled") + ">Flagged " + flagIdx.length + "</button>" +
        "</div>" +
      "</div>";

    if (!showing.length) {
      out += '<div class="card"><p class="empty">Nothing in this filter — ' +
        (state.reviewFilter === "wrong" ? "you got every question right." : "you didn't flag anything.") + "</p></div>";
    } else {
      out += '<div class="card">' + showing.map(function (i) {
        var it = s.items[i];
        var ok = isRight(it);
        var d = DOMAINS[it.domain] || { name: it.domain, icon: "•" };
        var blank = it.picked.length === 0;

        var opts = it.options.map(function (o, oi) {
          var chose = it.picked.indexOf(oi) !== -1;
          var cls = "rev__opt";
          var tag = "";
          if (o.correct && chose) { cls += " rev__opt--right"; tag = '<span class="rev__tag rev__tag--good">Your answer · correct</span>'; }
          else if (o.correct) { cls += " rev__opt--right"; tag = '<span class="rev__tag rev__tag--good">Correct answer</span>'; }
          else if (chose) { cls += " rev__opt--wrong"; tag = '<span class="rev__tag rev__tag--bad">Your answer · incorrect</span>'; }
          return '<div class="' + cls + '"><span class="rev__key">' + LETTERS[oi] + "</span>" +
            "<span>" + esc(o.text) + tag + "</span></div>";
        }).join("");

        return '<div class="rev">' +
          '<div class="rev__head">' +
            '<span class="rev__n">Q' + (i + 1) + "</span>" +
            '<span class="pill ' + (ok ? "pill--good" : "pill--low") + '">' + (ok ? "Correct" : blank ? "Left blank" : "Incorrect") + "</span>" +
            '<span class="pill pill--mute">' + d.icon + " " + esc(d.name) + "</span>" +
            (it.flagged ? '<span class="pill pill--flag">⚑</span>' : "") +
          "</div>" +
          '<p class="rev__prompt">' + esc(it.prompt) + "</p>" +
          '<div class="rev__opts">' + opts + "</div>" +
          '<div class="rev__why"><b>Why</b>' + esc(it.explanation) + "</div>" +
        "</div>";
      }).join("") + "</div>";
    }

    out +=
      '<div class="card">' +
        '<div class="row">' +
          '<button class="btn btn--outline grow" data-act="back-report">← Score report</button>' +
          '<button class="btn btn--primary grow" data-act="restart">Sit another paper</button>' +
        "</div>" +
      "</div>";

    return out;
  }

  /* ----------------------------------------------------------------- events */
  function onClick(ev) {
    var t = ev.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act");

    // clicking the scrim itself cancels; clicking inside the dialog does not
    if (act === "dialog-cancel" && t.classList.contains("scrim") && ev.target !== t) return;

    switch (act) {
      case "start":          startExam(buildPaper()); break;
      case "pick":           pick(+t.getAttribute("data-i")); break;
      case "prev":           goTo(state.index - 1); break;
      case "next":           goTo(state.index + 1); break;
      case "goto":           goTo(+t.getAttribute("data-i")); break;
      case "flag":           toggleFlag(); break;
      case "ask-submit":     askSubmit(); break;
      case "ask-abandon":    askAbandon(); break;
      case "review":         state.view = "review"; state.reviewFilter = "all"; window.scrollTo(0, 0); render(); break;
      case "back-report":    state.view = "report"; window.scrollTo(0, 0); render(); break;
      case "filter":         state.reviewFilter = t.getAttribute("data-v"); render(); break;
      case "restart":        startExam(buildPaper()); window.scrollTo(0, 0); break;
      case "home":           goIntro(); break;
      case "theme":          toggleTheme(); break;
      case "clear-history":
        state.dialog = {
          title: "Clear attempt history?",
          body: "Every recorded attempt and your best score will be removed from this browser.",
          confirmLabel: "Clear history",
          danger: true,
          onConfirm: function () { drop(KEY_RESULTS); state.dialog = null; render(); },
        };
        render();
        break;
      case "dialog-confirm": if (state.dialog && state.dialog.onConfirm) state.dialog.onConfirm(); break;
      case "dialog-cancel":
        if (state.dialog && state.dialog.onCancel) state.dialog.onCancel();
        else { state.dialog = null; render(); }
        break;
    }
  }

  function onKey(ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

    if (state.dialog) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        if (state.dialog.onCancel) state.dialog.onCancel();
        else { state.dialog = null; render(); }
      }
      return;
    }
    if (state.view !== "exam" || !state.session) return;

    var item = state.session.items[state.index];
    var k = ev.key;

    // A–D (or a–d) and 1–4 both select the option at that position
    var letter = k.length === 1 ? LETTERS.indexOf(k.toUpperCase()) : -1;
    var digit = /^[1-9]$/.test(k) ? +k - 1 : -1;
    var idx = letter !== -1 ? letter : digit;
    if (idx !== -1 && idx < item.options.length) { ev.preventDefault(); pick(idx); return; }

    if (k === "ArrowRight") { ev.preventDefault(); goTo(state.index + 1); }
    else if (k === "ArrowLeft") { ev.preventDefault(); goTo(state.index - 1); }
    else if (k === "f" || k === "F") { ev.preventDefault(); toggleFlag(); }
    else if (k === "Enter") {
      ev.preventDefault();
      if (state.index === state.session.items.length - 1) askSubmit(); else goTo(state.index + 1);
    }
  }

  /* ------------------------------------------------------------------ theme */
  function toggleTheme() {
    var now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", now);
    save(KEY_THEME, now);
  }

  function initTheme() {
    var saved = load(KEY_THEME, null);
    if (saved) { document.documentElement.setAttribute("data-theme", saved); return; }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  /* ------------------------------------------------------------------- boot */
  function boot() {
    initTheme();

    if (!BANK.length) {
      el("app").innerHTML = '<div class="card"><p class="empty">No questions loaded — check that <code>assets/js/questions.js</code> is present.</p></div>';
      return;
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);

    // Warn on tab close only while a paper is genuinely in progress.
    window.addEventListener("beforeunload", function (e) {
      if (state.view === "exam" && state.session && !state.session.submittedAt) {
        persist();
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    });

    // Repaint the clock immediately on tab focus — a sleeping tab skips ticks.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") { persist(); return; }
      if (state.view === "exam" && state.session && !state.session.submittedAt) {
        if (remaining() <= 0) submitExam(true); else paintClock();
      }
    });

    // Offer to resume a paper that was interrupted, unless its time already ran out.
    var saved = load(KEY_SESSION, null);
    if (saved && saved.items && saved.items.length && !saved.submittedAt) {
      if (Date.now() >= saved.deadline) drop(KEY_SESSION);
      else askResume(saved);
    }

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
