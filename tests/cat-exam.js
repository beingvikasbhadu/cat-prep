/* CAT-style exam engine with full analytics.
   The page sets window.CAT_EXAM = { title, section, key, minutes, intro, questions:[{n, kind:'MCQ'|'TITA', text, opts}], data:'<base64 JSON>' }
   data (hidden until submit) = [{n, topic, sub, diff:1..5, ans, sol, src, pct}]
   Works like the CAT screen: one question at a time, question palette, Save & Next, Mark for Review & Next,
   Clear Response; an answer counts only after Save & Next (or Mark for Review & Next). TITA uses an on-screen keypad.
   Tracks: visit order, time on every question, saves, changes, marks. After Submit: analytics + solutions. */
(function () {
  const C = window.CAT_EXAM;
  const QS = C.questions;
  const N = QS.length;
  const LIMIT = C.minutes * 60 * 1000;
  const TARGET_TOPICS = ['Arithmetic', 'Algebra', 'Geometry'];
  const DIFF = ['', 'Very easy', 'Easy', 'Medium', 'Hard', 'Very hard'];
  const IDEAL = [0, 90, 120, 180, 240, 300]; // seconds per difficulty
  let META = null;
  function meta() {
    if (!META) {
      const bin = atob(C.data);
      META = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
    }
    return META;
  }

  /* ---------- styles ---------- */
  const css = `
  :root{color-scheme:light}
  body{margin:0;background:#eef1f5;color:#1d2533;font-family:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;font-size:15px;line-height:1.5}
  .cx *{box-sizing:border-box}
  .cx-top{position:sticky;top:0;z-index:20;background:#2f3b4c;color:#fff;display:flex;align-items:center;gap:10px;padding:8px 14px;flex-wrap:wrap}
  .cx-top .t{font-weight:600;font-size:14px;flex:1;min-width:150px}
  .cx-top #cc-slot .cc-icon{background:#fff;border-color:#fff}
  .cx-time{font:600 15px "IBM Plex Mono",ui-monospace,Consolas,monospace;background:#fff;color:#1d2533;border-radius:4px;padding:4px 10px;white-space:nowrap}
  .cx-time.low{background:#ffe2d6;color:#b23a00}
  .cx-palbtn{display:none;background:#fff;color:#2f3b4c;border:0;border-radius:4px;padding:6px 10px;font:600 13px inherit;cursor:pointer}
  .cx-sec{background:#fff;border-bottom:1px solid #d5dbe3;padding:6px 14px;display:flex;gap:8px;align-items:center;font-size:13px}
  .cx-sec b{background:#1f6fd1;color:#fff;border-radius:3px;padding:3px 10px;font-weight:600}
  .cx-main{display:grid;grid-template-columns:minmax(0,1fr) 300px;min-height:calc(100vh - 92px)}
  .cx-q{background:#fff;display:flex;flex-direction:column;border-right:1px solid #d5dbe3}
  .cx-qhead{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid #e3e7ee;font-size:13px;color:#555}
  .cx-qhead b{color:#1d2533;font-size:16px}
  .cx-qbody{padding:16px;flex:1;overflow:auto}
  .cx-qbody p{margin:0 0 14px;max-width:70ch;font-size:16px}
  .cx-opt{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border:1px solid transparent;border-radius:6px;cursor:pointer;margin-bottom:4px;max-width:70ch}
  .cx-opt:hover{background:#f3f6fa}
  .cx-opt input{margin-top:4px;width:17px;height:17px;flex:none}
  .cx-opt.sel{border-color:#1f6fd1;background:#eef4fd}
  .cx-tita input{font:600 20px "IBM Plex Mono",monospace;width:220px;max-width:100%;padding:8px 10px;border:1px solid #9aa6b5;border-radius:4px;background:#fff;color:#000}
  .cx-kp{display:grid;grid-template-columns:repeat(3,52px);gap:6px;margin-top:10px}
  .cx-kp button{height:40px;border:1px solid #aab3c0;border-radius:4px;background:#f4f6f9;font:600 16px Arial,sans-serif;cursor:pointer;color:#222}
  .cx-kp button:active{background:#dfe5ec}
  .cx-kp .w3{grid-column:span 3;font-size:13px}
  .cx-hint{font-size:12.5px;color:#666;margin-top:8px}
  .cx-actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid #e3e7ee;background:#f8f9fb;position:sticky;bottom:0}
  .cx-actions button{font:600 14px "IBM Plex Sans",system-ui,sans-serif;border-radius:4px;padding:9px 14px;border:1px solid #aab3c0;background:#fff;cursor:pointer;color:#1d2533}
  .cx-actions .save{margin-left:auto;background:#1f6fd1;color:#fff;border-color:#1f6fd1}
  .cx-side{background:#e8eef6;padding:12px;display:flex;flex-direction:column;gap:10px}
  .cx-legend{display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;font-size:12px;background:#fff;border-radius:6px;padding:10px}
  .cx-legend div{display:flex;align-items:center;gap:6px}
  .cx-legend .full{grid-column:span 2}
  .pq{display:inline-grid;place-items:center;width:36px;height:32px;font:600 13px Arial,sans-serif;border:1px solid #b8c0cc;background:#f4f4f4;color:#333;cursor:pointer;position:relative;border-radius:3px;padding:0}
  .pq.s-na{background:#e2512b;border-color:#c43f1c;color:#fff;border-radius:16px 16px 3px 3px}
  .pq.s-ans{background:#2ea44f;border-color:#228b3f;color:#fff;border-radius:3px 3px 16px 16px}
  .pq.s-mk{background:#6f42c1;border-color:#5a32a3;color:#fff;border-radius:50%}
  .pq.s-amk{background:#6f42c1;border-color:#5a32a3;color:#fff;border-radius:50%}
  .pq.s-amk::after{content:"";position:absolute;right:-2px;bottom:-2px;width:11px;height:11px;border-radius:50%;background:#2ea44f;border:2px solid #fff}
  .pq.cur{outline:3px solid #f0a020;outline-offset:1px}
  .cx-legend .pq{width:28px;height:24px;font-size:11px;cursor:default}
  .cx-pal{background:#fff;border-radius:6px;padding:10px}
  .cx-pal h3{margin:0 0 8px;font-size:13px;background:#1f6fd1;color:#fff;padding:5px 8px;border-radius:3px}
  .cx-grid{display:grid;grid-template-columns:repeat(5,36px);gap:8px;justify-content:start}
  .cx-sideclose{display:none;align-self:flex-end;background:#fff;border:1px solid #aab3c0;border-radius:4px;padding:6px 12px;font:600 13px "IBM Plex Sans",system-ui,sans-serif;cursor:pointer}
  .cx-submit{background:#1f8f5f;color:#fff;border:0;border-radius:4px;padding:11px;font:600 15px "IBM Plex Sans",system-ui,sans-serif;cursor:pointer}
  .cx-modal{position:fixed;inset:0;background:rgba(10,20,35,.55);z-index:80;display:grid;place-items:center;padding:16px}
  .cx-modal[hidden]{display:none}
  .cx-box{background:#fff;border-radius:8px;max-width:440px;width:100%;padding:18px;display:grid;gap:12px}
  .cx-box h3{margin:0;font-size:18px}
  .cx-box table{border-collapse:collapse;width:100%;font-size:14px}
  .cx-box td{border:1px solid #d5dbe3;padding:6px 8px}
  .cx-box td:last-child{text-align:right;font-weight:600}
  .cx-box .r{display:flex;gap:8px;justify-content:flex-end}
  .cx-box button{font:600 14px "IBM Plex Sans",system-ui,sans-serif;border-radius:4px;padding:9px 16px;border:1px solid #aab3c0;background:#fff;cursor:pointer}
  .cx-box button.go{background:#1f8f5f;color:#fff;border-color:#1f8f5f}
  .cx-intro{max-width:820px;margin:0 auto;padding:20px 16px 60px;display:grid;gap:14px}
  .cx-card{background:#fff;border:1px solid #d5dbe3;border-radius:8px;padding:16px}
  .cx-card h1{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:26px;margin:0 0 6px;line-height:1.2}
  .cx-card h2{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:19px;margin:0 0 8px}
  .cx-card ul{margin:0;padding-left:20px} .cx-card li{margin:4px 0}
  .cx-card p{margin:0 0 8px} .cx-card p:last-child{margin:0}
  .cx-go{background:#1f6fd1;color:#fff;border:0;border-radius:6px;padding:12px 18px;font:600 15px "IBM Plex Sans",system-ui,sans-serif;cursor:pointer}
  .cx-go:disabled{opacity:.45;cursor:not-allowed}
  .cx-check{display:flex;gap:8px;align-items:flex-start;margin:10px 0}
  .cx-check input{width:18px;height:18px;margin-top:2px;flex:none}
  /* report */
  .rp{--ink:#1d2533;--ink2:#52514e;--line:#dfe3e9;--good:#0ca30c;--good-t:#0a7d0a;--bad:#d03b3b;--serious:#ec835a;--warn:#b26b00;--skip:#c9ced6;
    --l1:#86b6ef;--l2:#5598e7;--l3:#2a78d6;--l4:#1c5cab;--l5:#0d366b;
    max-width:1000px;margin:0 auto;padding:22px 16px 70px;display:grid;grid-template-columns:minmax(0,1fr);gap:16px;color:var(--ink)}
  .rp > *,.hero > *{min-width:0}
  body.cx-report .cc-icon,body.cx-report .cc-pad{display:none !important}
  .qh .s{display:none}
  .rp h1{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:28px;margin:2px 0 0;line-height:1.15}
  .rp h2{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:19px;margin:0 0 6px}
  .rp .eyebrow{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2);font-weight:600}
  .rp .note{color:var(--ink2);font-size:13.5px;margin:0 0 12px}
  .rp .mut{color:var(--ink2)}
  .rp .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px}
  .hero{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px;align-items:center}
  .hero .big{font:600 64px/1 "IBM Plex Sans",system-ui,sans-serif;letter-spacing:-.02em;margin:6px 0 14px}
  .hero .big small{font-size:22px;color:var(--ink2);font-weight:500;letter-spacing:0}
  .meter{position:relative;height:12px;border-radius:6px;background:#eceff3;margin:22px 0 10px}
  .meter i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--l3)}
  .meter b{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--ink)}
  .meter b em{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font:600 11.5px "IBM Plex Sans",sans-serif;font-style:normal;white-space:nowrap;color:var(--ink);margin-bottom:2px}
  .hero .sub{font-size:13.5px;color:var(--ink2)}
  .kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .kpi{border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:grid}
  .kpi span{font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink2);font-weight:600}
  .kpi b{font:600 26px/1.2 "IBM Plex Sans",system-ui,sans-serif}
  .kpi em{font-style:normal;font-size:12px;color:var(--ink2)}
  .adv{list-style:none;margin:0;padding:0;display:grid;gap:8px}
  .adv li{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:8px;background:#f6f8fb;font-size:14.5px}
  .adv .ai{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;color:#fff;background:var(--ink2)}
  .adv .a-good .ai{background:var(--good)} .adv .a-bad .ai{background:var(--bad)} .adv .a-warn .ai{background:var(--warn)} .adv .a-score .ai{background:var(--l3)}
  .lv{display:inline-block;border-radius:999px;padding:1px 9px;font-size:12px;font-weight:600;white-space:nowrap;line-height:1.6}
  .lv1{background:var(--l1);color:#0b1d33}.lv2{background:var(--l2);color:#fff}.lv3{background:var(--l3);color:#fff}.lv4{background:var(--l4);color:#fff}.lv5{background:var(--l5);color:#fff}
  .qmap{display:grid;gap:6px;align-items:stretch}
  .qh{font-size:13px;font-weight:600;text-align:center;padding-bottom:2px}
  .qh small{font-weight:500;color:var(--ink2)}
  .qr{display:flex;align-items:center}
  .qc{border-radius:8px;background:#f7f8fa;padding:6px;display:flex;flex-wrap:wrap;gap:6px;min-height:44px;align-content:flex-start}
  .qc.zone{background:#e4eefc;box-shadow:inset 0 0 0 1px #b7d3f6}
  .qd{font:600 13px "IBM Plex Sans",system-ui,sans-serif;border-radius:6px;padding:5px 8px;cursor:pointer;display:inline-flex;gap:4px;align-items:center;border:1px solid transparent;min-height:32px}
  .qd i{font-style:normal}
  .qd-ok{background:var(--good);color:#fff}
  .qd-no{background:var(--bad);color:#fff}
  .qd-skip{background:#fff;color:var(--ink);border-color:#aab3c0}
  .legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px;font-size:12.5px;color:var(--ink2);align-items:center}
  .legend span{display:inline-flex;gap:6px;align-items:center}
  .sw{display:inline-block;width:14px;height:14px;border-radius:4px;flex:none}
  .sw.qd-skip{border:1px solid #aab3c0}
  .sw.zone{background:#e4eefc;box-shadow:inset 0 0 0 1px #b7d3f6}
  .tl{position:relative;padding:4px 0 0}
  .tl-track{position:relative;height:40px;background:#f1f3f6;border-radius:6px;overflow:hidden}
  .seg{position:absolute;top:0;bottom:0;border:0;border-right:2px solid #fff;padding:0;font:600 11.5px "IBM Plex Sans",sans-serif;color:#fff;cursor:pointer;overflow:hidden;white-space:nowrap}
  .seg.lv1{color:#0b1d33}
  .seg-left{position:absolute;top:0;bottom:0;right:0;display:grid;place-items:center;font-size:11.5px;color:var(--ink2);background:repeating-linear-gradient(135deg,#f1f3f6 0 6px,#e6e9ee 6px 7px)}
  .tl-saves{position:relative;height:22px}
  .sv{position:absolute;top:3px;transform:translateX(-50%);font-weight:700;font-size:13px;cursor:default;line-height:1}
  .sv-ok{color:var(--good-t)} .sv-no{color:var(--bad)}
  .tl-axis{position:relative;height:18px;border-top:1px solid var(--line);font-size:11px;color:var(--ink2)}
  .tl-axis span{position:absolute;top:2px;transform:translateX(-50%)}
  .tl-axis span:first-child{transform:none} .tl-axis span:last-child{transform:translateX(-100%)}
  .flow{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;counter-reset:f}
  .flow li{counter-increment:f;display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:8px;padding:5px 8px;font-size:12.5px;background:#fff}
  .flow li::before{content:counter(f);font:600 11px "IBM Plex Mono",monospace;color:var(--ink2)}
  .flow li.none::before{content:none}
  .flow b{font-size:14px} .flow .rs-ok{color:var(--good-t)} .flow .rs-no{color:var(--bad)} .flow .rs-skip{color:var(--ink2)}
  .stack{display:flex;height:22px;border-radius:6px;overflow:hidden;gap:2px;background:#fff;margin-bottom:12px}
  .stack i{display:block;height:100%;cursor:default}
  .c-good{background:var(--good)} .c-bad{background:var(--bad)} .c-serious{background:var(--serious)} .c-hard{background:#59606b} .c-other{background:#aab3c0} .c-idle{background:repeating-linear-gradient(135deg,#eceff3 0 5px,#d9dde3 5px 6px)} .c-skip{background:var(--skip)}
  .hb{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;min-width:120px;margin:3px 0 4px}
  .hb i{display:block;height:100%}
  .tw{overflow-x:auto}
  table.t{border-collapse:collapse;width:100%;font-size:13.5px}
  table.t th,table.t td{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:middle}
  table.t th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink2);font-weight:600;white-space:nowrap}
  table.t .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
  table.t .w{min-width:150px}
  table.compact td{padding:5px 8px}
  .tb{position:relative;height:10px;background:#eceff3;border-radius:5px;min-width:110px;margin-bottom:3px}
  .tb i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;background:var(--l3)}
  .tb i.over{background:var(--serious)}
  .tb b{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink)}
  .rs{font-weight:600;white-space:nowrap} .rs-ok{color:var(--good-t)} .rs-no{color:var(--bad)} .rs-skip{color:var(--ink2)}
  .vd{display:inline-block;font-size:12px;font-weight:600;border-radius:6px;padding:2px 8px;line-height:1.4}
  .vd-good{background:#e2f5e2;color:#0a6b0a} .vd-bad{background:#fbe3e3;color:#a22a2a} .vd-warn{background:#fdf0dc;color:#8a5200} .vd-neutral{background:#eef0f3;color:var(--ink2)}
  .sols{display:grid;gap:10px}
  details.sol{background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 14px}
  details.sol summary{cursor:pointer;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:14px}
  details.sol .qtx{margin:10px 0 6px}
  details.sol .an{margin:8px 0 0;padding:10px 12px;background:#f4f7fb;border-radius:8px;font-size:14px}
  details.sol .src{font-size:12.5px;margin-top:6px}
  .rp .copy{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
  .rp textarea{width:100%;min-height:150px;font:12px/1.45 "IBM Plex Mono",ui-monospace,monospace;padding:10px;border:1px solid var(--line);border-radius:8px}
  .tip{position:absolute;z-index:90;max-width:280px;background:#1d2533;color:#fff;font-size:12.5px;line-height:1.4;padding:7px 10px;border-radius:6px;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.25)}
  .tip[hidden]{display:none}
  @media (max-width:700px){
    .hero{grid-template-columns:1fr}
    .hero .big{font-size:52px}
    .qmap{grid-template-columns:74px repeat(4,minmax(0,1fr)) !important;gap:4px}
    .qr .lv{font-size:11px;padding:1px 6px;white-space:normal;text-align:center}
    .qh .f{display:none} .qh .s{display:inline} .qh{font-size:12px}
    .qc{padding:4px;gap:4px}
    .qd{padding:3px 5px;font-size:12px;min-height:28px}
  }
  @media (max-width:900px){
    .cx-main{grid-template-columns:1fr}
    .cx-side{position:fixed;inset:0 0 0 auto;width:min(320px,88vw);z-index:70;transform:translateX(105%);transition:transform .2s;overflow:auto;box-shadow:-6px 0 24px rgba(0,0,0,.25)}
    .cx-side.open{transform:none}
    .cx-palbtn{display:inline-block}
    .cx-sideclose{display:inline-block}
    .cx-actions button{flex:1 1 auto}
    .cx-actions .save{margin-left:0}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- state ---------- */
  const blank = () => ({ startedAt: null, endedAt: null, early: false, cur: 1, answers: {}, marked: {}, visited: {}, time: {}, visits: {}, firstOpen: {}, firstSave: {}, changes: {}, log: [] });
  let S = blank();
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(C.key) || '{}') || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(C.key, JSON.stringify(S)); } catch (e) {} };
  const now = () => Date.now();
  const used = () => S.startedAt ? Math.min(LIMIT, (S.endedAt || now()) - S.startedAt) : 0;
  const locked = () => !!S.endedAt;
  const rel = () => used();
  let since = now();
  function accrue() {
    if (!S.startedAt || locked()) { since = now(); return; }
    const t = now(), d = Math.max(0, t - since);
    S.time[S.cur] = (S.time[S.cur] || 0) + d; since = t;
  }
  const mmss = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const clockFmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const has = v => v !== undefined && v !== null && String(v).trim() !== '';
  function status(n) {
    const a = has(S.answers[n]), m = !!S.marked[n];
    if (a && m) return 's-amk';
    if (m) return 's-mk';
    if (a) return 's-ans';
    if (S.visited[n]) return 's-na';
    return 's-nv';
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const root = document.createElement('div'); root.className = 'cx'; document.body.appendChild(root);

  /* ---------- intro ---------- */
  function renderIntro() {
    root.innerHTML = `<div class="cx-intro">
      <div class="cx-card"><div class="muted" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5a6577;font-weight:600">CAT 2026 · Practice exactly like the exam</div>
      <h1>${esc(C.title)}</h1><p>${C.intro}</p></div>
      <div class="cx-card"><h2>How this screen works (same as CAT)</h2><ul>
        <li>One question at a time. The <b>question palette</b> on the right (the <b>Questions</b> button on a phone) shows every question's status. Click a number to jump to it.</li>
        <li><b>Save &amp; Next</b> saves your answer and moves on. <b>Your answer counts only after Save &amp; Next</b> (or Mark for Review &amp; Next). If you pick an option and jump away without saving, it is not saved, just like CAT.</li>
        <li><b>Mark for Review &amp; Next</b>: flags the question (purple). If it has an answer, that answer is still counted.</li>
        <li><b>Clear Response</b> removes your answer.</li>
        <li>TITA answers are typed with the <b>on-screen keypad</b> only (the keyboard is off, as in CAT).</li>
        <li>The <b>calculator</b> is the orange icon at the top right, next to the timer.</li>
        <li>Marking: right +3; wrong MCQ −1; wrong TITA 0; skipped 0. The test locks at 00:00 or when you Submit.</li>
      </ul>
      <div class="cx-legend" style="margin-top:12px;max-width:520px">
        <div><span class="pq s-nv">1</span> Not visited</div><div><span class="pq s-na">2</span> Not answered</div>
        <div><span class="pq s-ans">3</span> Answered</div><div><span class="pq s-mk">4</span> Marked for review</div>
        <div class="full"><span class="pq s-amk">5</span> Answered &amp; marked for review (will be evaluated)</div></div></div>
      <div class="cx-card"><h2>Your plan</h2><ul>
        <li>First 3 minutes: open every question (use the palette or Save &amp; Next without answering) and decide <b>do now / later / skip</b>.</li>
        <li>Do the easy ones in <b>Arithmetic, Algebra and Geometry</b> first. Target: 12–14 attempts with 80%+ accuracy.</li>
        <li>No method in 1 minute → leave it. A very hard question is a trap, not a challenge.</li>
        <li>Every click and every second is recorded. After you submit you get a full report: score, topics, difficulty, the order you chose, time per question, solutions and what to do next.</li>
      </ul>
      <label class="cx-check"><input type="checkbox" id="cxAgree"> <span>I have read the instructions. The clock starts when I press the button and cannot be paused.</span></label>
      <button class="cx-go" id="cxStart" disabled>I am ready to begin</button></div></div>`;
    const ag = root.querySelector('#cxAgree'), go = root.querySelector('#cxStart');
    ag.addEventListener('change', () => { go.disabled = !ag.checked; });
    go.addEventListener('click', () => {
      S = blank(); S.startedAt = now(); S.cur = 1; since = now();
      openQ(1, 'start'); save(); renderExam(); window.scrollTo(0, 0);
    });
  }

  /* ---------- exam ---------- */
  let pending = {}; // unsaved selection per question (cleared when leaving without saving)
  function logE(type, n) { S.log.push([rel(), n, type]); }
  // mode: 'start' (first question of the test), 'resume' (page reopened), or undefined (normal navigation)
  function openQ(n, mode) {
    if (mode === 'resume') { since = now(); logE('resume', n); return; }
    if (!mode) { accrue(); if (S.cur === n) return; pending = {}; }
    S.cur = n; since = now();
    if (!S.visited[n]) { S.visited[n] = true; S.firstOpen[n] = Object.keys(S.firstOpen).length + 1; }
    S.visits[n] = (S.visits[n] || 0) + 1;
    logE('open', n);
  }
  function go(n) { if (locked()) return; openQ(n); save(); drawQ(); drawPalette(); closeSide(); }
  const nextN = n => n % N + 1;

  function renderExam() {
    root.innerHTML = `
      <div class="cx-top"><span class="t">${esc(C.title)}</span><button class="cx-palbtn" id="cxPal" type="button">Questions</button>
        <span id="cc-slot"></span><span class="cx-time" id="cxTime">Time Left : --:--</span></div>
      <div class="cx-sec">Section <b>${esc(C.section)}</b></div>
      <div class="cx-main">
        <section class="cx-q" aria-live="polite">
          <div class="cx-qhead"><b id="cxQno"></b><span id="cxMarks"></span></div>
          <div class="cx-qbody" id="cxBody"></div>
          <div class="cx-actions">
            <button type="button" id="cxMark">Mark for Review &amp; Next</button>
            <button type="button" id="cxClear">Clear Response</button>
            <button type="button" class="save" id="cxSave">Save &amp; Next</button>
          </div>
        </section>
        <aside class="cx-side" id="cxSide">
          <button type="button" class="cx-sideclose" id="cxSideClose">Close ✕</button>
          <div class="cx-legend" id="cxLegend"></div>
          <div class="cx-pal"><h3>${esc(C.section)}</h3><div class="cx-grid" id="cxGrid"></div></div>
          <button class="cx-submit" type="button" id="cxSubmit">Submit</button>
        </aside>
      </div>
      <div class="cx-modal" id="cxModal" hidden><div class="cx-box" role="dialog" aria-modal="true" aria-labelledby="cxMh"><h3 id="cxMh">Submit the test?</h3><table id="cxMt"></table>
        <p class="muted" style="margin:0">After submitting you cannot change any answer.</p>
        <div class="r"><button type="button" id="cxNo">No, go back</button><button type="button" class="go" id="cxYes">Yes, submit</button></div></div></div>`;
    root.querySelector('#cxSave').addEventListener('click', () => {
      if (locked()) return;
      const n = S.cur;
      if (has(pending[n])) commit(n, pending[n]);
      if (S.marked[n]) { delete S.marked[n]; logE('unmark', n); }
      go(nextN(n));
    });
    root.querySelector('#cxMark').addEventListener('click', () => {
      if (locked()) return;
      const n = S.cur;
      if (has(pending[n])) commit(n, pending[n]);
      S.marked[n] = true; logE('mark', n);
      go(nextN(n));
    });
    root.querySelector('#cxClear').addEventListener('click', () => {
      if (locked()) return;
      const n = S.cur;
      delete pending[n];
      if (has(S.answers[n])) { delete S.answers[n]; S.changes[n] = (S.changes[n] || 0) + 1; logE('clear', n); }
      save(); drawQ(); drawPalette();
    });
    root.querySelector('#cxSubmit').addEventListener('click', openModal);
    root.querySelector('#cxNo').addEventListener('click', () => { root.querySelector('#cxModal').hidden = true; });
    root.querySelector('#cxYes').addEventListener('click', () => lock(true));
    root.querySelector('#cxPal').addEventListener('click', () => root.querySelector('#cxSide').classList.toggle('open'));
    root.querySelector('#cxSideClose').addEventListener('click', closeSide);
    drawQ(); drawPalette(); tick();
    if (window.CatCalc && window.CatCalc.attach) window.CatCalc.attach();
  }
  function closeSide() { const s = root.querySelector('#cxSide'); if (s) s.classList.remove('open'); }
  function commit(n, v) {
    const prev = S.answers[n];
    if (prev === v) return;
    S.answers[n] = v;
    if (!S.firstSave[n]) S.firstSave[n] = Object.keys(S.firstSave).length + 1;
    if (has(prev)) S.changes[n] = (S.changes[n] || 0) + 1;
    logE('save:' + v, n);
  }

  function drawQ() {
    const q = QS[S.cur - 1];
    root.querySelector('#cxQno').textContent = 'Question No. ' + q.n;
    root.querySelector('#cxMarks').textContent = q.kind === 'MCQ' ? 'MCQ · Marks for correct answer 3 | Negative marks 1' : 'TITA · Marks for correct answer 3 | Negative marks 0';
    const body = root.querySelector('#cxBody');
    const cur = has(pending[q.n]) ? pending[q.n] : (S.answers[q.n] || '');
    let h = `<p>${esc(q.text)}</p>`;
    if (q.kind === 'MCQ') {
      h += q.opts.map((o, i) => { const v = 'abcd'[i]; return `<label class="cx-opt${cur === v ? ' sel' : ''}"><input type="radio" name="cxo" value="${v}"${cur === v ? ' checked' : ''}> <span>${esc(o)}</span></label>`; }).join('');
    } else {
      h += `<div class="cx-tita"><input id="cxTita" type="text" readonly inputmode="none" value="${esc(cur)}" aria-label="Your answer">
        <div class="cx-kp" id="cxKp">${['Backspace', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-', 'Clear All'].map(k => `<button type="button" data-k="${k}" class="${k.length > 1 ? 'w3' : ''}">${k}</button>`).join('')}</div>
        <div class="cx-hint">Use the keypad. Press Save &amp; Next to save the answer.</div></div>`;
    }
    body.innerHTML = h;
    if (q.kind === 'MCQ') {
      body.querySelectorAll('input[name=cxo]').forEach(r => r.addEventListener('change', () => {
        if (locked()) return;
        pending[q.n] = r.value;
        body.querySelectorAll('.cx-opt').forEach(l => l.classList.toggle('sel', l.contains(r)));
      }));
    } else {
      const inp = body.querySelector('#cxTita');
      body.querySelector('#cxKp').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b || locked()) return;
        let v = inp.value; const k = b.dataset.k;
        if (k === 'Backspace') v = v.slice(0, -1);
        else if (k === 'Clear All') v = '';
        else if (k === '-') { if (!v) v = '-'; }
        else if (k === '.') { if (!v.includes('.')) v += v === '' || v === '-' ? '0.' : '.'; }
        else if (v.replace(/[-.]/g, '').length < 10) v += k;
        inp.value = v; pending[q.n] = v;
      });
    }
    body.scrollTop = 0;
  }
  function counts() {
    const c = { 's-ans': 0, 's-na': 0, 's-nv': 0, 's-mk': 0, 's-amk': 0 };
    QS.forEach(q => c[status(q.n)]++);
    return c;
  }
  function drawPalette() {
    const c = counts();
    root.querySelector('#cxLegend').innerHTML =
      `<div><span class="pq s-ans">${c['s-ans']}</span> Answered</div><div><span class="pq s-na">${c['s-na']}</span> Not answered</div>
       <div><span class="pq s-nv">${c['s-nv']}</span> Not visited</div><div><span class="pq s-mk">${c['s-mk']}</span> Marked for review</div>
       <div class="full"><span class="pq s-amk">${c['s-amk']}</span> Answered &amp; marked (will be evaluated)</div>`;
    root.querySelector('#cxGrid').innerHTML = QS.map(q => `<button type="button" class="pq ${status(q.n)}${q.n === S.cur ? ' cur' : ''}" data-n="${q.n}" aria-label="Question ${q.n}">${q.n}</button>`).join('');
    root.querySelectorAll('#cxGrid .pq').forEach(b => b.addEventListener('click', () => go(+b.dataset.n)));
  }
  function openModal() {
    const c = counts();
    root.querySelector('#cxMt').innerHTML = `<tr><td>Answered</td><td>${c['s-ans'] + c['s-amk']}</td></tr><tr><td>Not answered</td><td>${c['s-na']}</td></tr><tr><td>Marked for review (no answer)</td><td>${c['s-mk']}</td></tr><tr><td>Not visited</td><td>${c['s-nv']}</td></tr><tr><td>Time left</td><td>${clockFmt(LIMIT - used())}</td></tr>`;
    root.querySelector('#cxModal').hidden = false;
  }
  function tick() {
    const el = root.querySelector('#cxTime'); if (!el) return;
    const left = LIMIT - used();
    el.textContent = 'Time Left : ' + clockFmt(left);
    el.classList.toggle('low', left <= 5 * 60 * 1000);
  }
  function lock(early) {
    if (!locked()) {
      accrue();
      S.endedAt = early ? now() : S.startedAt + LIMIT;
      S.early = !!early;
      logE(early ? 'submit' : 'timeup', S.cur);
      save();
    }
    renderReport();
    window.scrollTo(0, 0);
  }
  setInterval(() => {
    if (!S.startedAt || locked()) return;
    if (now() - S.startedAt >= LIMIT) { lock(false); return; }
    accrue(); tick();
    if (Math.floor(now() / 1000) % 5 === 0) save();
  }, 1000);
  document.addEventListener('visibilitychange', () => { if (S.startedAt && !locked()) { accrue(); save(); } });

  /* ---------- grading + analytics ---------- */
  // "Doable" = any very easy question, plus easy/medium questions in her three target topics.
  const isDoable = m => m.diff === 1 || (TARGET_TOPICS.includes(m.topic) && m.diff <= 3);
  const TOPICS = ['Arithmetic', 'Algebra', 'Geometry', 'Numbers'];
  function analyze() {
    const M = meta();
    const endT = used();
    // segments of the timeline from open/resume events
    const ev = S.log.filter(e => e[2] === 'open' || e[2] === 'resume' || e[2] === 'submit' || e[2] === 'timeup');
    const segs = [];
    for (let i = 0; i < ev.length; i++) {
      if (ev[i][2] === 'submit' || ev[i][2] === 'timeup') break;
      const t0 = ev[i][0], t1 = i + 1 < ev.length ? ev[i + 1][0] : endT;
      if (t1 > t0) segs.push({ n: ev[i][1], t0, t1 });
    }
    const saves = S.log.filter(e => e[2].startsWith('save:')).map(e => ({ t: e[0], n: e[1], v: e[2].slice(5) }));
    const lastSaveAt = {}; saves.forEach(s => { lastSaveAt[s.n] = s.t; });
    const firstSaveAt = {}; saves.forEach(s => { if (!(s.n in firstSaveAt)) firstSaveAt[s.n] = s.t; });
    const rows = QS.map(q => {
      const m = M.find(x => x.n === q.n);
      const a = has(S.answers[q.n]) ? String(S.answers[q.n]).trim() : '';
      let res = 'skip';
      if (a) {
        if (q.kind === 'MCQ') res = a.toLowerCase() === String(m.ans).toLowerCase() ? 'ok' : 'no';
        else { const x = Number(a), y = Number(m.ans); res = (a !== '' && !isNaN(x) && !isNaN(y) && Math.abs(x - y) < 1e-9) || a === String(m.ans) ? 'ok' : 'no'; }
      }
      const marks = res === 'ok' ? 3 : (res === 'no' && q.kind === 'MCQ' ? -1 : 0);
      const time = S.time[q.n] || 0;
      const doable = isDoable(m);
      const ideal = IDEAL[m.diff] * 1000;
      let v;
      if (res === 'ok') v = time > ideal * 1.5 ? ['Right, but slow', 'warn'] : ['Right', 'good'];
      else if (res === 'no') v = doable ? ['Wrong on a doable one: fix the method', 'bad'] : m.diff === 5 ? ['Wrong on a very hard one: should have skipped', 'bad'] : ['Wrong on a hard one: risky attempt', 'bad'];
      else if (doable) v = S.visited[q.n] ? ['Missed: doable, but skipped', 'bad'] : ['Missed: never opened', 'bad'];
      else if (time > 120000) v = ['Skipped, but spent ' + mmss(time) + ': decide faster', 'warn'];
      else v = m.diff >= 4 ? ['Good skip', 'good'] : ['Skipped (bonus topic)', 'neutral'];
      return { n: q.n, q, m, kind: q.kind, topic: m.topic, sub: m.sub, diff: m.diff, doable, a, ans: m.ans, res, marks, time, ideal,
        verdict: v[0], tone: v[1], visits: S.visits[q.n] || 0, open: S.firstOpen[q.n] || null, saved: S.firstSave[q.n] || null,
        savedAt: firstSaveAt[q.n] ?? null, changes: S.changes[q.n] || 0, marked: !!S.marked[q.n] };
    });
    const att = rows.filter(r => r.res !== 'skip');
    const tot = { marks: rows.reduce((s, r) => s + r.marks, 0), ok: rows.filter(r => r.res === 'ok').length, no: rows.filter(r => r.res === 'no').length,
      noMcq: rows.filter(r => r.res === 'no' && r.kind === 'MCQ').length, noTita: rows.filter(r => r.res === 'no' && r.kind === 'TITA').length,
      att: att.length, skip: N - att.length, used: endT, onQs: rows.reduce((s, r) => s + r.time, 0) };
    tot.acc = tot.att ? Math.round(100 * tot.ok / tot.att) : 0;
    const D = rows.filter(r => r.doable);
    const doable = { total: D.length, att: D.filter(r => r.res !== 'skip').length, ok: D.filter(r => r.res === 'ok').length, no: D.filter(r => r.res === 'no').length,
      missed: D.filter(r => r.res === 'skip'), wrong: D.filter(r => r.res === 'no'), potential: D.length * 3, got: D.reduce((s, r) => s + r.marks, 0) };
    doable.sel = doable.total ? Math.round(100 * doable.att / doable.total) : 0;
    const H = rows.filter(r => r.diff >= 4);
    const hard = { time: H.reduce((s, r) => s + r.time, 0), att: H.filter(r => r.res !== 'skip'), wrong: H.filter(r => r.res === 'no'), right: H.filter(r => r.res === 'ok') };
    // hard/very hard answers saved while at least one doable question was still unanswered at that moment
    const hardEarly = H.filter(r => r.savedAt !== null).map(r => ({ r, pending: D.filter(d => d.savedAt === null || d.savedAt > r.savedAt) })).filter(x => x.pending.length);
    const negMarks = rows.filter(r => r.marks < 0).length;
    const leftOnTable = D.filter(r => r.res !== 'ok').length * 3 + D.filter(r => r.marks < 0).length;
    const scanIds = new Set(S.log.filter(e => e[2] === 'open' && e[0] <= 5 * 60 * 1000).map(e => e[1]));
    const slow = rows.filter(r => r.res === 'ok' && r.time > r.ideal * 1.5);
    const group = (key, order) => order.map(k => {
      const r = rows.filter(x => key(x) === k);
      return { k, total: r.length, att: r.filter(x => x.res !== 'skip').length, ok: r.filter(x => x.res === 'ok').length, no: r.filter(x => x.res === 'no').length,
        skip: r.filter(x => x.res === 'skip').length, marks: r.reduce((s, x) => s + x.marks, 0), time: r.reduce((s, x) => s + x.time, 0) };
    }).filter(g => g.total);
    const timeSplit = [
      { k: 'Doable → right', ms: D.filter(r => r.res === 'ok').reduce((s, r) => s + r.time, 0), c: 'good' },
      { k: 'Doable → wrong', ms: D.filter(r => r.res === 'no').reduce((s, r) => s + r.time, 0), c: 'bad' },
      { k: 'Doable, then left', ms: D.filter(r => r.res === 'skip').reduce((s, r) => s + r.time, 0), c: 'serious' },
      { k: 'Hard & very hard', ms: hard.time, c: 'hard' },
      { k: 'Other', ms: rows.filter(r => !r.doable && r.diff < 4).reduce((s, r) => s + r.time, 0), c: 'other' },
      { k: 'No question open', ms: Math.max(0, endT - tot.onQs), c: 'idle' },
    ];
    return { rows, tot, doable, hard, hardEarly, negMarks, leftOnTable, scan: scanIds.size, slow, segs, saves,
      topics: group(r => r.topic, TOPICS), diffs: group(r => r.diff, [1, 2, 3, 4, 5]), timeSplit, endT };
  }

  const and = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  function advice(A) {
    const out = [];
    const { tot, doable, hard } = A;
    const list = rs => rs.map(r => `Q${r.n} (${esc(r.sub)}, ${DIFF[r.diff].toLowerCase()})`).join(', ');
    const gap = 36 - tot.marks;
    out.push(['score', gap > 0 ? `<b>Score ${tot.marks}.</b> ${gap} marks short of 36. Getting every doable question right would give ${doable.potential}${A.leftOnTable ? `; you left <b>${A.leftOnTable} marks</b> on doable questions alone.` : '.'}` : `<b>Score ${tot.marks}.</b> Target of 36 reached.`]);
    if (doable.missed.length) out.push(['bad', `<b>Question selection:</b> you skipped ${doable.missed.length} doable question${doable.missed.length > 1 ? 's' : ''}: ${list(doable.missed)}. These are the first marks to collect. Redo them from the solutions below, without the timer.`]);
    else out.push(['good', `<b>Question selection:</b> you attempted all ${doable.total} doable questions. That is exactly the plan.`]);
    if (A.hardEarly.length) out.push(['bad', `<b>Order:</b> you answered ${A.hardEarly.length} hard question${A.hardEarly.length > 1 ? 's' : ''} before finishing the doable ones: ${A.hardEarly.slice().sort((x, y) => x.r.savedAt - y.r.savedAt).map(x => `Q${x.r.n} (${DIFF[x.r.diff].toLowerCase()}) at ${mmss(x.r.savedAt)}, ${x.pending.length} doable still open`).join('; ')}. Finish the doable ones first; try hard ones only with time left over.`]);
    if (hard.time > 4 * 60 * 1000) out.push(['bad', `<b>Time on traps:</b> ${mmss(hard.time)} went on hard and very hard questions (${hard.right.length} right, ${hard.wrong.length} wrong). That is about ${Math.floor(hard.time / 120000)} easy questions' worth of time. Give a hard question 1 minute; no method, move on.`]);
    if (doable.wrong.length) out.push(['bad', `<b>Accuracy on doable questions:</b> ${list(doable.wrong)} went wrong. Find the exact step that failed in the solution and add it to your error log. These are your highest-value fixes.`]);
    if (A.negMarks) out.push(['bad', `<b>Negative marks:</b> ${A.negMarks} wrong MCQ${A.negMarks > 1 ? 's' : ''} cost you ${A.negMarks} mark${A.negMarks > 1 ? 's' : ''}. On an MCQ, check the answer against the options before saving; if you are guessing, leave it.`]);
    if (tot.att < 12) out.push(['warn', `<b>Attempts:</b> ${tot.att} of 22. The target is 12–14. Make decisions faster on the first pass: open, decide in 30 seconds, move.`]);
    else if (tot.acc < 80) out.push(['warn', `<b>Accuracy:</b> ${tot.acc}%. Below 80%, extra attempts cost marks. Before saving, put the answer back into the question.`]);
    if (A.scan < 15) out.push(['warn', `<b>First scan:</b> you opened ${A.scan} of ${N} questions in the first 5 minutes. Open all of them in the first 3–4 minutes and pick the doable ones first.`]);
    if (A.slow.length) out.push(['warn', `<b>Speed:</b> ${A.slow.map(r => 'Q' + r.n + ' took ' + mmss(r.time) + ' (ideal ' + mmss(r.ideal) + ')').join(', ')}. Right, but slow; look for the shortcut in the solution.`]);
    // topic weakness judged only on doable questions (hard ones are covered by the trap advice)
    TARGET_TOPICS.forEach(t => {
      const d = A.rows.filter(r => r.doable && r.topic === t && r.res !== 'skip');
      const ok = d.filter(r => r.res === 'ok').length;
      if (d.length >= 2 && ok / d.length < 0.6) out.push(['warn', `<b>${t}:</b> ${ok} right of ${d.length} doable questions attempted (${and(d.filter(r => r.res === 'no').map(r => 'Q' + r.n + ' ' + esc(r.sub)))} wrong). Revise these basics before the next test.`]);
    });
    const strong = A.topics.filter(g => g.att >= 2 && g.ok === g.att).map(g => g.k);
    if (strong.length) out.push(['good', `<b>Strength:</b> every attempt in ${and(strong)} was right. Keep doing these first.`]);
    const spare = LIMIT - used();
    if (S.early && spare > 5 * 60 * 1000) out.push([doable.missed.length ? 'warn' : 'good', `<b>Spare time:</b> you submitted with ${mmss(spare)} left. ${doable.missed.length ? 'That time was enough for the doable questions you skipped.' : 'Use it to recheck your answers, then try one hard question whose method you can see.'}`]);
    return out;
  }

  function resultsText(A) {
    const { rows, tot, doable } = A;
    const L = [C.title + ': my results', ''];
    L.push(`Score ${tot.marks} | Right ${tot.ok} | Wrong ${tot.no} (MCQ ${tot.noMcq}, TITA ${tot.noTita}) | Skipped ${tot.skip} | Accuracy ${tot.acc}% | Selection ${doable.sel}% (${doable.att}/${doable.total} doable) | Time ${mmss(used())} ${S.early ? '(submitted)' : '(time up)'}`);
    L.push('', 'Q | type | topic | level | doable | answer | result | time | visits | opened# | saved# | changes | marked');
    rows.forEach(r => L.push(['Q' + r.n, r.kind, r.topic + '/' + r.sub, DIFF[r.diff], r.doable ? 'yes' : 'no', r.a || '-', r.res === 'ok' ? 'RIGHT' : r.res === 'no' ? 'WRONG' : 'skip', mmss(r.time), r.visits, r.open || '-', r.saved || '-', r.changes, r.marked ? 'yes' : ''].join(' | ')));
    L.push('', 'Save order: ' + rows.filter(r => r.saved).sort((a, b) => a.saved - b.saved).map(r => 'Q' + r.n).join(' > '));
    L.push('Open order: ' + rows.filter(r => r.open).sort((a, b) => a.open - b.open).map(r => 'Q' + r.n).join(' > '));
    L.push('Log: ' + S.log.map(e => Math.round(e[0] / 1000) + 's ' + e[2] + ' Q' + e[1]).join('; '));
    return L.join('\n');
  }

  /* ---------- report ---------- */
  const ICON = { ok: '✓', no: '✗', skip: '–' };
  const RES = { ok: 'Right', no: 'Wrong', skip: 'Skipped' };
  function renderReport() {
    const A = analyze();
    const { rows, tot, doable } = A;
    const dchip = d => `<span class="lv lv${d}">${DIFF[d]}</span>`;
    const res = r => `<span class="rs rs-${r.res}">${ICON[r.res]} ${RES[r.res]}</span>`;
    const ansTxt = r => r.kind === 'MCQ' ? `(${r.ans}) ${esc(r.q.opts['abcd'.indexOf(r.ans)].replace(/^\([a-d]\)\s*/, ''))}` : esc(r.ans);
    const herTxt = r => !r.a ? '—' : r.kind === 'MCQ' ? '(' + esc(r.a) + ')' : esc(r.a);
    const tip = r => esc(`Q${r.n} · ${r.topic}: ${r.sub} · ${DIFF[r.diff]}${r.doable ? ' · doable' : ''} · ${RES[r.res]}${r.a ? ' (you: ' + r.a + ', key: ' + r.ans + ')' : ''} · time ${mmss(r.time)}`);
    const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

    // hero
    const maxM = N * 3;
    const hero = `<section class="hero">
      <div class="hero-main"><span class="eyebrow">Score</span><div class="big">${tot.marks}<small> / ${maxM}</small></div>
        <div class="meter" role="img" aria-label="Score ${tot.marks} of ${maxM}, target 36">
          <i style="width:${Math.max(0, pct(tot.marks, maxM))}%"></i><b style="left:${pct(36, maxM)}%"><em>target 36</em></b></div>
        <div class="sub">${tot.marks >= 36 ? 'Target reached.' : (36 - tot.marks) + ' marks to the target'} · ${tot.ok} right · ${tot.no} wrong${tot.noMcq ? ' (−' + tot.noMcq + ' from MCQs)' : ''} · ${tot.skip} skipped</div></div>
      <div class="kpis">
        <div class="kpi"><span>Selection</span><b>${doable.sel}%</b><em>${doable.att} of ${doable.total} doable attempted</em></div>
        <div class="kpi"><span>Accuracy</span><b>${tot.att ? tot.acc + '%' : '—'}</b><em>${tot.att ? tot.ok + ' of ' + tot.att + ' attempted' : 'nothing attempted'} · target 80%</em></div>
        <div class="kpi"><span>Marks left</span><b>${A.leftOnTable}</b><em>on doable questions</em></div>
        <div class="kpi"><span>Time used</span><b>${mmss(used())}</b><em>${S.early ? 'submitted' : 'time up'} · of ${C.minutes}:00</em></div>
      </div></section>`;

    // advice
    const adv = `<section class="card"><h2>What to do next</h2><ul class="adv">${advice(A).map(([t, h]) => `<li class="a-${t}"><span class="ai" aria-hidden="true">${t === 'good' ? '✓' : t === 'bad' ? '!' : t === 'warn' ? '•' : '★'}</span><span>${h}</span></li>`).join('')}</ul>
      <p class="note">Doable = every very easy question, plus easy and medium questions in Arithmetic, Algebra and Geometry. This paper has ${doable.total} (${doable.potential} marks).</p></section>`;

    // question map: difficulty rows x topic columns
    const cols = TOPICS.filter(t => rows.some(r => r.topic === t));
    const map = `<section class="card"><h2>Question map</h2><p class="note">Every question by topic and difficulty. The shaded area is the doable zone: every question in it should be attempted. Tap a question for details.</p>
      <div class="qmap" style="grid-template-columns:96px repeat(${cols.length},minmax(0,1fr))">
        <div></div>${cols.map(t => `<div class="qh"><span class="f">${t}</span><span class="s">${{ Arithmetic: 'Arith.', Algebra: 'Algebra', Geometry: 'Geom.', Numbers: 'Num.' }[t] || t}</span>${TARGET_TOPICS.includes(t) ? '' : '<br><small>bonus</small>'}</div>`).join('')}
        ${[1, 2, 3, 4, 5].map(d => `<div class="qr">${dchip(d)}</div>${cols.map(t => {
          const zone = d === 1 || (TARGET_TOPICS.includes(t) && d <= 3);
          const qs = rows.filter(r => r.topic === t && r.diff === d);
          return `<div class="qc${zone ? ' zone' : ''}">${qs.map(r => `<button type="button" class="qd qd-${r.res}" data-tip="${tip(r)}" aria-label="${tip(r)}">Q${r.n}<i aria-hidden="true">${ICON[r.res]}</i></button>`).join('')}</div>`;
        }).join('')}`).join('')}
      </div>
      <div class="legend"><span><i class="sw qd-ok"></i>✓ Right</span><span><i class="sw qd-no"></i>✗ Wrong</span><span><i class="sw qd-skip"></i>– Skipped</span><span><i class="sw zone"></i>Doable zone</span></div></section>`;

    // timeline
    const T = Math.max(LIMIT, A.endT);
    const ticks = []; for (let m = 0; m <= C.minutes; m += 5) ticks.push(m);
    const rowBy = n => rows[n - 1];
    const tl = `<section class="card"><h2>Your 40 minutes</h2><p class="note">Which question you were on, minute by minute (shade = difficulty). Marks below the bar show when you saved an answer.</p>
      <div class="tl">
        <div class="tl-track">${A.segs.map(s => { const r = rowBy(s.n); const w = 100 * (s.t1 - s.t0) / T; return `<button type="button" class="seg lv${r.diff}" style="left:${100 * s.t0 / T}%;width:${w}%" data-tip="${esc(`Q${r.n} · ${r.sub} · ${DIFF[r.diff]} · ${mmss(s.t0)}–${mmss(s.t1)} (${mmss(s.t1 - s.t0)})`)}">${w > 3.2 ? 'Q' + r.n : ''}</button>`; }).join('')}
          ${A.endT < T ? `<div class="seg-left" style="left:${100 * A.endT / T}%" title="Time not used">not used</div>` : ''}</div>
        <div class="tl-saves">${A.saves.map(s => { const r = rowBy(s.n); const ok = r.q.kind === 'MCQ' ? s.v === String(r.ans) : Number(s.v) === Number(r.ans); return `<span class="sv ${ok ? 'sv-ok' : 'sv-no'}" style="left:${100 * s.t / T}%" data-tip="${esc('Saved Q' + r.n + ' = ' + s.v + ' at ' + mmss(s.t) + (ok ? ' (right)' : ' (wrong)'))}">${ok ? '✓' : '✗'}</span>`; }).join('')}</div>
        <div class="tl-axis">${ticks.map(m => `<span style="left:${100 * m * 60000 / T}%">${m}′</span>`).join('')}</div>
      </div>
      <div class="legend">${[1, 2, 3, 4, 5].map(d => `<span><i class="sw lv${d}"></i>${DIFF[d]}</span>`).join('')}<span><b class="sv-ok">✓</b> saved right</span><span><b class="sv-no">✗</b> saved wrong</span></div></section>`;

    // order
    const saved = rows.filter(r => r.saved).sort((a, b) => a.saved - b.saved);
    const order = `<section class="card"><h2>The order you chose</h2>
      <p class="note">Answers in the order you saved them. The ideal is lighter shades (easier) first.</p>
      <ol class="flow">${saved.length ? saved.map(r => `<li data-tip="${tip(r)}"><span class="lv lv${r.diff}">Q${r.n}</span><small>${r.topic} · ${mmss(r.time)}</small><b class="rs-${r.res}">${ICON[r.res]}</b></li>`).join('') : '<li class="none">No answer was saved.</li>'}</ol>
      ${doable.missed.length ? `<p class="note" style="margin-top:12px">Doable but never answered: ${doable.missed.map(r => `<span class="lv lv${r.diff}" data-tip="${tip(r)}">Q${r.n}</span>`).join(' ')}</p>` : ''}</section>`;

    // time split
    const tsTot = A.timeSplit.reduce((s, x) => s + x.ms, 0) || 1;
    const split = `<section class="card"><h2>Where the time went</h2>
      <div class="stack" role="img" aria-label="Time split">${A.timeSplit.filter(x => x.ms > 0).map(x => `<i class="c-${x.c}" style="width:${100 * x.ms / tsTot}%" data-tip="${esc(x.k + ': ' + mmss(x.ms))}"></i>`).join('')}</div>
      <table class="t compact"><tr><th></th><th>Part</th><th class="n">Time</th><th class="n">Share</th></tr>${A.timeSplit.map(x => `<tr><td><i class="sw c-${x.c}"></i></td><td>${x.k}</td><td class="n">${mmss(x.ms)}</td><td class="n">${pct(x.ms, tsTot)}%</td></tr>`).join('')}</table></section>`;

    // topics + difficulty
    const bars = g => `<div class="hb" role="img" aria-label="${g.ok} right, ${g.no} wrong, ${g.skip} skipped">${g.ok ? `<i class="c-good" style="flex:${g.ok}"></i>` : ''}${g.no ? `<i class="c-bad" style="flex:${g.no}"></i>` : ''}${g.skip ? `<i class="c-skip" style="flex:${g.skip}"></i>` : ''}</div>`;
    const gtable = (title, groups, label, extra) => `<section class="card"><h2>${title}</h2><div class="tw"><table class="t"><tr><th>${label}</th><th>Questions</th><th class="w">Right · wrong · skipped</th><th class="n">Marks</th><th class="n">Time</th>${extra ? '<th class="n">Ideal each</th>' : ''}</tr>
      ${groups.map(g => `<tr><td>${extra ? dchip(g.k) : g.k + (TARGET_TOPICS.includes(g.k) ? '' : ' <small class="mut">(bonus)</small>')}</td><td class="n">${g.total}</td><td>${bars(g)}<small class="mut">${g.ok} ✓ · ${g.no} ✗ · ${g.skip} –</small></td><td class="n">${g.marks}</td><td class="n">${mmss(g.time)}</td>${extra ? `<td class="n">${g.k === 5 ? 'skip' : mmss(IDEAL[g.k] * 1000)}</td>` : ''}</tr>`).join('')}</table></div>
      ${extra ? '<p class="note">Levels come from real data: the share of test-takers who got each question right (35%+ very easy, 20–35% easy, 10–20% medium, 5–10% hard, under 5% very hard).</p>' : ''}</section>`;

    // every question
    const maxT = Math.max(...rows.map(r => Math.max(r.time, r.ideal)), 1);
    const qtable = `<section class="card"><h2>Every question</h2><div class="tw"><table class="t qt"><tr><th>Q</th><th>Topic</th><th>Level</th><th class="n">Opened</th><th class="n">Saved</th><th class="w">Time (line = ideal)</th><th>You</th><th>Key</th><th>Result</th><th>Verdict</th></tr>
      ${rows.map(r => `<tr><td class="n"><b>${r.n}</b></td><td>${r.topic}<br><small class="mut">${esc(r.sub)}</small></td><td>${dchip(r.diff)}${r.doable ? '<br><small class="mut">doable</small>' : ''}</td><td class="n">${r.open ? '#' + r.open : '—'}</td><td class="n">${r.saved ? '#' + r.saved : '—'}</td>
        <td><div class="tb"><i class="${r.time > r.ideal * 1.5 ? 'over' : ''}" style="width:${100 * r.time / maxT}%"></i>${r.diff < 5 ? `<b style="left:${100 * r.ideal / maxT}%"></b>` : ''}</div><small class="mut">${mmss(r.time)}${r.visits > 1 ? ' · ' + r.visits + ' visits' : ''}</small></td>
        <td>${herTxt(r)}${r.changes ? `<br><small class="mut">changed ${r.changes}×</small>` : ''}</td><td>${ansTxt(r)}</td><td>${res(r)}</td><td><span class="vd vd-${r.tone}">${r.verdict}</span></td></tr>`).join('')}</table></div></section>`;

    const sols = `<section class="sols"><h2>Solutions</h2>
      ${rows.map(r => `<details class="sol"${r.res === 'no' || (r.doable && r.res === 'skip') ? ' open' : ''}><summary><b>Q${r.n}</b> ${dchip(r.diff)} <span class="mut">${r.topic} · ${esc(r.sub)}</span> ${res(r)}</summary>
        <div class="qtx">${esc(r.q.text)}</div>${r.kind === 'MCQ' ? '<div class="mut">' + r.q.opts.map(esc).join(' &nbsp; ') + '</div>' : ''}
        <div class="an"><b>Answer: ${ansTxt(r)}</b> · you: ${herTxt(r)} · time ${mmss(r.time)} (ideal ${r.diff === 5 ? 'skip' : mmss(r.ideal)})<br>${r.m.sol}</div>
        <div class="mut src">Source: ${esc(r.m.src)}</div></details>`).join('')}</section>`;

    const send = `<section class="card"><h2>Send your results</h2><p class="note">Press Copy results and send the text to Vikas. It contains every answer, time and click, so the next plan can be built from it.</p>
      <div class="copy"><button class="cx-go" type="button" id="rpCopy">Copy results</button><span id="rpToast" class="mut"></span></div>
      <textarea id="rpOut" readonly aria-label="Results text"></textarea></section>`;

    root.innerHTML = `<div class="rp"><div><span class="eyebrow">${S.early ? 'Submitted' : "Time's up"} · your report</span><h1>${esc(C.title)}</h1></div>
      ${hero}${adv}${map}${tl}${order}${split}${gtable('By topic', A.topics, 'Topic', false)}${gtable('By difficulty', A.diffs, 'Level', true)}${qtable}${sols}${send}
      <script type="application/json" id="rpData">${JSON.stringify({ tot, doable: { total: doable.total, att: doable.att, ok: doable.ok, no: doable.no, sel: doable.sel, missed: doable.missed.map(r => r.n), wrong: doable.wrong.map(r => r.n), potential: doable.potential }, leftOnTable: A.leftOnTable, hardTime: A.hard.time, hardEarly: A.hardEarly.map(x => x.r.n), negMarks: A.negMarks, scan: A.scan, slow: A.slow.map(r => r.n), rows: rows.map(r => ({ n: r.n, res: r.res, marks: r.marks, time: r.time, verdict: r.verdict, doable: r.doable, visits: r.visits, open: r.open, saved: r.saved, changes: r.changes })), topics: A.topics, diffs: A.diffs, timeSplit: A.timeSplit.map(x => [x.k, x.ms]) }).replace(/</g, '\\u003c')}</script></div>
      <div class="tip" id="rpTip" role="tooltip" hidden></div>`;
    const text = resultsText(A);
    const out = root.querySelector('#rpOut'); out.value = text;
    root.querySelector('#rpCopy').addEventListener('click', () => {
      const t = root.querySelector('#rpToast');
      try { navigator.clipboard.writeText(text).then(() => { t.textContent = 'Copied. Now send it to Vikas.'; }, () => { out.focus(); out.select(); t.textContent = 'Select all and copy the text below.'; }); }
      catch (e) { out.focus(); out.select(); t.textContent = 'Select all and copy the text below.'; }
    });
    // tooltip: hover, focus or tap
    const tipEl = root.querySelector('#rpTip');
    const showTip = el => {
      tipEl.textContent = el.dataset.tip; tipEl.hidden = false;
      const r = el.getBoundingClientRect(), w = tipEl.offsetWidth;
      tipEl.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
      tipEl.style.top = (r.top + window.scrollY - tipEl.offsetHeight - 8 < window.scrollY ? r.bottom + window.scrollY + 8 : r.top + window.scrollY - tipEl.offsetHeight - 8) + 'px';
    };
    root.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
    root.addEventListener('mouseout', e => { if (e.target.closest('[data-tip]')) tipEl.hidden = true; });
    root.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
    root.addEventListener('click', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); else tipEl.hidden = true; });
    document.body.classList.add('cx-report');
  }

  /* ---------- boot ---------- */
  if (!S.startedAt) renderIntro();
  else if (locked() || now() - S.startedAt >= LIMIT) { if (!locked()) { S.endedAt = S.startedAt + LIMIT; save(); } renderReport(); }
  else { openQ(S.cur, 'resume'); save(); renderExam(); }
})();
