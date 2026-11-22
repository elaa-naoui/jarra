# Smart Jarra — Plateforme Intelligente d'Agriculture Urbaine en Tunisie 🇹🇳

> **« Smart Jarra — chaque goutte cultive demain. »**

Projet académique d'excellence combinant les savoir-faire traditionnels de l'irrigation par **jarres en terre cuite poreuses tunisiennes**, l'**aquaponie en circuit fermé**, la **robotique mobile d'inspection autonome**, les **étiquettes NFC**, l'**intelligence artificielle prédictive (TensorFlow.js)** et la **micro-hydroélectricité**.

---

## 📑 Table des matières

1. [Objectifs et Fonctionnalités](#-objectifs-et-fonctionnalités)
2. [Stack Technique Complète](#-stack-technique-complète)
3. [Structure Complète du Projet](#-structure-complète-du-projet)
4. [Schéma de Base de Données Supabase](#-schéma-de-base-de-données-supabase)
5. [IA de Besoin en Eau (Règles & Algorithme)](#-ia-de-besoin-en-eau)
6. [IA d'Analyse Foliaire (TensorFlow.js & Simulation)](#-ia-danalyse-foliaire)
7. [Robot Mobile Virtuel (JarraBot)](#-robot-mobile-virtuel)
8. [Guide d'Installation & Commandes NPM](#-guide-dinstallation)
9. [Variables d'Environnement](#-variables-denvironnement)
10. [Connexion & Configuration Supabase](#-connexion--configuration-supabase)
11. [Déploiement en Production sur Vercel](#-déploiement-sur-vercel)
12. [Version Démo Sans Installation (Single File HTML)](#-version-démo-sans-installation)
13. [Alignement ODD & Coopération Japon–Tunisie](#-alignement-odd--coopération-japon-tunisie)

---

## 🎯 Objectifs et Fonctionnalités

- **Calcul IA du besoin hydrique** selon le type de végétal, microclimat et saison automatique.
- **Orientation culturale** :
  - Hydroponie si besoin élevé (&ge; 70 pts).
  - Jarre enterrée si besoin modéré (40 à 69 pts).
  - Toiture végétalisée si besoin faible (&lt; 40 pts).
- **Robot mobile virtuel autonome (JarraBot)** :
  - Déplacement pas à pas de pot en pot.
  - Lecture automatique de la puce NFC virtuelle.
  - Prise de vue caméra spectrale.
  - Relevé des sondes IoT (T°, Humidité air, Humidité racinaire).
  - Diagnostic foliaire instantané.
- **Analyse photographique par réseau convolutif (5 classes)** :
  - `healthy` (saine)
  - `water_stress` (stress hydrique)
  - `yellow_leaves` (feuilles jaunes / chlorose)
  - `disease_spots` (taches foliaires / pathologie)
  - `wilting` (flétrissement avancé)
- **Gestion intégrée de l'hydraulique urbaine** :
  - Jarres enterrées microporeuses.
  - Bassin aquaponique (Tilapia du Nil, cycle des nitrates).
  - Réservoir de collecte pluviale.
  - Puits traditionnel avec roue à godets (Noria).
  - Micro-turbine hydroélectrique pour recharge locale.

---

## 🛠 Stack Technique Complète

- **Framework** : Next.js 14 / 15 (App Router, Server & Client Components).
- **Langage** : TypeScript 5 (Typage strict de bout en bout).
- **Design System** : Tailwind CSS avec charte aux couleurs du projet :
  - Vert (#2e7d32)
  - Bleu (#1565c0)
  - Blanc (#ffffff)
  - Terracotta / Terre cuite (#d84315)
  - Fond doux (#f4f7f4)
- **Base de Données** : Supabase (PostgreSQL, Row Level Security, Triggers & Index).
- **Moteur IA Vision** : TensorFlow.js (`@tensorflow/tfjs` + MobileNet / PlantVillage).
- **Graphiques** : Recharts (Courbes microclimatiques interactives 24h).
- **Animations** : Framer Motion.
- **Icônes** : Lucide React.
- **État Global** : Zustand (Store réactif avec persistance locale et synchronisation cloud).

---

## 📂 Structure Complète du Projet

```text
smart-jarra-next/
├── .env.example                # Modèle de variables d'environnement
├── .env.local                  # Clés Supabase et mode démo
├── next.config.js              # Configuration Next.js (optimisations d'images, Webpack)
├── package.json                # Dépendances et scripts de démarrage
├── postcss.config.js           # Configuration PostCSS
├── tailwind.config.ts          # Thème Tailwind personnalisé (couleurs #2e7d32, #1565c0, #d84315)
├── tsconfig.json               # Configuration TypeScript et alias de chemin (@/*)
├── supabase/
│   └── schema.sql              # Schéma SQL complet (5 tables, RLS, triggers, seed data)
└── src/
    ├── types/
    │   └── index.ts            # Interfaces TypeScript : Plant, Measurement, Jar, Aquarium, Alert...
    ├── lib/
    │   ├── supabase.ts         # Client Supabase & données de secours (offline-ready)
    │   ├── aiWaterNeed.ts      # Algorithme de besoin en eau & saisons automatiques
    │   └── tfPlantClassifier.ts# Inférence TensorFlow.js & simulation de vision
    ├── store/
    │   └── useJarraStore.ts    # Store Zustand global avec logique robot et capteurs
    ├── components/
    │   ├── Navbar.tsx          # Navigation sticky, logo, badge Tunisie, sélecteur TF.js
    │   ├── Footer.tsx          # Devise, lien Japon-Tunisie, 6 ODD des Nations Unies
    │   ├── RobotMap.tsx        # Carte dynamique du jardin, animation du robot & lecture NFC
    │   ├── Charts.tsx          # Graphiques Recharts : température, hygrométrie et sol
    │   ├── PhotoUploader.tsx   # Analyse photo, presets feuilles, jauge de confiance IA
    │   ├── WaterNeedCalculator.tsx # Calculateur interactif & saison automatique
    │   └── HydroEcosystem.tsx  # Aquarium, jarres, réservoir, noria et micro-turbine
    └── app/
        ├── layout.tsx          # Root layout avec polices Inter et Poppins
        ├── globals.css         # Directives Tailwind et styles globaux
        ├── page.tsx            # 1. Page d'Accueil complète
        ├── plantation/
        │   └── page.tsx        # 2. Page Plantation Immédiate
        ├── robot/
        │   └── page.tsx        # 3. Page Robot Mobile Virtuel
        ├── analyse-photo/
        │   └── page.tsx        # 4. Page Analyse Photo IA
        ├── mes-plantes/
        │   └── page.tsx        # 5. Page Mes Plantes (gestion, édition, suppression)
        └── dashboard/
            └── page.tsx        # 6. Page Tableau de Bord Général
```

---

## 🗄 Schéma de Base de Données Supabase

Le fichier `supabase/schema.sql` contient les définitions complètes pour PostgreSQL :

1. **`plants`** : ID, NFC ID (`NFC-TUN-xxx`), nom, type, saison, besoin en eau, méthode d'irrigation, statut sanitaire, photo.
2. **`measurements`** : ID, plant_id, température, humidité de l'air, humidité du sol, luminosité, diagnostic IA, confiance, recommandation, horodatage.
3. **`jars`** : ID, plant_id, niveau d'eau (%), statut de vanne (`open`/`closed`), dernier remplissage.
4. **`aquarium`** : ID, niveau (%), température, pH, ammoniac (NH3), nitrates (NO3), nombre de poissons (Tilapia).
5. **`alerts`** : ID, plant_id, type (`warning`, `danger`, `info`, `success`), message, horodatage.

---

## 🤖 Algorithme IA de Besoin en Eau

Fonction `aiWaterNeed(params)` (`src/lib/aiWaterNeed.ts`) :
- **Saisons automatiques selon l'espèce** :
  - Tomate : printemps
  - Menthe : automne
  - Basilic : printemps
  - Persil : automne
  - Romarin : automne
  - Laitue : automne
  - Fraise : automne
- **Calcul du score (0 à 100)** :
  `Score = BaseEspece + (T° - 22)*1.8 + (60 - HumiditeAir)*0.45 + (65 - HumiditeSol)*0.55 + FacteurSoleil - FacteurPluie + FacteurSaison`
- **Règles décisionnelles strictes** :
  - **Score &ge; 70** : Besoin Élevé &rarr; **Hydroponie** si compatible (sinon Jarre).
  - **40 &le; Score &le; 69** : Besoin Normal &rarr; **Jarre enterrée**.
  - **Score &lt; 40** : Besoin Faible &rarr; **Plantes sur le toit** si compatible (sinon Jarre).

---

## 🚀 Guide d'Installation & Commandes NPM

### Prérequis
- Node.js version 18.17 ou supérieure (version 20 ou 22 recommandée).
- Gestionnaire de paquets `npm` ou `pnpm` ou `yarn`.

### Étapes d'exécution

```bash
# 1. Se positionner dans le dossier du projet Next.js
cd c:\Users\user\Desktop\4iot\inovation\smart-jarra-next

# 2. Installer toutes les dépendances
npm install

# 3. Lancer le serveur de développement en local
npm run dev

# 4. Ouvrir votre navigateur sur
http://localhost:3000
```

Pour compiler le build de production prêt pour la présentation :
```bash
npm run build
npm run start
```

---

## 🔑 Variables d'Environnement

Créez ou éditez le fichier `.env.local` :

```env
# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co

# Clé anonyme publique Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Activer le mode démo (fonctionne à 100% même sans connexion internet ou sans Supabase)
NEXT_PUBLIC_DEMO_MODE=true
```

---

## ☁️ Déploiement sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com).
2. Liez votre dépôt GitHub contenant le dossier `smart-jarra-next`.
3. Configurez les variables d'environnement dans l'interface Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Cliquez sur **Deploy** : votre plateforme sera accessible mondialement en HTTPS en moins de 2 minutes !

---

## ⚡ Version Démo Rapide Sans Installation

Si le jury ne souhaite pas installer Node.js ni lancer de terminal :
1. Allez dans le dossier racine : `c:\Users\user\Desktop\4iot\inovation`
2. Double-cliquez directement sur **`smart-jarra-standalone.html`**
3. Tout s'ouvre immédiatement dans Chrome, Edge ou Firefox avec l'ensemble des 6 pages interactives, le robot animé, les calculs IA et le tableau de bord !
