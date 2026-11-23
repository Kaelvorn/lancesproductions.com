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
  tiktok: 'https://www.tiktok.com/@lances.productions',
  youtube: 'https://www.youtube.com/@LANCES-Productions',
  email: 'kevinmazin.pro@gmail.com',
  telephone: '+33698591995',
  /* Page Calendly « Appel découverte » (30 min, compte kevinmazin.pro,
     offre gratuite, 10/11/2026 ; remplace la page Google Agenda du 02/11).
     Toujours un lien, jamais une fenêtre intégrée (ses traceurs imposeraient
     un bandeau). Vide : les boutons ouvrent un e-mail pré-rempli. */
  rdv: 'https://calendly.com/lances-productions/appel-decouverte',
  /* true quand la page Calendly a pour première question « Votre demande » :
     les briques cochées dans l'offre la remplissent d'avance (?a1=…).
     false : le bouton ouvre la page Calendly sans rien transmettre. */
  rdvDemande: false
};
/* Tarif de lancement (CGV art. 2) : les trois premières collaborations au mois,
   pour un contrat signé au plus tard à la date de fin. placesRestantes à 0, ou la
   date passée : la fiche et les phrases marquées data-lancement disparaissent seules.
   Ne pas repousser la date sans décision de Kevin et CGV à jour (une échéance
   repoussée devient une fausse urgence). */
const LANCEMENT = {
  placesTotal: 3,
  placesRestantes: 3,
  majPlaces: '2026-11-23',
  fin: '2026-11-30T23:59:59+01:00'
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
   2. Les liens de sortie (Instagram, rendez-vous, e-mail)
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
    } else if (k === 'email') { a.href = `mailto:${LIENS.email}`; if (!a.textContent.trim()) a.textContent = LIENS.email; }
    else if (k === 'telephone') { a.href = `tel:${LIENS.telephone}`; }
    else if (LIENS[k]) { a.href = LIENS[k]; externe(a); }
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
  cible.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
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
const NOMS = ['Demande', 'Appel', 'Devis', 'Préparation', 'Images', 'Montage', 'Pilotage'];
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
/* Le moniteur montre l'étape en cours : ce que je fais, ce que le client fait */
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
    if (metape) metape.textContent = `Étape ${idx + 1} sur ${etapes.length} · ${NOMS[idx]}`;
    majMoniteur(etapes[idx], idx);
  }
  clipsV2.forEach(c => { const de = +c.dataset.de / etapes.length, a = +c.dataset.a / etapes.length; c.classList.toggle('actif', pMontage >= de && pMontage < a); });
  const nb = Math.floor(pMontage * barresOnde.length);
  barresOnde.forEach((b, i) => b.classList.toggle('lu', i < nb));
  if (mtc) mtc.textContent = formatTc(pMontage * 20 * etapes.length);
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
   12. L'offre à la carte : le composeur
   Les briques cochées écrivent la demande. Rien ne quitte l'appareil
   avant que le visiteur réserve son appel ou envoie son e-mail.
   ========================================================= */
/* Les anciennes ancres (liens déjà partagés) mènent à l'offre */
if (['#tarifs', '#pilote', '#sur-mesure'].includes(location.hash)) {
  history.replaceState(null, '', '#offre');
  const o = $('#offre'); if (o) o.scrollIntoView();
}
const briques = $$('.brique'), phrase = $('#compo-phrase');
if (briques.length && phrase) {
  const VIDE = phrase.textContent, choisies = new Set();
  const mail = $('#compo-mail'), rdv = $('#compo-rdv');
  const enumere = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} et ${a[a.length - 1]}`;
  const demande = () => {
    const noms = briques.filter(b => choisies.has(b)).map(b => b.dataset.brique);
    if (!noms.length) return '';
    const r = $('input[name="rythme"]:checked'), t = enumere(noms);
    return `${t.charAt(0).toUpperCase()}${t.slice(1)}${r && r.value ? `, ${r.value}` : ''}.`;
  };
  const maj = () => {
    const d = demande();
    phrase.textContent = d || VIDE; phrase.classList.toggle('vide', !d);
    if (mail) mail.href = lienMail('Ma demande · LANCES Productions', `Bonjour Kevin,\n\nMa demande : ${d || '[ce dont j’ai besoin]'}\n\nJe suis [prénom, activité, ville] ; mon compte Instagram ou mon site : [lien].\nMes disponibilités pour un appel de 30 min : [deux créneaux].\n\nMerci.`);
    if (rdv && LIENS.rdv && LIENS.rdvDemande) rdv.href = d ? `${LIENS.rdv}?a1=${encodeURIComponent(d)}` : LIENS.rdv;
  };
  briques.forEach(b => {
    const bouton = $('.brique-plus', b);
    if (!bouton) return;
    bouton.addEventListener('click', () => {
      const oui = !choisies.has(b);
      if (oui) choisies.add(b); else choisies.delete(b);
      b.classList.toggle('choisie', oui);
      bouton.setAttribute('aria-pressed', String(oui));
      $('span', bouton).textContent = oui ? 'Dans ma demande' : 'Ajouter à ma demande';
      maj();
    });
  });
  $$('input[name="rythme"]').forEach(i => i.addEventListener('change', maj));
  maj();
}

/* =========================================================
   13. Tarif de lancement : les places (vérité datée)
   ========================================================= */
const lancement = $('#lancement'), placesTexte = $('#places-texte');
if (lancement) {
  const r = LANCEMENT.placesRestantes, t = LANCEMENT.placesTotal;
  const clos = r <= 0 || (LANCEMENT.fin && Date.now() > Date.parse(LANCEMENT.fin));
  if (clos) { lancement.hidden = true; $$('[data-lancement]').forEach(el => { el.hidden = true; }); }
  else if (placesTexte) {
    placesTexte.textContent = `${t} place${t > 1 ? 's' : ''}, il en reste ${r} (au ${dateFr(LANCEMENT.majPlaces)})`;
    $$('.places i', lancement).forEach((i, k) => { i.style.opacity = k < r ? '1' : '.3'; });
  }
}

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
