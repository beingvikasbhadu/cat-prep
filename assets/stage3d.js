// 3D couple stage (Three.js, loaded on demand). Vikas and Khushi as soft-shaded 3D characters.
// Modes: "loop" = kiss story repeating (home, Us page), "kiss" = story once (pop-ups), "hug" = hug once.
// Falls back to the SVG drawing when WebGL or the library is unavailable. Pauses off-screen and in background tabs.
(function () {
  "use strict";
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const freezeParam = (location.search.match(/[?&]freeze=([\d.]+)/) || [])[1];
  const FREEZE = freezeParam != null ? parseFloat(freezeParam) : null;
  let threeP = null;
  const stages = new Set();

  function webglOK() {
    try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
  }
  function loadThree() { return threeP || (threeP = import(THREE_URL)); }

  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const seg = (t, a, b) => ease((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;

  function build(THREE, host, mode) {
    const disposables = [];
    const keep = o => (disposables.push(o), o);
    const mat = (color, rough, extra) => keep(new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough == null ? 0.6 : rough, metalness: 0 }, extra || {})));
    const sphere = (r, ws, hs, opts) => keep(new THREE.SphereGeometry(r, ws || 24, hs || 18, opts && opts.phiStart, opts && opts.phiLength, opts && opts.thetaStart, opts && opts.thetaLength));
    const capsule = (r, len) => keep(new THREE.CapsuleGeometry(r, len, 6, 16));
    const mesh = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };
    const group = (x, y, z) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); return g; };

    const M = {
      skinB: mat(0xf0c29e, 0.55), skinG: mat(0xf8d3b9, 0.5), skinShade: mat(0xe2a884, 0.6),
      hairB: mat(0x1b1517, 0.32), hairG: mat(0x2b1b16, 0.3), shirt: mat(0x7d4b33, 0.75), shirtDark: mat(0x613823, 0.75),
      pants: mat(0xf1e9dc, 0.8), shoes: mat(0xffffff, 0.45), sole: mat(0xdedad4, 0.6), dress: mat(0xfbf4ea, 0.7, { side: 2 }), ruffle: mat(0xf1e6d6, 0.75, { side: 2 }),
      ribbon: mat(0xf7a9c3, 0.5), eyeW: mat(0xffffff, 0.25, { emissive: 0x222222 }), iris: mat(0x3a2619, 0.2), shine: mat(0xffffff, 0.1, { emissive: 0xffffff, emissiveIntensity: 0.6 }),
      lash: mat(0x1d1210, 0.5), brow: mat(0x241a16, 0.6), mouthB: mat(0xa5534f, 0.5), lipsG: mat(0xe0607f, 0.35), kiss: mat(0xe6647f, 0.3),
      gold: mat(0xe2b34b, 0.25, { metalness: 0.6 }), button: mat(0xefe2d4, 0.4),
      blush: keep(new THREE.MeshBasicMaterial({ color: 0xff7fa6, transparent: true, opacity: 0.35, depthWrite: false })),
      sweat: keep(new THREE.MeshStandardMaterial({ color: 0x9fd3ff, roughness: 0.1, transparent: true, opacity: 0.9 })),
      heart: mat(0xff4d8d, 0.35, { emissive: 0xff2f6e, emissiveIntensity: 0.25 }),
      mouthG: mat(0xd76a80, 0.4), mouthIn: mat(0x8e3346, 0.6, { side: 2 }), kissB: mat(0xc96a78, 0.35), kissG: mat(0xe0607f, 0.3)
    };

    // shared shapes
    const G = {
      eyeW: sphere(1, 20, 14), iris: sphere(1, 16, 12), dot: sphere(1, 10, 8), blush: keep(new THREE.CircleGeometry(1, 20)),
      torus: keep(new THREE.TorusGeometry(1, 0.22, 8, 24, Math.PI)), ring: keep(new THREE.TorusGeometry(1, 0.08, 6, 32)),
      arc: keep(new THREE.TorusGeometry(1, 0.2, 6, 18, Math.PI)), halfDisc: keep(new THREE.CircleGeometry(1, 18, Math.PI, Math.PI))
    };
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.5); heartShape.bezierCurveTo(-0.9, 0.1, -0.5, 0.75, 0, 0.35); heartShape.bezierCurveTo(0.5, 0.75, 0.9, 0.1, 0, -0.5);
    G.heart = keep(new THREE.ExtrudeGeometry(heartShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3, curveSegments: 14 }));
    G.heart.center();

    function eye(x, y, z, size, lashes) {
      const e = group(x, y, z);
      const w = mesh(G.eyeW, M.eyeW); w.scale.set(size, size * (lashes ? 0.9 : 0.78), size * 0.45); e.add(w);
      const ir = mesh(G.iris, M.iris, 0, -size * 0.04, size * 0.3); ir.scale.set(size * 0.62, size * 0.66, size * 0.3); e.add(ir);
      const sh = mesh(G.dot, M.shine, size * 0.25, size * 0.25, size * 0.5); sh.scale.setScalar(size * 0.2); e.add(sh);
      if (lashes) {
        // thin upper lash line just above the eye, with flicks curling up and out
        const top = mesh(G.arc, M.lash, 0, size * 0.18, size * 0.28); top.scale.set(size * 1.02, size * 0.82, size * 0.3); e.add(top);
        [-1, 1].forEach(sx => { const f = mesh(keep(new THREE.BoxGeometry(size * 0.42, size * 0.09, size * 0.1)), M.lash, sx * size * 1.02, size * 0.78, size * 0.22); f.rotation.z = sx * 0.95; e.add(f); });
      }
      return e;
    }
    function faceKit(head, o) {
      const closed = o.eyePos.map(([x, y, z]) => { const a = mesh(G.arc, M.lash, x, y, z); a.scale.set(o.eyeR, o.eyeR * 0.75, o.eyeR * 0.4); a.visible = false; head.add(a); return a; });
      const smile = mesh(G.arc, o.mouthMat, 0, o.my, o.mz); smile.rotation.z = Math.PI; smile.scale.set(o.mw, o.mw * 0.7, o.mw * 0.4); head.add(smile);
      const big = mesh(G.halfDisc, M.mouthIn, 0, o.my + 0.003, o.mz + 0.003); big.scale.set(o.mw * 1.1, o.mw * 0.85, 1); big.visible = false; head.add(big);
      const ooh = mesh(G.dot, M.mouthIn, 0, o.my - 0.003, o.mz); ooh.scale.set(o.mw * 0.32, o.mw * 0.42, o.mw * 0.2); ooh.visible = false; head.add(ooh);
      const kiss = mesh(G.dot, o.kissMat, 0, o.my, o.mz + 0.003); kiss.scale.set(o.mw * 0.4, o.mw * 0.34, o.mw * 0.38); kiss.visible = false; head.add(kiss);
      return { closed, mouths: { smile, big, ooh, kiss } };
    }
    function arm(parent, side, x, y, upperMat, lowerMat, handMat, rUpper, rLower) {
      const sh = group(x, y, 0); parent.add(sh);
      const up = mesh(capsule(rUpper, 0.24), upperMat, 0, -0.17, 0); sh.add(up);
      const el = group(0, -0.33, 0); sh.add(el);
      const lo = mesh(capsule(rLower, 0.2), lowerMat, 0, -0.14, 0); el.add(lo);
      const hand = mesh(G.dot, handMat, 0, -0.3, 0.01); hand.scale.set(rLower * 1.15, rLower * 1.3, rLower * 1.0); el.add(hand);
      sh.rotation.z = side * 0.08;
      return { sh, el, hand };
    }

    // ---------- Vikas ----------
    function makeVikas() {
      const root = group(-0.45, 0, 0);
      const hips = group(0, 0.88, 0); root.add(hips);
      const legs = [-1, 1].map(sx => {
        const p = group(sx * 0.085, 0, 0); hips.add(p);
        const l = mesh(capsule(0.078, 0.64), M.pants, 0, -0.42, 0); p.add(l);
        const shoe = mesh(sphere(0.1), M.shoes, 0, -0.835, 0.05); shoe.scale.set(0.72, 0.42, 1.3); p.add(shoe);
        const sole = mesh(keep(new THREE.BoxGeometry(0.135, 0.018, 0.255)), M.sole, 0, -0.875, 0.045); p.add(sole);
        return p;
      });
      const body = group(0, 0, 0); hips.add(body);
      const torso = mesh(capsule(0.165, 0.34), M.shirt, 0, 0.3, 0); torso.scale.set(1.16, 1, 0.76); body.add(torso);
      const tuck = mesh(keep(new THREE.CylinderGeometry(0.168, 0.165, 0.05, 20)), M.pants, 0, 0.02, 0); tuck.scale.set(1.06, 1, 0.74); body.add(tuck);
      [-1, 1].forEach(sx => { const col = mesh(keep(new THREE.BoxGeometry(0.075, 0.02, 0.06)), M.shirtDark, sx * 0.045, 0.6, 0.095); col.rotation.set(0.3, 0, sx * -0.55); body.add(col); });
      [0.2, 0.32, 0.44].forEach(y => { const b = mesh(G.dot, M.button, 0, y, 0.122); b.scale.setScalar(0.011); body.add(b); });
      const pocket = mesh(keep(new THREE.BoxGeometry(0.07, 0.07, 0.01)), M.shirtDark, 0.08, 0.42, 0.118); body.add(pocket);
      const armL = arm(body, -1, -0.215, 0.55, M.shirt, M.skinB, M.skinB, 0.058, 0.047);
      const armR = arm(body, 1, 0.215, 0.55, M.shirt, M.skinB, M.skinB, 0.058, 0.047);
      [armL, armR].forEach(a => { const cuff = mesh(capsule(0.054, 0.02), M.shirtDark, 0, -0.02, 0); a.el.add(cuff); });
      const neck = mesh(keep(new THREE.CylinderGeometry(0.055, 0.06, 0.1, 16)), M.skinShade, 0, 0.66, 0); body.add(neck);
      const head = group(0, 0.9, 0); head.scale.setScalar(1.12); body.add(head);
      const face = mesh(sphere(0.19), M.skinB); face.scale.set(0.93, 1.06, 0.97); head.add(face);
      const jaw = mesh(sphere(0.14), M.skinB, 0, -0.08, 0.02); jaw.scale.set(0.95, 0.75, 0.9); head.add(jaw);
      [-1, 1].forEach(sx => { const ear = mesh(G.dot, M.skinShade, sx * 0.172, 0, -0.01); ear.scale.set(0.03, 0.05, 0.025); head.add(ear); });
      const hairTop = mesh(sphere(0.205, 24, 16, { thetaLength: Math.PI * 0.5 }), M.hairB, 0, 0.02, -0.01); hairTop.scale.set(0.98, 1.06, 1.02); hairTop.rotation.x = -0.25; head.add(hairTop);
      const hairBack = mesh(sphere(0.2), M.hairB, 0, 0.03, -0.05); hairBack.scale.set(0.98, 0.98, 0.9); head.add(hairBack);
      const fringe = mesh(sphere(0.125), M.hairB, -0.03, 0.155, 0.1); fringe.scale.set(1.42, 0.48, 0.8); fringe.rotation.z = 0.28; head.add(fringe);
      const sweep = mesh(sphere(0.08), M.hairB, 0.1, 0.16, 0.06); sweep.scale.set(1.1, 0.5, 0.8); sweep.rotation.z = -0.4; head.add(sweep);
      [-1, 1].forEach(sx => { const side = mesh(sphere(0.07), M.hairB, sx * 0.16, 0.06, -0.01); side.scale.set(0.45, 1, 0.9); head.add(side); });
      const eyes = [eye(-0.066, 0.008, 0.168, 0.034, false), eye(0.066, 0.008, 0.168, 0.034, false)]; eyes.forEach(e => head.add(e));
      const brows = [-1, 1].map(sx => { const br = mesh(keep(new THREE.BoxGeometry(0.06, 0.012, 0.012)), M.brow, sx * 0.066, 0.058, 0.172); br.rotation.z = sx * -0.12; head.add(br); return br; });
      const nose = mesh(G.dot, M.skinShade, 0, -0.035, 0.182); nose.scale.set(0.018, 0.024, 0.016); head.add(nose);
      const kit = faceKit(head, { eyePos: [[-0.066, 0.006, 0.172], [0.066, 0.006, 0.172]], eyeR: 0.026, mouthMat: M.mouthB, kissMat: M.kissB, mw: 0.021, my: -0.086, mz: 0.17 });
      const blush = [-1, 1].map(sx => { const b = mesh(G.blush, M.blush.clone(), sx * 0.105, -0.045, 0.158); keep(b.material); b.scale.setScalar(0.034); b.rotation.y = sx * 0.55; head.add(b); return b; });
      const sweat = mesh(G.dot, M.sweat, 0.15, 0.12, 0.08); sweat.scale.set(0.018, 0.028, 0.015); sweat.visible = false; head.add(sweat);
      return { root, hips, body, head, legs, armL, armR, eyes, kit, brows, browY: 0.058, browRot: [0.06, -0.06], blush, sweat, baseY: 0 };
    }

    // ---------- Khushi ----------
    function makeKhushi() {
      const root = group(0.45, 0, 0);
      const hips = group(0, 0.8, 0); root.add(hips);
      const legs = [-1, 1].map(sx => {
        const p = group(sx * 0.065, 0, 0); hips.add(p);
        const l = mesh(capsule(0.05, 0.62), M.skinG, 0, -0.39, 0); p.add(l);
        const heel = mesh(keep(new THREE.BoxGeometry(0.1, 0.035, 0.17)), M.shoes, 0, -0.78, 0.035); heel.rotation.x = -0.12; p.add(heel);
        const strap = mesh(G.ring, M.shoes, 0, -0.72, 0.01); strap.scale.setScalar(0.052); strap.rotation.x = Math.PI / 2; p.add(strap);
        return p;
      });
      const body = group(0, 0, 0); hips.add(body);
      const skirtPts = [];
      for (let i = 0; i <= 12; i++) { const k = i / 12; skirtPts.push(new THREE.Vector2(0.125 + 0.12 * Math.pow(k, 1.15), 0.2 - 0.4 * k)); }
      const skirt = mesh(keep(new THREE.LatheGeometry(skirtPts, 40)), M.dress, 0, 0, 0); skirt.scale.set(1, 1, 0.82); body.add(skirt);
      [[0.02, 0.06], [-0.1, 0.06], [-0.2, 0.07]].forEach(([y0, hgt], j) => {
        const pts = []; for (let i = 0; i <= 4; i++) { const k = i / 4; const yy = y0 - hgt * k; const base = 0.125 + 0.12 * Math.pow((0.2 - yy) / 0.4, 1.15); pts.push(new THREE.Vector2(base + 0.012 + 0.012 * Math.sin(k * Math.PI), yy)); }
        const fr = mesh(keep(new THREE.LatheGeometry(pts, 40)), M.ruffle, 0, 0, 0); fr.scale.set(1, 1, 0.82); body.add(fr);
      });
      const bodice = mesh(capsule(0.13, 0.14), M.dress, 0, 0.32, 0); bodice.scale.set(1.02, 1, 0.72); body.add(bodice);
      const ribbon = mesh(G.ring, M.ribbon, 0, 0.2, 0); ribbon.scale.set(0.133, 0.1, 0.25); ribbon.rotation.x = Math.PI / 2; body.add(ribbon);
      [-1, 1].forEach(sx => { const bow = mesh(G.dot, M.ribbon, sx * 0.022, 0.2, 0.1); bow.scale.set(0.024, 0.016, 0.012); bow.rotation.z = sx * 0.5; body.add(bow); });
      [-1, 1].forEach(sx => { const st = mesh(keep(new THREE.CylinderGeometry(0.006, 0.006, 0.09, 6)), M.dress, sx * 0.06, 0.5, 0.05); body.add(st); });
      const armR = arm(body, -1, -0.165, 0.45, M.skinG, M.skinG, M.skinG, 0.041, 0.036); // her right arm (screen left)
      const armL = arm(body, 1, 0.165, 0.45, M.skinG, M.skinG, M.skinG, 0.041, 0.036);
      const watch = mesh(G.ring, M.gold, 0, -0.24, 0); watch.scale.setScalar(0.04); watch.rotation.x = Math.PI / 2; armL.el.add(watch);
      const neck = mesh(keep(new THREE.CylinderGeometry(0.045, 0.05, 0.1, 16)), M.skinG, 0, 0.53, 0); body.add(neck);
      const head = group(0, 0.77, 0); head.scale.setScalar(1.12); body.add(head);
      const hairLong = mesh(capsule(0.17, 0.36), M.hairG, 0, -0.24, -0.075); hairLong.scale.set(1.02, 1, 0.5); head.add(hairLong);
      const face = mesh(sphere(0.18), M.skinG); face.scale.set(0.92, 1.05, 0.96); head.add(face);
      const jaw = mesh(sphere(0.13), M.skinG, 0, -0.075, 0.02); jaw.scale.set(0.92, 0.75, 0.9); head.add(jaw);
      const hairTop = mesh(sphere(0.195, 24, 16, { thetaLength: Math.PI * 0.52 }), M.hairG, 0, 0.015, -0.01); hairTop.scale.set(1.02, 1.06, 1.04); hairTop.rotation.x = -0.22; head.add(hairTop);
      const hairBack = mesh(sphere(0.192), M.hairG, 0, 0.02, -0.055); head.add(hairBack);
      [-1, 1].forEach(sx => {
        const bang = mesh(sphere(0.09), M.hairG, sx * 0.07, 0.13, 0.1); bang.scale.set(1, 0.45, 0.7); bang.rotation.z = sx * -0.45; head.add(bang);
        const lock = mesh(capsule(0.038, 0.3), M.hairG, sx * 0.165, -0.2, 0.03); lock.rotation.z = sx * 0.08; head.add(lock);
        const ear = mesh(G.dot, M.gold, sx * 0.168, -0.06, 0.03); ear.scale.setScalar(0.012); head.add(ear);
      });
      const eyes = [eye(-0.062, -0.002, 0.158, 0.039, true), eye(0.062, -0.002, 0.158, 0.039, true)]; eyes.forEach(e => head.add(e));
      const brows = [-1, 1].map(sx => { const br = mesh(keep(new THREE.BoxGeometry(0.05, 0.008, 0.01)), M.brow, sx * 0.062, 0.06, 0.165); br.rotation.z = sx * -0.18; head.add(br); return br; });
      const nose = mesh(G.dot, M.skinShade, 0, -0.035, 0.172); nose.scale.set(0.013, 0.018, 0.012); head.add(nose);
      const kit = faceKit(head, { eyePos: [[-0.062, -0.004, 0.162], [0.062, -0.004, 0.162]], eyeR: 0.03, mouthMat: M.mouthG, kissMat: M.kissG, mw: 0.017, my: -0.081, mz: 0.163 });
      const blush = [-1, 1].map(sx => { const b = mesh(G.blush, M.blush.clone(), sx * 0.1, -0.04, 0.15); keep(b.material); b.scale.setScalar(0.034); b.rotation.y = sx * 0.55; head.add(b); return b; });
      return { root, hips, body, head, legs, armL, armR, eyes, kit, brows, browY: 0.068, browRot: [0.08, -0.08], blush, baseY: 0 };
    }

    // ---------- scene ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 1.22, 4.55); camera.lookAt(0, 1.02, 0);
    scene.add(new THREE.HemisphereLight(0xfff1f7, 0xd9a9bf, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(2.5, 4, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9fc4, 1.4); rim.position.set(-3, 2.5, -2.5); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xfff0e0, 0.45); fill.position.set(-2, 1, 3); scene.add(fill);

    // soft blob shadows
    const sc = document.createElement("canvas"); sc.width = sc.height = 64;
    const sx = sc.getContext("2d"), gr = sx.createRadialGradient(32, 32, 2, 32, 32, 32);
    gr.addColorStop(0, "rgba(90,20,55,0.35)"); gr.addColorStop(1, "rgba(90,20,55,0)"); sx.fillStyle = gr; sx.fillRect(0, 0, 64, 64);
    const shTex = keep(new THREE.CanvasTexture(sc));
    const shMat = keep(new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
    const shGeo = keep(new THREE.PlaneGeometry(1, 1));
    const V = makeVikas(), K = makeKhushi();
    scene.add(V.root, K.root);
    const shadows = [V, K].map(c => { const p = new THREE.Mesh(shGeo, shMat); p.rotation.x = -Math.PI / 2; p.scale.set(0.62, 0.3, 1); p.position.y = 0.002; scene.add(p); return p; });

    // hearts
    const hearts = [];
    for (let i = 0; i < 6; i++) { const h = new THREE.Mesh(G.heart, M.heart); h.visible = false; scene.add(h); hearts.push(h); }
    const cheekHeart = new THREE.Mesh(G.heart, M.heart); cheekHeart.visible = false; scene.add(cheekHeart);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement; canvas.className = "stage3d-canvas";
    canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", host.getAttribute("data-label") || "3D cartoon of Vikas and Khushi");

    // ---------- poses ----------
    const blink = (t, seed) => { const p = (t + seed) % 3.7; return p < 0.12 ? 0.15 : 1; };
    // st: eyes "open" | "closed" (smiling arcs), mouth "smile" | "big" | "ooh" | "kiss", brow 0..1 raise, tilt 0..1 inner ends up (shy/worried)
    function face(c, st, t, seed) {
      const closed = st.eyes === "closed";
      const b = closed ? 1 : blink(t, seed);
      c.eyes.forEach(e => { e.visible = !closed; e.scale.y = b; });
      c.kit.closed.forEach(a => (a.visible = closed));
      Object.keys(c.kit.mouths).forEach(k => (c.kit.mouths[k].visible = k === (st.mouth || "smile")));
      c.brows.forEach((br, i) => { br.position.y = c.browY + 0.014 * (st.brow || 0) + 0.004 * (st.tilt || 0); br.rotation.z = c.browRot[i] + (i ? -1 : 1) * 0.3 * (st.tilt || 0); });
    }
    const within = (t, a, b) => t >= a && t < b;
    function setBlush(c, k) { c.blush.forEach(b => (b.material.opacity = 0.3 + 0.5 * k)); }
    function resetLimbs(c) {
      c.legs.forEach(l => (l.rotation.x = 0));
      [c.armL, c.armR].forEach((a, i) => { a.sh.rotation.set(0, 0, (i ? 1 : -1) * 0.08); a.el.rotation.set(0, 0, 0); });
      c.body.rotation.set(0, 0, 0); c.head.rotation.set(0, 0, 0); c.root.position.y = 0;
    }
    function walk(c, phase, amt) {
      const s = Math.sin(phase) * 0.45 * amt;
      c.legs[0].rotation.x = s; c.legs[1].rotation.x = -s;
      c.armL.sh.rotation.x = -s * 0.8; c.armR.sh.rotation.x = s * 0.8;
      c.root.position.y = Math.abs(Math.cos(phase)) * 0.025 * amt;
    }
    function idle(c, t, seed) {
      c.body.scale.y = 1 + Math.sin(t * 2 + seed) * 0.006;
      c.head.rotation.z += Math.sin(t * 1.3 + seed) * 0.02;
    }
    function popHeart(h, x, y, z, k, size) {
      h.visible = k > 0 && k < 1;
      if (!h.visible) return;
      const s = (k < 0.2 ? k / 0.2 * 1.2 : 1.2 - 0.2 * Math.min(1, (k - 0.2) / 0.2)) * size;
      h.scale.setScalar(s); h.position.set(x, y + k * 0.15, z); h.rotation.y = Math.sin(k * 6) * 0.4;
    }

    function kissStory(t, loop) {
      resetLimbs(V); resetLimbs(K);
      // positions and turns through the story
      let vx = -0.45, vz = 0, vry = 0, kx = 0.45, kry = 0, vLean = 0, vPitch = 0, kPitch = 0, kTilt = 0, vTilt = 0, kUp = 0;
      // 0.6-1.6 he steps in and turns to her cheek; 1.6-2.2 the cheek kiss
      const a = seg(t, 0.6, 1.6);
      vx = lerp(vx, 0.03, a); vz = lerp(0, 0.06, a); vry = lerp(0, 1.3, a); vLean = 0.12 * a; vPitch = 0.08 * a;
      // 2.2-2.7 shy: straightens and turns away; 2.7-4.4 walks off
      const b = seg(t, 2.2, 2.75);
      vry = lerp(vry, -1.7, b); vLean *= 1 - b; vPitch = lerp(vPitch, 0.18, b);
      const w = seg(t, 2.7, 4.4);
      vx = lerp(vx, -0.95, w); vz = lerp(vz, 0, w);
      // 4.4-5.2 she steps and reaches for his hand; he looks back
      const r = seg(t, 4.4, 5.2);
      kx = lerp(kx, 0.25, r); kry = lerp(0, -0.9, r); vry = lerp(vry, 0.5, r); vPitch = lerp(vPitch, 0, r);
      // 5.2-6.4 she pulls him back; both turn to face each other
      const p = seg(t, 5.2, 6.4);
      vx = lerp(vx, -0.19, p); kx = lerp(kx, 0.175, p); vry = lerp(vry, 1.2, p); kry = lerp(kry, -1.2, p);
      // 6.4-7.0 the kiss: heads tilt, she rises on tiptoe
      const k = seg(t, 6.4, 7.0);
      vPitch = lerp(vPitch, 0.22, k); vLean = lerp(vLean, 0.06, k); kPitch = lerp(0, -0.12, k); kTilt = 0.12 * k; vTilt = -0.1 * k; kUp = 0.05 * k;
      // loop: step back apart at the end
      if (loop) {
        const z = seg(t, 9.2, 10);
        vx = lerp(vx, -0.45, z); kx = lerp(kx, 0.45, z); vry = lerp(vry, 0, z); kry = lerp(kry, 0, z);
        vPitch *= 1 - z; vLean *= 1 - z; kPitch *= 1 - z; kTilt *= 1 - z; vTilt *= 1 - z; kUp *= 1 - z;
      }
      V.root.position.x = vx; V.root.position.z = vz; V.root.rotation.y = vry;
      K.root.position.x = kx; K.root.rotation.y = kry;
      V.body.rotation.x = vLean; V.head.rotation.x = vPitch; V.head.rotation.z = vTilt;
      K.head.rotation.x = kPitch; K.head.rotation.z = kTilt;
      K.root.position.y = kUp;
      // walking legs
      const moving = (t > 0.6 && t < 1.6) || (t > 2.7 && t < 4.4) || (t > 5.2 && t < 6.4) || (loop && t > 9.2);
      if (moving) walk(V, t * 9, 1);
      if (t > 4.4 && t < 5.2) walk(K, t * 8, 0.5);
      if (loop && t > 9.2) walk(K, t * 8, 0.6);
      if (kUp > 0) { K.legs.forEach(l => (l.rotation.x = 0)); }
      // her reaching arm (right arm, toward him), then holding hands while she pulls
      const reach = seg(t, 4.5, 5.0) * (1 - seg(t, 6.0, 6.5));
      K.armR.sh.rotation.x = -1.15 * reach; K.armR.sh.rotation.z = -0.08 - 0.25 * reach;
      V.armR.sh.rotation.x = Math.min(V.armR.sh.rotation.x, -0.7 * seg(t, 4.8, 5.2) * (1 - seg(t, 6.0, 6.5)));
      // hands rest on each other during the kiss
      const hold = seg(t, 6.4, 7.0) * (loop ? 1 - seg(t, 9.2, 9.7) : 1);
      V.armR.sh.rotation.x += -0.45 * hold; V.armR.el.rotation.x = -0.6 * hold;
      K.armR.sh.rotation.x += -0.4 * hold; K.armR.el.rotation.x = -0.5 * hold;
      // faces
      const lipKiss = t > 6.7 && (!loop || t < 9.3), afterKiss = loop && t >= 9.3;
      // Vikas: kisses her cheek, grins shyly with his eyes shut, looks back surprised when she grabs him, then the kiss
      face(V, {
        eyes: within(t, 1.35, 2.25) || within(t, 2.4, 4.45) || (t > 6.5 && !afterKiss) ? "closed" : "open",
        mouth: within(t, 1.45, 2.25) || lipKiss ? "kiss" : within(t, 4.55, 5.35) ? "ooh" : within(t, 2.4, 3.6) ? "big" : "smile",
        brow: within(t, 4.5, 5.4) ? 1 : 0, tilt: within(t, 2.3, 4.45) ? 1 : 0
      }, t, 0.3);
      // Khushi: surprised by the cheek kiss, giggles, a little worried as he walks off, then the kiss
      face(K, {
        eyes: within(t, 1.9, 3.05) || (t > 6.55 && !afterKiss) ? "closed" : "open",
        mouth: lipKiss ? "kiss" : within(t, 1.5, 1.9) ? "ooh" : within(t, 1.9, 3.1) || afterKiss ? "big" : "smile",
        brow: within(t, 1.45, 1.95) ? 1 : 0, tilt: within(t, 3.3, 4.5) ? 0.7 : 0
      }, t, 1.7);
      const giggle = seg(t, 1.85, 2.1) * (1 - seg(t, 2.9, 3.2));
      K.head.rotation.z += 0.14 * giggle * (1 + 0.25 * Math.sin(t * 18)); K.body.rotation.z = -0.05 * giggle;
      V.head.rotation.x += 0.12 * seg(t, 2.35, 2.6) * (1 - seg(t, 4.3, 4.6));
      setBlush(V, seg(t, 2.1, 2.5) * (1 - seg(t, 4.6, 5.2)) + 0.6 * seg(t, 6.5, 7));
      setBlush(K, seg(t, 1.5, 2.0) * (1 - seg(t, 3, 4)) + seg(t, 6.5, 7) * (loop ? 1 - seg(t, 9.3, 10) : 1));
      V.sweat.visible = t > 2.3 && t < 5.0;
      if (V.sweat.visible) V.sweat.position.y = 0.12 - ((t * 0.12) % 0.06);
      idle(V, t, 0); idle(K, t, 1.3);
      // hearts: one at her cheek, then a little burst above the kiss
      popHeart(cheekHeart, 0.33, 1.68, 0.2, (t - 1.6) / 1.2, 0.09);
      hearts.forEach((h, i) => popHeart(h, -0.02 + (i - 2.5) * 0.1, 2.02 + (i % 2) * 0.06, 0.1, (t - 6.9 - i * 0.22) / 2.2, 0.06 + (i % 3) * 0.015));
    }

    function hugStory(t) {
      resetLimbs(V); resetLimbs(K);
      const s = seg(t, 0.4, 1.5);
      V.root.position.x = lerp(-0.45, -0.165, s); K.root.position.x = lerp(0.45, 0.165, s);
      V.root.rotation.y = lerp(0, 1.05, s); K.root.rotation.y = lerp(0, -1.05, s);
      if (t > 0.4 && t < 1.5) { walk(V, t * 9, 0.8); walk(K, t * 9, 0.6); }
      const h = seg(t, 1.3, 2.0);
      // arms wrap around each other
      // arms on the -x side curl toward +x, arms on the +x side toward -x
      [[V.armL, 1], [V.armR, -1], [K.armR, 1], [K.armL, -1]].forEach(([a, inward]) => {
        a.sh.rotation.set(-1.3 * h, 0, inward * (0.45 * h) - inward * 0.08 * (1 - h));
        a.el.rotation.set(0, 0, inward * 1.15 * h);
      });
      V.head.rotation.y = 0.35 * h; K.head.rotation.y = -0.35 * h; V.head.rotation.x = 0.18 * h; K.head.rotation.z = 0.12 * h; V.head.rotation.z = -0.08 * h;
      K.root.position.y = 0.03 * h;
      face(V, { eyes: h > 0.5 ? "closed" : "open", mouth: "smile" }, t, 0.4);
      face(K, { eyes: h > 0.5 ? "closed" : "open", mouth: h > 0.5 ? "big" : "smile" }, t, 1.1);
      setBlush(V, 0.5 * h); setBlush(K, h);
      V.sweat.visible = false;
      idle(V, t, 0); idle(K, t, 1.3);
      cheekHeart.visible = false;
      hearts.forEach((ht, i) => popHeart(ht, (i - 2.5) * 0.11, 2.02 + (i % 2) * 0.06, 0.1, (t - 2.0 - i * 0.25) / 2.4, 0.06 + (i % 3) * 0.015));
    }

    function frame(t) {
      if (mode === "hug") hugStory(Math.min(t / 1.3, 4.6));
      else if (mode === "kiss") kissStory(Math.min(t / 1.4, 9.3), false);
      else kissStory((t / 1.4) % 10, true);
      shadows[0].position.set(V.root.position.x, 0.002, V.root.position.z);
      shadows[1].position.set(K.root.position.x, 0.002, K.root.position.z);
      renderer.render(scene, camera);
    }

    // ---------- lifecycle ----------
    let raf = 0, start = performance.now(), visible = true, alive = true, last = 0;
    function size() {
      const w = Math.max(1, host.clientWidth), h = Math.max(1, Math.round(w * 252 / 260));
      renderer.setSize(w, h, false); canvas.style.width = "100%"; canvas.style.height = "auto"; canvas.style.aspectRatio = "260 / 252";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    function tick(now) {
      raf = 0;
      if (!alive) return;
      if (visible && !document.hidden) {
        if (now - last > 1000 / 61) { last = now; frame(FREEZE != null ? FREEZE : (now - start) / 1000); }
        if (FREEZE == null && !reduceMotion) raf = requestAnimationFrame(tick);
      }
    }
    const kick = () => { if (!raf && alive) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); if (visible) kick(); });
    const ro = new ResizeObserver(() => { size(); if (reduceMotion || FREEZE != null) frame(FREEZE || 0); });
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    size();
    host.appendChild(canvas);
    io.observe(host); ro.observe(host);
    frame(FREEZE != null ? FREEZE : reduceMotion ? (mode === "hug" ? 4.6 : 0) : 0);
    host.classList.add("is-3d");
    kick();

    return {
      dispose() {
        alive = false; if (raf) cancelAnimationFrame(raf);
        io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis);
        disposables.forEach(d => d.dispose && d.dispose());
        renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss();
        canvas.remove(); host.classList.remove("is-3d");
      }
    };
  }

  async function mount(host) {
    if (host.__stage || host.__mounting) return;
    host.__mounting = true;
    try {
      const THREE = await loadThree();
      if (!host.isConnected) return;
      host.__stage = build(THREE, host, host.dataset.stage || "loop");
      stages.add(host);
    } catch (e) {
      host.classList.add("no-3d"); // keep the drawing
    } finally { host.__mounting = false; }
  }

  window.Stage3D = {
    supported: webglOK() && "IntersectionObserver" in window && "ResizeObserver" in window,
    mountAll(root) { if (!this.supported) return; (root || document).querySelectorAll(".stage3d:not(.is-3d)").forEach(mount); },
    disposeIn(root) {
      [...stages].forEach(h => { if (!root || root.contains(h)) { h.__stage && h.__stage.dispose(); h.__stage = null; stages.delete(h); } });
    },
    preload() { if (this.supported) loadThree().catch(() => {}); }
  };
})();
