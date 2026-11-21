# Smart Jarra — Guide d'installation et documentation complète

## 🌿 Présentation

**Smart Jarra** est une plateforme web intelligente pour l'agriculture urbaine en Tunisie.

**Projet académique** — 2025 | IoT + IA + Agriculture durable

---

## 📁 Structure des fichiers

```
smart-jarra/
├── index.html              ← SPA principale (ouvrir directement)
├── README.md               ← Ce fichier
├── css/
│   ├── design.css          ← Design system (couleurs, typo, tokens)
│   ├── components.css      ← Composants UI (navbar, cards, modals)
│   ├── pages.css           ← Styles des 6 pages
│   └── animations.css      ← Animations et transitions
└── js/
    ├── db.js               ← Base de données simulée (localStorage)
    ├── ai.js               ← IA besoin en eau + analyse photo
    ├── charts.js           ← Graphiques Canvas (sans lib externe)
    ├── robot.js            ← Robot virtuel + animation Canvas
    └── app.js              ← Router SPA + logique de toutes les pages
```

---

## 🚀 Installation

### Option 1 — Version HTML simple (recommandée pour la démo)

**Aucune installation requise !**

1. Ouvrez le dossier `smart-jarra/`
2. Double-cliquez sur `index.html`
3. La plateforme s'ouvre directement dans votre navigateur

> **Note** : Utilisez Chrome, Edge ou Firefox (versions récentes).

### Option 2 — Serveur local (pour éviter les restrictions CORS)

```bash
# Python (si installé)
cd smart-jarra
python -m http.server 8080

# Node.js (si installé)
npx serve .

# PHP (si installé)
php -S localhost:8080
```

Puis ouvrez `http://localhost:8080`

### Option 3 — Version Next.js (avec Supabase réel)

```bash
# Créer le projet Next.js
npx create-next-app@latest smart-jarra-next --typescript --tailwind --app
cd smart-jarra-next

# Installer les dépendances
npm install @supabase/supabase-js recharts framer-motion lucide-react zustand @tensorflow/tfjs @tensorflow-models/mobilenet

# Variables d'environnement
cp .env.example .env.local
```

---

## 🔐 Variables d'environnement (Next.js)

Créer un fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optionnel
NEXT_PUBLIC_APP_NAME=Smart Jarra
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 🗄️ Schéma SQL Supabase

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Table plants
CREATE TABLE plants (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nfc_id            TEXT UNIQUE,
  name              TEXT NOT NULL,
  type              TEXT,
  season            TEXT,
  water_need        TEXT,
  irrigation_method TEXT,
  status            TEXT DEFAULT 'healthy',
  photo_url         TEXT,
  ai_score          NUMERIC DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Table measurements
CREATE TABLE measurements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id        UUID REFERENCES plants(id) ON DELETE CASCADE,
  temperature     NUMERIC,
  air_humidity    NUMERIC,
  soil_moisture   NUMERIC,
  light           NUMERIC,
  ai_result       TEXT,
  confidence      NUMERIC,
  recommendation  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Table jars
CREATE TABLE jars (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id     UUID REFERENCES plants(id) ON DELETE CASCADE,
  level        NUMERIC DEFAULT 75,
  valve_status TEXT DEFAULT 'closed',
  last_filled  TIMESTAMPTZ DEFAULT NOW()
);

-- Table aquarium
CREATE TABLE aquarium (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level       NUMERIC DEFAULT 75,
  temperature NUMERIC DEFAULT 24.5,
  ph          NUMERIC DEFAULT 7.2,
  ammonia     NUMERIC DEFAULT 0.1,
  nitrate     NUMERIC DEFAULT 5,
  fish_count  INTEGER DEFAULT 8,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE plants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE jars         ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium     ENABLE ROW LEVEL SECURITY;

-- Policies (accès public pour la démo)
CREATE POLICY "Public access" ON plants       FOR ALL USING (true);
CREATE POLICY "Public access" ON measurements FOR ALL USING (true);
CREATE POLICY "Public access" ON jars         FOR ALL USING (true);
CREATE POLICY "Public access" ON aquarium     FOR ALL USING (true);

-- Index pour les performances
CREATE INDEX idx_measurements_plant_id ON measurements(plant_id);
CREATE INDEX idx_measurements_created_at ON measurements(created_at DESC);
CREATE INDEX idx_jars_plant_id ON jars(plant_id);
```

---

## 🌐 Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier smart-jarra (version HTML)
vercel --name smart-jarra

# Ou déployer la version Next.js
vercel --prod
```

**Variables d'environnement Vercel** :
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📱 Pages de la plateforme

| Page | URL/Route | Description |
|------|-----------|-------------|
| Accueil | `/` ou `#home` | Hero, fonctionnalités, Japon–Tunisie, ODD |
| Plantation | `#plantation` | Formulaire IA, recommandation méthode |
| Robot mobile | `#robot` | Animation jardin, NFC, capteurs |
| Analyse photo | `#analysis` | Upload photo, TensorFlow.js |
| Mes plantes | `#plants` | Liste, fiche détaillée, historique |
| Tableau de bord | `#dashboard` | KPIs, graphiques, alertes |

---

## 🧠 IA Besoin en eau — Algorithme

```
Score = BaseScore(type_plante)
      + Ajustement_Temperature
      + Ajustement_Humidité_Air
      + Ajustement_Humidité_Sol
      + Ajustement_Saison

Si Score ≥ 70 → Besoin ÉLEVÉ → Hydroponie (si compatible) ou Jarre
Si 40 ≤ Score < 70 → Besoin NORMAL → Jarre enterrée tunisienne
Si Score < 40 → Besoin FAIBLE → Toit végétalisé (si compatible) ou Jarre
```

| Type de plante | Score de base | Saison |
|----------------|---------------|--------|
| Tomate | 75 | Printemps |
| Basilic | 72 | Printemps |
| Fraise | 60 | Automne |
| Menthe | 55 | Automne |
| Laitue | 50 | Automne |
| Persil | 35 | Automne |
| Romarin | 20 | Automne |

---

## 🤖 Robot mobile — Séquence d'inspection

```
1. IDLE → Attente du signal de lancement
2. MOVING → Déplacement vers le prochain pot (animation fluide)
3. READING_NFC → Lecture de l'étiquette NFC virtuelle (1.2s)
4. TAKING_PHOTO → Photo virtuelle avec flash (0.8s)
5. MEASURING → Mesure capteurs (temp, humidité, lumière) (1s)
6. ANALYZING → Analyse IA de la photo (1.5s)
7. → Résultat affiché + sauvegarde en DB
8. → Passage au pot suivant (2s)
9. DONE → Retour à la base, rapport final
```

---

## 🌿 Design System — Tokens

```css
/* Couleurs principales */
--green:   #2e7d32   /* Vert principal */
--blue:    #1565c0   /* Bleu eau */
--terra:   #d84315   /* Terracotta jarre */
--white:   #ffffff
--bg:      #f4f7f4   /* Fond clair */

/* Typographie */
font-family: 'Poppins', sans-serif

/* Rayons */
--radius-sm: 0.5rem
--radius-xl: 1.5rem
--radius-full: 9999px

/* Ombres */
--shadow-sm: 0 2px 8px rgba(46,125,50,0.1)
--shadow-md: 0 4px 20px rgba(46,125,50,0.15)
```

---

## 📊 Données de démonstration

La plateforme se peuple automatiquement avec 6 plantes de démo au premier lancement :

| Plante | Type | Méthode | Statut |
|--------|------|---------|--------|
| Tomate cerise | Tomate | Hydroponie | Saine |
| Menthe fraîche | Menthe | Jarre enterrée | Stress hydrique |
| Basilic | Basilic | Hydroponie | Saine |
| Persil plat | Persil | Toit végétalisé | Jaunissement |
| Romarin | Romarin | Toit végétalisé | Saine |
| Laitue frisée | Laitue | Jarre enterrée | Saine |

---

## 🔄 Réinitialiser les données

Pour effacer toutes les données et recommencer avec les démos :

```javascript
// Dans la console du navigateur (F12)
localStorage.clear();
location.reload();
```

---

## 🌍 ODD — Objectifs de Développement Durable

| ODD | Titre | Contribution Smart Jarra |
|-----|-------|--------------------------|
| 2 | Faim Zéro | Production alimentaire locale en ville |
| 6 | Eau Propre | Économie 70% eau, récupération pluie |
| 11 | Villes Durables | Toits végétalisés, agriculture urbaine |
| 12 | Consommation Responsable | Zéro gaspillage, énergie turbine |
| 13 | Action Climatique | Réduction carbone, production verte |
| 17 | Partenariats | Collaboration Tunisie–Japon |

---

## 🇯🇵🇹🇳 Lien Japon–Tunisie

> *"Smart Jarra s'inspire des savoir-faire japonais en gestion durable de l'eau, de l'agriculture traditionnelle et du satoyama. Le projet adapte ces principes millénaires au contexte tunisien à travers les jarres enterrées, l'aquaponie, la récupération d'eau de pluie et l'agriculture urbaine."*

**Inspirations japonaises** :
- **Satoyama** — harmonie entre l'homme et la nature
- **Mottainai** — zéro gaspillage (eau, énergie, nourriture)
- **Ikigai** — raison d'être durable pour l'agriculture

**Adaptations tunisiennes** :
- Jarres poreuses traditionnelles (technique berbère ancienne)
- Adaptation aux plantes méditerranéennes et aromatiques
- Architecture adaptée au climat chaud et sec

---

## 📞 Contact & Crédits

**Projet académique** : Smart Jarra  
**Domaine** : Agriculture urbaine intelligente — IoT  
**Technologies** : HTML5, CSS3, JavaScript ES6+, localStorage, Canvas API  
**Compatible avec** : Supabase, TensorFlow.js, Next.js, Vercel

---

*© 2025 Smart Jarra — Tunisie 🇹🇳*
