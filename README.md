# 🌱 AGRI-TOGO

> Site vitrine de la coopérative agricole **AGRI-TOGO** — *« Valorisons les produits locaux »*

Site statique présentant la coopérative, son catalogue de produits agricoles et transformés, ses actualités et ses coordonnées. Connecte les producteurs togolais aux consommateurs pour une alimentation saine, traçable et 100 % locale.

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🌗 **Mode clair / sombre** | Bascule persistante (`localStorage`), suit la préférence système, aucun flash au chargement |
| 🎬 **Animations au scroll** | Reveal directionnel (haut/gauche/droite/zoom), cascade décalée, compteurs animés, parallax sur les héros |
| 🎠 **Carrousel de partenaires** | Autoplay 4 s, flèches, points de navigation, pause au survol, accessible |
| 🔍 **Catalogue produits** | Recherche en direct + filtres par catégorie (fruits, légumes, tubercules, céréales, transformés) |
| 🪟 **Effet verre (glassmorphism)** | Bandes de verre sombre translucide posées sur les photos des produits et actualités |
| 📝 **Formulaire de contact** | Validation personnalisée côté client (nom, email, message) avec erreurs inline |
| 📰 **Actualités liées** | Cartes de l'accueil reliées aux articles du blog via des ancres |
| 📱 **Responsive** | Breakpoints 992 px / 768 px / 480 px, menu hamburger mobile |
| ♿ **Accessibilité** | ARIA sur la navigation, le carrousel et le formulaire, `prefers-reduced-motion` respecté |

---

## 🗂️ Structure du projet

```
AGRI-TOGO/
├── pages/                  # Les 5 pages du site
│   ├── index.html          # Accueil (héro, chiffres clés, dernières actualités)
│   ├── about.html          # À propos (histoire, mission/vision/valeurs, carrousel partenaires)
│   ├── products.html       # Produits (recherche + filtres + catalogue)
│   ├── blogs.html          # Actualités (article vedette, événements, articles)
│   └── contact.html        # Contact (formulaire validé + coordonnées)
│
├── style/                  # Feuilles de style
│   ├── style.css           # Global : variables de thème, nav, héros, stats, footer, reveal
│   ├── about.css           # Page À propos
│   ├── products.css        # Page Produits
│   ├── blog.css            # Page Actualités
│   └── contact.css         # Page Contact
│
├── Javascript/
│   ├── main.js             # Thème, reveal au scroll, carrousel, validation du contact
│   ├── nav.js              # Menu mobile (hamburger, ARIA, touche Échap)
│   └── products.js         # Recherche et filtrage du catalogue
│
└── images/                 # Photos et logos utilisés par le site
```

---

## 🚀 Démarrage rapide

Le site est 100 % statique (HTML/CSS/JS vanilla) : **aucune installation ni dépendance requise**.

### Option 1 — Serveur local (recommandé)

Les pages utilisent des chemins relatifs (`../style/`, `../images/`…) : un petit serveur HTTP évite tout problème de chargement.

```bash
# Depuis la racine du projet
python -m http.server 8734 --bind 127.0.0.1
```

Puis ouvrez : http://127.0.0.1:8734/pages/index.html

### Option 2 — Simple ouverture

Ouvrez directement `pages/index.html` dans un navigateur moderne (le thème et les animations fonctionnent, mais certaines ressources peuvent être bloquées selon le navigateur).

---

## 🌐 Compatibilité navigateurs

- **Support complet** : Chrome, Firefox, Edge, Safari (versions récentes)
- `backdrop-filter` (effet verre) : préfixe `-webkit-` inclus pour Safari ; dégradation élégante en teinte sombre ailleurs
- Fallbacks prévus pour les anciens navigateurs : `matchMedia`/`addListener`, `:focus` pour `:focus-visible`, `max-width` pour `min()`, fond opaque si variables CSS absentes
- **IE11** : non supporté (choix assumé — le site repose sur CSS variables et ES6+)

---

## 🎨 Personnalisation

### Thème clair / sombre
Les couleurs sont centralisées dans les variables CSS en tête de `style/style.css` (`:root` et `[data-theme="dark"]`).

### Effet verre
L'opacité et le flou des bandes verre se règlent via `--glass-bg` et `--glass-border` dans `style/style.css`.

### Catalogue
Chaque produit est une `<article class="product-card" data-category="...">` dans `pages/products.html` — dupliquez ce bloc pour ajouter un produit.

### Images
Remplacez les fichiers du dossier `images/` en conservant les mêmes noms, ou mettez à jour les `src`/`url()` correspondants.

---

## 🔮 Améliorations envisagées

- Brancher le formulaire de contact sur un service réel (EmailJS, Formspree…)
- SEO : meta descriptions, Open Graph, `sitemap.xml`, `robots.txt`
- Optimisation des images (WebP, redimensionnement, lazy loading)
- Correction du lien « Notre Histoire » (page à créer)
- Tests automatisés et README de contribution

---

## 📄 Licence

© 2026 AGRI-TOGO — Tous droits réservés.
