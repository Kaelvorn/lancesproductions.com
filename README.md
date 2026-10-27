# lancesproductions.com

Le site de **LANCES Productions** (Kevin Mazin EI, Toulouse) : une page de fin de tunnel, deux pages légales et une page 404. Fichiers statiques seulement (HTML, CSS, JavaScript, polices, images) : aucun serveur, aucune base, aucun cookie de mesure, aucune ressource chargée depuis un autre domaine.

Conception et code : le copilote (Claude) à partir de la démo validée par Kevin le 25/10/2026 et de la charte LANCES (cadre et lance, fond Acier, Parchemin, Sofia Sans Semi Condensed, Montserrat). La carte complète (architecture, coûts, procédure de mise en ligne, décisions) est dans le dépôt du copilote : `organisation/site.md`.

## Arborescence

```
public/                     ce qui est servi, tel quel
  index.html                la page
  mentions-legales.html     /mentions-legales
  confidentialite.html      /confidentialite
  404.html                  page introuvable
  _headers                  en-têtes de sécurité (CSP, HSTS…) appliqués par Cloudflare
  robots.txt, sitemap.xml, favicon.svg, favicon.png, apple-touch-icon.png, og.png
  assets/css/site.css       styles (polices locales déclarées en tête)
  assets/js/site.js         script : liens de sortie, symbole, animations, calcul des prix
  assets/fonts/             18 fichiers woff2 (OFL, licences jointes)
wrangler.jsonc              configuration Cloudflare Workers (fichiers statiques)
package.json                scripts : dev, deploy, check
```

## Les réglages que l'on modifie

Tout ce qui change dans la vie du site est en tête de `public/assets/js/site.js` :

- `LIENS.rdv` : l'adresse de la page de réservation Google Agenda. Vide, les boutons « Réserver un appel » ouvrent un e-mail pré-rempli.
- `LIENS.paiement` : les liens de paiement Stripe par formule. **Laissés vides** (avis juridique du 26/10/2026) : les boutons mènent à la prise de rendez-vous. Ne les remplir qu'après la décision de Kevin et les précautions de `organisation/site.md` § 5.
- `PILOTE` : places restantes et date de mise à jour, date de fin du tarif de lancement (23/11/2026). Après cette date, ou quand les places sont prises, la section se ferme seule.

Les textes sont dans les fichiers HTML. Les prix de la page doivent rester ceux de `memoire/offre.md` § 6 (dépôt du copilote) et des CGV.

## Travailler en local

```bash
npm install
npm run dev        # http://localhost:8787, avec les en-têtes de _headers
npm run check      # validation HTML
```

## Mise en ligne

Le Worker `lancesproductions` est relié à ce dépôt par Cloudflare Workers Builds : **chaque push sur `main` est déployé** (environ une minute). Sans ce lien, à la main : `npm run deploy` (connexion Cloudflare demandée la première fois).

La redirection `www` → domaine nu n'est pas dans le dépôt : les fichiers statiques des Workers n'acceptent que des adresses relatives dans `_redirects` (erreur 100324 au premier déploiement, 27/10/2026). Elle est réglée dans Cloudflare : Rules → Redirect Rules, modèle « Redirect from WWW to root » (301, chemin et paramètres gardés).

Vérifications après chaque mise en ligne : la page, `/mentions-legales`, `/confidentialite`, une adresse inexistante (404), `www.` redirigé, et les en-têtes sur https://securityheaders.com.

## Sécurité

- `Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; …` : aucun script ni style externe ne peut s'exécuter. Pour ajouter une ressource extérieure, il faut la déclarer dans `_headers`, en connaissance de cause (traceurs, RGPD).
- Pas d'attribut `style=""` ni de `<script>` en ligne dans le HTML (la CSP les bloquerait) : tout passe par `site.css` et `site.js`.
- HSTS un an, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Les polices sont servies par le site (pas d'appel à Google Fonts).

## Licences

Le code et les textes appartiennent à Kevin Mazin EI (LANCES Productions). Les polices sont sous SIL Open Font License 1.1 : `public/assets/fonts/LICENCES.md`.
