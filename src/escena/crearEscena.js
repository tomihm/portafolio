import * as T from 'three';

// texto que escribe el monitor cuando el mouse esta sobre un objeto
const comandos = { ferreteria: 'cd ferreteria/', mygos: 'cd mygos/', bibliotecas: 'cd bibliotecas/', contacto: 'cat contacto.txt', lamp: 'lampara --toggle' };
// punto de cada objeto donde se apoya su etiqueta
const anclas = { ferreteria: [0, 0.68, 0], mygos: [0, 0.82, -0.03], contacto: [0, 1.6, 0], bibliotecas: [0, 1.22, 0] };

/**
 * Arma la escena 3D del escritorio dentro de `host`.
 * La escena mueve las etiquetas (elementos del DOM) en cada cuadro; React solo las dibuja.
 * Devuelve un control para avisarle el hover y la seccion activa, y para destruirla.
 */
export function crearEscena(host, { capaEtiquetas, etiquetas, alHover, alElegir }) {
    let hover = null;
    let activo = null;
    let lamparaEncendida = true;
    let muerto = false;
    const mouse = { x: 0, y: 0 };

    const renderer = new T.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.9;
    renderer.outputColorSpace = T.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', display: 'block', zIndex: '0' });
    host.prepend(renderer.domElement);

    const scene = new T.Scene();
    scene.background = new T.Color('#141823');
    scene.fog = new T.Fog('#141823', 10, 20);
    const camera = new T.PerspectiveCamera(36, 1, 0.1, 50);
    const lookAt = new T.Vector3(0.1, 1.12, 0);

    const M = (c, r = 0.6, m = 0, extra = {}) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...extra });
    const mat = {
        wall: M('#262c3b', 0.95), wood: M('#6a4634', 0.5), woodDark: M('#2a1c15', 0.7),
        frame: M('#3a4252', 0.7), plastic: M('#2a303c', 0.45, 0.2), metal: M('#8b9099', 0.35, 0.8),
        red: M('#c8552b', 0.42, 0.1), redDark: M('#a8431f', 0.5, 0.1), cream: M('#e8e2d6', 0.5),
        server: M('#2a3246', 0.5, 0.3), drawer: M('#2a3244', 0.5, 0.3), coffee: M('#2b1a10', 0.2),
        glass: M('#1a2133', 0.2, 0, { emissive: '#141b2c', emissiveIntensity: 0.6 }),
    };
    const add = (parent, geo, m, x = 0, y = 0, z = 0, name) => {
        const mesh = new T.Mesh(geo, m); mesh.position.set(x, y, z);
        mesh.castShadow = mesh.receiveShadow = true; if (name) mesh.name = name;
        parent.add(mesh); return mesh;
    };
    // caja con bordes redondeados
    const rbox = (w, h, d, r) => {
        const s = new T.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r, k = Math.min(r, W / 2, H / 2) * 0.6;
        s.moveTo(x + k, y); s.lineTo(x + W - k, y); s.quadraticCurveTo(x + W, y, x + W, y + k);
        s.lineTo(x + W, y + H - k); s.quadraticCurveTo(x + W, y + H, x + W - k, y + H);
        s.lineTo(x + k, y + H); s.quadraticCurveTo(x, y + H, x, y + H - k);
        s.lineTo(x, y + k); s.quadraticCurveTo(x, y, x + k, y);
        const g = new T.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: 4, curveSegments: 8 });
        g.center(); return g;
    };
    const B = (w, h, d) => new T.BoxGeometry(w, h, d);

    // pieza
    add(scene, new T.PlaneGeometry(24, 12), mat.wall, 0, 3, -1.5);
    const floor = add(scene, new T.PlaneGeometry(24, 12), mat.woodDark, 0, -1.6, 2); floor.rotation.x = -Math.PI / 2;
    add(scene, B(6.6, 0.1, 2.5), mat.wood, 0, -0.05, -0.15, 'desk');
    add(scene, B(6.6, 0.55, 0.06), mat.woodDark, 0, -0.37, 1.07);

    const pm = new T.PMREMGenerator(renderer);
    const envS = new T.Scene(); envS.background = new T.Color('#1a1f2c');
    const envP = (c, x, y, z, s) => { const m = new T.Mesh(new T.PlaneGeometry(s, s), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m); };
    envP('#8fa3ff', -3, 3, 2, 3); envP('#ffc98a', 3, 3, 1, 2.5); envP('#ffffff', 0, 4, 3, 2);
    scene.environment = pm.fromScene(envS, 0.04).texture; scene.environmentIntensity = 0.3;
    add(scene, B(24, 0.14, 0.04), mat.frame, 0, -0.03, -1.47);

    // repisa con libros
    const shelf = new T.Group(); shelf.position.set(1.55, 1.78, -1.3); scene.add(shelf);
    add(shelf, rbox(1.5, 0.04, 0.26, 0.01), mat.wood, 0, 0, 0);
    [[-0.6, '#c8552b', 0.3], [-0.53, '#3b4a6b', 0.34], [-0.46, '#e8e2d6', 0.27], [-0.39, '#556b4f', 0.31], [-0.32, '#3b4a6b', 0.25], [-0.2, '#8b6cff', 0.29], [-0.13, '#e8e2d6', 0.33]].forEach(([x, c, h]) => add(shelf, B(0.06, h, 0.19), M(c, 0.7), x, 0.02 + h / 2, 0));
    const lean = add(shelf, B(0.06, 0.28, 0.19), M('#c8552b', 0.7), -0.02, 0.15, 0); lean.rotation.z = -0.35;
    add(shelf, new T.SphereGeometry(0.07, 32, 16), mat.metal, 0.4, 0.09, 0);

    // planta
    const plant = new T.Group(); plant.position.set(-0.72, 0, -0.75); scene.add(plant);
    add(plant, new T.CylinderGeometry(0.13, 0.1, 0.22, 40), M('#b3573a', 0.8), 0, 0.11, 0);
    add(plant, new T.CylinderGeometry(0.12, 0.12, 0.01, 32), mat.coffee, 0, 0.215, 0);
    const leaf = M('#4f7a56', 0.6);
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, l = add(plant, new T.SphereGeometry(0.11, 24, 12), leaf, Math.cos(a) * 0.1, 0.38 + (i % 3) * 0.08, Math.sin(a) * 0.1); l.scale.set(0.45, 1.3, 0.2); l.rotation.set(Math.sin(a) * 0.6, -a, Math.cos(a) * 0.6); }

    // mouse del escritorio
    const mouseM = add(scene, new T.SphereGeometry(0.06, 32, 16), mat.plastic, 0.8, 0.018, 0.48); mouseM.scale.set(0.95, 0.45, 1.5);

    // ventana con luna
    const win = new T.Group(); win.position.set(-2.35, 1.4, -1.48); scene.add(win);
    add(win, B(1.5, 1.5, 0.02), mat.glass, 0, 0, 0);
    [[0, 0.75, 1.6, 0.08], [0, -0.75, 1.6, 0.08], [0, 0, 1.5, 0.05]].forEach(([x, y, w, h]) => add(win, B(w, h, 0.08), mat.frame, x, y, 0.04));
    [[-0.76, 0, 0.08, 1.58], [0.76, 0, 0.08, 1.58], [0, 0, 0.05, 1.5]].forEach(([x, y, w, h]) => add(win, B(w, h, 0.08), mat.frame, x, y, 0.04));
    const moon = add(win, new T.SphereGeometry(0.11, 32, 16), new T.MeshBasicMaterial({ color: '#e9e3d4' }), 0.4, 0.45, 0.02);
    moon.castShadow = false;
    const stars = new T.Group(); win.add(stars);
    [[-0.5, 0.5], [-0.2, 0.25], [0.5, -0.2], [-0.45, -0.4], [0.2, -0.5], [0.15, 0.6]].forEach(([x, y]) => {
        const s = new T.Mesh(new T.SphereGeometry(0.008, 6, 6), new T.MeshBasicMaterial({ color: '#c9d4ff' })); s.position.set(x, y, 0.015); stars.add(s);
    });

    const clickable = {};
    const reg = (key, g) => { g.userData.key = key; g.userData.baseY = g.position.y; clickable[key] = g; scene.add(g); };

    // caja de herramientas: ferreteria
    const tb = new T.Group(); tb.position.set(-2.15, 0, 0.15); tb.rotation.y = 0.28;
    add(tb, rbox(0.95, 0.36, 0.46, 0.025), mat.red, 0, 0.18, 0);
    add(tb, rbox(0.98, 0.09, 0.49, 0.02), mat.redDark, 0, 0.39, 0);
    add(tb, B(0.11, 0.05, 0.012), mat.cream, 0, 0.3, 0.236);
    [-0.22, 0.22].forEach(x => add(tb, new T.CylinderGeometry(0.016, 0.016, 0.14, 16), mat.metal, x, 0.5, 0));
    const bar = add(tb, new T.CylinderGeometry(0.02, 0.02, 0.48, 16), mat.metal, 0, 0.57, 0); bar.rotation.z = Math.PI / 2;
    reg('ferreteria', tb);

    // celular: mygos
    const ph = new T.Group(); ph.position.set(-1.15, 0, 0.3); ph.rotation.y = 0.18;
    add(ph, rbox(0.3, 0.05, 0.22, 0.015), mat.plastic, 0, 0.025, 0);
    const phBody = new T.Group(); phBody.position.set(0, 0.38, -0.03); phBody.rotation.x = -0.14; ph.add(phBody);
    add(phBody, rbox(0.34, 0.68, 0.045, 0.02), mat.plastic, 0, 0, 0);
    const pc = document.createElement('canvas'); pc.width = 300; pc.height = 600;
    const px = pc.getContext('2d'); px.fillStyle = '#14121f'; px.fillRect(0, 0, 300, 600);
    [['#8b6cff', 70], ['#3b3358', 250], ['#3b3358', 400]].forEach(([c, y], i) => { px.fillStyle = c; px.beginPath(); px.roundRect(40, y, 220, i ? 120 : 150, 18); px.fill(); });
    px.fillStyle = '#ece8e1'; px.font = '500 26px monospace'; px.fillText('mygos', 40, 50);
    const pTex = new T.CanvasTexture(pc); pTex.colorSpace = T.SRGBColorSpace;
    add(phBody, new T.PlaneGeometry(0.3, 0.6), new T.MeshBasicMaterial({ map: pTex, toneMapped: false }), 0, 0, 0.0235).castShadow = false;
    reg('mygos', ph);

    // monitor con terminal: contacto
    const mon = new T.Group(); mon.position.set(0.15, 0, -0.4);
    add(mon, rbox(0.62, 0.035, 0.34, 0.012), mat.plastic, 0, 0.018, 0);
    add(mon, B(0.09, 0.45, 0.05), mat.plastic, 0, 0.25, -0.06);
    add(mon, rbox(1.72, 1.06, 0.07, 0.03), mat.plastic, 0, 0.98, 0);
    const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 600;
    const tx = tc.getContext('2d');
    const tTex = new T.CanvasTexture(tc); tTex.colorSpace = T.SRGBColorSpace; tTex.anisotropy = 8;
    let cursorOn = true;
    const drawTerm = () => {
        tx.fillStyle = '#08090c'; tx.fillRect(0, 0, 1024, 600);
        tx.font = '500 34px "IBM Plex Mono", monospace';
        const P = 'tomas@portafolio:~$ ';
        const rows = [[P, 'whoami'], ['', 'web · móvil · backend'], null, [P, 'ls'], ['', 'ferreteria/  mygos/'], ['', 'bibliotecas/  contacto.txt'], null, [P, (comandos[hover] || '')]];
        let y = 92;
        rows.forEach((r, i) => {
            if (r) {
                tx.fillStyle = '#f2a44b'; tx.fillText(r[0], 60, y);
                const w = tx.measureText(r[0]).width;
                tx.fillStyle = '#ece8e1'; tx.fillText(r[1], 60 + w, y);
                if (i === rows.length - 1 && cursorOn) { tx.fillRect(60 + w + tx.measureText(r[1]).width + 4, y - 30, 20, 38); }
            }
            y += r ? 58 : 34;
        });
        tx.fillStyle = 'rgba(255,255,255,0.025)'; for (let s = 0; s < 600; s += 4) tx.fillRect(0, s, 1024, 1);
        tTex.needsUpdate = true;
    };
    drawTerm();
    const parpadeo = setInterval(() => { cursorOn = !cursorOn; drawTerm(); }, 530);
    add(mon, new T.PlaneGeometry(1.6, 0.94), new T.MeshBasicMaterial({ map: tTex, toneMapped: false }), 0, 0.98, 0.0355).castShadow = false;
    reg('contacto', mon);
    const glow = new T.PointLight('#9fb2ff', 4, 4.5, 1.2); glow.position.set(0.15, 0.95, 0.4); scene.add(glow);

    // teclado
    const kb = new T.Group(); kb.position.set(0.15, 0, 0.42); scene.add(kb);
    add(kb, rbox(1.0, 0.03, 0.32, 0.01), mat.plastic, 0, 0.015, 0);
    const keyGeo = B(0.052, 0.014, 0.05), keyMat = M('#272c37', 0.6);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) add(kb, keyGeo, keyMat, -0.442 + c * 0.068, 0.036, -0.1 + r * 0.068);

    // taza
    const mug = new T.Group(); mug.position.set(1.12, 0, 0.5); scene.add(mug);
    add(mug, new T.CylinderGeometry(0.09, 0.085, 0.2, 40), mat.cream, 0, 0.1, 0);
    add(mug, new T.CylinderGeometry(0.078, 0.078, 0.005, 32), mat.coffee, 0, 0.195, 0);
    add(mug, new T.TorusGeometry(0.052, 0.014, 12, 28), mat.cream, 0.1, 0.1, 0);

    // servidor: bibliotecas
    const sv = new T.Group(); sv.position.set(1.75, 0, -0.25); sv.rotation.y = -0.12;
    add(sv, rbox(0.76, 1.12, 0.6, 0.03), mat.server, 0, 0.56, 0);
    const leds = [];
    for (let i = 0; i < 4; i++) {
        const y = 0.2 + i * 0.25;
        add(sv, rbox(0.64, 0.2, 0.02, 0.006), mat.drawer, 0, y, 0.3);
        [-0.24, -0.18].forEach((x, j) => {
            const amber = i === 2 && j === 1;
            const lm = new T.MeshStandardMaterial({ color: '#111', emissive: amber ? '#f2a44b' : '#4ade80', emissiveIntensity: 2 });
            const l = add(sv, new T.SphereGeometry(0.017, 16, 8), lm, x, y, 0.315); l.castShadow = false;
            leds.push({ m: lm, ph: Math.random() * 10, sp: 2 + Math.random() * 6 });
        });
        add(sv, B(0.26, 0.012, 0.004), M('#4a5468', 0.5), 0.1, y, 0.312);
    }
    reg('bibliotecas', sv);

    // lampara (se prende y apaga con un clic)
    const lamp = new T.Group(); lamp.position.set(2.95, 0, 0.1);
    add(lamp, new T.CylinderGeometry(0.15, 0.17, 0.04, 40), mat.plastic, 0, 0.02, 0);
    const p1 = new T.Group(); p1.position.y = 0.04; p1.rotation.z = 0.22; lamp.add(p1);
    add(p1, new T.CylinderGeometry(0.016, 0.016, 1.0, 16), mat.metal, 0, 0.5, 0);
    add(p1, new T.SphereGeometry(0.03, 16, 12), mat.metal, 0, 1.0, 0);
    const p2 = new T.Group(); p2.position.y = 1.0; p2.rotation.z = 0.75; p1.add(p2);
    add(p2, new T.CylinderGeometry(0.014, 0.014, 0.55, 16), mat.metal, 0, 0.275, 0);
    const tip = new T.Object3D(); tip.position.y = 0.55; p2.add(tip);
    scene.add(lamp); lamp.updateMatrixWorld(true);
    const P = new T.Vector3(); tip.getWorldPosition(P);
    const target = new T.Vector3(1.1, 0.0, 0.45);
    const dir = target.clone().sub(P).normalize();
    const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, -1, 0), dir);
    const shade = new T.Group(); shade.position.copy(lamp.worldToLocal(P.clone())); lamp.add(shade);
    const wq = lamp.getWorldQuaternion(new T.Quaternion()).invert().multiply(q); shade.quaternion.copy(wq);
    const shadeGeo = new T.ConeGeometry(0.17, 0.24, 40, 1, true); shadeGeo.translate(0, -0.06, 0);
    add(shade, shadeGeo, new T.MeshStandardMaterial({ color: '#d9d2c3', roughness: 0.4, metalness: 0.3, side: T.DoubleSide }), 0, 0, 0).castShadow = false;
    const bulbMat = new T.MeshBasicMaterial({ color: '#ffd9a0' });
    add(shade, new T.SphereGeometry(0.05, 20, 12), bulbMat, 0, -0.13, 0).castShadow = false;
    const beamGeo = new T.ConeGeometry(0.62, 1.3, 48, 1, true); beamGeo.translate(0, -0.65, 0);
    const beamMat = new T.MeshBasicMaterial({ color: '#ffcf8a', transparent: true, opacity: 0.05, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, fog: false });
    const beam = new T.Mesh(beamGeo, beamMat); beam.position.y = -0.1; shade.add(beam);
    reg('lamp', lamp);

    const spot = new T.SpotLight('#ffbf78', 75, 9, 0.95, 0.75, 1.2);
    spot.position.copy(P).addScaledVector(dir, 0.12); spot.target.position.copy(target);
    spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0005; spot.shadow.radius = 4;
    scene.add(spot, spot.target);
    const fill = new T.PointLight('#ffa860', 6, 6, 1.3); fill.position.set(1.6, 1.5, 0.9); scene.add(fill);

    // polvo en la luz de la lampara
    const dN = 140, dPos = new Float32Array(dN * 3), dSeed = [];
    for (let i = 0; i < dN; i++) { dSeed.push([1.2 + Math.random() * 1.3, Math.random() * 1.4, -0.2 + Math.random() * 0.9, Math.random() * 6]); }
    const dGeo = new T.BufferGeometry(); dGeo.setAttribute('position', new T.BufferAttribute(dPos, 3));
    const dMat = new T.PointsMaterial({ color: '#ffd9a0', size: 0.012, transparent: true, opacity: 0.7, depthWrite: false, blending: T.AdditiveBlending });
    scene.add(new T.Points(dGeo, dMat));

    // brillo bajo el objeto con hover
    const gc = document.createElement('canvas'); gc.width = gc.height = 128; const gx = gc.getContext('2d');
    const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(242,164,75,0.55)'); gr.addColorStop(1, 'rgba(242,164,75,0)');
    gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
    const ringMat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(gc), transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending });
    const ring = new T.Mesh(new T.PlaneGeometry(1.3, 1.3), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.003; scene.add(ring);

    // guirnalda de luces
    const gPts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, x = -3.4 + u * 6.8; gPts.push(new T.Vector3(x, 2.75 - Math.sin(u * Math.PI * 3) ** 2 * 0.28 - Math.sin(u * Math.PI) * 0.12, -1.42)); }
    const gCurve = new T.CatmullRomCurve3(gPts);
    scene.add(new T.Mesh(new T.TubeGeometry(gCurve, 160, 0.005, 6), M('#0c0d10', 0.8)));
    const bulbs = [];
    for (let i = 0; i < 22; i++) {
        const p = gCurve.getPoint((i + 0.5) / 22);
        const bm = new T.MeshBasicMaterial({ color: '#ffcf8a', fog: false });
        const b = new T.Mesh(new T.SphereGeometry(0.028, 14, 10), bm); b.position.copy(p).add(new T.Vector3(0, -0.035, 0.01)); b.scale.y = 1.3; scene.add(b);
        bulbs.push({ m: bm, ph: Math.random() * 6 });
    }
    const gc2 = document.createElement('canvas'); gc2.width = gc2.height = 64; const g2 = gc2.getContext('2d');
    const r2 = g2.createRadialGradient(32, 32, 0, 32, 32, 32); r2.addColorStop(0, 'rgba(255,200,130,0.9)'); r2.addColorStop(0.3, 'rgba(255,180,110,0.25)'); r2.addColorStop(1, 'rgba(255,180,110,0)');
    g2.fillStyle = r2; g2.fillRect(0, 0, 64, 64);
    const haloTex = new T.CanvasTexture(gc2);
    bulbs.forEach((b, i) => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false })); s.scale.set(0.32, 0.32, 1); s.position.copy(gCurve.getPoint((i + 0.5) / 22)).add(new T.Vector3(0, -0.035, 0.03)); scene.add(s); b.s = s; });
    [-2.2, 0, 2.2].forEach(x => { const l = new T.PointLight('#ffb470', 1.2, 2.6, 1.5); l.position.set(x, 2.45, -1.2); scene.add(l); });

    // afiche
    const pcv = document.createElement('canvas'); pcv.width = 400; pcv.height = 560; const pg = pcv.getContext('2d');
    pg.fillStyle = '#e8e2d6'; pg.fillRect(0, 0, 400, 560);
    pg.fillStyle = '#c8552b'; pg.beginPath(); pg.arc(200, 230, 120, 0, Math.PI * 2); pg.fill();
    pg.fillStyle = '#1e2330'; pg.fillRect(40, 230, 320, 6);
    pg.font = '500 64px "IBM Plex Mono", monospace'; pg.textAlign = 'center'; pg.fillStyle = '#1e2330'; pg.fillText('{ }', 200, 252);
    pg.font = '500 22px "IBM Plex Mono", monospace'; pg.fillText('BUILD · SHIP · REPEAT', 200, 470);
    const posterTex = new T.CanvasTexture(pcv); posterTex.colorSpace = T.SRGBColorSpace;
    const poster = new T.Group(); poster.position.set(-0.75, 1.85, -1.47); poster.rotation.z = 0.015; scene.add(poster);
    add(poster, B(0.62, 0.84, 0.03), mat.woodDark, 0, 0, 0);
    add(poster, new T.PlaneGeometry(0.54, 0.76), new T.MeshStandardMaterial({ map: posterTex, roughness: 0.8 }), 0, 0, 0.016).castShadow = false;

    // vapor de la taza
    const steam = [];
    for (let i = 0; i < 7; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false })); scene.add(s); steam.push({ s, ph: i / 7 }); }

    // luz general
    scene.add(new T.HemisphereLight('#3c4466', '#3a2414', 1.1));
    const moonL = new T.DirectionalLight('#8c9ed6', 0.9);
    moonL.position.set(-3, 4, 3); moonL.castShadow = true; moonL.shadow.mapSize.set(1024, 1024);
    Object.assign(moonL.shadow.camera, { left: -4, right: 4, top: 3, bottom: -2 });
    scene.add(moonL);

    // interaccion: que objeto esta bajo el mouse
    const ray = new T.Raycaster(), ndc = new T.Vector2();
    const list = Object.values(clickable);
    const pick = e => {
        const r = host.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(list, true)[0];
        let o = hit && hit.object; while (o && !o.userData.key) o = o.parent;
        return o ? o.userData.key : null;
    };
    const cambiarHover = k => { if (k !== hover) { hover = k; drawTerm(); alHover(k); } };
    renderer.domElement.addEventListener('pointermove', e => {
        const k = pick(e);
        cambiarHover(k);
        renderer.domElement.style.cursor = k ? 'pointer' : 'default';
    });
    renderer.domElement.addEventListener('pointerleave', () => cambiarHover(null));
    renderer.domElement.addEventListener('click', e => {
        const k = pick(e);
        if (k === 'lamp') lamparaEncendida = !lamparaEncendida;
        else if (k) alElegir(k);
    });
    const onWinMove = e => {
        const r = host.getBoundingClientRect();
        mouse.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        mouse.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener('pointermove', onWinMove);

    let W = 1, H = 1, baseZ = 5.2;
    const resize = () => {
        W = host.clientWidth; H = host.clientHeight;
        renderer.setSize(W, H, false);
        renderer.domElement.style.width = W + 'px'; renderer.domElement.style.height = H + 'px';
        const a = W / H; camera.aspect = a;
        // en pantallas angostas la camara se aleja para que entre todo el escritorio
        baseZ = a < 1.9 ? 6.3 * Math.min(2.3, 1.9 / a) : 6.3;
        camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(host); resize();

    const v = new T.Vector3(), cam = { x: 0, y: 0 }; let panX = 0;
    let lampLvl = 1;
    let raf;
    const t0 = performance.now();
    const loop = () => {
        if (muerto) return;
        raf = requestAnimationFrame(loop);
        const t = (performance.now() - t0) / 1000;
        const intro = 1 - Math.pow(1 - Math.min(1, t / 1.8), 3);
        cam.x += (mouse.x * 0.7 + Math.sin(t * 0.25) * 0.15 - cam.x) * 0.05;
        cam.y += (-mouse.y * 0.25 - cam.y) * 0.05;
        camera.position.set(cam.x + (1 - intro) * -1.2, 1.75 + cam.y + (1 - intro) * 0.8, baseZ + (1 - intro) * 2.5);
        // con el panel abierto la camara se corre para dejar la escena a la izquierda
        const open = activo && W > 760 ? 1.25 : 0; panX += (open - panX) * 0.06;
        camera.position.x += panX; lookAt.x = 0.1 + panX; camera.lookAt(lookAt);

        list.forEach(g => {
            const up = g.userData.key === hover ? 0.07 : 0;
            g.position.y += (g.userData.baseY + up - g.position.y) * 0.15;
        });
        bulbs.forEach(b => { const k = 0.85 + Math.sin(t * 1.3 + b.ph) * 0.15; b.m.color.setRGB(k, 0.81 * k, 0.54 * k); b.s.material.opacity = k; });
        steam.forEach(o => { const u = (t * 0.22 + o.ph) % 1; o.s.position.set(1.12 + Math.sin(u * 7 + o.ph * 9) * 0.04, 0.24 + u * 0.5, 0.5); const sc = 0.08 + u * 0.18; o.s.scale.set(sc, sc, 1); o.s.material.opacity = Math.sin(u * Math.PI) * 0.12; });
        const hg = hover && clickable[hover];
        if (hg) { ring.position.x += (hg.position.x - ring.position.x) * 0.2; ring.position.z += (hg.position.z + 0.1 - ring.position.z) * 0.2; }
        ringMat.opacity += ((hg ? 1 : 0) - ringMat.opacity) * 0.12;
        dSeed.forEach((s, i) => { dPos[i * 3] = s[0] + Math.sin(t * 0.2 + s[3]) * 0.08; dPos[i * 3 + 1] = (s[1] + t * 0.03) % 1.4; dPos[i * 3 + 2] = s[2] + Math.cos(t * 0.17 + s[3]) * 0.08; });
        dGeo.attributes.position.needsUpdate = true; dMat.opacity = 0.7 * lampLvl;
        leds.forEach(l => { l.m.emissiveIntensity = Math.sin(t * l.sp + l.ph) > -0.6 ? 2.2 : 0.2; });

        lampLvl += ((lamparaEncendida ? 1 : 0) - lampLvl) * 0.12;
        spot.intensity = 75 * lampLvl; fill.intensity = 6 * lampLvl; beamMat.opacity = 0.07 * lampLvl;
        bulbMat.color.setRGB(0.25 + 0.75 * lampLvl, 0.22 + 0.63 * lampLvl, 0.2 + 0.43 * lampLvl);

        // las etiquetas aparecen despues de la intro y siguen a su objeto
        capaEtiquetas.style.opacity = Math.min(1, Math.max(0, (t - 1.2) * 2));
        Object.entries(anclas).forEach(([k, a]) => {
            const el = etiquetas[k];
            if (!el) return;
            v.set(a[0], a[1], a[2]).applyMatrix4(clickable[k].matrixWorld).project(camera);
            el.style.transform = `translate(${(v.x * 0.5 + 0.5) * W}px, ${(-v.y * 0.5 + 0.5) * H}px) translate(-50%, -100%)`;
        });
        renderer.render(scene, camera);
    };
    loop();

    return {
        setHover(k) { if (k !== hover) { hover = k; drawTerm(); } },
        setActivo(k) { activo = k; },
        destruir() {
            muerto = true;
            cancelAnimationFrame(raf);
            clearInterval(parpadeo);
            ro.disconnect();
            window.removeEventListener('pointermove', onWinMove);
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
