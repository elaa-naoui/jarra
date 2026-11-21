/**
 * SMART JARRA — Base de données simulée (localStorage)
 * Remplace Supabase pour la version HTML standalone
 * 
 * SQL Schema Supabase équivalent en bas du fichier
 */

const DB = {
  // ── Clés localStorage ──────────────────────────────────
  KEYS: {
    plants:       'sj_plants',
    measurements: 'sj_measurements',
    jars:         'sj_jars',
    aquarium:     'sj_aquarium',
  },

  // ── Génération UUID ───────────────────────────────────
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  // ── Lecture ───────────────────────────────────────────
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  },

  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // ══════════════════════════════════════════════════════
  //   TABLE: PLANTS
  // ══════════════════════════════════════════════════════
  plants: {
    getAll() {
      return DB.get(DB.KEYS.plants);
    },

    getById(id) {
      return DB.get(DB.KEYS.plants).find(p => p.id === id) || null;
    },

    insert(plant) {
      const plants = DB.get(DB.KEYS.plants);
      const now    = new Date().toISOString();
      const record = {
        id:               DB.uuid(),
        nfc_id:           plant.nfc_id  || `NFC-${Date.now()}`,
        name:             plant.name    || 'Plante inconnue',
        type:             plant.type    || 'autre',
        season:           plant.season  || 'printemps',
        water_need:       plant.water_need    || 'normal',
        irrigation_method: plant.irrigation_method || 'jarre',
        status:           plant.status  || 'healthy',
        photo_url:        plant.photo_url || null,
        ai_score:         plant.ai_score || 0,
        created_at:       now,
        updated_at:       now,
      };
      plants.push(record);
      DB.set(DB.KEYS.plants, plants);

      // Créer automatiquement une jarre associée
      DB.jars.insert({
        plant_id:    record.id,
        level:       Math.round(50 + Math.random() * 40),
        valve_status: 'closed',
      });

      return record;
    },

    update(id, updates) {
      const plants = DB.get(DB.KEYS.plants);
      const idx    = plants.findIndex(p => p.id === id);
      if (idx === -1) return null;
      plants[idx] = {
        ...plants[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      DB.set(DB.KEYS.plants, plants);
      return plants[idx];
    },

    delete(id) {
      const plants = DB.get(DB.KEYS.plants).filter(p => p.id !== id);
      DB.set(DB.KEYS.plants, plants);
      // Supprimer mesures + jarres liées
      DB.measurements.deleteByPlant(id);
      DB.jars.deleteByPlant(id);
    },

    count() { return DB.get(DB.KEYS.plants).length; },
  },

  // ══════════════════════════════════════════════════════
  //   TABLE: MEASUREMENTS
  // ══════════════════════════════════════════════════════
  measurements: {
    getAll() {
      return DB.get(DB.KEYS.measurements);
    },

    getByPlant(plantId) {
      return DB.get(DB.KEYS.measurements)
        .filter(m => m.plant_id === plantId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getLatestByPlant(plantId) {
      const list = this.getByPlant(plantId);
      return list[0] || null;
    },

    insert(measurement) {
      const list = DB.get(DB.KEYS.measurements);
      const record = {
        id:             DB.uuid(),
        plant_id:       measurement.plant_id,
        temperature:    measurement.temperature    || 0,
        air_humidity:   measurement.air_humidity   || 0,
        soil_moisture:  measurement.soil_moisture  || 0,
        light:          measurement.light          || 0,
        ai_result:      measurement.ai_result      || 'healthy',
        confidence:     measurement.confidence     || 0,
        recommendation: measurement.recommendation || '',
        created_at:     new Date().toISOString(),
      };
      list.push(record);
      DB.set(DB.KEYS.measurements, list);

      // Mettre à jour le statut de la plante
      DB.plants.update(measurement.plant_id, {
        status: measurement.ai_result || 'healthy',
      });

      return record;
    },

    deleteByPlant(plantId) {
      const list = DB.get(DB.KEYS.measurements)
        .filter(m => m.plant_id !== plantId);
      DB.set(DB.KEYS.measurements, list);
    },

    getLast10() {
      return DB.get(DB.KEYS.measurements)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
    },
  },

  // ══════════════════════════════════════════════════════
  //   TABLE: JARS
  // ══════════════════════════════════════════════════════
  jars: {
    getAll() {
      return DB.get(DB.KEYS.jars);
    },

    getByPlant(plantId) {
      return DB.get(DB.KEYS.jars).find(j => j.plant_id === plantId) || null;
    },

    insert(jar) {
      const jars = DB.get(DB.KEYS.jars);
      const record = {
        id:           DB.uuid(),
        plant_id:     jar.plant_id,
        level:        jar.level        || 75,
        valve_status: jar.valve_status || 'closed',
        last_filled:  new Date().toISOString(),
      };
      jars.push(record);
      DB.set(DB.KEYS.jars, jars);
      return record;
    },

    update(id, updates) {
      const jars = DB.get(DB.KEYS.jars);
      const idx  = jars.findIndex(j => j.id === id);
      if (idx === -1) return null;
      jars[idx] = { ...jars[idx], ...updates };
      DB.set(DB.KEYS.jars, jars);
      return jars[idx];
    },

    deleteByPlant(plantId) {
      const jars = DB.get(DB.KEYS.jars).filter(j => j.plant_id !== plantId);
      DB.set(DB.KEYS.jars, jars);
    },

    getAverageLevel() {
      const jars = DB.get(DB.KEYS.jars);
      if (!jars.length) return 0;
      const sum = jars.reduce((acc, j) => acc + (j.level || 0), 0);
      return Math.round(sum / jars.length);
    },
  },

  // ══════════════════════════════════════════════════════
  //   TABLE: AQUARIUM
  // ══════════════════════════════════════════════════════
  aquarium: {
    KEY: 'sj_aquarium_data',

    get() {
      try {
        return JSON.parse(localStorage.getItem('sj_aquarium_data') || 'null') || {
          id:          DB.uuid(),
          level:       78,
          temperature: 24.5,
          ph:          7.2,
          ammonia:     0.1,
          nitrate:     5,
          fish_count:  8,
          updated_at:  new Date().toISOString(),
        };
      } catch { return null; }
    },

    update(data) {
      const current = this.get();
      const updated = { ...current, ...data, updated_at: new Date().toISOString() };
      localStorage.setItem('sj_aquarium_data', JSON.stringify(updated));
      return updated;
    },

    simulate() {
      const current = this.get();
      this.update({
        level:       Math.max(20, Math.min(100, current.level + (Math.random() - 0.5) * 2)),
        temperature: +(current.temperature + (Math.random() - 0.5) * 0.5).toFixed(1),
        ph:          +(current.ph + (Math.random() - 0.5) * 0.1).toFixed(2),
        ammonia:     +Math.max(0, (current.ammonia + (Math.random() - 0.6) * 0.05)).toFixed(2),
        nitrate:     +Math.max(0, (current.nitrate + (Math.random() - 0.5) * 1)).toFixed(1),
      });
    },
  },

  // ══════════════════════════════════════════════════════
  //   DONNÉES DE DÉMONSTRATION
  // ══════════════════════════════════════════════════════
  seedDemoData() {
    if (DB.plants.count() > 0) return; // Données déjà présentes

    const demoPlants = [
      { name: 'Tomate cerise',  type: 'tomate',   season: 'printemps', water_need: 'élevé',  irrigation_method: 'hydroponie',       status: 'healthy',      ai_score: 82 },
      { name: 'Menthe fraîche', type: 'menthe',   season: 'automne',   water_need: 'normal', irrigation_method: 'jarre enterrée',   status: 'water_stress', ai_score: 55 },
      { name: 'Basilic',        type: 'basilic',  season: 'printemps', water_need: 'élevé',  irrigation_method: 'hydroponie',       status: 'healthy',      ai_score: 75 },
      { name: 'Persil plat',    type: 'persil',   season: 'automne',   water_need: 'faible', irrigation_method: 'plante sur toit', status: 'yellow_leaves', ai_score: 32 },
      { name: 'Romarin',        type: 'romarin',  season: 'automne',   water_need: 'faible', irrigation_method: 'plante sur toit', status: 'healthy',      ai_score: 28 },
      { name: 'Laitue frisée',  type: 'laitue',  season: 'automne',   water_need: 'normal', irrigation_method: 'jarre enterrée',   status: 'healthy',      ai_score: 48 },
    ];

    demoPlants.forEach(p => {
      const plant = DB.plants.insert(p);
      // Ajouter mesures historiques
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const m = DB.measurements.insert({
          plant_id:      plant.id,
          temperature:   20 + Math.random() * 15,
          air_humidity:  40 + Math.random() * 40,
          soil_moisture: 20 + Math.random() * 60,
          light:         200 + Math.random() * 800,
          ai_result:     p.status,
          confidence:    70 + Math.random() * 30,
          recommendation: DB._getRecommendation(p.status),
        });
      }
    });

    console.log('✅ Données de démonstration insérées');
  },

  _getRecommendation(status) {
    const recs = {
      healthy:      'Plante en bonne santé. Continuer l\'irrigation normale.',
      water_stress: 'Augmenter l\'arrosage. Ouvrir la valve de la jarre.',
      yellow_leaves:'Vérifier le pH du sol. Ajouter du compost.',
      disease_spots:'Traiter avec un fongicide naturel. Isoler la plante.',
      wilting:      'Arrosage immédiat nécessaire. Vérifier les racines.',
    };
    return recs[status] || 'Surveiller la plante.';
  },
};

/*
 ══════════════════════════════════════════════════════════════
 SCHÉMA SQL SUPABASE
 (Pour connecter une vraie base de données Supabase)
 ══════════════════════════════════════════════════════════════

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

 -- RLS Policies (Row Level Security)
 ALTER TABLE plants       ENABLE ROW LEVEL SECURITY;
 ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
 ALTER TABLE jars         ENABLE ROW LEVEL SECURITY;
 ALTER TABLE aquarium     ENABLE ROW LEVEL SECURITY;

 -- Allow public read/write for demo
 CREATE POLICY "Public access" ON plants       FOR ALL USING (true);
 CREATE POLICY "Public access" ON measurements FOR ALL USING (true);
 CREATE POLICY "Public access" ON jars         FOR ALL USING (true);
 CREATE POLICY "Public access" ON aquarium     FOR ALL USING (true);

 ══════════════════════════════════════════════════════════════
 CONNEXION SUPABASE (remplacer le localStorage par Supabase)
 ══════════════════════════════════════════════════════════════

 // Dans .env.local :
 // NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 // NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...

 // import { createClient } from '@supabase/supabase-js'
 // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 // const { data, error } = await supabase.from('plants').select('*')
*/
