/* =====================================================================
   LANCES Productions — script du site (lancesproductions.com)
   Aucune dépendance, aucune ressource externe, aucun traceur.
   ===================================================================== */
(() => {
'use strict';

/* =========================================================
   0. RÉGLAGES À TENIR À JOUR (la seule partie que l'on modifie)
   ========================================================= */
const LIENS = {
  instagram: 'https://www.instagram.com/lancesproductions/',
  tiktok: 'https://www.tiktok.com/@lancesproductions',
  youtube: 'https://www.youtube.com/@lancesproductions',
  email: 'kevinmazin.pro@gmail.com',
  telephone: '+33698591995',
  /* Page de réservation Google Agenda (appel de 20 min). Vide : les boutons
     « Réserver un appel » ouvrent un e-mail pré-rempli à la place. */
  rdv: '',
  /* Liens de paiement Stripe, par formule. Laissés vides (avis juridique du
     26/10/2026) : les boutons « Commander » mènent à la prise de rendez-vous.
     Ne les remplir qu'après la décision de Kevin et les précautions listées
     dans organisation/site.md (dépôt du copilote). */
  paiement: { pilote: '', pack4: '', pack6: '', pack8: '' }
};
/* Tarif de lancement : places et date de fin (CGV art. 2, devis 3). */
const PILOTE = {
  placesTotal: 3,
  placesRestantes: 3,
  majPlaces: '2026-10-27',
  fin: '2026-11-23T23:59:59+01:00'
};

/* =========================================================
   1. Outils
   ========================================================= */
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointeurFin = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const borne = (v, a, b) => Math.min(b, Math.max(a, v));
const vers = (a, b, t) => a + (b - a) * t;
const sortie = t => 1 - Math.pow(1 - t, 4);
const nombre = n => Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ');
const deux = n => String(n).padStart(2, '0');
const dateFr = iso => { const [a, m, j] = iso.split('-'); return `${j}/${m}/${a}`; };
if (!pointeurFin) document.documentElement.classList.add('tactile');

/* =========================================================
   2. Les liens de sortie (Instagram, rendez-vous, e-mail, paiement)
   ========================================================= */
function lienMail(sujet, corps) {
  return `mailto:${LIENS.email}?subject=${encodeURIComponent(sujet)}` + (corps ? `&body=${encodeURIComponent(corps)}` : '');
}
const MAIL_RDV = lienMail('Appel de 30 min · LANCES Productions', 'Bonjour Kevin,\n\nJe suis [prénom, activité, ville].\nMes disponibilités pour un appel de 30 min : [deux créneaux].\nMon compte Instagram ou mon site : [lien].\n\nMerci.');
function externe(a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
function poseLiens() {
  $$('[data-lien]').forEach(a => {
    const k = a.dataset.lien;
    if (k === 'rdv') {
      if (LIENS.rdv) { a.href = LIENS.rdv; externe(a); } else { a.href = MAIL_RDV; }
    } else if (k === 'email') { a.href = `mailto:${LIENS.email}`; a.textContent = a.textContent.trim() || LIENS.email; }
    else if (k === 'telephone') { a.href = `tel:${LIENS.telephone}`; }
    else if (LIENS[k]) { a.href = LIENS[k]; externe(a); }
  });
  /* Boutons des formules : paiement si un lien existe, sinon rendez-vous */
  $$('[data-paiement]').forEach(a => {
    const url = LIENS.paiement[a.dataset.paiement];
    const aussi = a.parentElement.querySelector('.aussi');
    if (url) {
      a.href = url; externe(a);
      a.textContent = a.dataset.textePaiement || 'Commander';
      if (aussi) aussi.hidden = false;
    } else {
      a.href = LIENS.rdv || MAIL_RDV; if (LIENS.rdv) externe(a);
      a.textContent = a.dataset.texteRdv || 'Réserver un appel';
      if (aussi) aussi.hidden = true;
    }
  });
  $$('[data-lien-note]').forEach(p => { p.textContent = LIENS.rdv ? p.dataset.lienNote : p.dataset.lienNoteMail; });
}
poseLiens();

/* =========================================================
   3. Le symbole cadre et lance (géométrie de la charte, repère 400)
   ========================================================= */
const CADRE = 'M 20 288.57 L 334.29 288.57 L 334.29 153.07 L 313.71 164.71 L 313.71 268 L 40.57 268 L 40.57 159.43 L 227.05 159.43 L 277.13 138.86 L 20 138.86 Z';
const LANCE = 'M 40.57 250.86 L 40.57 268 L 103.43 268 L 380 111.43 Z';
const VARIANTES = {
  rouge: { stops: [[0, '#8E1A08'], [.22, '#C42800'], [.52, '#F0562A'], [.84, '#FF8A1C'], [1, '#FFC53D']], halo: '#F0562A', pointe: '#FFE6B3' },
  blanc: { stops: [[0, '#B9B09F'], [.3, '#E2D9C8'], [.66, '#F2EBDD'], [1, '#FFFFFF']], halo: '#F2EBDD', pointe: '#FFFFFF' }
};
const TRANCHES = [{ y: 170, h: 4.2, dx: -4.5 }, { y: 205.5, h: 2.6, dx: 3.2 }, { y: 241, h: 5, dx: -2.6 }];
let uid = 0;

function symbole(nom, plat) {
  const v = VARIANTES[nom] || VARIANTES.rouge;
  const p = 's' + (++uid);
  const stops = v.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  if (plat) {
    return `<svg viewBox="14 104 372 190" aria-hidden="true" focusable="false"><defs><linearGradient id="${p}l" gradientUnits="userSpaceOnUse" x1="40" y1="268" x2="380" y2="111">${stops}</linearGradient></defs><path d="${CADRE}" fill="#222A33" stroke="#4E5A66" stroke-width="3" stroke-linejoin="round"/><path d="${LANCE}" fill="url(#${p}l)"/></svg>`;
  }
  const trous = TRANCHES.map(t => `<rect x="0" y="${t.y}" width="400" height="${t.h}" fill="#000"/>`).join('');
  const clips = TRANCHES.map((t, i) => `<clipPath id="${p}b${i}"><rect x="0" y="${t.y}" width="400" height="${t.h}"/></clipPath>`).join('');
  const tranches = TRANCHES.map((t, i) => `<g clip-path="url(#${p}b${i})"><g class="s-tranche" data-dx="${t.dx}" transform="translate(${t.dx} 0)"><path d="${CADRE}" fill="url(#${p}c)"/><path d="${CADRE}" fill="url(#${p}t)"/></g></g>`).join('');
  return `<svg class="symbole" viewBox="0 86 400 224" overflow="visible" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="${p}l" gradientUnits="userSpaceOnUse" x1="40" y1="268" x2="380" y2="111">${stops}</linearGradient>
<linearGradient id="${p}c" gradientUnits="userSpaceOnUse" x1="60" y1="300" x2="320" y2="120"><stop offset="0" stop-color="#040506"/><stop offset=".55" stop-color="#0C0E11"/><stop offset="1" stop-color="#1C2229"/></linearGradient>
<linearGradient id="${p}a" gradientUnits="userSpaceOnUse" x1="20" y1="290" x2="335" y2="139"><stop offset="0" stop-color="#3A4551"/><stop offset=".55" stop-color="#93A2AF"/><stop offset="1" stop-color="#46525E"/></linearGradient>
<pattern id="${p}t" patternUnits="userSpaceOnUse" width="8" height="2.7"><rect width="8" height=".95" fill="#3F4B58" fill-opacity=".5"/></pattern>
<linearGradient id="${p}e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6E6" stop-opacity="0"/><stop offset=".5" stop-color="#FFF6E6" stop-opacity=".95"/><stop offset="1" stop-color="#FFF6E6" stop-opacity="0"/></linearGradient>
<radialGradient id="${p}p"><stop offset="0" stop-color="${v.pointe}"/><stop offset=".3" stop-color="${v.halo}" stop-opacity=".6"/><stop offset="1" stop-color="${v.halo}" stop-opacity="0"/></radialGradient>
<filter id="${p}f" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
<mask id="${p}m" maskUnits="userSpaceOnUse" x="0" y="80" width="400" height="240"><rect x="0" y="80" width="400" height="240" fill="#fff"/>${trous}</mask>
<mask id="${p}ml" maskUnits="userSpaceOnUse" x="0" y="80" width="400" height="240"><path d="${LANCE}" fill="#fff"/></mask>
${clips}
</defs>
<g class="s-ecran">
  <g mask="url(#${p}m)"><path d="${CADRE}" fill="url(#${p}c)"/><path d="${CADRE}" fill="url(#${p}t)"/></g>
  ${tranches}
  <path class="s-flash" d="${CADRE}" fill="#EEF4FA"/>
</g>
<path class="s-arete" d="${CADRE}" fill="none" stroke="url(#${p}a)" stroke-width="1.25" stroke-linejoin="round" pathLength="1"/>
<g class="s-lance">
  <path class="s-halo" d="${LANCE}" fill="${v.halo}" filter="url(#${p}f)" opacity=".55"/>
  <path d="${LANCE}" fill="url(#${p}l)"/>
  <path d="${LANCE}" fill="none" stroke="#FFEBC8" stroke-opacity=".35" stroke-width=".7" stroke-linejoin="round"/>
  <g mask="url(#${p}ml)"><g transform="skewX(-28)"><rect class="s-eclat" x="-60" y="90" width="64" height="230" fill="url(#${p}e)"/></g></g>
</g>
<circle class="s-tete" cx="40" cy="262" r="17" fill="url(#${p}p)"/>
<circle class="s-pointe" cx="380" cy="111.43" r="24" fill="url(#${p}p)"/>
</svg>`;
}

$$('[data-symbole]').forEach(h => {
  const nom = h.dataset.symbole;
  h.innerHTML = symbole(nom === 'plat' ? 'rouge' : nom, nom === 'plat');
  if (h.hasAttribute('data-intro') && !reduit) h.firstElementChild.classList.add('intro');
});
$$('[data-mini-lance]').forEach(s => {
  s.innerHTML = `<defs><linearGradient id="ml${++uid}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8E1A08"/><stop offset=".6" stop-color="#F0562A"/><stop offset="1" stop-color="#FFC53D"/></linearGradient></defs><path d="M2 15 L2 21 L14 21 L58 2 Z" fill="url(#ml${uid})"/>`;
});

/* Glitch télé : les tranches du cadre sautent de temps en temps */
function glitch(svg) {
  const tr = $$('.s-tranche', svg);
  if (!tr.length) return;
  let n = 0;
  const saut = () => {
    tr.forEach(t => t.setAttribute('transform', `translate(${(Math.random() * 2 - 1) * 9} 0)`));
    if (++n < 3) setTimeout(saut, 50 + Math.random() * 60);
    else setTimeout(() => tr.forEach(t => t.setAttribute('transform', `translate(${t.dataset.dx} 0)`)), 70);
  };
  saut();
}
const svgHero = $('#scene-hero svg');
if (!reduit && svgHero) {
  setTimeout(() => glitch(svgHero), 1000);
  const boucle = () => { if (!document.hidden) glitch(svgHero); setTimeout(boucle, 5200 + Math.random() * 4800); };
  setTimeout(boucle, 4200);
}

/* =========================================================
   4. Champ de lances (canvas) : traits de lumière dans l'axe de la lance
   ========================================================= */
const ANGLE = Math.atan2(-156.57, 339.43);
class Champ {
  constructor(canvas, o) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.o = Object.assign({ couleurs: [[226, 232, 238], [240, 86, 42], [255, 197, 61]], poids: [.8, .95], densite: 1, source: null, force: 1, lueur: '242,235,221', lueurA: .07 }, o);
    this.d = { x: Math.cos(ANGLE), y: Math.sin(ANGLE) };
    this.ptr = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, k: 0, actif: 0 };
    this.traits = []; this.vu = true; this.elanV = 1; this.raf = 0;
    this.tick = this.tick.bind(this);
    this.taille();
    new ResizeObserver(() => this.taille()).observe(canvas);
    new IntersectionObserver(e => { this.vu = e[0].isIntersecting; this.relance(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => this.relance());
    const zone = canvas.parentElement;
    zone.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.ptr.tx = e.clientX - r.left; this.ptr.ty = e.clientY - r.top; this.ptr.actif = 1;
      if (this.ptr.x < -9e3) { this.ptr.x = this.ptr.tx; this.ptr.y = this.ptr.ty; }
    }, { passive: true });
    zone.addEventListener('pointerleave', () => { this.ptr.actif = 0; });
    this.relance();
  }
  taille() {
    const r = this.c.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width; this.h = r.height;
    this.c.width = Math.round(r.width * dpr); this.c.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(borne(this.w * this.h / 10500, 40, 150) * this.o.densite);
    while (this.traits.length < n) this.traits.push(this.nouveau({}, true));
    this.traits.length = n;
    if (this.o.source) this.src = this.o.source(r);
    if (reduit) this.dessine(0);
  }
  nouveau(s, debut) {
    const z = .14 + .86 * Math.pow(Math.random(), 1.7);
    s.z = z; s.len = 24 + 240 * z * (.35 + Math.random() * .65); s.v = 12 + 160 * z;
    s.a = .03 + .34 * Math.pow(z, 1.5); s.lw = .4 + 1.35 * z;
    const k = Math.random(); s.col = k < this.o.poids[0] ? 0 : k < this.o.poids[1] ? 1 : 2;
    if (debut) { s.x = Math.random() * this.w * 1.3 - this.w * .15; s.y = Math.random() * this.h * 1.3; }
    else {
      const p = Math.random() * (this.w + this.h);
      if (p < this.w) { s.x = p - this.h * .35; s.y = this.h + s.len * .5; }
      else { s.x = -s.len * .6; s.y = (p - this.w) * 1.1 + this.h * .05; }
    }
    return s;
  }
  elan(f) { this.elanV = f; }
  relance() {
    if (reduit) return;
    if (this.vu && !document.hidden && !this.raf) { this.dernier = performance.now(); this.raf = requestAnimationFrame(this.tick); }
  }
  tick(t) {
    this.raf = 0;
    if (!this.vu || document.hidden) return;
    const dt = Math.min(.05, (t - this.dernier) / 1000); this.dernier = t;
    this.dessine(dt);
    this.raf = requestAnimationFrame(this.tick);
  }
  dessine(dt) {
    const { ctx, w, h, d, ptr } = this;
    ctx.clearRect(0, 0, w, h);
    ptr.x = vers(ptr.x, ptr.tx, .1); ptr.y = vers(ptr.y, ptr.ty, .1); ptr.k = vers(ptr.k, ptr.actif, .05);
    this.elanV = vers(this.elanV, 1, .025);
    const s0 = this.src;
    if (s0) {
      const g = ctx.createRadialGradient(s0.x, s0.y, 0, s0.x, s0.y, s0.r);
      g.addColorStop(0, `rgba(${s0.c},${s0.a})`); g.addColorStop(1, `rgba(${s0.c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    if (ptr.k > .01) {
      const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 320);
      g.addColorStop(0, `rgba(${this.o.lueur},${this.o.lueurA * ptr.k})`); g.addColorStop(1, `rgba(${this.o.lueur},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const vit = this.elanV * this.o.force;
    for (const s of this.traits) {
      s.x += d.x * s.v * dt * vit; s.y += d.y * s.v * dt * vit;
      const qx = s.x - d.x * s.len, qy = s.y - d.y * s.len;
      if (qx > w + 10 || qy < -10) { this.nouveau(s, false); continue; }
      let a = s.a;
      const dist = Math.hypot(s.x - ptr.x, s.y - ptr.y);
      if (dist < 260) a *= 1 + 2.4 * (1 - dist / 260) * ptr.k;
      const [r, g, b] = this.o.couleurs[s.col];
      const gr = ctx.createLinearGradient(qx, qy, s.x, s.y);
      gr.addColorStop(0, `rgba(${r},${g},${b},0)`); gr.addColorStop(1, `rgba(${r},${g},${b},${Math.min(1, a)})`);
      ctx.strokeStyle = gr; ctx.lineWidth = s.lw;
      ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(s.x, s.y); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

const sourceHero = rc => {
  const svg = $('#scene-hero svg');
  if (!svg) return null;
  const r = svg.getBoundingClientRect();
  return { x: r.left - rc.left + (380 / 400) * r.width, y: r.top - rc.top + ((111.43 - 86) / 224) * r.height, r: Math.max(rc.width, rc.height) * .5, c: '240,86,42', a: .13 };
};
const champHero = $('#champ-hero') ? new Champ($('#champ-hero'), { source: sourceHero, lueur: '110,146,166', lueurA: .09 }) : null;
if (champHero && !reduit) setTimeout(() => champHero.elan(5.5), 1150);
const champFin = $('#champ-fin') ? new Champ($('#champ-fin'), { couleurs: [[242, 235, 221], [255, 255, 255], [167, 179, 191]], poids: [.62, .82], densite: .8, force: .8, source: rc => ({ x: rc.width / 2, y: rc.height * .22, r: rc.width * .45, c: '242,235,221', a: .06 }) }) : null;

/* Inclinaison du symbole sous le pointeur */
const scene = $('#scene-hero');
const incl = { x: 0, y: 0, tx: 0, ty: 0 };
if (scene && pointeurFin && !reduit) {
  $('.hero').addEventListener('pointermove', e => {
    incl.tx = (e.clientX / innerWidth - .5) * 16; incl.ty = -(e.clientY / innerHeight - .5) * 11;
  }, { passive: true });
  $('.hero').addEventListener('pointerleave', () => { incl.tx = 0; incl.ty = 0; });
}

/* Projecteur pétrole : part du haut, s'incline vers le pointeur (héros seulement) */
const proj = $('#projecteur'), hero = $('.hero');
const PROJ_REPOS = { ox: .74, ix: .62, iy: .48, k: .55 };
const pj = Object.assign({}, PROJ_REPOS), pjCible = Object.assign({}, PROJ_REPOS);
let heroVu = true, heroW = 1, heroH = 1;
if (proj && hero && pointeurFin && !reduit) {
  new IntersectionObserver(e => { heroVu = e[0].isIntersecting; }).observe(hero);
  new ResizeObserver(e => { heroW = e[0].contentRect.width || 1; heroH = e[0].contentRect.height || 1; }).observe(hero);
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const mx = borne((e.clientX - r.left) / r.width, 0, 1), my = borne((e.clientY - r.top) / r.height, 0, 1);
    Object.assign(pjCible, { ix: mx, iy: my, ox: PROJ_REPOS.ox + (mx - PROJ_REPOS.ix) * .25, k: .95 });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => Object.assign(pjCible, PROJ_REPOS));
}
function majProjecteur() {
  if (!proj || !pointeurFin || reduit || !heroVu) return;
  Object.keys(pj).forEach(c => { pj[c] = vers(pj[c], pjCible[c], .08); });
  const ang = borne(-Math.atan2((pj.ix - pj.ox) * heroW, pj.iy * heroH + 40) * 180 / Math.PI, -45, 45);
  proj.style.setProperty('--ox', (pj.ox * 100).toFixed(2) + '%');
  proj.style.setProperty('--ix', (pj.ix * 100).toFixed(2) + '%');
  proj.style.setProperty('--iy', (pj.iy * 100).toFixed(2) + '%');
  proj.style.setProperty('--ang', ang.toFixed(2) + 'deg');
  proj.style.setProperty('--k', pj.k.toFixed(3));
}

/* =========================================================
   5. Viseur : timecode
   ========================================================= */
const tc = $('#timecode');
const debut = performance.now();
const formatTc = s => { const f = Math.floor((s % 1) * 25), t = Math.floor(s); return `${deux(Math.floor(t / 3600))}:${deux(Math.floor(t / 60) % 60)}:${deux(t % 60)}:${deux(f)}`; };
if (tc && !reduit) setInterval(() => { if (!document.hidden) tc.textContent = formatTc((performance.now() - debut) / 1000); }, 40);

/* =========================================================
   6. En-tête, menu mobile, progression, lien actif
   ========================================================= */
const entete = $('#entete'), barre = $('.progression span');
const liens = $$('.nav a[href^="#"]');
const sections = liens.map(a => $(a.getAttribute('href')));
const menu = $('#menu-mobile'), menuBouton = $('.menu-bouton');
function ouvrirMenu(o) {
  if (!menu || !menuBouton) return;
  menuBouton.setAttribute('aria-expanded', String(o));
  menu.hidden = !o;
  document.body.classList.toggle('menu-ouvert', o);
}
if (menuBouton) menuBouton.addEventListener('click', () => ouvrirMenu(menuBouton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) ouvrirMenu(false); });
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const cible = id.length > 1 ? document.getElementById(id.slice(1)) : null;
  if (!cible) return;
  e.preventDefault();
  if (menu && !menu.hidden) ouvrirMenu(false);
  let vise = cible;
  if (cible.matches('[role="tabpanel"]')) { ouvrePanneau(cible); vise = $('.onglets') || cible; }
  vise.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id);
});

/* =========================================================
   7. Apparitions au défilement (état de repos visible)
   ========================================================= */
function decoupeMots(el) {
  const marche = n => {
    Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 3) {
        const parts = c.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const m = document.createElement('span'); m.className = 'mot';
          const i = document.createElement('span'); i.className = 'mot-i'; i.textContent = p;
          m.appendChild(i); frag.appendChild(m);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) marche(c);
    });
  };
  marche(el);
}
$$('[data-mots]').forEach(decoupeMots);

const t0 = performance.now();
function apparait(el) {
  const delai = +(el.dataset.delai || 0);
  if (el.hasAttribute('data-mots')) {
    $$('.mot-i', el).forEach((m, i) => m.animate(
      [{ transform: 'translateY(105%)', opacity: 0, filter: 'blur(8px)' }, { transform: 'none', opacity: 1, filter: 'blur(0px)' }],
      { duration: 1000, delay: delai + i * 55, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
  } else {
    el.animate([{ transform: 'translateY(32px)', opacity: 0, filter: 'blur(10px)' }, { transform: 'none', opacity: 1, filter: 'blur(0px)' }],
      { duration: 1050, delay: delai, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  }
  $$('[data-compte]', el).forEach(compte);
}
function compte(el) {
  const fin = +el.dataset.compte, dep = performance.now(), duree = 1200;
  const pas = t => { const k = sortie(borne((t - dep) / duree, 0, 1)); el.textContent = nombre(fin * k); if (k < 1) requestAnimationFrame(pas); };
  requestAnimationFrame(pas);
}
if (!reduit && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entrees => {
    entrees.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const dejaVisible = performance.now() - t0 < 250 && e.boundingClientRect.top < innerHeight * .92;
      if (!dejaVisible) apparait(e.target);
    });
  }, { rootMargin: '0px 0px 8% 0px' });
  $$('[data-revele],[data-mots]').forEach(el => io.observe(el));
}

/* Le symbole de l'écran de fin rejoue son entrée quand il arrive à l'écran */
$$('[data-rejoue]').forEach(h => {
  if (reduit) return;
  const svg = h.firstElementChild;
  new IntersectionObserver((e, o) => {
    if (!e[0].isIntersecting) return;
    o.disconnect();
    svg.classList.remove('intro'); void svg.getBoundingClientRect(); svg.classList.add('intro');
    if (champFin) setTimeout(() => champFin.elan(4.5), 1150);
  }, { threshold: .4 }).observe(h);
});

/* =========================================================
   8. Le constat s'éclaire mot à mot
   ========================================================= */
const essai = $('[data-eclaire]');
let motsEssai = [], dernierAllume = -1;
if (essai) {
  const marche = n => {
    Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'ew'; s.textContent = p; frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) marche(c);
    });
  };
  marche(essai);
  motsEssai = $$('.ew', essai);
  if (reduit) { motsEssai.forEach(m => m.classList.add('on')); $$('.trait', essai).forEach(t => t.classList.add('on')); }
}
function majEssai(r) {
  if (!essai || reduit || !r) return;
  const p = borne((innerHeight * .82 - r.top) / (r.height + innerHeight * .3), 0, 1);
  const n = Math.round(p * motsEssai.length * 1.08);
  if (n === dernierAllume) return;
  dernierAllume = n;
  motsEssai.forEach((m, i) => m.classList.toggle('on', i < n));
  $$('.trait', essai).forEach(t => { const ws = $$('.ew', t); t.classList.toggle('on', ws.length && ws[ws.length - 1].classList.contains('on')); });
}

/* =========================================================
   9. Bandeau : accélère avec le défilement
   ========================================================= */
const piste = $('#bandeau');
let bandeauX = 0, bandeauVu = true, largeurGroupe = 0;
if (piste) {
  piste.appendChild(piste.firstElementChild.cloneNode(true));
  const mesure = () => { largeurGroupe = piste.firstElementChild.getBoundingClientRect().width; };
  mesure(); new ResizeObserver(mesure).observe(piste.firstElementChild);
  new IntersectionObserver(e => { bandeauVu = e[0].isIntersecting; }).observe(piste);
}

/* =========================================================
   10. La méthode : la tête de lecture suit les étapes
   ========================================================= */
const montage = $('#montage'), etapes = $$('.etape'), clipsV1 = $$('.clip-v1'), clipsV2 = $$('.clip-titre');
const onde = $('#onde'), mtc = $('#montage-tc'), metape = $('#montage-etape');
const NOMS = ['Appel', 'Textes', 'Séance', 'Montage', 'Livraison', 'Bilan'];
let barresOnde = [], pMontage = 0, etapeActive = -1;
$$('.clip').forEach(c => { c.style.setProperty('--de', c.dataset.de); c.style.setProperty('--a', c.dataset.a); });
if (onde) {
  let graine = 7;
  const alea = () => { graine = (graine * 16807) % 2147483647; return graine / 2147483647; };
  const n = innerWidth < 700 ? 60 : 110;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('i');
    const env = .35 + .65 * Math.abs(Math.sin(i / n * Math.PI * 3.2));
    b.style.height = Math.round(18 + 78 * env * (.35 + alea() * .65)) + '%';
    onde.appendChild(b); barresOnde.push(b);
  }
}
/* Le moniteur montre l'étape en cours : ce que je fais par défaut, ce qu'on peut faire ensemble */
const moniteur = {
  corps: $('#mon-corps'), n: $('#mon-n'), meta: $('#mon-meta'),
  titre: $('#mon-titre'), defaut: $('#mon-defaut'), ensemble: $('#mon-ensemble')
};
function majMoniteur(etape, idx) {
  if (!moniteur.corps || !etape) return;
  moniteur.n.textContent = deux(idx + 1);
  moniteur.meta.textContent = $('.etape-meta', etape).textContent;
  moniteur.titre.textContent = $('h3', etape).textContent;
  moniteur.defaut.textContent = etape.dataset.defaut || '';
  moniteur.ensemble.textContent = etape.dataset.ensemble || '';
  if (!reduit) { moniteur.corps.classList.remove('change'); void moniteur.corps.offsetWidth; moniteur.corps.classList.add('change'); }
}
function majMontage(rects) {
  if (!montage || !etapes.length || !rects) return;
  const ligne = innerHeight * .5;
  let cible = 0;
  const r0 = rects[0], rN = rects[rects.length - 1];
  if (ligne <= r0.top) cible = 0;
  else if (ligne >= rN.bottom) cible = 1;
  else rects.forEach((r, i) => { if (ligne >= r.top && ligne < r.bottom) cible = (i + (ligne - r.top) / r.height) / etapes.length; });
  pMontage = reduit ? cible : vers(pMontage, cible, .14);
  montage.style.setProperty('--p', pMontage.toFixed(4));
  const idx = Math.min(etapes.length - 1, Math.floor(pMontage * etapes.length + .0001));
  if (idx !== etapeActive) {
    etapeActive = idx;
    etapes.forEach((e, i) => e.classList.toggle('actif', i === idx));
    clipsV1.forEach((c, i) => c.classList.toggle('actif', i === idx));
    if (metape) metape.textContent = `Étape ${idx + 1} sur 6 · ${NOMS[idx]}`;
    majMoniteur(etapes[idx], idx);
  }
  clipsV2.forEach(c => { const de = +c.dataset.de / 6, a = +c.dataset.a / 6; c.classList.toggle('actif', pMontage >= de && pMontage < a); });
  const nb = Math.floor(pMontage * barresOnde.length);
  barresOnde.forEach((b, i) => b.classList.toggle('lu', i < nb));
  if (mtc) mtc.textContent = formatTc(pMontage * 120);
}

/* =========================================================
   11. Les maquettes de formats
   ========================================================= */
const SCRIPT = [['3', 'erreurs'], ['qui', 'bloquent'], ['ton', 'squat'], ['la', 'première'], ['tes', 'talons'], ['décollent']];
function telephone(el) {
  const type = el.dataset.telephone;
  let minuteur = 0, etat = 0;
  const pas = () => {
    if (type === 'court') {
      const zone = $('[data-sous-titres]', el);
      const total = SCRIPT.reduce((s, c) => s + c.length, 0);
      let k = etat % total, bloc = 0;
      while (k >= SCRIPT[bloc].length) { k -= SCRIPT[bloc].length; bloc++; }
      zone.innerHTML = SCRIPT[bloc].map((m, i) => `<span class="${i === k ? 'dit' : i > k ? 'avant' : ''}">${m}</span>`).join(' ');
      etat++;
      minuteur = setTimeout(pas, k === SCRIPT[bloc].length - 1 ? 620 : 380);
    } else if (type === 'pub') {
      const b = etat % 2 === 1;
      $('.ab', el).classList.toggle('b', b);
      $$('.ab span', el).forEach((s, i) => s.classList.toggle('on', i === (b ? 1 : 0)));
      $$('.accroche', el).forEach((a, i) => a.classList.toggle('on', i === (b ? 1 : 0)));
      etat++;
      minuteur = setTimeout(pas, 3200);
    } else {
      const li = $$('.chapitres li', el), i = etat % li.length;
      li.forEach((l, j) => { l.classList.toggle('on', j === i); l.classList.toggle('fait', j < i); });
      etat++;
      minuteur = setTimeout(pas, 2500);
    }
  };
  if (reduit) { pas(); clearTimeout(minuteur); return; }
  new IntersectionObserver(e => {
    if (e[0].isIntersecting) { el.classList.add('joue'); if (!minuteur) pas(); }
    else { el.classList.remove('joue'); clearTimeout(minuteur); minuteur = 0; }
  }).observe(el);
}
$$('[data-telephone]').forEach(telephone);

/* =========================================================
   12. Tarifs : onglets et calcul à l'occasion
   ========================================================= */
const onglets = $$('[role="tab"]'), indic = $('.onglet-indic');
function placeIndic() { const a = onglets.find(o => o.getAttribute('aria-selected') === 'true'); if (a && indic) { indic.style.width = a.offsetWidth + 'px'; indic.style.transform = `translateX(${a.offsetLeft}px)`; } }
function choisit(o, focus) {
  onglets.forEach(x => {
    const sel = x === o;
    x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1;
    const p = document.getElementById(x.getAttribute('aria-controls'));
    if (sel && p.hidden) { p.hidden = false; if (!reduit) { p.classList.remove('arrive'); void p.offsetWidth; p.classList.add('arrive'); } }
    else if (!sel) p.hidden = true;
  });
  if (focus) o.focus();
  placeIndic();
}
onglets.forEach((o, i) => {
  o.addEventListener('click', () => choisit(o));
  o.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); choisit(onglets[(i + (e.key === 'ArrowRight' ? 1 : -1) + onglets.length) % onglets.length], true); }
  });
});
placeIndic();
addEventListener('resize', placeIndic);
if (document.fonts) document.fonts.ready.then(placeIndic);

const PRIX = { courte: 120, pub: 150, presentation: 250 }, SEANCE = 190, PACKS = { 4: 480, 6: 690, 8: 890 };
const NOMS_ARTICLES = { courte: 'vidéo courte', pub: 'publicité', presentation: 'vidéo de présentation' };
const qte = { courte: 0, pub: 1, presentation: 1 };
const totalEl = $('#total'), acompteEl = $('#acompte'), noteEl = $('#calcul-note'), devisEl = $('#demande-devis');
let totalAffiche = 590;
function tween(el, de, a) {
  if (reduit) { el.textContent = nombre(a); return; }
  const dep = performance.now();
  const f = t => { const k = sortie(borne((t - dep) / 550, 0, 1)); el.textContent = nombre(vers(de, a, k)); if (k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function calcule() {
  if (!totalEl) return;
  const n = qte.courte + qte.pub + qte.presentation;
  let courtes = qte.courte, note = '';
  if (qte.pub === 0 && qte.presentation === 0 && courtes > 0 && courtes < 3) { courtes = 3; note = 'Les vidéos courtes seules se commandent par <b>3 au minimum</b>&#8239;: le total en compte 3.'; }
  const total = n === 0 ? 0 : SEANCE + courtes * PRIX.courte + qte.pub * PRIX.pub + qte.presentation * PRIX.presentation;
  if (n === 0) note = 'Ajoutez au moins une vidéo.';
  const nv = Math.max(n, courtes + qte.pub + qte.presentation);
  if (!note && qte.presentation === 0 && qte.pub <= 1 && nv >= 4 && nv <= 8) {
    const pack = nv <= 4 ? 4 : nv <= 6 ? 6 : 8, prix = PACKS[pack];
    if (prix < total) note = `Le même volume chaque mois&#8239;: <b>pack ${pack} à ${prix}&nbsp;€</b>, séance offerte.`;
  }
  tween(totalEl, totalAffiche, total); totalAffiche = total;
  acompteEl.textContent = nombre(total / 2);
  noteEl.innerHTML = note;
  Object.keys(qte).forEach(k => {
    const ligne = $(`.ligne-calcul[data-type="${k}"]`);
    $('output', ligne).textContent = qte[k];
    $('[data-moins]', ligne).disabled = qte[k] === 0;
    $('[data-plus]', ligne).disabled = qte[k] >= 8;
  });
  if (devisEl) {
    const lignes = Object.keys(qte).filter(k => (k === 'courte' ? courtes : qte[k]) > 0).map(k => `- ${k === 'courte' ? courtes : qte[k]} × ${NOMS_ARTICLES[k]}`);
    const corps = `Bonjour Kevin,\n\nJe souhaite un devis à l'occasion :\n- 1 séance de tournage (190 €)\n${lignes.join('\n')}\nTotal indiqué sur le site : ${nombre(total)} €.\n\nJe suis [prénom, activité, ville] ; mon compte Instagram ou mon site : [lien].\nMes disponibilités pour un appel de 30 min : [deux créneaux].\n\nMerci.`;
    devisEl.href = lienMail('Demande de devis · LANCES Productions', corps);
  }
}
$$('.ligne-calcul').forEach(l => {
  const k = l.dataset.type;
  $('[data-moins]', l).addEventListener('click', () => { qte[k] = Math.max(0, qte[k] - 1); calcule(); });
  $('[data-plus]', l).addEventListener('click', () => { qte[k] = Math.min(8, qte[k] + 1); calcule(); });
});
calcule();

/* Devis types : l'e-mail pré-rempli reprend la carte */
$$('[data-devis-mail]').forEach(a => {
  const carte = a.closest('.devis');
  const compo = $$('.devis-compo li', carte).map(li => `- ${li.textContent.replace(/\u202f/g, ' ')}`).join('\n');
  const corps = `Bonjour Kevin,\n\nJe souhaite ce devis : ${$('h4', carte).textContent}\n${compo}\nPrix indiqué sur le site : ${$('.devis-prix', carte).dataset.prixTexte}.\n\nJe suis [prénom, activité, ville] ; mon compte Instagram ou mon site : [lien].\nMes disponibilités pour un appel de 30 min : [deux créneaux].\n\nMerci.`;
  a.href = lienMail(`Devis : ${$('h4', carte).textContent} · LANCES Productions`, corps);
});

/* Un lien vers un panneau (#sur-mesure) ouvre son onglet */
function ouvrePanneau(panneau) {
  const o = onglets.find(x => x.getAttribute('aria-controls') === panneau.id);
  if (o) choisit(o);
}
if (location.hash === '#sur-mesure' && $('#sur-mesure')) ouvrePanneau($('#sur-mesure'));

/* =========================================================
   12 bis. Sur mesure : l'assistant (questions, proposition, date, envoi)
   Rien ne quitte l'appareil avant que le visiteur envoie son e-mail.
   ========================================================= */
const assistant = $('#assistant'), formQ = $('#questionnaire');
if (assistant && formQ) {
  const ecrans = $$('[data-ecran]', assistant);
  const PARCOURS = {
    estimation: ['choix', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'proposition', 'date', 'envoi'],
    contact: ['choix', 'date', 'q6', 'envoi']
  };
  const AUTO = ['q1', 'q2', 'q4', 'q5'];
  let parcours = 'estimation', courant = 'choix', prop = null, ajuste = false;
  const coche = n => $(`input[name="${n}"]:checked`, formQ);
  const val = n => { const i = coche(n); return i ? i.value : ''; };
  const lib = n => { const i = coche(n); return i ? i.nextElementSibling.textContent.replace(/ /g, ' ') : ''; };
  const champ = n => (formQ.elements[n] ? formQ.elements[n].value.trim() : '');
  const euros = n => `${nombre(n)} €`;
  const jour = formQ.elements.jour;
  const iso = d => `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
  const demain = () => { const d = new Date(); d.setDate(d.getDate() + 1); return iso(d); };
  if (jour) jour.min = demain();
  if (LIENS.rdv) $$('.agenda', assistant).forEach(p => { p.hidden = false; });

  function piloteOuvert() { return Date.now() < Date.parse(PILOTE.fin) && PILOTE.placesRestantes > 0; }

  /* La formule proposée : la grille de prix, jamais un prix inventé.
     Testée sur les 144 combinaisons de réponses (4 profils × 3 situations × 6 priorités × 2 rythmes). */
  const MOT = m => new RegExp(`(^|[^a-zà-ÿ])(${m})([^a-zà-ÿ]|$)`);
  function propose() {
    const profil = val('profil'), stade = val('stade'), prio = val('priorite'), mensuel = val('rythme') === 'mensuel';
    const mots = champ('besoin').toLowerCase();
    const horsGrille = profil === 'autre' || /youtube|vlog|podcast|interview|aftermovie|documentaire|mariage|marathon|tournoi|comp[ée]tition|[ée]v[ée]nement|s[ée]minaire/.test(mots) || MOT('films?|clips?|galas?|courses?|trails?').test(mots);
    const lieu = profil === 'salle' || (profil === 'prof' && prio === 'salle');
    const fixe = (montant, suite) => ({ html: `<b>${euros(montant)}</b>${suite || ''}`, texte: `${euros(montant)}${suite || ''}` });
    const surDevis = t => ({ html: `<b>Sur devis</b> ${t}`, texte: `sur devis ${t}` });
    const notes = [];
    const pack4 = pour => ({ pour, titre: 'Pack 4', compo: ['4 vidéos par mois, séance offerte', 'Les idées et les textes de chaque vidéo', 'Une vidéo par mois peut devenir une publicité'], prix: fixe(PACKS[4], ' par mois'), pack4: true });
    const pack6 = pour => ({ pour, titre: 'Pack 6', compo: ['6 vidéos par mois, séance offerte', 'Une vidéo par mois montée en publicité', 'Le plan de contenu et un bilan en trois chiffres'], prix: fixe(PACKS[6], ' par mois') });
    const troisCourtes = (pour, conseil) => ({ pour, titre: 'Trois vidéos courtes', compo: ['La séance de tournage', '3 vidéos courtes : reels, témoignages, coulisses'], prix: fixe(SEANCE + 3 * PRIX.courte), conseil });
    let r;
    if (horsGrille) r = { pour: 'Projet sur mesure', titre: 'Production sur mesure', compo: ['Écriture, tournage et montage adaptés à votre projet', 'Format, durée et finition fixés ensemble à l’appel'], prix: surDevis('sous 48 h après l’appel') };
    else if (prio === 'images') r = { pour: 'Vous montez vous-même', titre: mensuel ? 'Le tournage seul, chaque mois' : 'Le tournage seul', compo: [mensuel ? 'Une séance de tournage par mois, avec le matériel' : 'Une séance de tournage avec le matériel', 'Vos rushs triés, prêts à monter'], prix: surDevis('après l’appel') };
    else if (lieu) {
      if (mensuel) {
        r = { pour: 'Salle, studio ou école, chaque mois', titre: 'Pack 8', compo: ['8 vidéos par mois : coachs, cours, ambiance', 'Une séance de tournage par mois, offerte', 'Une vidéo par mois peut devenir une publicité'], prix: fixe(PACKS[8], ' par mois') };
        if (prio === 'image') notes.push(`La vidéo de présentation de votre salle s’ajoute pour ${euros(PRIX.presentation)} le premier mois, sans nouvelle séance.`);
      }
      else if (prio === 'prospects') r = { pour: 'Faire venir de nouveaux adhérents', titre: 'Présentation + publicité', compo: ['La séance de tournage', 'Une vidéo de présentation de votre salle', 'Une publicité, 2 accroches'], prix: fixe(SEANCE + PRIX.presentation + PRIX.pub) };
      else if (prio === 'image') r = { pour: 'Une image plus professionnelle', titre: 'Vidéo de présentation', compo: ['La séance de tournage', 'Une vidéo de présentation de votre salle, 2 min'], prix: fixe(SEANCE + PRIX.presentation) };
      else if (prio === 'regulier') r = troisCourtes('Du contenu d’avance', `Pour publier chaque semaine, le pack 8 revient moins cher par vidéo : ${euros(PACKS[8])} par mois, séance offerte.`);
      else r = { pour: 'Montrer votre salle', titre: 'Présentation + 3 vidéos courtes', compo: ['La séance de tournage', 'Une vidéo de présentation de votre salle', '3 vidéos courtes : coachs, cours, ambiance'], prix: fixe(SEANCE + PRIX.presentation + 3 * PRIX.courte) };
    } else if (mensuel) {
      if (stade !== 'lance' && prio === 'prospects') r = pack6('Attirer plus de prospects');
      else if (stade !== 'lance' && prio === 'regulier') r = pack6('Publier sans y passer du temps');
      else if (prio === 'image') r = { pour: 'Une image plus professionnelle', titre: 'Pack 4 + présentation', compo: ['4 vidéos par mois, séance offerte', 'Une vidéo de présentation en plus le premier mois'], prix: fixe(PACKS[4] + PRIX.presentation, ` le premier mois, puis ${euros(PACKS[4])} par mois`), pack4: true };
      else r = pack4(stade === 'lance' ? 'Pour lancer votre activité' : 'Une vidéo par semaine');
    } else {
      if (prio === 'prospects') r = { pour: 'Attirer plus de prospects', titre: 'Deux publicités', compo: ['La séance de tournage', '2 publicités prêtes pour Meta, 2 accroches chacune'], prix: fixe(SEANCE + 2 * PRIX.pub) };
      else if (prio === 'image') r = { pour: 'Une image plus professionnelle', titre: 'Vidéo de présentation', compo: ['La séance de tournage', 'Une vidéo de présentation de 2 min', 'Pour votre page de rendez-vous, votre bio, votre épinglé'], prix: fixe(SEANCE + PRIX.presentation) };
      else if (prio === 'regulier') r = troisCourtes('Du contenu d’avance', `Pour publier chaque semaine, le pack 4 revient moins cher : ${euros(PACKS[4])} par mois, séance offerte.`);
      else r = { pour: 'Se présenter et se faire connaître', titre: 'Présentation + publicité', compo: ['La séance de tournage', 'Une vidéo de présentation', 'Une publicité, 2 accroches'], prix: fixe(SEANCE + PRIX.presentation + PRIX.pub) };
    }
    if (r.conseil) notes.push(r.conseil);
    /* La réponse libre : ce que le visiteur cite et que la formule n'a pas */
    if (!horsGrille && prio !== 'images') {
      const a = re => r.compo.some(c => re.test(c));
      if (/pr[ée]sent/.test(mots) && !a(/présentation/i)) notes.push(`Vous citez une vidéo de présentation : elle s’ajoute pour ${euros(PRIX.presentation)}, sans nouvelle séance.`);
      if ((/publicit/.test(mots) || MOT('pubs?').test(mots)) && !a(/publicit/i)) notes.push(`Vous citez la publicité : chaque publicité s’ajoute pour ${euros(PRIX.pub)}, 2 accroches comprises.`);
    }
    if (piloteOuvert() && r.pack4) notes.push(`Offre de fin d’année : le premier mois du pack 4 à ${euros(PACKS[4] * .8)} au lieu de ${euros(PACKS[4])}, sans engagement, pour un contrat signé au plus tard le 23 novembre.`);
    if (piloteOuvert() && r.titre === 'Pack 8') notes.push('Offre de fin d’année : le premier mois sans engagement, pour un contrat signé au plus tard le 23 novembre.');
    if (prio === 'sais_pas') notes.push('Vous hésitez encore : on affine la formule ensemble pendant l’appel.');
    r.note = notes.join('\n');
    return r;
  }
  function afficheProposition() {
    prop = propose();
    $('#prop-pour').textContent = prop.pour;
    $('#prop-titre').textContent = prop.titre;
    const ul = $('#prop-compo'); ul.textContent = '';
    prop.compo.forEach(c => { const li = document.createElement('li'); li.textContent = c; ul.appendChild(li); });
    $('#prop-prix').innerHTML = prop.prix.html;
    const note = $('#prop-note'); note.hidden = !prop.note; note.textContent = prop.note || '';
    $('.ajuster', assistant).hidden = true; ajuste = false;
  }

  /* Validation de l'écran en cours */
  function erreur(ec, msg, champFautif) {
    const e = $('.q-erreur', ec); e.textContent = msg; e.hidden = false;
    if (champFautif) { champFautif.setAttribute('aria-invalid', 'true'); champFautif.focus(); }
    return false;
  }
  function valide(id) {
    const ec = ecrans.find(e => e.dataset.ecran === id);
    $$('[aria-invalid]', ec).forEach(c => c.removeAttribute('aria-invalid'));
    if (AUTO.includes(id)) { const n = $('input[type="radio"]', ec).name; return coche(n) ? true : erreur(ec, 'Choisissez une réponse.'); }
    if (id === 'q6') {
      const f = formQ.elements;
      if (!champ('prenom')) return erreur(ec, 'Indiquez votre prénom.', f.prenom);
      if (!champ('email') && !champ('tel')) return erreur(ec, 'Indiquez un e-mail ou un téléphone.', f.email);
      if (champ('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ('email'))) return erreur(ec, 'Cet e-mail semble incomplet.', f.email);
      if (champ('tel') && champ('tel').replace(/\D/g, '').length < 9) return erreur(ec, 'Ce numéro semble incomplet.', f.tel);
    }
    if (id === 'date') {
      if (!jour.value || jour.value < demain()) return erreur(ec, 'Choisissez un jour à partir de demain.', jour);
      if (!coche('creneau')) return erreur(ec, 'Choisissez un créneau.');
      if (!coche('moyen')) return erreur(ec, 'Téléphone ou visio ?');
    }
    return true;
  }

  /* Navigation entre les écrans */
  function montre(id, focus = true) {
    courant = id;
    assistant.classList.toggle('mode-contact', parcours === 'contact');
    if (id === 'q4') {
      const opt = $('input[name="priorite"][value="salle"]', formQ), coach = val('profil') === 'coach';
      opt.closest('label').hidden = coach;
      if (coach && opt.checked) opt.checked = false;
    }
    if (id === 'proposition') afficheProposition();
    if (id === 'envoi') prepareEnvoi();
    let actif = null;
    ecrans.forEach(e => {
      const on = e.dataset.ecran === id;
      e.hidden = !on;
      if (on) { actif = e; $$('.q-erreur', e).forEach(x => { x.hidden = true; }); if (!reduit) { e.classList.remove('arrive'); void e.offsetWidth; e.classList.add('arrive'); } }
    });
    if (!focus || !actif) return;
    const t = $('[tabindex="-1"]', actif); if (t) t.focus({ preventScroll: true });
    const r = assistant.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * .7) assistant.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  }
  const etape = d => { const p = PARCOURS[parcours], i = p.indexOf(courant); if (p[i + d]) montre(p[i + d]); };

  formQ.addEventListener('submit', e => { e.preventDefault(); if (valide(courant)) etape(1); });
  formQ.addEventListener('change', e => {
    const n = e.target.name;
    if (e.target.type === 'radio' && AUTO.includes(courant) && $(`[data-ecran="${courant}"] input[name="${n}"]`, assistant)) { const ici = courant; setTimeout(() => { if (courant === ici && valide(ici)) etape(1); }, reduit ? 0 : 280); }
  });
  formQ.addEventListener('input', e => { e.target.removeAttribute('aria-invalid'); });
  assistant.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.commence) { parcours = b.dataset.commence; montre(PARCOURS[parcours][1]); }
    else if (b.hasAttribute('data-retour')) etape(-1);
    else if (b.hasAttribute('data-remplit')) { const t = formQ.elements.besoin; t.value = b.textContent; t.focus(); }
    else if (b.hasAttribute('data-ajuster')) { $('.ajuster', assistant).hidden = false; formQ.elements.remarque.focus(); }
    else if (b.hasAttribute('data-modifie')) montre('q1');
    else if (b.hasAttribute('data-confirme')) { ajuste = !!b.closest('.ajuster'); montre('date'); }
    else if (b.hasAttribute('data-recommence')) { formQ.reset(); parcours = 'estimation'; prop = null; $('.envoye', assistant).hidden = true; montre('choix'); }
  });

  /* Le récapitulatif et l'e-mail */
  function lignes() {
    const l = [];
    if (parcours === 'estimation') {
      l.push(['Profil', lib('profil')], ['Où j’en suis', lib('stade')], ['Besoin', champ('besoin') || '—'], ['Priorité', lib('priorite')], ['Rythme', lib('rythme')]);
      if (prop) l.push(['Formule proposée', `${prop.titre} · ${prop.prix.texte}${ajuste ? ' (à ajuster)' : ''}`]);
      if (ajuste && champ('remarque')) l.push(['Remarque', champ('remarque')]);
    }
    const d = jour.value ? new Date(`${jour.value}T12:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
    l.push(['Appel de 30 min', `${d} · ${lib('creneau')} · ${lib('moyen')}`]);
    l.push(['Prénom', champ('prenom')]);
    if (champ('email')) l.push(['E-mail', champ('email')]);
    if (champ('tel')) l.push(['Téléphone', champ('tel')]);
    if (champ('instagram')) l.push(['Instagram', champ('instagram')]);
    return l;
  }
  function prepareEnvoi() {
    const l = lignes(), dl = $('#recap');
    dl.textContent = '';
    l.forEach(([k, v]) => { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; dl.append(dt, dd); });
    const intro = parcours === 'estimation' ? 'Voici mon estimation faite sur le site.' : 'Je souhaite être contacté.';
    const corps = `Bonjour Kevin,\n\n${intro}\n\n${l.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\nMerci.`;
    const sujet = `${parcours === 'estimation' ? 'Demande sur mesure' : 'Demande d’appel'} · ${champ('prenom')} · LANCES Productions`;
    $('#envoi-demande').href = lienMail(sujet, corps);
  }
  $('#envoi-demande').addEventListener('click', () => { setTimeout(() => { $('.envoye', assistant).hidden = false; }, 1200); });

  montre('choix', false);
}

/* =========================================================
   13. Offre de fin d’année (tarif de lancement des CGV) : compte à rebours et places (vérité datée)
   ========================================================= */
const FIN_PILOTE = Date.parse(PILOTE.fin);
const cases = { j: $('[data-u="j"]'), h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
const placesTexte = $('#places-texte'), pilote = $('#pilote');
if (placesTexte) {
  const r = PILOTE.placesRestantes, t = PILOTE.placesTotal;
  placesTexte.textContent = r > 0
    ? `${t} place${t > 1 ? 's' : ''} au total, il en reste ${r} (mis à jour le ${dateFr(PILOTE.majPlaces)})`
    : `Les ${t} places sont prises (mis à jour le ${dateFr(PILOTE.majPlaces)})`;
  $$('.places i').forEach((i, k) => { i.style.opacity = k < r ? '1' : '.3'; });
}
function majCompte() {
  if (!cases.j) return;
  const r = Math.max(0, FIN_PILOTE - Date.now());
  if (r === 0 || PILOTE.placesRestantes <= 0) {
    if (pilote && !pilote.classList.contains('clos')) {
      pilote.classList.add('clos');
      $$('[data-pilote-ouvert]', pilote).forEach(el => { el.hidden = true; });
      $$('[data-pilote-clos]', pilote).forEach(el => { el.hidden = false; });
    }
    if (r === 0) return;
  }
  const v = { j: Math.floor(r / 864e5), h: Math.floor(r / 36e5) % 24, m: Math.floor(r / 6e4) % 60, s: Math.floor(r / 1e3) % 60 };
  Object.keys(v).forEach(k => {
    const t = deux(v[k]);
    if (cases[k] && cases[k].textContent !== t) {
      cases[k].textContent = t;
      if (!reduit) { cases[k].classList.remove('tic'); void cases[k].offsetWidth; cases[k].classList.add('tic'); }
    }
  });
}
majCompte(); if (cases.j) setInterval(majCompte, 1000);

/* =========================================================
   14. Le clap
   ========================================================= */
const clap = $('#clap'), prise = $('#prise');
let nPrise = 1;
const dateClap = $('#clap-date');
if (dateClap) dateClap.textContent = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
const ecrits = $$('[data-ecrit]').map(e => [e, e.textContent]);
function ecrit() {
  if (reduit) return;
  ecrits.forEach(([e, t], n) => {
    e.textContent = '';
    let i = 0;
    const f = () => { e.textContent = t.slice(0, ++i); if (i < t.length) setTimeout(f, 34); };
    setTimeout(f, 820 + n * 140);
  });
}
function claque(nouvelle) {
  if (!clap || reduit) return;
  if (nouvelle) { nPrise++; prise.textContent = deux(nPrise); }
  clap.classList.remove('clac'); void clap.offsetWidth; clap.classList.add('clac');
  ecrit();
}
if (clap) {
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); claque(false); } }, { threshold: .5 }).observe(clap);
  const cb = $('#clap-bouton'); if (cb) cb.addEventListener('click', () => claque(true));
}

/* =========================================================
   16. Copier
   ========================================================= */
$$('[data-copie]').forEach(b => b.addEventListener('click', () => {
  const src = document.getElementById(b.dataset.copie), texte = src.textContent.replace(/\u00a0/g, ' ').trim();
  const fait = () => { b.textContent = 'Copié'; b.classList.add('ok'); setTimeout(() => { b.textContent = 'Copier'; b.classList.remove('ok'); }, 1800); };
  const choisitTexte = () => { const s = getSelection(), r = document.createRange(); r.selectNodeContents(src); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText(texte).then(fait, choisitTexte); } catch (e) { choisitTexte(); }
}));

/* =========================================================
   17. Lumière sous le pointeur, boutons aimantés, grande marque
   ========================================================= */
if (pointeurFin && !reduit) {
  $$('[data-lumiere]').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true }));
  $$('.aimant').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .16}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  const pied = $('#pied'), marque = $('.marque-geante');
  if (pied && marque) pied.addEventListener('pointermove', e => {
    const r = marque.getBoundingClientRect();
    marque.style.setProperty('--fx', ((e.clientX - r.left) / r.width * 100) + '%');
    marque.style.setProperty('--fy', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });
}

/* =========================================================
   18. Boucle d'animation unique
   ========================================================= */
let dernierY = scrollY, vitesse = 0;
function image() {
  /* 1. Toutes les lectures de mise en page d'abord */
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  let actif = -1;
  sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) actif = i; });
  const rEssai = essai && !reduit ? essai.getBoundingClientRect() : null;
  const rEtapes = montage && etapes.length ? etapes.map(e => e.getBoundingClientRect()) : null;
  /* 2. Puis les écritures */
  vitesse = vers(vitesse, y - dernierY, .2); dernierY = y;
  if (entete) entete.classList.toggle('condense', y > 60);
  if (barre) barre.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
  liens.forEach((a, i) => { if (i === actif) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  if (scene && pointeurFin && !reduit) {
    incl.x = vers(incl.x, incl.tx, .06); incl.y = vers(incl.y, incl.ty, .06);
    scene.style.transform = `rotateY(${incl.x.toFixed(2)}deg) rotateX(${incl.y.toFixed(2)}deg)`;
  }
  if (piste && bandeauVu && !reduit && largeurGroupe) {
    bandeauX -= .55 + Math.min(14, Math.abs(vitesse) * .22);
    if (bandeauX <= -largeurGroupe) bandeauX += largeurGroupe;
    piste.style.transform = `translate3d(${bandeauX.toFixed(2)}px,0,0)`;
  }
  majProjecteur();
  majEssai(rEssai);
  majMontage(rEtapes);
  requestAnimationFrame(image);
}
requestAnimationFrame(image);
})();
