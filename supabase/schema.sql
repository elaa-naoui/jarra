-- =============================================================================
-- SMART JARRA — SCHÉMA SQL COMPLET SUPABASE (PostgreSQL)
-- « Chaque goutte cultive demain » — Agriculture Urbaine Intelligente en Tunisie
-- =============================================================================

-- 1. Activation de l'extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Nettoyage si réinstallation
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS jars CASCADE;
DROP TABLE IF EXISTS measurements CASCADE;
DROP TABLE IF EXISTS aquarium CASCADE;
DROP TABLE IF EXISTS plants CASCADE;

-- 2. TABLE : plants (Répertoire des plantes du jardin urbain)
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    season TEXT NOT NULL,
    water_need TEXT NOT NULL,           -- 'Faible' | 'Normal' | 'Élevé'
    irrigation_method TEXT NOT NULL,    -- 'Jarre enterrée' | 'Hydroponie' | 'Plantes sur le toit'
    status TEXT NOT NULL DEFAULT 'healthy', -- 'healthy' | 'water_stress' | 'yellow_leaves' | 'disease_spots' | 'wilting'
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les scans NFC et les filtres par statut
CREATE INDEX idx_plants_nfc_id ON plants(nfc_id);
CREATE INDEX idx_plants_status ON plants(status);
CREATE INDEX idx_plants_type ON plants(type);

-- 3. TABLE : measurements (Historique des télémesures capteurs IoT & IA)
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    temperature NUMERIC(5, 2) NOT NULL,    -- en °C
    air_humidity NUMERIC(5, 2) NOT NULL,   -- en %
    soil_moisture NUMERIC(5, 2) NOT NULL,  -- en %
    light NUMERIC(7, 2) NOT NULL,          -- en lux ou %
    ai_result TEXT NOT NULL,               -- diagnostic IA ('healthy', etc.)
    confidence NUMERIC(5, 2) NOT NULL,     -- pourcentage de confiance (0-100)
    recommendation TEXT NOT NULL,          -- recommandation agronomique
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_measurements_plant_id ON measurements(plant_id);
CREATE INDEX idx_measurements_created_at ON measurements(created_at DESC);

-- 4. TABLE : jars (Surveillance des jarres en terre cuite microporeuses enterrées)
CREATE TABLE jars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    level NUMERIC(5, 2) NOT NULL DEFAULT 85.0,  -- Niveau d'eau en %
    valve_status TEXT NOT NULL DEFAULT 'closed',-- 'open' | 'closed' | 'auto'
    last_filled TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jars_plant_id ON jars(plant_id);

-- 5. TABLE : aquarium (Bassin aquaponique couplé au système de bio-filtration)
CREATE TABLE aquarium (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level NUMERIC(5, 2) NOT NULL DEFAULT 92.0,       -- Niveau d'eau en %
    temperature NUMERIC(5, 2) NOT NULL DEFAULT 23.5, -- Température de l'eau en °C
    ph NUMERIC(4, 2) NOT NULL DEFAULT 7.2,           -- Potentiel hydrogène
    ammonia NUMERIC(5, 3) NOT NULL DEFAULT 0.02,     -- NH3/NH4+ en mg/L
    nitrate NUMERIC(6, 2) NOT NULL DEFAULT 18.5,     -- NO3- absorbé par les plantes en mg/L
    fish_count INTEGER NOT NULL DEFAULT 24           -- Nombre de poissons (Tilapia du Nil / Carpes)
);

-- 6. TABLE : alerts (Centre d'alertes temps-réel du jardin urbain)
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    type TEXT NOT NULL,                              -- 'warning' | 'danger' | 'info' | 'success'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- =============================================================================
-- TRIGGER : Mise à jour automatique de updated_at sur plants
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_plants_updated_at
BEFORE UPDATE ON plants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- POLITIQUES DE SÉCURITÉ (Row Level Security - RLS)
-- Pour une utilisation académique ouverte avec clé publique (Anon Key)
-- =============================================================================
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE jars ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des plantes" ON plants FOR SELECT USING (true);
CREATE POLICY "Insertion publique des plantes" ON plants FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique des plantes" ON plants FOR UPDATE USING (true);
CREATE POLICY "Suppression publique des plantes" ON plants FOR DELETE USING (true);

CREATE POLICY "Lecture publique des mesures" ON measurements FOR SELECT USING (true);
CREATE POLICY "Insertion publique des mesures" ON measurements FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture publique des jarres" ON jars FOR SELECT USING (true);
CREATE POLICY "Modification publique des jarres" ON jars FOR UPDATE USING (true);

CREATE POLICY "Lecture publique de l aquarium" ON aquarium FOR SELECT USING (true);
CREATE POLICY "Modification publique de l aquarium" ON aquarium FOR UPDATE USING (true);

CREATE POLICY "Lecture publique des alertes" ON alerts FOR SELECT USING (true);
CREATE POLICY "Insertion publique des alertes" ON alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppression publique des alertes" ON alerts FOR DELETE USING (true);

-- =============================================================================
-- JEU DE DONNÉES DE DÉPART (Seed data - Tunisie & Agriculture Urbaine)
-- =============================================================================

INSERT INTO plants (id, nfc_id, name, type, season, water_need, irrigation_method, status, photo_url) VALUES
('11111111-1111-1111-1111-111111111111', 'NFC-TUN-001', 'Tomate Cerise Mornag', 'Tomate', 'printemps', 'Normal', 'Jarre enterrée', 'healthy', 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'),
('22222222-2222-2222-2222-222222222222', 'NFC-TUN-002', 'Menthe Verte Zaghouan', 'Menthe', 'automne', 'Élevé', 'Hydroponie', 'healthy', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80'),
('33333333-3333-3333-3333-333333333333', 'NFC-TUN-003', 'Basilic Grand Vert', 'Basilic', 'printemps', 'Normal', 'Jarre enterrée', 'water_stress', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80'),
('44444444-4444-4444-4444-444444444444', 'NFC-TUN-004', 'Romarin Sauvage Chaambi', 'Romarin', 'automne', 'Faible', 'Plantes sur le toit', 'healthy', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'),
('55555555-5555-5555-5555-555555555555', 'NFC-TUN-005', 'Laitue Romaine Ariana', 'Laitue', 'automne', 'Élevé', 'Hydroponie', 'yellow_leaves', 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80'),
('66666666-6666-6666-6666-666666666666', 'NFC-TUN-006', 'Persil Plat Tunisien', 'Persil', 'automne', 'Normal', 'Jarre enterrée', 'healthy', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80');

-- Historique des mesures pour la Tomate Cerise
INSERT INTO measurements (plant_id, temperature, air_humidity, soil_moisture, light, ai_result, confidence, recommendation, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 24.5, 55.0, 68.0, 850.0, 'healthy', 96.5, 'Niveau hydrique optimal via la jarre poreuse. Maintenir le remplissage hebdomadaire.', NOW() - INTERVAL '3 hours'),
('11111111-1111-1111-1111-111111111111', 26.2, 51.0, 64.0, 920.0, 'healthy', 94.8, 'Végétation vigoureuse, aucun signe de mildiou ou flétrissement.', NOW() - INTERVAL '1 hour');

-- Mesures pour le Basilic en stress hydrique
INSERT INTO measurements (plant_id, temperature, air_humidity, soil_moisture, light, ai_result, confidence, recommendation, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 29.8, 38.0, 32.0, 980.0, 'water_stress', 91.2, 'Humidité du sol inférieure au seuil critique (32%). Remplir la jarre immédiatement.', NOW() - INTERVAL '45 minutes');

-- Jarres associées aux plantes
INSERT INTO jars (plant_id, level, valve_status, last_filled) VALUES
('11111111-1111-1111-1111-111111111111', 78.0, 'closed', NOW() - INTERVAL '1 day'),
('33333333-3333-3333-3333-333333333333', 22.0, 'open', NOW() - INTERVAL '3 days'),
('66666666-6666-6666-6666-666666666666', 85.0, 'closed', NOW() - INTERVAL '12 hours');

-- État du bassin aquaponique
INSERT INTO aquarium (level, temperature, ph, ammonia, nitrate, fish_count) VALUES
(94.0, 23.8, 7.25, 0.018, 22.4, 28);

-- Alertes initiales
INSERT INTO alerts (plant_id, type, message, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'warning', 'Stress hydrique détecté sur le Basilic Grand Vert (NFC-TUN-003) : humidité sol 32%', NOW() - INTERVAL '40 minutes'),
('55555555-5555-5555-5555-555555555555', 'danger', 'Chlorose/Feuilles jaunes observées sur la Laitue Romaine (NFC-TUN-005) : carence en azote possible', NOW() - INTERVAL '2 hours'),
(NULL, 'info', 'Turbine hydraulique opérationnelle : 4.2W générés lors du recyclage d eau de pluie', NOW() - INTERVAL '4 hours');
