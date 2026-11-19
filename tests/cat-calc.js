/* Practice copy of the CAT on-screen calculator (TCS "Normal Calculator").
   Own code, built to look and behave like the exam one:
   - orange calculator icon at the top right, above the timer; click to open/close
   - draggable window: blue title bar, grey body, two white display boxes,
     grey keys, red ← C +/-, tall green =
   - mouse only (the keyboard does nothing), 9 characters per number,
     × ÷ % done before + −, a % b = a/100 × b, √ and 1/x act on the number shown, one memory (M shows when set)
   Use: <script src="cat-calc.js"></script> just before </body>. */
(function () {
  if (window.CatCalc) return;
  const css = `
  .cc-bar{grid-column:1/-1;display:flex;justify-content:flex-end;align-items:center;margin:-6px -4px -4px 0;min-height:26px}
  .cc-icon{width:30px;height:28px;padding:0;border:1px solid transparent;border-radius:4px;background:transparent;cursor:pointer;display:grid;place-items:center}
  .cc-icon:hover,.cc-icon[aria-expanded="true"]{border-color:#e0a050;background:rgba(240,140,30,.12)}
  .cc-icon.cc-float{position:fixed;top:10px;right:12px;z-index:60;background:#fff;border-color:#ccc;box-shadow:0 2px 8px rgba(0,0,0,.2)}
  .cc-pad{position:fixed;z-index:61;width:214px;background:#dadada;border:1px solid #aaa;border-bottom:7px solid #999;border-radius:5px;
    box-shadow:0 0 15px 0 rgba(0,0,0,.1) inset,0 6px 24px rgba(0,0,0,.28);font-family:Arial,Helvetica,sans-serif;color:#444;
    user-select:none;-webkit-user-select:none;box-sizing:border-box;line-height:normal}
  .cc-pad *{box-sizing:border-box}
  .cc-pad[hidden]{display:none}
  .cc-head{display:flex;align-items:center;padding:10px;background:#4286f3;color:#fff;cursor:move;font-size:14px;margin-bottom:5px;border-radius:4px 4px 0 0;touch-action:none}
  .cc-head b{flex:1;font-weight:700}
  .cc-head button{width:18px;height:18px;margin-left:8px;border:0;padding:0;background:transparent;cursor:pointer;display:grid;place-items:center}
  .cc-main{padding:0 10px 10px}
  .cc-pad.cc-min{width:200px}
  .cc-pad.cc-min .cc-main{display:none}
  .cc-pad.cc-min .cc-head{margin-bottom:0}
  .cc-box{position:relative;width:100%;height:30px;line-height:26px;background:#fff;border:1px solid #aaa;border-width:1px 1px 3px;border-radius:3px;
    text-align:right;font-size:17px;padding:0 5px 0 14px;margin-bottom:7px;overflow:hidden;white-space:nowrap;color:#000}
  .cc-line{font-size:14px;color:#333}
  .cc-m{position:absolute;left:4px;top:0;font-size:11px;font-weight:700;color:#444;visibility:hidden}
  .cc-keys{display:grid;grid-template-columns:repeat(5,35px);column-gap:3px;row-gap:5px}
  .cc-keys button{height:25px;width:35px;padding:0;background:#f1f1f1;border:1px solid #aaa;border-width:1px 1px 3px;border-radius:4px;
    color:#444;font:700 12px/20px Arial,Helvetica,sans-serif;cursor:pointer;text-align:center}
  .cc-keys button:hover{background:#eaeaea}
  .cc-keys button:active{border-bottom-width:1px;transform:translateY(2px)}
  .cc-keys .cc-red{background:#e74c3c;border-color:#c0392b;color:#fff}
  .cc-keys .cc-red:hover{background:#e0493a}
  .cc-keys .cc-w2{grid-column:span 2;width:73px}
  .cc-keys .cc-bk{font-size:20px;line-height:18px}
  .cc-keys .cc-eq{grid-row:span 2;height:55px;background:#2ecc71;border-color:#27ae60;color:#fff;font-size:20px}
  .cc-keys .cc-eq:hover{background:#2bc46c}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const ICON = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="3" y="1" width="16" height="20" rx="2.5" fill="#f08c1e"/><rect x="5.5" y="3.5" width="11" height="4.5" rx="1" fill="#fff"/>' +
    [0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${5.5 + c * 4}" y="${10 + r * 3.6}" width="3" height="2.4" rx=".6" fill="#fff"/>`).join('')).join('') + '</svg>';
  const MIN = '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="10" width="12" height="2.4" fill="#fff"/></svg>';
  const CLOSE = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

  const MAXLEN = 9;
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
  function clearAll() { cur = '0'; fresh = true; vals = []; ops = []; line = ''; err = false; lastWasOp = false; }

  function press(k) {
    if (err && k !== 'C') return;
    if (/^[0-9.]$/.test(k)) {
      if (fresh) { cur = k === '.' ? '0.' : k; fresh = false; lastWasOp = false; return; }
      if (k === '.' && cur.includes('.')) return;
      if (cur.length >= MAXLEN) return;
      cur = cur === '0' && k !== '.' ? k : cur + k; lastWasOp = false; return;
    }
    if (k in PREC) {
      if (lastWasOp && ops.length) { ops[ops.length - 1] = k; line = line.slice(0, -1) + k; return; }
      line += cur + k;
      vals.push(parseFloat(cur));
      reduce(PREC[k]);
      setCur(vals[vals.length - 1]);
      ops.push(k); fresh = true; lastWasOp = true; return;
    }
    if (k === '=') {
      if (!ops.length) { fresh = true; return; }
      if (lastWasOp) { ops.pop(); line = line.slice(0, -1); }
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
  pad.className = 'cc-pad'; pad.hidden = true; pad.setAttribute('role', 'dialog'); pad.setAttribute('aria-label', 'Normal Calculator');
  const K = [
    ['MC', 'MC'], ['MR', 'MR'], ['MS', 'MS'], ['M+', 'M+'], ['M-', 'M-'],
    ['BK', '←', 'cc-red cc-w2 cc-bk'], ['C', 'C', 'cc-red'], ['NEG', '+/-', 'cc-red'], ['SQRT', 'sqrt'],
    ['7', '7'], ['8', '8'], ['9', '9'], ['/', '/'], ['%', '%'],
    ['4', '4'], ['5', '5'], ['6', '6'], ['*', '*'], ['INV', '1/x'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['-', '-'], ['=', '=', 'cc-eq'],
    ['0', '0', 'cc-w2'], ['.', '.'], ['+', '+']
  ];
  pad.innerHTML = '<div class="cc-head"><b>Normal Calculator</b>' +
    `<button type="button" class="cc-mn" aria-label="Minimise">${MIN}</button><button type="button" class="cc-x" aria-label="Close">${CLOSE}</button></div>` +
    '<div class="cc-main"><div class="cc-box cc-line"></div><div class="cc-box cc-out"><span class="cc-m">M</span><span class="cc-v">0</span></div><div class="cc-keys">' +
    K.map(([k, t, c]) => `<button type="button" tabindex="-1" data-k="${k}" class="${c || ''}">${t}</button>`).join('') +
    '</div></div>';
  document.body.appendChild(pad);
  const vEl = pad.querySelector('.cc-v'), lineEl = pad.querySelector('.cc-line'), mEl = pad.querySelector('.cc-m');
  function render() {
    vEl.textContent = cur;
    lineEl.textContent = line ? (line.length > 22 ? '…' + line.slice(-21) : line) : ' ';
    mEl.style.visibility = mem === null ? 'hidden' : 'visible';
  }
  pad.querySelector('.cc-keys').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    press(b.dataset.k); render(); b.blur();
  });
  // no keyboard handler on purpose: the exam calculator ignores the keyboard

  // the orange icon: top right of the sticky time bar (above the timer), like the exam screen
  const icon = document.createElement('button');
  icon.type = 'button'; icon.className = 'cc-icon'; icon.title = 'Calculator';
  icon.setAttribute('aria-label', 'Calculator'); icon.setAttribute('aria-expanded', 'false');
  icon.innerHTML = ICON;
  const strip = document.querySelector('.summary');
  if (strip) { const bar = document.createElement('div'); bar.className = 'cc-bar'; bar.appendChild(icon); strip.insertBefore(bar, strip.firstChild); }
  else { icon.classList.add('cc-float'); document.body.appendChild(icon); }

  let placed = false;
  function place() {
    const r = icon.getBoundingClientRect();
    const w = pad.offsetWidth || 214;
    pad.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w)) + 'px';
    pad.style.top = Math.max(8, r.bottom + 6) + 'px';
  }
  function show(on) {
    pad.hidden = !on; icon.setAttribute('aria-expanded', String(on));
    if (on && !placed) { place(); placed = true; }
  }
  icon.addEventListener('click', () => show(pad.hidden));
  pad.querySelector('.cc-x').addEventListener('click', () => { show(false); clearAll(); render(); });
  pad.querySelector('.cc-mn').addEventListener('click', () => pad.classList.toggle('cc-min'));

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

  window.addEventListener('resize', () => {
    if (pad.hidden) { placed = false; return; }
    const r = pad.getBoundingClientRect();
    if (r.right > window.innerWidth || r.bottom > window.innerHeight) place();
  });

  render();
  window.CatCalc = { press: k => { press(k); render(); return cur; }, value: () => cur, open: () => show(true) };
})();
