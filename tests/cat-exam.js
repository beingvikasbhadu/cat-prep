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
  .rp{max-width:980px;margin:0 auto;padding:20px 16px 60px;display:grid;gap:16px}
  .rp h1{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:26px;margin:0}
  .rp h2{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-size:19px;margin:0 0 10px}
  .rp .muted{color:#5a6577;font-size:13.5px}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
  .tile{background:#fff;border:1px solid #d5dbe3;border-radius:8px;padding:12px}
  .tile span{display:block;font-size:12px;color:#5a6577;text-transform:uppercase;letter-spacing:.04em}
  .tile b{font:600 26px "IBM Plex Mono",ui-monospace,Consolas,monospace}
  .tile.good b{color:#1f8f5f} .tile.bad b{color:#c0392b}
  .tw{overflow-x:auto}
  table.t{border-collapse:collapse;width:100%;font-size:13.5px;background:#fff}
  table.t th,table.t td{border:1px solid #d5dbe3;padding:6px 8px;text-align:left;vertical-align:top}
  table.t th{background:#f1f4f8;font-weight:600;white-space:nowrap}
  table.t td.n{text-align:right;font-family:"IBM Plex Mono",ui-monospace,monospace;white-space:nowrap}
  .ok{color:#1f8f5f;font-weight:700} .no{color:#c0392b;font-weight:700} .sk{color:#8a94a3}
  .d1{background:#d8f3e3}.d2{background:#e6f5d6}.d3{background:#fff4cf}.d4{background:#ffe2cc}.d5{background:#ffd3d3}
  .dtag{display:inline-block;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:600;white-space:nowrap;color:#2a2a2a}
  .flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  .flow .st{border-radius:6px;padding:4px 8px;font-size:12.5px;border:1px solid #d5dbe3}
  .flow .st b{font-family:"IBM Plex Mono",monospace}
  .todo li{margin:6px 0}
  .bar{height:10px;border-radius:5px;background:#e3e8ef;overflow:hidden;min-width:80px}
  .bar i{display:block;height:100%;background:#1f6fd1}
  details.sol{background:#fff;border:1px solid #d5dbe3;border-radius:8px;padding:10px 12px}
  details.sol summary{cursor:pointer;font-weight:600;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  details.sol .qt{margin:8px 0;color:#1d2533}
  details.sol .an{margin:6px 0 0;padding:8px 10px;background:#f4f7fb;border-radius:6px}
  .verdict{font-size:12.5px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid currentColor}
  .rp .copy{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .rp textarea{width:100%;min-height:160px;font:12.5px/1.45 "IBM Plex Mono",ui-monospace,monospace;padding:10px;border:1px solid #d5dbe3;border-radius:6px}
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
      openQ(1, true); save(); renderExam(); window.scrollTo(0, 0);
    });
  }

  /* ---------- exam ---------- */
  let pending = {}; // unsaved selection per question (cleared when leaving without saving)
  function logE(type, n) { S.log.push([rel(), n, type]); }
  function openQ(n, first) {
    if (!first) accrue();
    if (!first && S.cur !== n) pending = {};
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
      if (has(S.answers[n])) { delete S.answers[n]; logE('clear', n); }
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
  function grade() {
    const M = meta();
    return QS.map(q => {
      const m = M.find(x => x.n === q.n);
      const a = has(S.answers[q.n]) ? String(S.answers[q.n]).trim() : '';
      let res = 'skip';
      if (a) {
        if (q.kind === 'MCQ') res = a.toLowerCase() === String(m.ans).toLowerCase() ? 'ok' : 'no';
        else { const x = parseFloat(a), y = parseFloat(m.ans); res = (!isNaN(x) && Math.abs(x - y) < 1e-9) || a === String(m.ans) ? 'ok' : 'no'; }
      }
      const marks = res === 'ok' ? 3 : (res === 'no' && q.kind === 'MCQ' ? -1 : 0);
      const time = S.time[q.n] || 0;
      const should = TARGET_TOPICS.includes(m.topic) && m.diff <= 3;
      let verdict;
      if (res === 'ok') verdict = time > IDEAL[m.diff] * 1000 * 1.5 ? ['Right but slow', '#a45f00'] : ['Right', '#1f8f5f'];
      else if (res === 'no') verdict = m.diff >= 4 ? ['Wrong on a hard one: should have skipped', '#c0392b'] : ['Wrong on a doable one: check the method', '#c0392b'];
      else if (should) verdict = !S.visited[q.n] ? ['Missed: never opened', '#c0392b'] : ['Missed: doable, but skipped', '#c0392b'];
      else verdict = time > 120000 ? ['Good skip, but too much time spent', '#a45f00'] : ['Good skip', '#1f8f5f'];
      return { q, m, a, res, marks, time, should, verdict, visits: S.visits[q.n] || 0, open: S.firstOpen[q.n] || null, saved: S.firstSave[q.n] || null, changes: S.changes[q.n] || 0, marked: !!S.marked[q.n] };
    });
  }
  function group(rows, key, order) {
    return order.map(k => {
      const r = rows.filter(x => key(x) === k);
      const att = r.filter(x => x.res !== 'skip');
      return { k, total: r.length, att: att.length, ok: r.filter(x => x.res === 'ok').length, no: r.filter(x => x.res === 'no').length,
        marks: r.reduce((s, x) => s + x.marks, 0), time: r.reduce((s, x) => s + x.time, 0) };
    }).filter(g => g.total);
  }
  function advice(rows, tot) {
    const out = [];
    const missed = rows.filter(r => r.should && r.res === 'skip');
    const wrongEasy = rows.filter(r => r.res === 'no' && r.m.diff <= 3);
    const wrongHard = rows.filter(r => r.res === 'no' && r.m.diff >= 4);
    const hardTime = rows.filter(r => r.m.diff >= 4).reduce((s, r) => s + r.time, 0);
    const negs = rows.filter(r => r.marks < 0).length;
    const firstScan = rows.filter(r => r.open && S.log.some(e => e[1] === r.q.n && e[2] === 'open' && e[0] <= 5 * 60 * 1000)).length;
    const shouldTotal = rows.filter(r => r.should).length;
    const shouldDone = rows.filter(r => r.should && r.res !== 'skip').length;
    if (missed.length) out.push(`<b>Question selection:</b> you left ${missed.length} doable question${missed.length > 1 ? 's' : ''} (very easy to medium in Arithmetic, Algebra or Geometry): ${missed.map(r => 'Q' + r.q.n + ' (' + r.m.sub + ', ' + DIFF[r.m.diff].toLowerCase() + ')').join(', ')}. These are the marks you must collect first. Read the solutions below and redo them without the timer.`);
    else out.push(`<b>Question selection:</b> you attempted every doable question in your three topics (${shouldDone} of ${shouldTotal}). That is exactly the plan.`);
    if (hardTime > 5 * 60 * 1000) out.push(`<b>Time on traps:</b> you spent ${mmss(hardTime)} on hard and very hard questions. In the exam, give such a question 1 minute; if no method appears, move on. That time is enough for 2–3 easy questions.`);
    if (wrongEasy.length) out.push(`<b>Accuracy on doable questions:</b> ${wrongEasy.map(r => 'Q' + r.q.n + ' (' + r.m.sub + ')').join(', ')} went wrong. Find the exact step that failed in the solution and add it to your error log. These are your highest-value fixes.`);
    if (wrongHard.length) out.push(`<b>Risky attempts:</b> ${wrongHard.map(r => 'Q' + r.q.n).join(', ')} ${wrongHard.length > 1 ? 'were' : 'was'} hard and went wrong. ${negs ? 'Wrong MCQs cost you ' + negs + ' mark' + (negs > 1 ? 's' : '') + ' here. ' : ''}Only attempt a hard question when you are sure of the method.`);
    if (tot.att < 12) out.push(`<b>Attempts:</b> ${tot.att} attempted. The target is 12–14. Make the first pass faster: open, decide in 30 seconds, move.`);
    else if (tot.att && tot.ok / tot.att < 0.8) out.push(`<b>Accuracy:</b> ${Math.round(100 * tot.ok / tot.att)}%. Below 80%, extra attempts hurt. Before saving, put your answer back into the question.`);
    if (firstScan < Math.min(N, 15)) out.push(`<b>First scan:</b> you opened ${firstScan} of ${N} questions in the first 5 minutes. Open all of them in the first 3–4 minutes and pick the easy ones first, as in the plan.`);
    const topics = group(rows, r => r.m.topic, ['Arithmetic', 'Algebra', 'Geometry', 'Numbers']);
    topics.forEach(g => { if (TARGET_TOPICS.includes(g.k) && g.att >= 2 && g.ok / g.att < 0.6) out.push(`<b>${g.k}:</b> ${g.ok} right out of ${g.att} attempted. Revise this topic's basics before the next test.`); });
    const strong = topics.filter(g => g.att >= 2 && g.ok === g.att).map(g => g.k);
    if (strong.length) out.push(`<b>Strength:</b> every attempt in ${strong.join(' and ')} was right. Keep doing these first.`);
    return out;
  }
  function resultsText(rows, tot) {
    const L = [C.title + ': my results', ''];
    L.push(`Score ${tot.marks} | Right ${tot.ok} | Wrong ${tot.no} (MCQ ${rows.filter(r => r.res === 'no' && r.q.kind === 'MCQ').length}, TITA ${rows.filter(r => r.res === 'no' && r.q.kind === 'TITA').length}) | Skipped ${N - tot.att} | Time ${mmss(used())} ${S.early ? '(submitted)' : '(time up)'}`);
    L.push('', 'Q | type | topic | level | answer | result | time | visits | opened# | saved# | changes | marked');
    rows.forEach(r => L.push(['Q' + r.q.n, r.q.kind, r.m.topic + '/' + r.m.sub, DIFF[r.m.diff], r.a || '-', r.res === 'ok' ? 'RIGHT' : r.res === 'no' ? 'WRONG' : 'skip', mmss(r.time), r.visits, r.open || '-', r.saved || '-', r.changes, r.marked ? 'yes' : ''].join(' | ')));
    L.push('', 'Save order: ' + rows.filter(r => r.saved).sort((a, b) => a.saved - b.saved).map(r => 'Q' + r.q.n).join(' > '));
    L.push('Open order: ' + rows.filter(r => r.open).sort((a, b) => a.open - b.open).map(r => 'Q' + r.q.n).join(' > '));
    L.push('Log: ' + S.log.map(e => Math.round(e[0] / 1000) + 's ' + e[2] + ' Q' + e[1]).join('; '));
    return L.join('\n');
  }

  function renderReport() {
    const rows = grade();
    const att = rows.filter(r => r.res !== 'skip');
    const tot = { marks: rows.reduce((s, r) => s + r.marks, 0), ok: rows.filter(r => r.res === 'ok').length, no: rows.filter(r => r.res === 'no').length, att: att.length };
    const shouldRows = rows.filter(r => r.should);
    const selPct = shouldRows.length ? Math.round(100 * shouldRows.filter(r => r.res !== 'skip').length / shouldRows.length) : 0;
    const potential = shouldRows.length * 3;
    const topics = group(rows, r => r.m.topic, ['Arithmetic', 'Algebra', 'Geometry', 'Numbers']);
    const diffs = group(rows, r => r.m.diff, [1, 2, 3, 4, 5]);
    const maxT = Math.max(1, ...rows.map(r => r.time));
    const dtag = d => `<span class="dtag d${d}">${DIFF[d]}</span>`;
    const resTxt = r => r.res === 'ok' ? '<span class="ok">✓ Right</span>' : r.res === 'no' ? '<span class="no">✗ Wrong</span>' : '<span class="sk">Skipped</span>';
    const saveFlow = rows.filter(r => r.saved).sort((a, b) => a.saved - b.saved);
    const openFlow = rows.filter(r => r.open).sort((a, b) => a.open - b.open);
    const ansTxt = r => r.q.kind === 'MCQ' ? `(${r.m.ans}) ${esc(r.q.opts['abcd'.indexOf(r.m.ans)].replace(/^\([a-d]\)\s*/, ''))}` : esc(r.m.ans);
    const herTxt = r => !r.a ? '—' : r.q.kind === 'MCQ' ? '(' + esc(r.a) + ')' : esc(r.a);
    root.innerHTML = `<div class="rp">
      <div><div class="muted" style="text-transform:uppercase;letter-spacing:.08em;font-weight:600;font-size:12px">${S.early ? 'Submitted' : "Time's up"} · report</div><h1>${esc(C.title)}: your analysis</h1></div>
      <div class="tiles">
        <div class="tile ${tot.marks >= 36 ? 'good' : ''}"><span>Score</span><b>${tot.marks}</b><div class="muted">of ${N * 3} · target 36+</div></div>
        <div class="tile"><span>Right / wrong</span><b>${tot.ok} / ${tot.no}</b><div class="muted">${tot.att} attempted of ${N}</div></div>
        <div class="tile ${tot.att && tot.ok / tot.att >= 0.8 ? 'good' : 'bad'}"><span>Accuracy</span><b>${tot.att ? Math.round(100 * tot.ok / tot.att) : 0}%</b><div class="muted">target 80%+</div></div>
        <div class="tile ${selPct >= 90 ? 'good' : 'bad'}"><span>Selection</span><b>${selPct}%</b><div class="muted">doable questions attempted (${shouldRows.filter(r => r.res !== 'skip').length} of ${shouldRows.length})</div></div>
        <div class="tile"><span>Time used</span><b>${mmss(used())}</b><div class="muted">of ${C.minutes}:00</div></div>
      </div>

      <section class="cx-card"><h2>What to do next</h2><ul class="todo">${advice(rows, tot).map(x => '<li>' + x + '</li>').join('')}</ul>
        <p class="muted" style="margin-top:8px">"Doable" = very easy, easy or medium questions in Arithmetic, Algebra and Geometry. In this paper they are worth ${potential} marks; getting all of them right is the 36+ plan.</p></section>

      <section class="cx-card"><h2>Question selection: the order you chose</h2>
        <p class="muted">Order you <b>saved</b> answers (colour = difficulty). The ideal is green and yellow first, red last or never.</p>
        <div class="flow">${saveFlow.length ? saveFlow.map((r, i) => `<span class="st d${r.m.diff}">${i + 1}. <b>Q${r.q.n}</b> ${r.m.topic} · ${mmss(r.time)} ${r.res === 'ok' ? '✓' : '✗'}</span>`).join('') : '<span class="muted">No answers saved.</span>'}</div>
        <p class="muted" style="margin-top:12px">Order you <b>opened</b> questions:</p>
        <div class="flow">${openFlow.map(r => `<span class="st d${r.m.diff}">Q${r.q.n}</span>`).join('')}</div></section>

      <section class="cx-card"><h2>By topic</h2><div class="tw"><table class="t"><tr><th>Topic</th><th>Questions</th><th>Attempted</th><th>Right</th><th>Wrong</th><th>Marks</th><th>Time</th></tr>
        ${topics.map(g => `<tr><td>${g.k}${TARGET_TOPICS.includes(g.k) ? '' : ' <span class="muted">(bonus)</span>'}</td><td class="n">${g.total}</td><td class="n">${g.att}</td><td class="n">${g.ok}</td><td class="n">${g.no}</td><td class="n">${g.marks}</td><td class="n">${mmss(g.time)}</td></tr>`).join('')}</table></div></section>

      <section class="cx-card"><h2>By difficulty</h2><div class="tw"><table class="t"><tr><th>Level</th><th>Questions</th><th>Attempted</th><th>Right</th><th>Wrong</th><th>Marks</th><th>Time</th><th>Ideal time each</th></tr>
        ${diffs.map(g => `<tr><td>${dtag(g.k)}</td><td class="n">${g.total}</td><td class="n">${g.att}</td><td class="n">${g.ok}</td><td class="n">${g.no}</td><td class="n">${g.marks}</td><td class="n">${mmss(g.time)}</td><td class="n">${g.k === 5 ? 'skip' : mmss(IDEAL[g.k] * 1000)}</td></tr>`).join('')}</table></div>
        <p class="muted" style="margin-top:8px">Levels come from real data: the share of test-takers who got each question right (35%+ very easy, 20–35% easy, 10–20% medium, 5–10% hard, under 5% very hard).</p></section>

      <section class="cx-card"><h2>Every question</h2><div class="tw"><table class="t"><tr><th>Q</th><th>Topic</th><th>Level</th><th>Opened #</th><th>Saved #</th><th>Time</th><th></th><th>Your answer</th><th>Correct</th><th>Result</th><th>Verdict</th></tr>
        ${rows.map(r => `<tr><td class="n">${r.q.n}</td><td>${r.m.topic}<br><span class="muted">${esc(r.m.sub)}</span></td><td>${dtag(r.m.diff)}</td><td class="n">${r.open || '—'}</td><td class="n">${r.saved || '—'}</td><td class="n">${mmss(r.time)}${r.visits > 1 ? '<br><span class="muted">' + r.visits + ' visits</span>' : ''}</td><td><div class="bar"><i style="width:${Math.round(100 * r.time / maxT)}%"></i></div></td><td>${herTxt(r)}${r.changes ? '<br><span class="muted">changed ' + r.changes + '×</span>' : ''}</td><td>${ansTxt(r)}</td><td>${resTxt(r)}</td><td><span class="verdict" style="color:${r.verdict[1]}">${r.verdict[0]}</span></td></tr>`).join('')}</table></div></section>

      <section style="display:grid;gap:10px"><h2 style="font-family:'Bricolage Grotesque','Segoe UI',system-ui,sans-serif;font-size:19px;margin:0">Solutions</h2>
        ${rows.map(r => `<details class="sol"${r.res === 'no' || (r.should && r.res === 'skip') ? ' open' : ''}><summary>Q${r.q.n} ${dtag(r.m.diff)} <span class="muted">${r.m.topic} · ${esc(r.m.sub)}</span> ${resTxt(r)}</summary>
          <div class="qt">${esc(r.q.text)}</div>${r.q.kind === 'MCQ' ? '<div class="muted">' + r.q.opts.map(esc).join(' &nbsp; ') + '</div>' : ''}
          <div class="an"><b>Answer: ${ansTxt(r)}</b> · your answer: ${herTxt(r)} · time ${mmss(r.time)} (ideal ${r.m.diff === 5 ? 'skip' : mmss(IDEAL[r.m.diff] * 1000)})<br>${r.m.sol}</div>
          <div class="muted" style="margin-top:6px">Source: ${esc(r.m.src)}</div></details>`).join('')}
      </section>

      <section class="cx-card"><h2>Send your results</h2><p class="muted">Press Copy results and send the text to Vikas. It contains every answer, time and click, so the next plan can be built from it.</p>
        <div class="copy"><button class="cx-go" type="button" id="rpCopy">Copy results</button><span id="rpToast" class="muted"></span></div>
        <textarea id="rpOut" readonly aria-label="Results text"></textarea></section>
    </div>`;
    const text = resultsText(rows, tot);
    const out = root.querySelector('#rpOut'); out.value = text;
    root.querySelector('#rpCopy').addEventListener('click', () => {
      const t = root.querySelector('#rpToast');
      try { navigator.clipboard.writeText(text).then(() => { t.textContent = 'Copied. Now send it to Vikas.'; }, () => { out.focus(); out.select(); t.textContent = 'Select all and copy the text below.'; }); }
      catch (e) { out.focus(); out.select(); t.textContent = 'Select all and copy the text below.'; }
    });
    const icon = document.querySelector('.cc-icon'); if (icon) icon.style.display = 'none';
  }

  /* ---------- boot ---------- */
  if (!S.startedAt) renderIntro();
  else if (locked() || now() - S.startedAt >= LIMIT) { if (!locked()) { S.endedAt = S.startedAt + LIMIT; save(); } renderReport(); }
  else { since = now(); openQ(S.cur, true); save(); renderExam(); }
})();
