import { createClient } from "@supabase/supabase-js";
import { Plant, Measurement, Jar, Aquarium, Alert } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key";

export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://votre-projet.supabase.co" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "votre_cle_anon_publique";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Données de démonstration académiques pré-intégrées
 */
export const INITIAL_PLANTS: Plant[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    nfc_id: "NFC-TUN-001",
    name: "Tomate Cerise Mornag",
    type: "Tomate",
    season: "printemps",
    water_need: "Normal",
    irrigation_method: "Jarre enterrée",
    status: "healthy",
    photo_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 0,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    nfc_id: "NFC-TUN-002",
    name: "Menthe Verte Zaghouan",
    type: "Menthe",
    season: "automne",
    water_need: "Élevé",
    irrigation_method: "Hydroponie",
    status: "healthy",
    photo_url: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 1,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    nfc_id: "NFC-TUN-003",
    name: "Basilic Grand Vert",
    type: "Basilic",
    season: "printemps",
    water_need: "Normal",
    irrigation_method: "Jarre enterrée",
    status: "water_stress",
    photo_url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 2,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    nfc_id: "NFC-TUN-004",
    name: "Romarin Sauvage Chaambi",
    type: "Romarin",
    season: "automne",
    water_need: "Faible",
    irrigation_method: "Plantes sur le toit",
    status: "healthy",
    photo_url: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 3,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    nfc_id: "NFC-TUN-005",
    name: "Laitue Romaine Ariana",
    type: "Laitue",
    season: "automne",
    water_need: "Élevé",
    irrigation_method: "Hydroponie",
    status: "yellow_leaves",
    photo_url: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 4,
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    nfc_id: "NFC-TUN-006",
    name: "Persil Plat Tunisien",
    type: "Persil",
    season: "automne",
    water_need: "Normal",
    irrigation_method: "Jarre enterrée",
    status: "healthy",
    photo_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    pot_index: 5,
  },
];

export const INITIAL_AQUARIUM: Aquarium = {
  id: "aq-01",
  level: 94.0,
  temperature: 23.8,
  ph: 7.25,
  ammonia: 0.018,
  nitrate: 22.4,
  fish_count: 28,
};

export const INITIAL_ALERTS: Alert[] = [
  {
    id: "alt-01",
    plant_id: "33333333-3333-3333-3333-333333333333",
    type: "warning",
    message: "Stress hydrique sur Basilic Grand Vert : humidité sol à 32% (jarre vide).",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "alt-02",
    plant_id: "55555555-5555-5555-5555-555555555555",
    type: "danger",
    message: "Chlorose foliaire constatée sur Laitue Romaine : apport azote requis.",
    created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: "alt-03",
    plant_id: null,
    type: "success",
    message: "Turbine hydraulique : 4.8 Wh d'énergie propre récupérés via l'eau de pluie.",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];
