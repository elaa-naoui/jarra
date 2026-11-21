export type PlantType =
  | "Tomate"
  | "Menthe"
  | "Basilic"
  | "Persil"
  | "Romarin"
  | "Laitue"
  | "Fraise";

export type Season = "printemps" | "automne";

export type WaterNeedLevel = "Faible" | "Normal" | "Élevé";

export type IrrigationMethod =
  | "Hydroponie"
  | "Jarre enterrée"
  | "Plantes sur le toit";

export type DiagnosticClass =
  | "healthy"
  | "water_stress"
  | "yellow_leaves"
  | "disease_spots"
  | "wilting";

export interface Plant {
  id: string;
  nfc_id: string;
  name: string;
  type: PlantType;
  season: Season;
  water_need: WaterNeedLevel;
  irrigation_method: IrrigationMethod;
  status: DiagnosticClass;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  pot_index?: number;
}

export interface Measurement {
  id: string;
  plant_id: string;
  temperature: number; // °C
  air_humidity: number; // %
  soil_moisture: number; // %
  light: number; // lux
  ai_result: DiagnosticClass;
  confidence: number; // %
  recommendation: string;
  created_at: string;
}

export interface Jar {
  id: string;
  plant_id: string;
  level: number; // %
  valve_status: "open" | "closed" | "auto";
  last_filled: string;
}

export interface Aquarium {
  id: string;
  level: number; // %
  temperature: number; // °C
  ph: number;
  ammonia: number; // mg/L
  nitrate: number; // mg/L
  fish_count: number;
}

export interface Alert {
  id: string;
  plant_id?: string | null;
  type: "warning" | "danger" | "info" | "success";
  message: string;
  created_at: string;
}

export interface AIWaterNeedParams {
  plantType: PlantType;
  temperature: number;
  airHumidity: number;
  soilMoisture: number;
  season: Season;
  light: number; // lux
  rain: number; // mm
}

export interface AIWaterNeedResult {
  score: number; // 0 à 100
  waterNeed: WaterNeedLevel;
  recommendedMethod: IrrigationMethod;
  reason: string;
}

export interface PhotoAnalysisResult {
  diagnostic: DiagnosticClass;
  labelFr: string;
  confidence: number;
  recommendation: string;
  photoUrl: string;
  modelUsed: "simulation" | "tensorflow_mobilenet";
  details?: {
    chlorophyllIndex?: number;
    hydrationScore?: number;
    necrosisCoverage?: number;
  };
}

export interface RobotState {
  isRunning: boolean;
  currentPotIndex: number; // 0 to plants.length - 1
  phase: "idle" | "moving" | "scanning_nfc" | "taking_photo" | "measuring" | "analyzing" | "completed";
  progress: number; // 0-100
  lastReadNfc: string | null;
  lastSnapshot: string | null;
  statusMessage: string;
}
