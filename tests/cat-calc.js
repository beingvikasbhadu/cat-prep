/* Practice copy of the CAT on-screen calculator ("Normal Calculator").
   Own code, written to behave like the exam one: mouse only (typing on the
   keyboard does nothing), 9 characters per number, ×/÷/% done before +/−,
   a % b = a/100 × b, √ and 1/x act on the number on screen, one memory. */
(function () {
  if (window.CatCalc) return;
  const css = `
  .cc-open{position:fixed;right:14px;bottom:14px;z-index:60;font:600 14px/1 var(--font-body,system-ui,sans-serif);
    background:var(--accent,#1f5fae);color:var(--accent-ink,#fff);border:0;border-radius:999px;padding:11px 16px;cursor:pointer;
    box-shadow:0 4px 14px rgba(0,0,0,.25)}
  .cc-pad{position:fixed;z-index:61;width:226px;background:#e9edf2;border:1px solid #9aa6b5;border-radius:6px;
    box-shadow:0 8px 28px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif;color:#111;user-select:none;-webkit-user-select:none;touch-action:none}
  .cc-pad[hidden]{display:none}
  .cc-head{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#3c6fa8;color:#fff;border-radius:5px 5px 0 0;cursor:move;font-size:13px}
  .cc-head b{flex:1}
  .cc-head button{width:22px;height:20px;border:0;border-radius:3px;background:rgba(255,255,255,.2);color:#fff;font:700 13px/1 Arial;cursor:pointer;padding:0}
  .cc-body{padding:6px}
  .cc-pad.cc-min .cc-body{display:none}
  .cc-line,.cc-out{width:100%;box-sizing:border-box;border:1px solid #9aa6b5;background:#fff;text-align:right;font-family:Consolas,"Courier New",monospace;
    padding:3px 6px;overflow:hidden;white-space:nowrap}
  .cc-line{height:22px;font-size:12px;color:#555;border-bottom:0}
  .cc-out{height:32px;font-size:19px;position:relative}
  .cc-m{position:absolute;left:5px;top:8px;font-size:11px;color:#1f5fae}
  .cc-open svg{vertical-align:-3px;margin-right:6px}
  .cc-keys{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:6px}
  .cc-keys button{height:30px;border:1px solid #8e9aab;border-radius:3px;background:linear-gradient(#fdfdfd,#dfe4ea);
    font:14px Arial,Helvetica,sans-serif;color:#111;cursor:pointer;padding:0}
  .cc-keys button:active{background:#c9d3df}
  .cc-keys .cc-mem{font-size:12px;height:24px}
  .cc-keys .cc-num{background:linear-gradient(#ffffff,#eef1f4);font-weight:700}
  .cc-keys .cc-w2{grid-column:span 2}
  .cc-keys .cc-eq{grid-row:span 2;height:auto;background:linear-gradient(#e7f1fb,#c6dbf1)}
  .cc-note{font-size:10.5px;color:#4a5566;margin-top:6px;line-height:1.35}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const MAXLEN = 9;           // characters per typed number (dot included)
  const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 3 };
  let cur = '0', fresh = true, vals = [], ops = [], line = '', mem = null, err = false, lastWasOp = false;

  function fmt(v) {
    if (!isFinite(v)) return isNaN(v) ? 'Math Error' : 'Infinity';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e15 || a < 1e-9) return String(Number(v.toPrecision(12)));
    return String(Number(v.toFixed(9)));
  }
  function apply(a, op, b) {
    switch (op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; case '%': return a / 100 * b; }
  }
  function reduce(minPrec) {
    while (ops.length && PREC[ops[ops.length - 1]] >= minPrec) {
      const b = vals.pop(), a = vals.pop(), op = ops.pop();
      vals.push(apply(a, op, b));
    }
  }
  function setCur(v) { cur = fmt(v); err = !isFinite(v); }
  function render() {
    out.firstChild.nodeValue = cur;
    lineEl.textContent = line ? (line.length > 26 ? '…' + line.slice(-25) : line) : ' ';
    mEl.style.visibility = mem === null ? 'hidden' : 'visible';
  }
  function clearAll() { cur = '0'; fresh = true; vals = []; ops = []; line = ''; err = false; lastWasOp = false; }

  function press(k) {
    if (err && k !== 'C') return;            // after an error only C works
    if (/^[0-9.]$/.test(k)) {
      if (fresh) { cur = k === '.' ? '0.' : k; fresh = false; lastWasOp = false; return; }
      if (k === '.' && cur.includes('.')) return;
      if (cur.length >= MAXLEN) return;
      cur = cur === '0' && k !== '.' ? k : cur + k; lastWasOp = false; return;
    }
    if (k in PREC) {
      if (lastWasOp && ops.length) { ops[ops.length - 1] = k; line = line.slice(0, -1) + k; return; }
      const x = parseFloat(cur);
      line += cur + k;
      vals.push(x);
      reduce(PREC[k]);
      setCur(vals[vals.length - 1]);
      ops.push(k); fresh = true; lastWasOp = true; return;
    }
    if (k === '=') {
      if (!ops.length) { fresh = true; return; }
      if (lastWasOp) { ops.pop(); vals.pop(); line = line.slice(0, -1); vals.push(parseFloat(cur)); }
      else vals.push(parseFloat(cur));
      reduce(0);
      setCur(vals.pop()); vals = []; ops = []; line = ''; fresh = true; lastWasOp = false; return;
    }
    const x = parseFloat(cur);
    switch (k) {
      case 'C': clearAll(); return;
      case 'BK': if (fresh) return; cur = cur.length > 1 ? cur.slice(0, -1) : '0'; if (cur === '-' || cur === '') cur = '0'; return;
      case 'NEG': if (x !== 0) cur = cur.startsWith('-') ? cur.slice(1) : '-' + cur; return;
      case 'SQRT': setCur(Math.sqrt(x)); fresh = true; lastWasOp = false; return;
      case 'INV': setCur(1 / x); fresh = true; lastWasOp = false; return;
      case 'MC': mem = null; return;
      case 'MR': if (mem !== null) { setCur(mem); fresh = true; lastWasOp = false; } return;
      case 'MS': mem = x; fresh = true; return;
      case 'M+': mem = (mem || 0) + x; fresh = true; return;
      case 'M-': mem = (mem || 0) - x; fresh = true; return;
    }
  }

  const pad = document.createElement('div');
  pad.className = 'cc-pad'; pad.hidden = true; pad.setAttribute('role', 'dialog'); pad.setAttribute('aria-label', 'Calculator');
  const K = [
    ['MC', 'MC', 'cc-mem'], ['MR', 'MR', 'cc-mem'], ['MS', 'MS', 'cc-mem'], ['M+', 'M+', 'cc-mem'], ['M-', 'M-', 'cc-mem'],
    ['BK', '←', 'cc-w2'], ['C', 'C'], ['NEG', '+/-'], ['SQRT', 'sqrt'],
    ['7', '7', 'cc-num'], ['8', '8', 'cc-num'], ['9', '9', 'cc-num'], ['/', '/'], ['%', '%'],
    ['4', '4', 'cc-num'], ['5', '5', 'cc-num'], ['6', '6', 'cc-num'], ['*', '*'], ['INV', '1/x'],
    ['1', '1', 'cc-num'], ['2', '2', 'cc-num'], ['3', '3', 'cc-num'], ['-', '-'], ['=', '=', 'cc-eq'],
    ['0', '0', 'cc-num cc-w2'], ['.', '.', 'cc-num'], ['+', '+']
  ];
  pad.innerHTML = '<div class="cc-head"><b>Normal Calculator</b><button type="button" class="cc-mn" aria-label="Minimise">_</button><button type="button" class="cc-x" aria-label="Close">×</button></div>' +
    '<div class="cc-body"><div class="cc-line"></div><div class="cc-out">0<span class="cc-m">M</span></div><div class="cc-keys">' +
    K.map(([k, t, c]) => `<button type="button" tabindex="-1" data-k="${k}" class="${c || ''}">${t}</button>`).join('') +
    '</div><div class="cc-note">Practice copy of the CAT calculator. Mouse/tap only, like the exam.</div></div>';
  document.body.appendChild(pad);
  const out = pad.querySelector('.cc-out'), lineEl = pad.querySelector('.cc-line'), mEl = pad.querySelector('.cc-m');
  pad.querySelector('.cc-keys').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    press(b.dataset.k); render(); b.blur();
  });
  // no keyboard input on purpose (the exam calculator ignores the keyboard)

  const openBtn = document.createElement('button');
  openBtn.type = 'button'; openBtn.className = 'cc-open';
  openBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5"/><path d="M5 4.5h6M5 8h1M8 8h0M11 8h0M5 11h1M8 11h0M11 11h0" stroke-linecap="round" stroke-width="2"/></svg>Calculator';
  document.body.appendChild(openBtn);
  function place() {
    const w = pad.offsetWidth || 226;
    pad.style.left = Math.max(8, window.innerWidth - w - 16) + 'px';
    pad.style.top = '70px';
  }
  let placed = false;
  openBtn.addEventListener('click', () => {
    pad.hidden = !pad.hidden;
    if (!pad.hidden && !placed) { place(); placed = true; }
  });
  pad.querySelector('.cc-x').addEventListener('click', () => { pad.hidden = true; clearAll(); render(); });
  pad.querySelector('.cc-mn').addEventListener('click', () => pad.classList.toggle('cc-min'));

  // drag by the title bar
  const head = pad.querySelector('.cc-head');
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    const r = pad.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    head.setPointerCapture(e.pointerId);
    const move = ev => {
      pad.style.left = Math.min(window.innerWidth - 60, Math.max(0, ev.clientX - dx)) + 'px';
      pad.style.top = Math.min(window.innerHeight - 30, Math.max(0, ev.clientY - dy)) + 'px';
    };
    const up = () => { head.removeEventListener('pointermove', move); head.removeEventListener('pointerup', up); };
    head.addEventListener('pointermove', move); head.addEventListener('pointerup', up);
  });

  render();
  window.CatCalc = { press: k => { press(k); render(); return cur; }, value: () => cur, line: () => line, open: () => { if (pad.hidden) openBtn.click(); } };
})();
