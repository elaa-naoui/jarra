import {
  PlantType,
  Season,
  AIWaterNeedParams,
  AIWaterNeedResult,
  IrrigationMethod,
  WaterNeedLevel,
} from "@/types";

/**
 * Table de correspondance automatique de la saison selon le type de plante
 * Tomate : printemps
 * Menthe : automne
 * Basilic : printemps
 * Persil : automne
 * Romarin : automne
 * Laitue : automne
 * Fraise : automne
 */
export const PLANT_SEASONS: Record<PlantType, Season> = {
  Tomate: "printemps",
  Menthe: "automne",
  Basilic: "printemps",
  Persil: "automne",
  Romarin: "automne",
  Laitue: "automne",
  Fraise: "automne",
};

/**
 * Compatibilités culturales des plantes
 */
export const PLANT_COMPATIBILITY: Record<
  PlantType,
  {
    hydroponic: boolean;
    greenRoof: boolean;
    jarreRecommended: boolean;
    baseWaterNeed: number; // base factor
  }
> = {
  Tomate: {
    hydroponic: true,
    greenRoof: false,
    jarreRecommended: true,
    baseWaterNeed: 65,
  },
  Menthe: {
    hydroponic: true,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 70,
  },
  Basilic: {
    hydroponic: true,
    greenRoof: false,
    jarreRecommended: true,
    baseWaterNeed: 55,
  },
  Persil: {
    hydroponic: true,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 50,
  },
  Romarin: {
    hydroponic: false,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 25,
  },
  Laitue: {
    hydroponic: true,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 68,
  },
  Fraise: {
    hydroponic: true,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 60,
  },
};

/**
 * Obtient la saison par défaut associée à une plante
 */
export function getSeasonForPlant(type: PlantType): Season {
  return PLANT_SEASONS[type] || "printemps";
}

/**
 * Algorithme agronomique d'IA calculant le score de besoin en eau (0 à 100)
 * et recommandant la méthode d'irrigation optimale selon les règles strictes du projet :
 * - score >= 70 : Besoin élevé -> Hydroponie si compatible, sinon Jarre enterrée.
 * - 40 <= score <= 69 : Besoin normal -> Jarre enterrée.
 * - score < 40 : Besoin faible -> Plantes sur le toit si compatible, sinon Jarre enterrée.
 */
export function aiWaterNeed(params: AIWaterNeedParams): AIWaterNeedResult {
  const {
    plantType,
    temperature,
    airHumidity,
    soilMoisture,
    season,
    light,
    rain,
  } = params;

  const plantInfo = PLANT_COMPATIBILITY[plantType] || {
    hydroponic: true,
    greenRoof: true,
    jarreRecommended: true,
    baseWaterNeed: 50,
  };

  // 1. Facteur de base lié à l'espèce
  let score = plantInfo.baseWaterNeed;

  // 2. Facteur Thermique (en Tunisie le stress commence au-dessus de 25°C)
  // Température normale : ~20-22°C. Au-dessus : +2 pts/°C. En dessous : -1.5 pts/°C
  const tempDelta = temperature - 22;
  score += tempDelta * 1.8;

  // 3. Facteur Humidité de l'Air (l'air sec augmente l'évapotranspiration)
  // Air humide (70%) compense, air sec (<40%) assèche fortement
  const humidityDelta = 60 - airHumidity;
  score += humidityDelta * 0.45;

  // 4. Facteur Humidité du Sol (si sol déjà sec, le besoin immédiat augmente)
  // Sol optimal à 65%. Si sol à 30%, fort déficit
  const soilDeficit = 65 - soilMoisture;
  score += soilDeficit * 0.55;

  // 5. Facteur Rayonnement Lumineux / Ensoleillement (lux)
  // 1000 lux ou plein soleil méditerranéen stimule la transpiration
  if (light > 800) {
    score += 8;
  } else if (light < 300) {
    score -= 5;
  }

  // 6. Facteur Pluviométrie / Eau de pluie (mm)
  // La pluie diminue directement le besoin d'irrigation artificielle
  if (rain > 0) {
    score -= Math.min(rain * 2.5, 30);
  }

  // 7. Facteur Saison
  // En été/printemps tunisien, l'évapotranspiration est plus forte qu'en automne/hiver
  if (season === "printemps") {
    score += 5;
  } else {
    score -= 3;
  }

  // Bornage du score entre 0 et 100
  score = Math.round(Math.max(0, Math.min(100, score)));

  // Détermination du niveau de besoin et de la méthode
  let waterNeed: WaterNeedLevel;
  let recommendedMethod: IrrigationMethod;
  let reason = "";

  if (score >= 70) {
    waterNeed = "Élevé";
    if (plantInfo.hydroponic) {
      recommendedMethod = "Hydroponie";
      reason = `Besoin hydrique critique (${score}/100) induit par une température élevée (${temperature}°C) et un sol pauvre en eau (${soilMoisture}%). L'hydroponie en circuit fermé assure une nutrition minérale continue sans stress hydrique.`;
    } else {
      recommendedMethod = "Jarre enterrée";
      reason = `Besoin hydrique élevé (${score}/100), mais l'espèce (${plantType}) préfère un enracinement profond. La jarre enterrée fournit une diffusion racinaire microporeuse continue sans choc.`;
    }
  } else if (score >= 40) {
    waterNeed = "Normal";
    recommendedMethod = "Jarre enterrée";
    reason = `Besoin hydrique modéré (${score}/100). La technique ancestrale de la jarre en terre cuite enterrée est idéale : zéro évaporation de surface, économie de 70% d'eau et humidification constante du rhizosphère.`;
  } else {
    waterNeed = "Faible";
    if (plantInfo.greenRoof) {
      recommendedMethod = "Plantes sur le toit";
      reason = `Besoin hydrique très sobre (${score}/100). Parfaitement adapté à la toiture végétalisée urbaine, résistant aux vents et réduisant l'îlot de chaleur urbain en Tunisie.`;
    } else {
      recommendedMethod = "Jarre enterrée";
      reason = `Besoin hydrique faible (${score}/100). La jarre poreuse enterrée à remplissage espacé suffit largement et protège les racines.`;
    }
  }

  return {
    score,
    waterNeed,
    recommendedMethod,
    reason,
  };
}
