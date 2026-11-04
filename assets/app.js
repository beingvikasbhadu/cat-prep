(function () {
  "use strict";

  const T = window.TRACKER, MATH = window.MATH, BLOCKS = window.MATH_BLOCKS, TESTS = window.TESTS;
  const LOVE = window.LOVE, QUIZ = window.QUIZ;
  const app = document.getElementById("app");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- small helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#8217;" }[c]));
  const byId = (list, id) => list.find(x => x.id === id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem("catprep:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("catprep:" + k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem("catprep:" + k); } catch (e) {} }
  };
  const session = {
    get(k) { try { return sessionStorage.getItem("catprep:" + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem("catprep:" + k, v); } catch (e) {} }
  };
  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }
  function isoOf(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  const todayISO = () => isoOf(new Date());
  function niceDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  const shortDate = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  function daysLeft() {
    const a = new Date(todayISO() + "T00:00:00"), b = new Date(T.examDate + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const statusClass = s => ({ "Done": "good", "Fixed": "good", "In progress": "accent", "Practising": "accent", "Open": "bad" }[s] || "muted");
  const chip = (text, cls) => '<span class="chip ' + (cls || "muted") + '">' + esc(text) + "</span>";
  const topicStatus = id => (T.topics[id] || { status: "Not started" });
  const testFor = topic => TESTS.find(t => t.topic === topic.id || (t.topics || []).includes(topic.id)) || null;
  const LV = window.LEVELS;
  const qTarget = q => q.target || LV[q.lv || 2].target;

  // ---------- love system ----------
  const fill = (s, n) => String(s).replace(/\{name\}/g, LOVE.her).replace(/\{n\}/g, n == null ? "" : n);
  const lastPick = {};
  function pick(pool, key) {
    if (!pool || !pool.length) return "";
    let i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && i === lastPick[key]) i = (i + 1) % pool.length;
    lastPick[key] = i;
    return pool[i];
  }
  function loadStats() {
    return Object.assign({ visits: 0, lastDay: null, streak: 0, kisses: 0, revised: {}, quiz: {}, timeDay: null, timeSecs: 0, timeShown: [], milestones: [] }, store.get("stats", {}));
  }
  const stats = loadStats();
  const saveStats = () => store.set("stats", stats);

  const toastRoot = document.getElementById("toasts");
  const toastQueue = [];
  let toastBusy = false;
  function toast(msg, opts) {
    toastQueue.push({ msg, opts: opts || {} });
    if (!toastBusy) nextToast();
  }
  function nextToast() {
    const item = toastQueue.shift();
    if (!item) { toastBusy = false; return; }
    toastBusy = true;
    const el = document.createElement("div");
    el.className = "toast" + (item.opts.kind ? " " + item.opts.kind : "");
    el.innerHTML = '<span class="toast-av" aria-hidden="true">' + miniFace() + '</span><div class="toast-body"><p>' + esc(item.msg) + '</p><span class="toast-from">' + esc(LOVE.me) + " 💌</span></div>";
    toastRoot.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    let gone = false;
    const close = () => {
      if (gone) return; gone = true;
      el.classList.remove("in");
      setTimeout(() => { el.remove(); nextToast(); }, 250);
    };
    el.addEventListener("click", close);
    setTimeout(close, item.opts.ms || 4800);
  }
  function heartBurst(x, y, count) {
    if (reduceMotion) return;
    const icons = ["💗", "💕", "💖", "💞", "😘", "✨"];
    for (let i = 0; i < (count || 12); i++) {
      const s = document.createElement("span");
      s.className = "burst";
      s.textContent = icons[i % icons.length];
      const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70;
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", (Math.sin(ang) * dist - 30) + "px");
      s.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }
  function burstAt(el, count) {
    const r = el.getBoundingClientRect();
    heartBurst(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  let sceneOpen = false;
  function kissScene(text, title, mode) {
    if (sceneOpen) { toast(text); return; }
    sceneOpen = true;
    const prev = document.activeElement;
    const wrap = document.createElement("div");
    wrap.className = "scene";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", title || "A message from " + LOVE.me);
    wrap.innerHTML = '<div class="scene-card">' + couple("once " + (mode || "")) +
      '<h2>' + esc(title || "Muah! 😘") + '</h2><p>' + esc(text) + '</p><span class="toast-from">— ' + esc(LOVE.me) + ' 💌</span>' +
      '<button class="btn primary" type="button">Aww, close 💗</button></div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("in"));
    const btn = wrap.querySelector("button");
    btn.focus({ preventScroll: true });
    wrap.querySelector(".scene-card").scrollTop = 0;
    const close = () => {
      wrap.classList.remove("in");
      document.removeEventListener("keydown", onKey);
      setTimeout(() => { wrap.remove(); sceneOpen = false; if (prev && prev.focus) prev.focus(); }, 250);
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    btn.addEventListener("click", close);
    wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
    setTimeout(() => { const r = wrap.querySelector(".scene-card").getBoundingClientRect(); heartBurst(r.left + r.width / 2, r.top + 90, 16); }, 1300);
  }

  function addKisses(n) {
    if (!n) return;
    stats.kisses += n;
    saveStats();
    document.querySelectorAll("[data-kisses]").forEach(el => { el.textContent = stats.kisses; });
    const hit = LOVE.milestones.filter(m => stats.kisses >= m.at && !stats.milestones.includes(m.at));
    if (hit.length) {
      hit.forEach(m => stats.milestones.push(m.at));
      saveStats();
      const m = hit[hit.length - 1];
      setTimeout(() => kissScene(m.text, m.at + " kisses unlocked! 💋"), 600);
    }
  }

  // Runs before the first render so the home page shows today's streak and visit.
  function countVisit() {
    const t = todayISO();
    let gap = 0, newDay = false;
    if (stats.lastDay !== t) {
      newDay = true;
      if (stats.lastDay) gap = Math.round((new Date(t + "T00:00:00") - new Date(stats.lastDay + "T00:00:00")) / 86400000);
      stats.streak = gap === 1 ? stats.streak + 1 : 1;
      stats.lastDay = t;
    }
    if (stats.timeDay !== t) { stats.timeDay = t; stats.timeSecs = 0; stats.timeShown = []; }
    const firstEver = stats.visits === 0;
    const fresh = !session.get("seen");
    if (fresh) { stats.visits += 1; session.set("seen", "1"); }
    saveStats();
    return fresh ? { firstEver, gap, newDay } : null;
  }
  function specialToday() {
    const md = todayISO().slice(5);
    return (LOVE.special || []).find(s => s.date === md);
  }
  function countdownToday() {
    const msg = LOVE.countdown[daysLeft()];
    return msg ? fill(msg) : null;
  }
  function greet(arrival) {
    if (!arrival) return;
    const h = new Date().getHours();
    setTimeout(() => {
      if (arrival.firstEver) { kissScene(fill(LOVE.firstVisit), "Hi " + LOVE.her + " 💗"); return; }
      const sp = specialToday();
      if (sp && stats.specialShown !== todayISO()) {
        stats.specialShown = todayISO(); saveStats();
        kissScene(fill(sp.text), fill(sp.title));
      }
      if (arrival.gap >= 2) toast(fill(LOVE.comeback, arrival.gap));
      else if (h >= 5 && h < 11 && arrival.newDay) toast(fill(pick(LOVE.morning, "morning")));
      else toast(fill(pick(LOVE.welcome, "welcome"), stats.visits));
      if (arrival.newDay && stats.streak > 1) toast(fill((LOVE.streakSpecial || {})[stats.streak] || LOVE.streak, stats.streak));
      if (h >= 23 || h < 5) toast(fill(LOVE.lateNight), { kind: "night" });
    }, 700);
  }

  // Idle nudge (not during a timed test), once per idle stretch.
  let lastAct = Date.now(), idleShown = false;
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(ev => window.addEventListener(ev, () => { lastAct = Date.now(); idleShown = false; }, { passive: true }));
  setInterval(() => {
    if (document.hidden || idleShown || sceneOpen) return;
    if (location.hash.startsWith("#/test/") || focusState()) return;
    if (Date.now() - lastAct > 180000) { idleShown = true; toast(fill(pick(LOVE.idle, "idle"))); }
  }, 15000);

  // Tapping the heart logo
  document.querySelector(".logo").addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();
    heartBurst(e.clientX, e.clientY, 10);
    toast(fill(pick(LOVE.logoTap, "logo")));
  });

  // ---------- study date (focus timer) ----------
  const FOCUS_MIN = 25, BREAK_MIN = 5;
  const focusState = () => store.get("focus", null);
  function startFocus(mode) {
    const mins = mode === "break" ? BREAK_MIN : FOCUS_MIN;
    store.set("focus", { mode, endsAt: Date.now() + mins * 60000, half: false });
    if (mode === "focus") toast(fill(LOVE.focusStart));
    paintFocus();
  }
  function stopFocus() { store.del("focus"); paintFocus(); }
  function paintFocus() {
    const f = focusState(), pill = document.getElementById("focusPill");
    const left = f ? Math.max(0, Math.round((f.endsAt - Date.now()) / 1000)) : 0;
    if (pill) {
      pill.hidden = !f;
      if (f) pill.textContent = (f.mode === "break" ? "☕ Break " : "📚 Study date ") + fmt(left);
    }
    const big = document.getElementById("focusTime");
    if (big) {
      big.textContent = f ? fmt(left) : FOCUS_MIN + ":00";
      document.getElementById("focusLabel").textContent = f ? (f.mode === "break" ? "Break time ☕" : "Studying together 📚") : "Ready when you are";
      document.getElementById("focusStart").hidden = !!f;
      document.getElementById("focusStop").hidden = !f;
      const total = (f && f.mode === "break" ? BREAK_MIN : FOCUS_MIN) * 60;
      document.getElementById("focusRing").style.setProperty("--p", f ? Math.round((1 - left / total) * 100) : 0);
    }
  }
  setInterval(() => {
    const f = focusState();
    if (!f) return;
    const left = (f.endsAt - Date.now()) / 1000;
    if (f.mode === "focus" && !f.half && left <= FOCUS_MIN * 30) { f.half = true; store.set("focus", f); toast(fill(LOVE.focusHalf)); }
    if (left <= 0) {
      if (f.mode === "focus") { addKisses(3); kissScene(fill(LOVE.focusEnd) + " (+3 kisses 💋)", "Study date done! 🎉"); startFocus("break"); }
      else { stopFocus(); toast(fill(LOVE.focusBreakEnd)); }
      return;
    }
    paintFocus();
  }, 1000);
  document.getElementById("focusPill").addEventListener("click", () => { location.hash = "#/us"; });
  // Time on site today: counts only while the page is visible.
  setInterval(() => {
    if (document.hidden) return;
    const t = todayISO();
    if (stats.timeDay !== t) { stats.timeDay = t; stats.timeSecs = 0; stats.timeShown = []; }
    stats.timeSecs += 1;
    const min = Math.floor(stats.timeSecs / 60);
    Object.keys(LOVE.time).forEach(k => {
      if (min >= +k && !stats.timeShown.includes(+k)) { stats.timeShown.push(+k); toast(fill(LOVE.time[k])); }
    });
    if (stats.timeSecs % 10 === 0) saveStats();
    const tm = document.querySelector("[data-minutes]");
    if (tm) tm.textContent = min;
  }, 1000);
  window.addEventListener("pagehide", saveStats);
  // Keep the greeting and the countdown right if the page stays open past noon, evening or midnight.
  setInterval(() => {
    const g = document.querySelector("[data-greet]");
    if (g && g.textContent !== greeting()) g.textContent = greeting();
    const d = document.querySelector("[data-day]");
    if (d && d.dataset.day !== todayISO() && !sceneOpen) route();
  }, 30000);

  // ---------- drawings ----------
  // Vikas (left) leans in and kisses Khushi (right) on the cheek.
  function couple(mode) {
    return '<svg class="couple ' + (mode || "") + '" viewBox="0 0 260 186" role="img" aria-label="Cartoon of ' + esc(LOVE.me) + ' kissing ' + esc(LOVE.her) + ' on the cheek">' +
      '<g class="fh"><path class="f1" d="M30 60c-2-6-10-6-10 0 0 5 6 8 10 12 4-4 10-7 10-12 0-6-8-6-10 0z"/><path class="f2" d="M230 44c-2-5-8-5-8 0 0 4 5 6 8 9 3-3 8-5 8-9 0-5-6-5-8 0z"/><path class="f3" d="M130 18c-2-5-8-5-8 0 0 4 5 6 8 9 3-3 8-5 8-9 0-5-6-5-8 0z"/><path class="f4" d="M236 120c-2-5-7-5-7 0 0 3 4 5 7 8 3-3 7-5 7-8 0-5-5-5-7 0z"/></g>' +
      // Khushi
      '<g class="girl">' +
        '<path d="M133 82Q130 44 165 44Q200 44 197 82L200 142Q186 150 178 134L176 100L154 100L152 134Q144 150 130 142Z" fill="#3a2a33"/>' +
        '<path d="M138 176Q140 122 165 116Q190 122 192 176Z" fill="#ffadc6"/>' +
        '<path d="M165 146c-2-5-9-5-9 0 0 4 5 7 9 10 4-3 9-6 9-10 0-5-7-5-9 0z" fill="#ff6f9f"/>' +
        '<circle cx="165" cy="80" r="30" fill="#ffe6da"/>' +
        '<path d="M135 76Q136 48 165 48Q194 48 195 76Q186 62 172 64Q166 56 158 64Q146 62 135 76Z" fill="#3a2a33"/>' +
        '<g transform="translate(190 54)"><path d="M0 0L-11-8L-11 8ZM0 0L11-8L11 8Z" fill="#ff5c93"/><circle r="3.5" fill="#ff8fb5"/></g>' +
        '<path d="M151 82q5-5 10 0M169 82q5-5 10 0" stroke="#3a2a33" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<ellipse class="blush" cx="150" cy="92" rx="6.5" ry="3.8" fill="#ff9dba"/><ellipse class="blush" cx="181" cy="92" rx="6.5" ry="3.8" fill="#ff9dba"/>' +
        '<path d="M161 95q4 4 8 0" stroke="#c2456f" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      // Vikas
      '<g class="boy">' +
        '<path d="M66 176Q66 120 95 116Q124 120 124 176Z" fill="#a9b8ff"/>' +
        '<path d="M86 118L95 129L104 118" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="65" cy="82" r="5" fill="#f6cdbb"/>' +
        '<circle cx="95" cy="80" r="30" fill="#ffe1d3"/>' +
        '<path d="M64 78Q62 46 95 46Q128 46 126 78Q120 62 108 60Q100 68 86 62Q74 66 64 78Z" fill="#2d2530"/>' +
        '<path d="M84 82q5 4 10 0M102 82q5 4 10 0" stroke="#2d2530" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="82" cy="93" rx="6" ry="3.5" fill="#ffa3bd" opacity=".85"/><ellipse cx="111" cy="93" rx="5" ry="3.2" fill="#ffa3bd" opacity=".85"/>' +
        '<ellipse cx="120" cy="92" rx="3" ry="2.6" fill="#ff6f9a"/>' +
      '</g>' +
      '<g class="pop"><path d="M140 44c-2-6-11-6-11 1 0 5 6 9 11 13 5-4 11-8 11-13 0-7-9-7-11-1z" fill="#ff4d8d"/></g>' +
      '<text x="95" y="184" text-anchor="middle" class="tag">' + esc(LOVE.me) + '</text><text x="165" y="184" text-anchor="middle" class="tag">' + esc(LOVE.her) + '</text>' +
      "</svg>";
  }
  function miniFace() {
    return '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#ffd6e4"/><circle cx="30" cy="34" r="18" fill="#ffe1d3"/><path d="M12 32Q11 12 30 12Q49 12 48 32Q44 22 37 21Q32 26 25 22Q17 24 12 32Z" fill="#2d2530"/><path d="M22 35q3 3 6 0M33 35q3 3 6 0" stroke="#2d2530" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="21" cy="41" rx="3.5" ry="2" fill="#ffa3bd"/><ellipse cx="40" cy="41" rx="3.5" ry="2" fill="#ffa3bd"/><path d="M27 44q3 2.5 6 0" stroke="#c2456f" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
  }

  // ---------- theme ----------
  const themeBtn = document.getElementById("themeBtn");
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  applyTheme(store.get("theme", null));
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next); store.set("theme", next);
  });

  // ---------- router ----------
  let leaveHook = null;
  function route() {
    if (leaveHook) { leaveHook(); leaveHook = null; }
    const [path, anchor] = location.hash.replace(/^#\/?/, "").split("#");
    const parts = (path || "").split("/").filter(Boolean);
    const [p, id, sub] = parts;
    let html, after, nav = p || "home";
    if (!p) { html = home(); after = wireHome; }
    else if (p === "notes") html = notesHub();
    else if (p === "varc") { html = verbal(window.VARC, "varc"); after = () => wireRevised("varc", "VARC"); }
    else if (p === "lrdi") { html = verbal(window.LRDI, "lrdi"); after = () => wireRevised("lrdi", "LRDI"); }
    else if (p === "math" && id) { html = topicPage(id); nav = "math"; after = () => wireRevised(id, (byId(MATH, id) || {}).name); }
    else if (p === "math") html = mathPage();
    else if (p === "quiz" && id) { const r = quizPage(id, sub || "all"); html = r.html; after = r.after; nav = "quiz"; }
    else if (p === "quiz") html = quizHub();
    else if (p === "us") { html = usPage(); after = wireUs; }
    else if (p === "test" && id) { const r = testPage(id); html = r.html; after = r.after; nav = "math"; }
    else if (p === "tracker") { html = trackerPage(); after = wireTracker; }
    else html = notFound();
    app.innerHTML = '<div class="page">' + html + "</div>";
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === nav || (a.dataset.nav === "notes" && (nav === "varc" || nav === "lrdi"))));
    paintFocus();
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    if (after) after();
    const h = app.querySelector("h1");
    document.title = (h && p ? h.textContent + " · " : "") + LOVE.her + "’s CAT Diary";
  }
  window.addEventListener("hashchange", route);

  // ---------- pages ----------
  function greeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    if (h >= 17 && h < 23) return "Good evening";
    return "Hey night owl";
  }
  function nextMilestone() { return LOVE.milestones.find(m => stats.kisses < m.at); }

  function home() {
    const dl = daysLeft();
    const t = todayISO();
    const items = T.calendar.flatMap(b => b.items);
    const today = items.find(i => i.date === t);
    const next = items.filter(i => i.date > t && !i.done).slice(0, 3);
    const weak = T.weaknesses.filter(w => w.status !== "Fixed");
    const hist = store.get("attempts", []).slice(-4).reverse();
    const total = T.targets.qa + T.targets.varc + T.targets.lrdi;
    const dayIdx = Math.floor(new Date(t + "T00:00:00").getTime() / 86400000);
    const note = LOVE.daily[dayIdx % LOVE.daily.length];
    const nm = nextMilestone();
    const prevAt = [...LOVE.milestones].reverse().find(m => stats.kisses >= m.at);
    const from = prevAt ? prevAt.at : 0;
    const pct = nm ? Math.round((stats.kisses - from) / (nm.at - from) * 100) : 100;
    const unlocked = LOVE.milestones.filter(m => stats.milestones.includes(m.at));

    return '' +
      '<section class="hero">' +
        '<div class="hero-text">' +
          '<p class="eyebrow"><span data-greet>' + greeting() + '</span>, ' + esc(LOVE.her) + ' 🌸</p>' +
          '<h1 data-day="' + t + '">' + (dl > 0 ? '<span class="big">' + dl + '</span> ' + (dl === 1 ? "day" : "days") + ' to CAT' : dl === 0 ? "Exam day! 화이팅 💪" : "CAT 2026 is done 🎉") + '</h1>' +
          '<p class="lede">Target: <b>' + total + ' correct</b> across three sections. Revise a little, play a quiz, collect kisses. I’m cheering for you every single day 💗</p>' +
          '<div class="hero-btns"><a class="btn primary" href="#/quiz">Play a quick quiz ✨</a><a class="btn" href="#/math">Revise a topic</a></div>' +
        '</div>' +
        '<div class="hero-art">' + couple("loop") + '</div>' +
      '</section>' +
      (countdownToday() ? '<section class="banner"><span aria-hidden="true">⏳</span><p>' + esc(countdownToday()) + "</p></section>" : "") +
      '<section class="card note"><span class="note-pin" aria-hidden="true">💌</span><p class="sub">Note of the day from ' + esc(LOVE.me) + '</p><p class="note-text">' + esc(fill(note)) + '</p></section>' +
      '<a class="card us-teaser" href="#/us"><span class="ut-emoji" aria-hidden="true">💕</span><div><b>Just us</b><span>How are you feeling? Open-when letters, a hug, and a 25-minute study date with me</span></div><span class="ut-go" aria-hidden="true">→</span></a>' +
      '<section class="card jar">' +
        '<div class="jar-icon" aria-hidden="true">🫙<span>💋</span></div>' +
        '<div class="jar-body"><p class="sub">Kiss jar</p><p class="jar-count"><b data-kisses>' + stats.kisses + '</b> kisses earned</p>' +
          (nm ? '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progress to the next reward"><span style="width:' + pct + '%"></span></div><p class="small muted">Next surprise unlocks at ' + nm.at + ' 💝 (' + (nm.at - stats.kisses) + ' to go). Every right answer adds one.</p>'
              : '<p class="small muted">You unlocked every surprise. You are officially the best 🏆</p>') +
          (unlocked.length ? '<details class="reveal small-reveal"><summary>Your unlocked rewards (' + unlocked.length + ')</summary><ul class="plain">' + unlocked.map(m => "<li>💝 " + esc(m.text) + "</li>").join("") + "</ul></details>" : "") +
        '</div>' +
        '<div class="jar-side"><div><b>' + stats.streak + '</b><span>day streak 🔥</span></div><div><b data-minutes>' + Math.floor(stats.timeSecs / 60) + '</b><span>min today ⏱️</span></div></div>' +
      '</section>' +
      '<section class="quiz-row">' + ["math", "varc", "lrdi"].map(k => quizCard(k)).join("") + '</section>' +
      '<section class="targets">' +
        targetCard("Quant", T.targets.qa, 22, "#/math", "Topic notes + tests") +
        targetCard("VARC", T.targets.varc, 24, "#/varc", "RC types, traps, PJ") +
        targetCard("LRDI", T.targets.lrdi, 22, "#/lrdi", "Set selection, types") +
      '</section>' +
      '<section class="card">' +
        '<div class="card-head"><h2>Today’s plan 📅</h2><a class="link" href="#/tracker">Full plan →</a></div>' +
        (today ? '<p class="today' + (today.done ? " done" : "") + '"><span class="date">' + esc(niceDate(today.date)) + '</span>' + esc(today.text) + (today.done ? " " + chip("Done", "good") : "") + "</p>"
               : '<p class="muted">Nothing planned for today. Maybe one quick quiz? 🥺</p>') +
        (next.length ? '<p class="sub">Coming up</p><ul class="plain">' + next.map(i => '<li><span class="date">' + esc(niceDate(i.date)) + "</span>" + esc(i.text) + "</li>").join("") + "</ul>" : "") +
      '</section>' +
      '<section class="card">' +
        '<div class="card-head"><h2>Weak spots to hug 🧸</h2><a class="link" href="#/tracker#weak">All →</a></div>' +
        (weak.length ? '<ul class="weak-list">' + weak.slice(0, 4).map(w => '<li>' + chip(w.status, statusClass(w.status)) + '<div><b>' + esc(w.what) + '</b><span>' + esc(w.fix) + "</span></div></li>").join("") + "</ul>"
                     : '<p class="muted">No open weaknesses. Amazing!</p>') +
      '</section>' +
      (hist.length ? '<section class="card"><div class="card-head"><h2>Recent tests</h2></div><ul class="plain">' +
        hist.map(h => '<li><a href="#/test/' + esc(h.testId) + '">' + esc(h.title) + '</a> <span class="muted">· ' + h.score + "/" + h.total + " · " + fmt(h.secs) + " · " + esc(new Date(h.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) + "</span></li>").join("") +
        "</ul></section>" : "") +
      '<p class="footnote">Made with 💗 by ' + esc(LOVE.me) + ' for ' + esc(LOVE.her) + ' · plan updated ' + esc(shortDate(T.updated)) + '</p>';
  }
  function wireHome() {
    const art = app.querySelector(".hero-art");
    if (art) art.addEventListener("click", e => { heartBurst(e.clientX, e.clientY, 10); toast(fill(pick(LOVE.correct, "tap"))); });
  }
  function targetCard(name, target, of, href, sub) {
    return '<a class="target" href="' + href + '"><span class="t-name">' + name + '</span><span class="t-num">' + target + '<small>/' + of + '</small></span><span class="t-sub">' + sub + "</span></a>";
  }
  function quizCard(k) {
    const Q = QUIZ[k], s = stats.quiz[k];
    return '<a class="quiz-card q-' + k + '" href="#/quiz/' + k + '"><span class="qc-emoji" aria-hidden="true">' + Q.emoji + '</span><b>' + esc(Q.title) + ' quiz</b><span class="small">' + esc(Q.blurb) + '</span><span class="qc-best">' + (s ? "Best " + s.best + "/10 · played " + s.plays + "×" : Q.questions.length + " questions · not played yet") + "</span></a>";
  }
  function notesHub() {
    return '' +
      '<header class="page-head"><p class="eyebrow">Free-time revision 🌷</p><h1>Notes</h1><p class="lede">Short, sweet revision for VARC and LRDI. Read one section with your chai ☕</p></header>' +
      '<section class="quiz-row two">' +
        '<a class="quiz-card q-varc" href="#/varc"><span class="qc-emoji" aria-hidden="true">📖</span><b>VARC notes</b><span class="small">RC question types, option traps, PJ, summary, tone words</span><span class="qc-best">Target ' + T.targets.varc + ' correct' + (stats.revised.varc ? " · revised 💗" : "") + "</span></a>" +
        '<a class="quiz-card q-lrdi" href="#/lrdi"><span class="qc-emoji" aria-hidden="true">🧩</span><b>LRDI notes</b><span class="small">Set selection, how to start each set type, formulas, traps</span><span class="qc-best">Target ' + T.targets.lrdi + ' correct' + (stats.revised.lrdi ? " · revised 💗" : "") + "</span></a>" +
      "</section>";
  }

  function revisedBox(key, label) {
    const d = stats.revised[key];
    return '<section class="card revised-box" id="revisedBox"><div><h2>' + (d ? "Revised 💗" : "Done revising?") + '</h2><p class="muted">' +
      (d ? "Last revised on " + esc(shortDate(d)) + ". Revise again any time." : "Tap the button and collect 2 kisses 💋") +
      '</p></div><button class="btn primary" id="revisedBtn" type="button">' + (d === todayISO() ? "Revised today ✓" : "I revised " + esc(label) + " ✓") + "</button></section>";
  }
  function wireRevised(key, label) {
    const btn = document.getElementById("revisedBtn");
    if (!btn || !label) return;
    btn.addEventListener("click", () => {
      const already = stats.revised[key] === todayISO();
      stats.revised[key] = todayISO();
      saveStats();
      burstAt(btn, 14);
      if (already) { toast("Revising again? Extra dedication, extra love 💞"); return; }
      addKisses(2);
      toast(fill(pick(LOVE.revised, "revised")));
      btn.textContent = "Revised today ✓";
      const box = document.getElementById("revisedBox");
      box.querySelector("h2").textContent = "Revised 💗";
      box.querySelector("p").textContent = "Last revised on " + shortDate(todayISO()) + ". Revise again any time.";
    });
  }

  function verbal(V, key) {
    return '' +
      '<header class="page-head"><p class="eyebrow">Free-time revision 🌷</p><h1>' + esc(V.title) + '</h1><p class="lede">' + esc(V.lead) + '</p></header>' +
      '<section class="card goal"><div class="goal-num">' + V.target + '<small>correct</small></div><ul class="plain tight">' + V.plan.map(p => "<li>" + esc(p) + "</li>").join("") + "</ul></section>" +
      V.sections.map((s, i) => '<details class="card fold"' + (i === 0 ? " open" : "") + '><summary><h2>' + esc(s.title) + '</h2><span class="chev" aria-hidden="true"></span></summary><div class="fold-body">' +
        (s.points ? '<ul class="dots">' + s.points.map(p => "<li>" + esc(p) + "</li>").join("") + "</ul>" : "") +
        (s.steps ? '<ol class="steps">' + s.steps.map(p => "<li>" + esc(p) + "</li>").join("") + "</ol>" : "") +
        (s.pairs ? '<dl class="pairs">' + s.pairs.map(p => "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(p[1]) + "</dd></div>").join("") + "</dl>" : "") +
        "</div></details>").join("") +
      '<section class="card cta"><div><h2>' + esc(QUIZ[key].emoji + " " + V.title) + ' quick quiz</h2><p class="muted">10 quick questions to check what you just revised.</p></div><a class="btn" href="#/quiz/' + key + '">Play now</a></section>' +
      revisedBox(key, V.title);
  }

  function mathPage() {
    return '' +
      '<header class="page-head"><p class="eyebrow">Quant · target ' + T.targets.qa + ' correct 🧮</p><h1>Math topics</h1><p class="lede">Tap a topic for a quick revision with examples. Topics we have finished have a timed test. 💗 = you revised it.</p></header>' +
      BLOCKS.map(b => {
        const list = MATH.filter(m => m.block === b.id);
        return '<section class="block"><div class="block-head"><h2>' + esc(b.name) + '</h2><p class="muted">' + esc(b.note) + '</p></div><div class="topic-grid">' +
          list.map(m => {
            const st = topicStatus(m.id);
            const rv = stats.revised[m.id];
            return '<a class="topic" href="#/math/' + m.id + '"><div class="topic-top">' + chip(st.status, statusClass(st.status)) + (m.testId ? chip("Test", "test") : "") + (rv ? '<span class="rv-heart" title="Revised ' + esc(shortDate(rv)) + '">💗</span>' : "") + '</div><h3>' + esc(m.name) + '</h3><p>' + esc(m.summary) + '</p><span class="topic-meta">' + esc(m.priority) + " · " + esc(m.weight) + "</span></a>";
          }).join("") + "</div></section>";
      }).join("");
  }

  function topicPage(id) {
    const m = byId(MATH, id);
    if (!m) return notFound();
    const st = topicStatus(m.id);
    const test = testFor(m);
    const block = byId(BLOCKS, m.block);
    const hist = test ? store.get("attempts", []).filter(a => a.testId === test.id).slice(-3).reverse() : [];
    return '' +
      '<a class="back" href="#/math">← All topics</a>' +
      '<header class="page-head"><p class="eyebrow">' + esc(block.name) + " · " + esc(m.priority) + " · " + esc(m.weight) + '</p><h1>' + esc(m.name) + '</h1><p class="lede">' + esc(m.summary) + '</p></header>' +
      '<section class="card status-row"><div>' + chip(st.status, statusClass(st.status)) + '</div><div><span class="sub">Score</span><p>' + esc(st.score || "No set sent yet") + '</p></div>' + (st.weak ? '<div><span class="sub">Weak types</span><p>' + esc(st.weak) + "</p></div>" : "") + "</section>" +
      '<section><h2 class="sec">Key ideas ✏️</h2><div class="ideas">' + m.ideas.map((x, i) => '<div class="idea"><span class="idea-n">' + (i + 1) + '</span><div><h3>' + esc(x.t) + "</h3><p>" + esc(x.d) + "</p></div></div>").join("") + "</div></section>" +
      '<section><h2 class="sec">Examples <span class="muted small">· try first, then open the solution</span></h2>' + m.examples.map((e, i) =>
        '<div class="card example"><p class="ex-q"><b>Example ' + (i + 1) + ".</b> " + esc(e.q) + '</p><details class="reveal"><summary>Show solution 👀</summary><ol class="steps">' + e.steps.map(s => "<li>" + esc(s) + "</li>").join("") + '</ol><p class="answer">Answer: ' + esc(e.a) + "</p></details></div>").join("") + "</section>" +
      '<section class="card traps"><h2>Traps to avoid ⚠️</h2><ul class="dots">' + m.traps.map(t => "<li>" + esc(t) + "</li>").join("") + "</ul></section>" +
      revisedBox(m.id, m.name) +
      (test
        ? '<section class="card cta"><div><h2>' + esc(test.title) + ' ⏱️</h2><p class="muted">' + test.questions.length + " questions · about " + Math.round(test.questions.reduce((a, q) => a + qTarget(q), 0) / 60) + " min · 3 levels · one timer per question</p>" +
            (hist.length ? '<p class="small muted">Last: ' + hist.map(h => h.score + "/" + h.total).join(", ") + "</p>" : "") +
          '</div><a class="btn primary" href="#/test/' + test.id + '">' + (store.get("test:" + test.id, null) ? "Continue test" : "Start test") + "</a></section>"
        : '<section class="card cta muted-cta"><p>The timed test for this topic arrives when we reach it in the plan. Meanwhile, try the <a href="#/quiz/math">math quick quiz</a> 💕</p></section>');
  }

  // ---------- quick quiz ----------
  const MATH_DECK = { arithmetic: "arithmetic", algebra: "algebra", geometry: "geometry", number: "number", modern: "number" };
  function deckQuestions(key, deck) {
    const Q = QUIZ[key];
    return Q.questions.filter(q => {
      if (deck === "all") return !q.set;
      if (key === "math") { const t = byId(MATH, q.topic); return t && MATH_DECK[t.block] === deck; }
      return q.d === deck;
    });
  }
  function quizHub() {
    return '' +
      '<header class="page-head"><p class="eyebrow">Quick quiz 🎀</p><h1>Pick a quiz</h1><p class="lede">10 quick questions each round, picked at random. Pick a whole subject or one deck. Every right answer puts a kiss in your jar 💋</p></header>' +
      ["math", "varc", "lrdi"].map(k => {
        const Q = QUIZ[k], s = stats.quiz[k];
        return '<section class="card deck-box q-' + k + '"><div class="deck-head"><span class="qc-emoji" aria-hidden="true">' + Q.emoji + '</span><div><h2>' + esc(Q.title) + '</h2><p class="small muted">' + esc(Q.blurb) + " · " + Q.questions.length + " questions" + (s ? " · best " + s.best + "/10" : "") + "</p></div></div>" +
          '<div class="decks">' + Q.decks.map(d => '<a class="deck" href="#/quiz/' + k + "/" + d.id + '"><span aria-hidden="true">' + d.emoji + "</span>" + esc(d.name) + '<small>' + deckQuestions(k, d.id).length + "</small></a>").join("") + "</div></section>";
      }).join("");
  }
  function quizPage(key, deckId) {
    const Q = QUIZ[key];
    if (!Q) return { html: notFound() };
    const deck = Q.decks.find(d => d.id === deckId) || Q.decks[0];
    const pool = deckQuestions(key, deck.id);
    let chosen;
    if (deck.sets) {
      // Keep each passage or puzzle's questions together, in order.
      const groups = [];
      pool.forEach(q => { let g = groups.find(x => x.set === q.set); if (!g) groups.push(g = { set: q.set, qs: [] }); g.qs.push(q); });
      chosen = shuffle(groups).flatMap(g => g.qs).slice(0, 10);
    } else chosen = shuffle(pool).slice(0, 10);
    const round = chosen.map(q => {
      const order = shuffle(q.o.map((_, i) => i));
      return { q: q.q, o: order.map(i => q.o[i]), a: order.indexOf(q.a), why: q.why, topic: q.topic, set: q.set, picked: null };
    });
    let i = 0, right = 0;
    const html = '<a class="back" href="#/quiz">← All quizzes</a>' +
      '<header class="page-head"><p class="eyebrow">' + esc(Q.emoji + " " + Q.title) + ' quick quiz · ' + esc(deck.emoji + " " + deck.name) + '</p><h1>' + esc(Q.title) + ' quiz</h1></header>' +
      '<div class="dots-row" id="qDots" aria-hidden="true">' + round.map(() => "<span></span>").join("") + "</div>" +
      '<div id="quizBox"></div>';

    function after() {
      const box = document.getElementById("quizBox"), dots = document.getElementById("qDots").children;
      function show() {
        const q = round[i];
        [...dots].forEach((d, k) => { d.className = k < i ? (round[k].picked === round[k].a ? "r" : "w") : k === i ? "now" : ""; });
        box.innerHTML = '<article class="card quiz-q">' + (q.set ? '<div class="passage"><p class="sub">' + (key === "varc" ? "Read the passage" : "The set") + "</p><p>" + esc(q.set) + "</p></div>" : "") + '<p class="sub">Question ' + (i + 1) + " of " + round.length + '</p><h2 class="qq">' + esc(q.q) + '</h2><div class="qopts">' +
          q.o.map((o, k) => '<button class="qopt" type="button" data-k="' + k + '"><span class="qletter">' + "ABCD"[k] + "</span>" + esc(o) + "</button>").join("") +
          '</div><div id="qFeedback" aria-live="polite"></div></article>';
        box.querySelectorAll(".qopt").forEach(b => b.addEventListener("click", () => answer(+b.dataset.k, b)));
      }
      function answer(k, btn) {
        const q = round[i];
        if (q.picked !== null) return;
        q.picked = k;
        const ok = k === q.a;
        box.querySelectorAll(".qopt").forEach((b, n) => { b.disabled = true; if (n === q.a) b.classList.add("right"); else if (n === k) b.classList.add("wrong"); });
        if (ok) { right++; burstAt(btn, 12); addKisses(1); }
        const msg = fill(pick(ok ? LOVE.correct : LOVE.wrong, ok ? "c" : "w"));
        const topic = !ok && q.topic ? byId(MATH, q.topic) : null;
        document.getElementById("qFeedback").innerHTML =
          '<div class="qfb ' + (ok ? "ok" : "no") + '"><p class="qfb-love"><span class="toast-av sm" aria-hidden="true">' + miniFace() + "</span>" + esc(msg) + '</p><p class="qfb-why"><b>' + (ok ? "Why it’s right: " : "Answer: " + esc(q.o[q.a]) + ". ") + "</b>" + esc(q.why) + "</p>" +
          (topic ? '<p class="small"><a href="#/math/' + topic.id + '">Revise ' + esc(topic.name) + " →</a></p>" : "") +
          '<button class="btn primary" id="qNext" type="button">' + (i + 1 < round.length ? "Next question →" : "See my score 💝") + "</button></div>";
        const nx = document.getElementById("qNext");
        nx.focus({ preventScroll: true });
        nx.addEventListener("click", () => { i++; if (i < round.length) show(); else finish(); });
      }
      function finish() {
        [...dots].forEach((d, k) => { d.className = round[k].picked === round[k].a ? "r" : "w"; });
        const s = stats.quiz[key] || { best: 0, plays: 0, last: 0 };
        s.plays++; s.last = right; s.best = Math.max(s.best, right); s.at = todayISO();
        stats.quiz[key] = s; saveStats();
        const n = round.length;
        const tier = right >= Math.ceil(n * 0.8) ? "finishGreat" : right >= Math.ceil(n * 0.5) ? "finishGood" : "finishLow";
        const msg = right === n ? fill(LOVE.perfect) : fill(pick(LOVE[tier], tier));
        const wrongs = round.filter(q => q.picked !== q.a);
        box.innerHTML = '<section class="card quiz-end ' + tier + '"><div class="end-score"><b>' + right + "</b><span>/ " + round.length + '</span></div><p class="end-msg">' + esc(msg) + '</p><p class="muted small">+' + right + " kisses this round · total " + stats.kisses + " 💋 · best " + s.best + "/10</p>" +
          '<div class="row center"><button class="btn primary" id="again" type="button">Play again 🔁</button><a class="btn" href="#/quiz">Other decks</a></div></section>' +
          (wrongs.length ? '<section class="card"><h2>Ones to look at again</h2><ul class="review-list">' + wrongs.map(q => { const t = q.topic && byId(MATH, q.topic); return "<li><b>" + esc(q.q) + "</b><span>Answer: " + esc(q.o[q.a]) + " · " + esc(q.why) + "</span>" + (t ? '<a href="#/math/' + t.id + '">Revise ' + esc(t.name) + " →</a>" : "") + "</li>"; }).join("") + "</ul></section>" : "");
        document.getElementById("again").addEventListener("click", route);
        if (tier === "finishGreat") setTimeout(() => kissScene(msg, right === n ? "Perfect score!! 😍" : "Muah! 😘"), 500);
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
      show();
    }
    return { html, after };
  }

  // ---------- answer checking (timed tests) ----------
  function numbersIn(s) {
    const clean = String(s).replace(/,/g, "").replace(/−/g, "-")
      .replace(/(\d*\.?\d*)\s*√\s*(\d+\.?\d*)/g, (m, k, r) => String((k ? Number(k) : 1) * Math.sqrt(Number(r))));
    return (clean.match(/-?\d*\.?\d+(?:\/\d*\.?\d+)?/g) || []).map(t => {
      if (t.includes("/")) { const [a, b] = t.split("/").map(Number); return b ? a / b : NaN; }
      return Number(t);
    }).filter(n => !isNaN(n));
  }
  function isRight(q, input) {
    const a = q.ans, s = String(input || "").trim();
    if (!s) return false;
    if (a.kind === "mcq") return s.toLowerCase() === a.v;
    if (a.kind === "num") {
      const n = numbersIn(s)[0];
      if (n === undefined) return false;
      const tol = a.tol != null ? a.tol : Math.max(0.01, Math.abs(a.v) * 1e-6);
      return Math.abs((a.abs ? Math.abs(n) : n) - a.v) <= tol;
    }
    if (a.kind === "ratio") {
      const parts = String(s).replace(/,/g, "").split(/:|\/|\bto\b/i).map(p => numbersIn(p)[0]);
      if (parts.length !== a.v.length || parts.some(p => p === undefined || p <= 0)) return false;
      return a.v.every((v, i) => Math.abs(parts[i] * a.v[0] - v * parts[0]) < 1e-6 * Math.max(1, v * parts[0]));
    }
    return false;
  }
  window.__catCheck = isRight;

  // ---------- timed test ----------
  function blankState(test) {
    return { q: test.questions.map(() => ({ elapsed: 0, startedAt: null, answer: "", done: false })), result: null };
  }
  const elapsed = r => r.elapsed + (r.startedAt ? (Date.now() - r.startedAt) / 1000 : 0);

  function testPage(id) {
    const test = byId(TESTS, id);
    if (!test) return { html: notFound() };
    const topic = byId(MATH, test.topic);
    let st = store.get("test:" + id, null);
    if (!st || !st.q || st.q.length !== test.questions.length) st = blankState(test);
    // A timer left running while the page was closed stops at the last save.
    st.q.forEach(r => { if (r.startedAt) { r.elapsed += Math.max(0, ((st.savedAt || Date.now()) - r.startedAt) / 1000); r.startedAt = null; } });
    const save = () => { st.savedAt = Date.now(); store.set("test:" + id, st); };

    if (st.result) return { html: resultsView(test, topic, st.result), after: () => wireResults(test, st) };

    const targetTotal = test.questions.reduce((a, q) => a + qTarget(q), 0);
    const html = '' +
      '<a class="back" href="#/math/' + topic.id + '">← ' + esc(topic.name) + "</a>" +
      '<header class="page-head"><p class="eyebrow">Timed test · ' + test.questions.length + ' questions · target ' + fmt(targetTotal) + '</p><h1>' + esc(test.title) + '</h1><p class="lede">Press Start when you begin reading a question and Done when you have your answer. Starting another question pauses the one that is running, just like moving on in the exam. 화이팅! 💪</p></header>' +
      recapBox(test) +
      '<div class="test-bar" role="status"><div><span class="sub">Done</span><b id="tbDone">0/' + test.questions.length + '</b></div><div><span class="sub">Time</span><b id="tbTime">0:00</b></div><div><span class="sub">Target</span><b>' + fmt(targetTotal) + '</b></div><div class="tb-prog"><span id="tbProg"></span></div></div>' +
      test.questions.map((q, i) => '' +
        (i === 0 || test.questions[i - 1].lv !== q.lv ? '<h2 class="lv-head lv' + q.lv + '">' + esc(LV[q.lv].name) + ' <small>' + test.questions.filter(z => z.lv === q.lv).length + " questions · target " + fmt(LV[q.lv].target) + ' each</small><span class="lv-timer" data-lvt="' + q.lv + '">⏱ 0:00 / ' + fmt(test.questions.filter(z => z.lv === q.lv).reduce((a, z) => a + qTarget(z), 0)) + "</span></h2>" : "") +
        '<article class="card q" id="q' + i + '">' +
          '<div class="q-head"><span class="q-num">Q' + (i + 1) + "</span>" + chip("L" + q.lv, "lv" + q.lv) + chip(q.fmt, q.fmt === "MCQ" ? "warn" : "muted") + '<span class="q-target">target ' + fmt(qTarget(q)) + '</span><span class="q-time">0:00</span></div>' +
          '<p class="q-text">' + esc(q.text) + "</p>" +
          (q.fmt === "MCQ"
            ? '<div class="opts" role="radiogroup" aria-label="Options for Q' + (i + 1) + '">' + q.opts.map((o, k) => { const v = "abcd"[k]; return '<label class="opt"><input type="radio" name="o' + i + '" value="' + v + '" data-ans="' + i + '"><span>' + esc(o) + "</span></label>"; }).join("") + "</div>"
            : '<label class="ans"><span class="sub">Your answer</span><input type="text" inputmode="decimal" autocomplete="off" data-ans="' + i + '" placeholder="e.g. 20, 3:5 or 47.5"></label>') +
          '<div class="q-actions"><button class="btn" data-act="toggle" data-i="' + i + '" type="button">Start</button><button class="btn" data-act="done" data-i="' + i + '" type="button">Done</button></div>' +
        "</article>").join("") +
      '<section class="card submit-box"><p id="submitNote" class="muted">Submit when you have finished. You will see your score, the analysis and the solutions straight away.</p><button class="btn primary big" id="submitBtn" type="button">Submit test 💝</button></section>';

    function after() {
      const cards = test.questions.map((q, i) => document.getElementById("q" + i));
      st.q.forEach((r, i) => {
        if (!r.answer) return;
        const q = test.questions[i];
        if (q.fmt === "MCQ") { const el = cards[i].querySelector('input[value="' + r.answer + '"]'); if (el) el.checked = true; }
        else cards[i].querySelector("input[data-ans]").value = r.answer;
      });
      function paint() {
        let done = 0, total = 0;
        st.q.forEach((r, i) => {
          const t = elapsed(r), q = test.questions[i], card = cards[i];
          total += t; if (r.done) done++;
          card.querySelector(".q-time").textContent = fmt(t);
          card.classList.toggle("running", !!r.startedAt);
          card.classList.toggle("finished", r.done);
          card.classList.toggle("over", t > qTarget(q));
          const tb = card.querySelector('[data-act="toggle"]');
          tb.textContent = r.startedAt ? "Pause" : (r.elapsed > 0 ? "Resume" : "Start");
          tb.classList.toggle("primary", !r.startedAt && !r.done);
          card.querySelector('[data-act="done"]').textContent = r.done ? "Reopen" : "Done";
        });
        app.querySelectorAll("[data-lvt]").forEach(el => {
          const lv = +el.dataset.lvt;
          let used = 0, tgt = 0;
          test.questions.forEach((z, k) => { if (z.lv === lv) { used += elapsed(st.q[k]); tgt += qTarget(z); } });
          el.textContent = "⏱ " + fmt(used) + " / " + fmt(tgt);
          el.classList.toggle("over", used > tgt);
          el.classList.toggle("live", test.questions.some((z, k) => z.lv === lv && st.q[k].startedAt));
        });
        document.getElementById("tbDone").textContent = done + "/" + test.questions.length;
        document.getElementById("tbTime").textContent = fmt(total);
        document.getElementById("tbProg").style.width = (done / test.questions.length * 100) + "%";
      }
      function pauseAll() { st.q.forEach(r => { if (r.startedAt) { r.elapsed = elapsed(r); r.startedAt = null; } }); }
      function startQ(i) { pauseAll(); st.q[i].startedAt = Date.now(); st.q[i].done = false; }

      app.addEventListener("click", onClick);
      app.addEventListener("input", onInput);
      app.addEventListener("change", onInput);
      function onClick(e) {
        const b = e.target.closest("[data-act]");
        if (b) {
          const i = +b.dataset.i, r = st.q[i];
          if (b.dataset.act === "toggle") { if (r.startedAt) pauseAll(); else startQ(i); }
          if (b.dataset.act === "done") {
            if (r.done) r.done = false;
            else {
              if (r.startedAt) { r.elapsed = elapsed(r); r.startedAt = null; }
              r.done = true;
              const lv = test.questions[i].lv;
              st.lvDone = st.lvDone || [];
              if (!st.lvDone.includes(lv) && test.questions.every((q, k) => q.lv !== lv || st.q[k].done)) {
                st.lvDone.push(lv); burstAt(b, 14); toast(fill(LOVE.levelDone[lv]));
              }
            }
          }
          save(); paint(); return;
        }
        if (e.target.id === "submitBtn") submit();
      }
      function onInput(e) {
        const el = e.target.closest("[data-ans]");
        if (!el) return;
        const i = +el.dataset.ans, r = st.q[i];
        r.answer = el.value.trim();
        if (!r.startedAt && !r.done && r.elapsed === 0) startQ(i);
        save(); paint();
      }
      let armed = false;
      function submit() {
        const blank = st.q.filter(r => !r.answer).length;
        if (blank && !armed) {
          armed = true;
          document.getElementById("submitNote").textContent = blank + " question" + (blank > 1 ? "s are" : " is") + " unanswered (counted as skipped). Tap Submit again to finish.";
          document.getElementById("submitBtn").textContent = "Submit anyway";
          return;
        }
        pauseAll();
        st.result = analyse(test, st);
        save();
        const hist = store.get("attempts", []);
        hist.push({ testId: test.id, title: test.title, at: st.result.at, score: st.result.score, total: test.questions.length, secs: st.result.secs, weak: st.result.weakTypes });
        store.set("attempts", hist.slice(-50));
        const res = st.result;
        route();
        addKisses(res.score + (res.level === "good" ? 5 : 0));
        const tier = res.level === "good" ? "finishGreat" : res.level === "accent" ? "finishGood" : "finishLow";
        const msg = res.score === test.questions.length ? fill(LOVE.perfect) : fill(pick(LOVE[tier], tier));
        if (res.level === "good") setTimeout(() => kissScene(msg + " (+5 bonus kisses 💋)", "Topic conquered! 🏆"), 500);
        else toast(msg);
      }
      const timer = setInterval(paint, 500);
      const onHide = () => { if (document.hidden) { pauseAll(); save(); paint(); } };
      document.addEventListener("visibilitychange", onHide);
      leaveHook = () => {
        clearInterval(timer);
        pauseAll(); save();
        app.removeEventListener("click", onClick);
        app.removeEventListener("input", onInput);
        app.removeEventListener("change", onInput);
        document.removeEventListener("visibilitychange", onHide);
      };
      paint();
    }
    return { html, after };
  }

  function recapBox(test) {
    const ids = test.topics || [test.topic];
    const ideas = ids.flatMap(id => (byId(MATH, id) || { ideas: [] }).ideas);
    return '<details class="card fold recap"><summary><h2>Quick recap before you start 📝</h2><span class="chev" aria-hidden="true"></span></summary><div class="fold-body"><div class="recap-grid">' +
      ideas.map(x => '<div><b>' + esc(x.t) + "</b><span>" + esc(x.d) + "</span></div>").join("") + "</div></div></details>";
  }
  function analyse(test, st) {
    const rows = test.questions.map((q, i) => {
      const r = st.q[i], secs = Math.round(elapsed(r));
      const status = !r.answer ? "skip" : isRight(q, r.answer) ? "right" : "wrong";
      return { n: i + 1, lv: q.lv, status, answer: r.answer, secs, target: qTarget(q), over: secs > qTarget(q), type: q.type, fmt: q.fmt };
    });
    const right = rows.filter(r => r.status === "right").length;
    const wrong = rows.filter(r => r.status === "wrong");
    const attempted = right + wrong.length;
    const secs = rows.reduce((a, r) => a + r.secs, 0);
    const target = rows.reduce((a, r) => a + r.target, 0);
    const uniq = a => [...new Set(a)];
    const weakTypes = uniq(rows.filter(r => r.status !== "right").map(r => r.type));
    const slowTypes = uniq(rows.filter(r => r.status === "right" && r.over).map(r => r.type)).filter(t => !weakTypes.includes(t));
    const marks = right * 3 - wrong.filter(r => r.fmt === "MCQ").length;
    const acc = attempted ? right / attempted : 0;
    const n = rows.length;
    let verdict, level;
    if (right >= Math.ceil(n * 0.8) && acc >= 0.85) { level = "good"; verdict = "Strong. You can move on; retest this topic in about a week to keep it fresh."; }
    else if (right >= Math.ceil(n * 0.6)) { level = "accent"; verdict = "Close. Practise the weak types below, then retake the test in a day or two."; }
    else { level = "bad"; verdict = "Re-read the revision notes and the examples first, then retake the test."; }
    const byLevel = [1, 2, 3].map(lv => {
      const rs = rows.filter(r => r.lv === lv);
      return { lv, total: rs.length, right: rs.filter(r => r.status === "right").length, secs: rs.reduce((a, r) => a + r.secs, 0), target: rs.reduce((a, r) => a + r.target, 0) };
    }).filter(x => x.total);
    return { at: Date.now(), rows, byLevel, score: right, attempted, acc, secs, target, weakTypes, slowTypes, marks, verdict, level,
      overList: rows.filter(r => r.over).map(r => "Q" + r.n) };
  }

  function reportText(test, res) {
    const topicName = byId(MATH, test.topic).name;
    const when = new Date(res.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const L = [];
    L.push("CAT Prep test report");
    L.push("Test: " + test.title + " (" + topicName + ", " + test.questions.length + " Qs)");
    L.push("Taken: " + when);
    L.push("Score: " + res.score + "/" + test.questions.length + " · attempted " + res.attempted + " · accuracy " + Math.round(res.acc * 100) + "% · CAT marks " + res.marks);
    L.push("Time: " + fmt(res.secs) + " vs target " + fmt(res.target) + (res.overList.length ? " · over target: " + res.overList.join(", ") : " · none over target"));
    if (res.byLevel) L.push("By level: " + res.byLevel.map(x => "L" + x.lv + " " + x.right + "/" + x.total + " in " + fmt(x.secs) + " (target " + fmt(x.target) + ")").join(" · "));
    L.push("Weak types: " + (res.weakTypes.join("; ") || "none"));
    if (res.slowTypes.length) L.push("Right but slow: " + res.slowTypes.join("; "));
    L.push("");
    res.rows.forEach(r => {
      const q = test.questions[r.n - 1];
      const mark = r.status === "right" ? "RIGHT" : r.status === "wrong" ? "WRONG" : "SKIPPED";
      L.push("Q" + r.n + (r.lv ? " L" + r.lv : "") + " " + mark + " | yours: " + (r.answer || "-") + " | key: " + q.show + " | " + fmt(r.secs) + "/" + fmt(r.target) + " | " + r.type);
    });
    return L.join("\n");
  }

  function resultsView(test, topic, res) {
    const n = test.questions.length;
    const pct = Math.round(res.score / n * 100);
    return '' +
      '<a class="back" href="#/math/' + topic.id + '">← ' + esc(topic.name) + "</a>" +
      '<header class="page-head"><p class="eyebrow">Results · ' + esc(new Date(res.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) + '</p><h1>' + esc(test.title) + "</h1></header>" +
      '<section class="card score ' + res.level + '">' +
        '<div class="ring" style="--p:' + pct + '"><span>' + res.score + "<small>/" + n + "</small></span></div>" +
        '<div class="score-stats">' +
          stat("Accuracy", Math.round(res.acc * 100) + "%", res.attempted + " attempted") +
          stat("CAT marks", res.marks, "+3 right, −1 wrong MCQ") +
          stat("Time", fmt(res.secs), "target " + fmt(res.target)) +
          stat("Over target", res.overList.length, res.overList.join(", ") || "none") +
        "</div>" +
        '<p class="verdict">' + esc(res.verdict) + "</p>" +
      "</section>" +
      (res.byLevel ? '<section class="card"><h2>By level 🎀</h2><div class="lv-grid">' + res.byLevel.map(x =>
        '<div class="lv-card lv' + x.lv + '"><span class="sub">' + esc(LV[x.lv].name) + '</span><b>' + x.right + "<small>/" + x.total + '</small></b><span class="small' + (x.secs > x.target ? " over" : "") + '">' + fmt(x.secs) + " vs " + fmt(x.target) + "</span></div>").join("") + "</div></section>" : "") +
      '<section class="card"><h2>What to work on 🧸</h2>' +
        (res.weakTypes.length ? '<p class="sub">Got wrong or skipped</p><div class="tags">' + res.weakTypes.map(t => chip(t, "bad")).join("") + "</div>" : '<p class="muted">No weak types in this test. 😍</p>') +
        (res.slowTypes.length ? '<p class="sub">Right, but slower than target</p><div class="tags">' + res.slowTypes.map(t => chip(t, "warn")).join("") + "</div>" : "") +
        '<p class="small muted">Re-solve each wrong question below without looking, then read its solution.</p>' +
      "</section>" +
      '<section class="card send"><h2>Send this to Claude 📮</h2><p class="muted">Copy the report and paste it in the chat. Claude checks it, updates your tracker on this site and plans the next set.</p>' +
        '<div class="row"><button class="btn primary" id="copyBtn" type="button">Copy report for Claude</button><span id="copyMsg" class="small" role="status"></span></div>' +
        '<textarea id="reportBox" readonly hidden aria-label="Report text"></textarea></section>' +
      '<section><h2 class="sec">Question by question</h2>' +
        res.rows.map(r => {
          const q = test.questions[r.n - 1];
          const cls = r.status === "right" ? "good" : r.status === "wrong" ? "bad" : "muted";
          const label = r.status === "right" ? "Right" : r.status === "wrong" ? "Wrong" : "Skipped";
          return '<details class="card review ' + cls + '"' + (r.status !== "right" ? " open" : "") + '><summary><span class="q-num">Q' + r.n + "</span>" + chip(label, cls) + '<span class="rv-type">' + esc(r.type) + '</span><span class="rv-time' + (r.over ? " over" : "") + '">' + fmt(r.secs) + " / " + fmt(r.target) + "</span></summary>" +
            '<div class="fold-body"><p class="q-text">' + esc(q.text) + "</p>" +
            '<p class="rv-ans"><span>Yours: <b>' + esc(r.answer || "—") + '</b></span><span>Answer: <b>' + esc(q.show) + "</b></span></p>" +
            '<ol class="steps">' + q.steps.map(s => "<li>" + esc(s) + "</li>").join("") + "</ol></div></details>";
        }).join("") +
      "</section>" +
      '<section class="card cta"><p class="muted">Want another go? Your result is saved in your history.</p><button class="btn" id="retakeBtn" type="button">Retake test</button></section>';
  }
  function stat(label, val, sub) {
    return '<div class="stat"><span class="sub">' + esc(label) + "</span><b>" + esc(val) + '</b><span class="small muted">' + esc(sub) + "</span></div>";
  }
  async function copyText(text, msg, box) {
    try { await navigator.clipboard.writeText(text); msg.textContent = "Copied! Paste it in the chat with Claude 💌"; }
    catch (e) {
      box.hidden = false; box.value = text; box.focus(); box.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e2) {}
      msg.textContent = ok ? "Copied! Paste it in the chat with Claude 💌" : "Select the text below and copy it.";
    }
  }
  function wireResults(test, st) {
    const text = reportText(test, st.result);
    document.getElementById("copyBtn").addEventListener("click", () => copyText(text, document.getElementById("copyMsg"), document.getElementById("reportBox")));
    const rb = document.getElementById("retakeBtn");
    let armed = false;
    rb.addEventListener("click", () => {
      if (!armed) { armed = true; rb.textContent = "Tap again to clear and restart"; return; }
      store.del("test:" + test.id); route();
    });
  }

  // ---------- tracker ----------
  function progressText() {
    const L = [LOVE.her + "'s progress on this device (CAT Prep site)", "Date: " + todayISO()];
    L.push("Kisses: " + stats.kisses + " · streak: " + stats.streak + " days · visits: " + stats.visits + " · study time today: " + Math.floor(stats.timeSecs / 60) + " min");
    const rv = Object.keys(stats.revised).map(k => ((byId(MATH, k) || {}).name || k.toUpperCase()) + " (" + shortDate(stats.revised[k]) + ")");
    L.push("Revised: " + (rv.join(", ") || "none yet"));
    const qz = Object.keys(stats.quiz).map(k => QUIZ[k].title + " best " + stats.quiz[k].best + "/10, last " + stats.quiz[k].last + "/10, played " + stats.quiz[k].plays + "x");
    L.push("Quick quizzes: " + (qz.join("; ") || "none yet"));
    const hist = store.get("attempts", []);
    L.push("Timed tests: " + (hist.map(h => h.title + " " + h.score + "/" + h.total + " (" + new Date(h.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ")").join("; ") || "none yet"));
    return L.join("\n");
  }
  function trackerPage() {
    const rvCount = Object.keys(stats.revised).length;
    return '' +
      '<header class="page-head"><p class="eyebrow">Updated by Claude · ' + esc(niceDate(T.updated)) + '</p><h1>Revision plan tracker</h1><p class="lede">' + esc(T.goalNote) + "</p></header>" +
      '<section class="card mine"><h2>Your progress on this phone 💗</h2><div class="mine-stats">' +
        '<div><b>' + stats.kisses + '</b><span>kisses 💋</span></div><div><b>' + stats.streak + '</b><span>day streak 🔥</span></div><div><b>' + rvCount + '</b><span>topics revised 📚</span></div><div><b>' + stats.visits + '</b><span>visits 🏠</span></div>' +
      '</div><p class="small muted">Copy this and paste it in the chat, so Claude can add it to the plan.</p><div class="row"><button class="btn" id="progBtn" type="button">Copy my progress</button><span id="progMsg" class="small" role="status"></span></div><textarea id="progBox" readonly hidden aria-label="Progress text"></textarea></section>' +
      '<section class="card"><h2>Topic tracker</h2><div class="table-wrap"><table><thead><tr><th>Topic</th><th>Status</th><th>Score</th><th>Weak types</th></tr></thead><tbody>' +
        BLOCKS.map(b => '<tr class="grp"><td colspan="4">' + esc(b.name) + "</td></tr>" + MATH.filter(m => m.block === b.id).map(m => {
          const s = topicStatus(m.id);
          return '<tr><td><a href="#/math/' + m.id + '">' + esc(m.name) + "</a>" + (stats.revised[m.id] ? " 💗" : "") + "</td><td>" + chip(s.status, statusClass(s.status)) + "</td><td>" + esc(s.score || "—") + "</td><td>" + esc(s.weak || "—") + "</td></tr>";
        }).join("")).join("") +
      "</tbody></table></div></section>" +
      '<section class="card" id="weak"><h2>Weakness board</h2><p class="small muted">Marked Fixed only after 3 fresh questions of that type are right in a row.</p><div class="weak-cards">' +
        T.weaknesses.map(w => '<div class="weak">' + chip(w.status, statusClass(w.status)) + "<h3>" + esc(w.what) + '</h3><p class="small muted">Found in ' + esc(w.found) + "</p><p>" + esc(w.fix) + "</p></div>").join("") +
      "</div></section>" +
      '<section class="card"><h2>Error log</h2><p class="small muted">Redo each one after 1, 3 and 7 days in the warm-up.</p><div class="table-wrap"><table><thead><tr><th>Date</th><th>Question</th><th>Reason</th><th>Takeaway</th></tr></thead><tbody>' +
        T.errorLog.map(e => "<tr><td>" + esc(e.date) + "</td><td>" + esc(e.where) + "</td><td>" + esc(e.reason) + "</td><td>" + esc(e.takeaway) + "</td></tr>").join("") +
      "</tbody></table></div></section>" +
      '<section class="card"><h2>Calendar</h2>' +
        T.calendar.map(b => '<p class="sub">' + esc(b.block) + '</p><ul class="cal">' + b.items.map(i => '<li class="' + (i.done ? "done" : "") + (i.date === todayISO() ? " today-row" : "") + '"><span class="tick" aria-hidden="true"></span><span class="date">' + esc(niceDate(i.date)) + "</span><span>" + esc(i.text) + "</span></li>").join("") + "</ul>").join("") +
      "</section>";
  }
  function wireTracker() {
    document.getElementById("progBtn").addEventListener("click", () => copyText(progressText(), document.getElementById("progMsg"), document.getElementById("progBox")));
  }

  // ---------- us ----------
  function usPage() {
    const mood = stats.mood && stats.mood.day === todayISO() ? LOVE.moods.find(m => m.id === stats.mood.id) : null;
    const unlocked = LOVE.milestones.filter(m => stats.milestones.includes(m.at));
    const nm = nextMilestone();
    return '' +
      '<header class="page-head"><p class="eyebrow">Just ' + esc(LOVE.me) + ' & ' + esc(LOVE.her) + ' 💕</p><h1>Us</h1><p class="lede">A little corner for the two of us. Check in, open a letter, or study together for 25 minutes.</p></header>' +
      '<section class="card mood"><h2>How are you feeling today?</h2><div class="moods">' +
        LOVE.moods.map(m => '<button class="mood-btn' + (mood && mood.id === m.id ? " on" : "") + '" type="button" data-mood="' + m.id + '"><span aria-hidden="true">' + m.emoji + "</span>" + esc(m.label) + "</button>").join("") +
      '</div><p class="mood-reply" id="moodReply" aria-live="polite">' + (mood ? '<span class="toast-av sm" aria-hidden="true">' + miniFace() + "</span>" + esc(fill(mood.reply)) : "") + "</p></section>" +
      '<section class="card cuddle"><div class="cuddle-art">' + couple("loop") + '</div><div class="cuddle-body"><h2>Need some love?</h2><p class="muted">Tap for a hug or a kiss from ' + esc(LOVE.me) + '. Unlimited refills 💞</p><div class="row"><button class="btn primary" id="hugBtn" type="button">Get a hug 🤗</button><button class="btn" id="kissBtn" type="button">Get a kiss 😘</button></div></div></section>' +
      '<section class="card focus"><div class="focus-ring" id="focusRing" style="--p:0"><div><b id="focusTime">25:00</b><span id="focusLabel">Ready when you are</span></div></div><div class="focus-body"><h2>Study date 📚</h2><p class="muted">25 minutes of focus with me, then a 5-minute break. Phone face down. You get 3 kisses for every round 💋</p><div class="row"><button class="btn primary" id="focusStart" type="button">Start study date</button><button class="btn" id="focusStop" type="button" hidden>Stop</button></div></div></section>' +
      musicRoom() +
      '<section><h2 class="sec">Open when… 💌</h2><div class="letters">' +
        LOVE.letters.map(l => { const locked = l.unlock && todayISO() < l.unlock; const read = (stats.lettersRead || []).includes(l.id);
          return '<button class="letter' + (locked ? " locked" : "") + (read ? " read" : "") + '" type="button" data-letter="' + l.id + '"><span class="env" aria-hidden="true">' + (locked ? "🔒" : read ? "💌" : "✉️") + '</span><span class="lt-emoji" aria-hidden="true">' + l.emoji + "</span><b>" + esc(l.title) + "</b>" + (locked ? '<small>Opens ' + esc(shortDate(l.unlock)) + "</small>" : read ? "<small>Read again</small>" : "<small>Tap to open</small>") + "</button>"; }).join("") +
      "</div></section>" +
      '<section class="card shayari-card"><p class="sub">Main shayar toh nahin… par tumhare liye 🌹</p><blockquote class="shayari big" id="shayariBox">' + shayariHTML(dailyShayari()) + '</blockquote><button class="btn" id="shayariBtn" type="button">Ek aur shayari 💌</button></section>' +
      '<section class="card reasons"><h2>Reasons I’m proud of you 🥹</h2><p class="reason" id="reasonText">' + esc(LOVE.reasons[Math.floor(Math.random() * LOVE.reasons.length)]) + '</p><button class="btn" id="reasonBtn" type="button">Another reason 💗</button></section>' +
      '<section class="card"><h2>Kiss jar rewards 🫙</h2><p class="muted">You have <b data-kisses>' + stats.kisses + "</b> kisses." + (nm ? " Next reward at " + nm.at + "." : " Every reward unlocked!") + "</p>" +
        '<ul class="rewards">' + LOVE.milestones.map(m => { const got = unlocked.includes(m); return '<li class="' + (got ? "got" : "") + '"><span aria-hidden="true">' + (got ? "💝" : "🔒") + "</span><b>" + m.at + "</b><span>" + (got ? esc(m.text) : "A surprise from " + esc(LOVE.me) + "…") + "</span></li>"; }).join("") + "</ul></section>";
  }
  function songLink(s, label) {
    const q = encodeURIComponent(s.title + " " + s.film + " song");
    return '<a class="song" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener noreferrer"><span class="song-disc" aria-hidden="true">💿</span><span><small>' + esc(label) + "</small><b>" + esc(s.title) + "</b><em>" + esc(s.film) + " (" + s.year + ")</em></span></a>";
  }
  function letterScene(l) {
    if (sceneOpen) return;
    sceneOpen = true;
    const prev = document.activeElement;
    const wrap = document.createElement("div");
    wrap.className = "scene";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", l.title);
    wrap.innerHTML = '<div class="scene-card letter-card"><span class="lc-emoji" aria-hidden="true">' + l.emoji + "</span><h2>" + esc(l.title) + '</h2><p class="lc-text">' + esc(fill(l.text)) + "</p>" +
      (l.shayari ? '<blockquote class="shayari"><span class="sub">✍️ Shayari, sirf tumhare liye</span>' + l.shayari.map(x => '<span class="sh-line' + (x.startsWith("—") ? " sh-note" : "") + '">' + esc(fill(x)) + "</span>").join("") + "</blockquote>" : "") +
      (l.filmy ? '<p class="filmy"><span class="sub">🎬 Filmy moment</span>' + esc(fill(l.filmy)) + "</p>" : "") +
      (l.song ? (songIdx(l.song.title) >= 0 && LOVE.playlist[songIdx(l.song.title)].yt
        ? '<button class="song" type="button" data-playsong="' + songIdx(l.song.title) + '"><span class="song-disc" aria-hidden="true">💿</span><span><small>🎵 Song for you · tap to play here</small><b>' + esc(l.song.title) + "</b><em>" + esc(l.song.film) + " (" + l.song.year + ")</em></span></button>"
        : songLink(l.song, "🎵 Song for you")) : "") +
      (l.end ? '<p class="lc-end">' + esc(fill(l.end)) + "</p>" : "") +
      '<span class="toast-from">With all my love, ' + esc(LOVE.me) + ' 💌</span><button class="btn primary" type="button">Close 💗</button></div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("in"));
    const btn = wrap.querySelector("button");
    btn.focus({ preventScroll: true });
    wrap.querySelector(".scene-card").scrollTop = 0;
    const close = () => {
      wrap.classList.remove("in");
      document.removeEventListener("keydown", onKey);
      setTimeout(() => { wrap.remove(); sceneOpen = false; if (prev && prev.focus) prev.focus(); }, 250);
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    btn.addEventListener("click", close);
    wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
    const ps = wrap.querySelector("[data-playsong]");
    if (ps) ps.addEventListener("click", () => {
      close();
      setTimeout(() => { const mr = document.getElementById("musicRoom"); if (mr) mr.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); playSong(+ps.dataset.playsong); }, 260);
    });
  }

  // ---------- music room (official YouTube uploads, played through YouTube's own player) ----------
  const songIdx = title => LOVE.playlist.findIndex(s => s.title === title);
  const music = { player: null, cur: -1, shuffle: false, playing: false, timer: null, ready: null };
  function musicRoom() {
    const playable = LOVE.playlist.filter(s => s.yt || s.apple).length;
    return '<section class="card music" id="musicRoom">' +
      '<div class="music-head"><div><h2>Our music room 🎧</h2><p class="muted">' + playable + ' old Bollywood songs I dedicate to you. Pick one and study with it 💗</p></div></div>' +
      '<div class="music-main">' +
        '<div class="music-screen"><div class="yt-frame"><div id="ytPlayer"></div><div class="apple-box" id="appleBox" hidden></div><div class="yt-cover" id="ytCover"><div class="vinyl" aria-hidden="true"><span></span></div><p>Tap a song to start 💿</p></div></div></div>' +
        '<div class="now"><span class="sub" id="nowLabel">Now playing</span><b id="nowTitle">Pick a song for us</b><em id="nowFilm">Old Bollywood, only for you</em><p class="now-note" id="nowNote">Every song here comes with a note from ' + esc(LOVE.me) + ' 💌</p>' +
          '<div class="bar seek" id="seekBar" role="slider" aria-label="Song position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><span id="seekFill"></span></div><div class="times"><span id="tNow">0:00</span><span id="tDur">0:00</span></div>' +
          '<div class="controls"><button class="cbtn" id="mPrev" type="button" aria-label="Previous song">⏮</button><button class="cbtn big" id="mPlay" type="button" aria-label="Play">▶</button><button class="cbtn" id="mNext" type="button" aria-label="Next song">⏭</button><button class="cbtn" id="mShuffle" type="button" aria-pressed="false" aria-label="Shuffle">🔀</button></div>' +
        "</div>" +
      "</div>" +
      '<ol class="tracks">' + LOVE.playlist.map((s, i) => (s.yt || s.apple)
        ? '<li><button class="track" type="button" data-track="' + i + '"><span class="tr-n">' + (i + 1) + '</span><span class="tr-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="tr-body"><b>' + esc(s.title) + "</b><em>" + esc(s.film) + " · " + s.year + (s.apple ? " · Apple Music" : "") + '</em><small>' + esc(s.note) + "</small></span></button></li>"
        : '<li><a class="track ext" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(s.title + " " + s.film + " song") + '" target="_blank" rel="noopener noreferrer"><span class="tr-n">↗</span><span class="tr-body"><b>' + esc(s.title) + "</b><em>" + esc(s.film) + " · " + s.year + ' · opens on YouTube</em><small>' + esc(s.note) + "</small></span></a></li>").join("") +
      "</ol>" +
      '<p class="small muted music-foot">Songs play from the official label channels on YouTube. Keep this page open while they play; most phones pause YouTube when the screen locks.</p>' +
      "</section>";
  }
  function loadYT() {
    if (music.ready) return music.ready;
    music.ready = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) return resolve();
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => { music.ready = null; reject(new Error("YouTube player could not load")); };
      document.head.appendChild(s);
    });
    return music.ready;
  }
  const playableList = () => LOVE.playlist.map((s, i) => (s.yt || s.apple) ? i : -1).filter(i => i >= 0);
  function paintMusic() {
    const s = LOVE.playlist[music.cur];
    const el = id => document.getElementById(id);
    if (!el("musicRoom")) return;
    app.querySelectorAll("[data-track]").forEach(b => { const on = +b.dataset.track === music.cur; b.classList.toggle("on", on); b.classList.toggle("playing", on && music.playing); });
    el("mPlay").textContent = music.playing ? "⏸" : "▶";
    el("mPlay").setAttribute("aria-label", music.playing ? "Pause" : "Play");
    el("mShuffle").classList.toggle("on", music.shuffle);
    el("mShuffle").setAttribute("aria-pressed", music.shuffle ? "true" : "false");
    el("musicRoom").classList.toggle("is-playing", music.playing);
    if (s) {
      el("nowTitle").textContent = s.title;
      el("nowFilm").textContent = s.film + " (" + s.year + ")";
      el("nowNote").textContent = s.note + " — " + LOVE.me + " 💌" + (s.apple ? " (plays in Apple Music's player)" : "");
      el("ytCover").hidden = true;
    }
  }
  function tickMusic() {
    const p = music.player, cur = LOVE.playlist[music.cur];
    if (!p || !p.getDuration || !document.getElementById("seekFill") || (cur && cur.apple)) return;
    const d = p.getDuration() || 0, t = p.getCurrentTime() || 0;
    document.getElementById("seekFill").style.width = (d ? t / d * 100 : 0) + "%";
    document.getElementById("seekBar").setAttribute("aria-valuenow", d ? Math.round(t / d * 100) : 0);
    document.getElementById("tNow").textContent = fmt(t);
    document.getElementById("tDur").textContent = fmt(d);
  }
  async function playSong(i) {
    const s = LOVE.playlist[i];
    if (!s || !(s.yt || s.apple) || !document.getElementById("musicRoom")) return;
    music.cur = i;
    const ab = document.getElementById("appleBox");
    if (s.apple) {
      // Apple Music's own embed player (a preview, or the full song when signed in to Apple Music).
      if (music.player && music.player.pauseVideo) music.player.pauseVideo();
      music.playing = false;
      ab.innerHTML = '<iframe title="' + esc(s.title) + ' on Apple Music" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/album/' + s.apple + '"></iframe>' +
        '<p class="apple-links">Not loading? <a href="https://music.apple.com/in/album/' + s.apple + '" target="_blank" rel="noopener noreferrer">Open in Apple Music</a> · <a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(s.title + " " + s.film + " song") + '" target="_blank" rel="noopener noreferrer">Open on YouTube</a></p>';
      ab.hidden = false;
      paintMusic();
      ["seekFill"].forEach(id => { const x = document.getElementById(id); if (x) x.style.width = "0%"; });
      document.getElementById("tNow").textContent = "—"; document.getElementById("tDur").textContent = "—";
      toast("“" + s.title + "” for my pari 🧚‍♀️💗 Tap play in the Apple Music player.");
      return;
    }
    if (ab) { ab.hidden = true; ab.innerHTML = ""; }
    paintMusic();
    try { await loadYT(); } catch (e) { toast("The music player couldn't load. Check the internet and try again 💗"); return; }
    if (!document.getElementById("musicRoom")) return;
    if (music.player && music.player.loadVideoById) { music.player.loadVideoById(s.yt); }
    else {
      music.player = new YT.Player("ytPlayer", {
        videoId: s.yt, width: "100%", height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: e => { if (/[?&]mute\b/.test(location.search)) e.target.mute(); e.target.playVideo(); },
          onStateChange: e => {
            music.playing = e.data === YT.PlayerState.PLAYING;
            if (music.playing) music.errors = 0;
            if (e.data === YT.PlayerState.ENDED) nextSong();
            paintMusic(); tickMusic();
          },
          onError: e => {
            const bad = LOVE.playlist[music.cur], mr = document.getElementById("musicRoom");
            if (mr) mr.dataset.err = e.data;
            music.errors = (music.errors || 0) + 1;
            // 100 = removed, 101/150 = the owner blocked embedding: skip it. Anything else is the browser or network: stop.
            if ([100, 101, 150].includes(e.data) && music.errors < 4) {
              toast("“" + bad.title + "” can't play here right now. Next one 💗");
              setTimeout(nextSong, 1200);
            } else {
              toast("This song won't play in this browser right now. Try again, or open it on YouTube 💗");
            }
          }
        }
      });
    }
    if (!music.timer) music.timer = setInterval(tickMusic, 500);
    if (!music.greeted) { music.greeted = true; toast("Now playing “" + s.title + "”, dedicated to you 🎶💗"); }
  }
  function nextSong(step) {
    const list = playableList();
    if (!list.length) return;
    if (music.shuffle && list.length > 1) { let n; do { n = list[Math.floor(Math.random() * list.length)]; } while (n === music.cur); return playSong(n); }
    const pos = list.indexOf(music.cur);
    playSong(list[pos < 0 ? 0 : (pos + (step || 1) + list.length) % list.length]);
  }
  function wireMusic() {
    app.querySelectorAll("[data-track]").forEach(b => b.addEventListener("click", () => {
      if (+b.dataset.track === music.cur && music.player && music.player.getPlayerState) {
        if (music.playing) music.player.pauseVideo(); else music.player.playVideo();
      } else playSong(+b.dataset.track);
    }));
    document.getElementById("mPlay").addEventListener("click", () => {
      if (!music.player || music.cur < 0) return playSong(music.cur >= 0 ? music.cur : playableList()[0]);
      if (music.playing) music.player.pauseVideo(); else music.player.playVideo();
    });
    document.getElementById("mNext").addEventListener("click", () => nextSong(1));
    document.getElementById("mPrev").addEventListener("click", () => nextSong(-1));
    document.getElementById("mShuffle").addEventListener("click", () => { music.shuffle = !music.shuffle; paintMusic(); toast(music.shuffle ? "Shuffle on: surprise me 🔀💕" : "Shuffle off 💗"); });
    const bar = document.getElementById("seekBar");
    const seekTo = frac => { const p = music.player; if (p && p.getDuration) { p.seekTo(Math.max(0, Math.min(1, frac)) * p.getDuration(), true); tickMusic(); } };
    bar.addEventListener("click", e => { const r = bar.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); });
    bar.addEventListener("keydown", e => {
      const p = music.player; if (!p || !p.getDuration) return;
      const d = p.getDuration() || 1, t = p.getCurrentTime() || 0;
      if (e.key === "ArrowRight") { e.preventDefault(); seekTo((t + 10) / d); }
      if (e.key === "ArrowLeft") { e.preventDefault(); seekTo((t - 10) / d); }
    });
    // The player lives inside this page; leaving the page stops the music.
    leaveHook = () => {
      if (music.timer) { clearInterval(music.timer); music.timer = null; }
      if (music.player && music.player.destroy) { try { music.player.destroy(); } catch (e) {} }
      music.player = null; music.playing = false; music.cur = -1;
    };
  }
  const shayariHTML = pair => pair.map(x => '<span class="sh-line">' + esc(fill(x)) + "</span>").join("");
  function dailyShayari() {
    const day = Math.floor(new Date(todayISO() + "T00:00:00").getTime() / 86400000);
    return LOVE.shayari[day % LOVE.shayari.length];
  }
  function wireUs() {
    wireMusic();
    let shIdx = LOVE.shayari.indexOf(dailyShayari());
    document.getElementById("shayariBtn").addEventListener("click", e => {
      shIdx = (shIdx + 1) % LOVE.shayari.length;
      document.getElementById("shayariBox").innerHTML = shayariHTML(LOVE.shayari[shIdx]);
      burstAt(e.currentTarget, 8);
    });
    app.querySelectorAll("[data-mood]").forEach(b => b.addEventListener("click", () => {
      const m = LOVE.moods.find(x => x.id === b.dataset.mood);
      stats.mood = { id: m.id, day: todayISO() }; saveStats();
      app.querySelectorAll("[data-mood]").forEach(x => x.classList.toggle("on", x === b));
      document.getElementById("moodReply").innerHTML = '<span class="toast-av sm" aria-hidden="true">' + miniFace() + "</span>" + esc(fill(m.reply));
      burstAt(b, 8);
    }));
    document.getElementById("hugBtn").addEventListener("click", () => kissScene(fill(pick(LOVE.hug, "hug")), "Hug! 🤗", "hug"));
    document.getElementById("kissBtn").addEventListener("click", () => kissScene(fill(pick(LOVE.kiss, "kiss")), "Muah! 😘"));
    document.getElementById("focusStart").addEventListener("click", () => startFocus("focus"));
    document.getElementById("focusStop").addEventListener("click", () => { stopFocus(); toast("Stopped. It's okay, even 10 minutes counts 💗"); });
    app.querySelectorAll("[data-letter]").forEach(b => b.addEventListener("click", () => {
      const l = LOVE.letters.find(x => x.id === b.dataset.letter);
      if (l.unlock && todayISO() < l.unlock) { toast("Not yet, cutie! This one opens on " + shortDate(l.unlock) + " 🔒💗"); return; }
      stats.lettersRead = stats.lettersRead || [];
      if (!stats.lettersRead.includes(l.id)) { stats.lettersRead.push(l.id); saveStats(); b.classList.add("read"); b.querySelector(".env").textContent = "💌"; b.querySelector("small").textContent = "Read again"; }
      letterScene(l);
    }));
    const rt = document.getElementById("reasonText");
    document.getElementById("reasonBtn").addEventListener("click", e => {
      let next; do { next = LOVE.reasons[Math.floor(Math.random() * LOVE.reasons.length)]; } while (LOVE.reasons.length > 1 && next === rt.textContent);
      rt.textContent = next; burstAt(e.currentTarget, 8);
    });
    paintFocus();
  }

  function notFound() {
    return '<header class="page-head"><h1>Page not found 🥺</h1><p class="lede"><a href="#/">Go home</a></p></header>';
  }

  const arrival = countVisit();
  route();
  greet(arrival);
})();
