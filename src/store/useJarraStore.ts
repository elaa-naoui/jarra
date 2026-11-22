import { create } from "zustand";
import {
  Plant,
  Measurement,
  Jar,
  Aquarium,
  Alert,
  RobotState,
  DiagnosticClass,
  IrrigationMethod,
} from "@/types";
import {
  INITIAL_PLANTS,
  INITIAL_AQUARIUM,
  INITIAL_ALERTS,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";
import { DIAGNOSTIC_DETAILS } from "@/lib/tfPlantClassifier";

interface JarraStore {
  plants: Plant[];
  measurements: Measurement[];
  jars: Record<string, Jar>;
  aquarium: Aquarium;
  rainwaterTank: {
    level: number; // %
    capacityLiters: number;
    currentLiters: number;
  };
  microTurbine: {
    powerWatts: number;
    energyProducedWh: number;
    isSpinning: boolean;
  };
  noriaWell: {
    depthMeters: number;
    isOperating: boolean;
    waterExtractedLiters: number;
  };
  alerts: Alert[];
  robotState: RobotState;
  isRealModelActive: boolean;

  // Actions
  fetchData: () => Promise<void>;
  addPlant: (plantData: {
    name: string;
    type: Plant["type"];
    season: Plant["season"];
    water_need: Plant["water_need"];
    irrigation_method: Plant["irrigation_method"];
    status?: DiagnosticClass;
    photo_url?: string;
  }) => Promise<Plant>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  addMeasurement: (measurement: Omit<Measurement, "id" | "created_at">) => void;
  addAlert: (alert: Omit<Alert, "id" | "created_at">) => void;
  dismissAlert: (id: string) => void;
  toggleRealModel: () => void;
  startRobot: () => void;
  stopRobot: () => void;
  refillJar: (plantId: string) => void;
  operateNoriaWell: () => void;
  activateTurbine: () => void;
}

export const useJarraStore = create<JarraStore>((set, get) => ({
  plants: INITIAL_PLANTS,
  measurements: [
    {
      id: "m-01",
      plant_id: "11111111-1111-1111-1111-111111111111",
      temperature: 24.5,
      air_humidity: 55,
      soil_moisture: 68,
      light: 850,
      ai_result: "healthy",
      confidence: 96.5,
      recommendation: "Niveau hydrique optimal via la jarre poreuse.",
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "m-02",
      plant_id: "33333333-3333-3333-3333-333333333333",
      temperature: 29.8,
      air_humidity: 38,
      soil_moisture: 32,
      light: 980,
      ai_result: "water_stress",
      confidence: 91.2,
      recommendation: "Humidité basse. Recharger la jarre enterrée.",
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ],
  jars: {
    "11111111-1111-1111-1111-111111111111": {
      id: "j-01",
      plant_id: "11111111-1111-1111-1111-111111111111",
      level: 78,
      valve_status: "closed",
      last_filled: new Date(Date.now() - 86400000).toISOString(),
    },
    "33333333-3333-3333-3333-333333333333": {
      id: "j-02",
      plant_id: "33333333-3333-3333-3333-333333333333",
      level: 18,
      valve_status: "open",
      last_filled: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    "66666666-6666-6666-6666-666666666666": {
      id: "j-03",
      plant_id: "66666666-6666-6666-6666-666666666666",
      level: 84,
      valve_status: "closed",
      last_filled: new Date(Date.now() - 43200000).toISOString(),
    },
  },
  aquarium: INITIAL_AQUARIUM,
  rainwaterTank: {
    level: 76,
    capacityLiters: 1200,
    currentLiters: 912,
  },
  microTurbine: {
    powerWatts: 4.5,
    energyProducedWh: 38.6,
    isSpinning: true,
  },
  noriaWell: {
    depthMeters: 8.5,
    isOperating: false,
    waterExtractedLiters: 145,
  },
  alerts: INITIAL_ALERTS,
  robotState: {
    isRunning: false,
    currentPotIndex: 0,
    phase: "idle",
    progress: 0,
    lastReadNfc: null,
    lastSnapshot: null,
    statusMessage: "Robot en attente sur sa station de charge.",
  },
  isRealModelActive: false,

  fetchData: async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: plantsData } = await supabase.from("plants").select("*");
      if (plantsData && plantsData.length > 0) {
        set({ plants: plantsData as Plant[] });
      }

      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (alertsData) {
        set({ alerts: alertsData as Alert[] });
      }

      const { data: aqData } = await supabase.from("aquarium").select("*").single();
      if (aqData) {
        set({ aquarium: aqData as Aquarium });
      }
    } catch (err) {
      console.warn("Utilisation du cache local (Supabase hors ligne) :", err);
    }
  },

  addPlant: async (plantData) => {
    const newId = crypto.randomUUID();
    const potIndex = get().plants.length;
    const nfcId = `NFC-TUN-${String(potIndex + 1).padStart(3, "0")}`;

    const newPlant: Plant = {
      id: newId,
      nfc_id: nfcId,
      name: plantData.name,
      type: plantData.type,
      season: plantData.season,
      water_need: plantData.water_need,
      irrigation_method: plantData.irrigation_method,
      status: plantData.status || "healthy",
      photo_url:
        plantData.photo_url ||
        "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pot_index: potIndex,
    };

    set((state) => ({
      plants: [newPlant, ...state.plants],
      jars: {
        ...state.jars,
        [newId]: {
          id: crypto.randomUUID(),
          plant_id: newId,
          level: 80,
          valve_status: "closed",
          last_filled: new Date().toISOString(),
        },
      },
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase.from("plants").insert([newPlant]);
      } catch (e) {
        console.error("Erreur insertion Supabase", e);
      }
    }

    get().addAlert({
      plant_id: newId,
      type: "success",
      message: `Nouvelle plante enregistrée : ${newPlant.name} (${newPlant.irrigation_method}) avec NFC ${newPlant.nfc_id}`,
    });

    return newPlant;
  },

  updatePlant: async (id, updates) => {
    set((state) => ({
      plants: state.plants.map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      ),
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase.from("plants").update(updates).eq("id", id);
      } catch (e) {
        console.error("Erreur mise à jour Supabase", e);
      }
    }
  },

  deletePlant: async (id) => {
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase.from("plants").delete().eq("id", id);
      } catch (e) {
        console.error("Erreur suppression Supabase", e);
      }
    }
  },

  addMeasurement: (measurementData) => {
    const measurement: Measurement = {
      ...measurementData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      measurements: [measurement, ...state.measurements],
    }));

    if (isSupabaseConfigured) {
      supabase.from("measurements").insert([measurement]).then();
    }
  },

  addAlert: (alertData) => {
    const alert: Alert = {
      ...alertData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      alerts: [alert, ...state.alerts.slice(0, 19)], // garder les 20 plus récentes
    }));

    if (isSupabaseConfigured) {
      supabase.from("alerts").insert([alert]).then();
    }
  },

  dismissAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    }));
  },

  toggleRealModel: () => {
    set((state) => ({
      isRealModelActive: !state.isRealModelActive,
    }));
  },

  startRobot: () => {
    const state = get();
    if (state.robotState.isRunning || state.plants.length === 0) return;

    set({
      robotState: {
        isRunning: true,
        currentPotIndex: 0,
        phase: "moving",
        progress: 0,
        lastReadNfc: null,
        lastSnapshot: null,
        statusMessage: "Départ du robot mobile vers le premier pot...",
      },
    });

    // Déroulement de la séquence de mission du robot
    let potIdx = 0;
    const runCycleForPot = (index: number) => {
      const currentPlant = get().plants[index];
      if (!currentPlant || !get().robotState.isRunning) {
        set((s) => ({
          robotState: {
            ...s.robotState,
            isRunning: false,
            phase: "completed",
            statusMessage: "Mission terminée : tous les pots ont été inspectés avec succès !",
          },
        }));
        return;
      }

      // 1. Déplacement
      set((s) => ({
        robotState: {
          ...s.robotState,
          currentPotIndex: index,
          phase: "moving",
          statusMessage: `Déplacement vers le pot #${index + 1} (${currentPlant.name})...`,
        },
      }));

      // 2. Scan NFC après 1.2s
      setTimeout(() => {
        if (!get().robotState.isRunning) return;
        set((s) => ({
          robotState: {
            ...s.robotState,
            phase: "scanning_nfc",
            lastReadNfc: currentPlant.nfc_id,
            statusMessage: `Tag NFC détecté : ${currentPlant.nfc_id} [${currentPlant.name}]`,
          },
        }));

        // 3. Prise de photo après 1.2s
        setTimeout(() => {
          if (!get().robotState.isRunning) return;
          set((s) => ({
            robotState: {
              ...s.robotState,
              phase: "taking_photo",
              lastSnapshot: currentPlant.photo_url || null,
              statusMessage: "Capture optique de la feuille via la caméra robotique...",
            },
          }));

          // 4. Mesure capteurs & IA après 1.4s
          setTimeout(() => {
            if (!get().robotState.isRunning) return;

            // Génération de télémesures contextuelles
            const temp = 22 + Math.floor(Math.random() * 8);
            const humidity = 45 + Math.floor(Math.random() * 25);
            const soil =
              currentPlant.status === "water_stress"
                ? 30 + Math.floor(Math.random() * 5)
                : 60 + Math.floor(Math.random() * 20);
            const light = 600 + Math.floor(Math.random() * 400);

            // Diagnostic IA
            const diagResult = currentPlant.status;
            const meta = DIAGNOSTIC_DETAILS[diagResult];

            get().addMeasurement({
              plant_id: currentPlant.id,
              temperature: temp,
              air_humidity: humidity,
              soil_moisture: soil,
              light: light,
              ai_result: diagResult,
              confidence: 93.4,
              recommendation: meta.recommendation,
            });

            // Si stress hydrique détecté, alerte automatique
            if (diagResult === "water_stress") {
              get().addAlert({
                plant_id: currentPlant.id,
                type: "warning",
                message: `Robot Scan : ${currentPlant.name} est en stress hydrique (sol: ${soil}%).`,
              });
            }

            set((s) => ({
              robotState: {
                ...s.robotState,
                phase: "analyzing",
                statusMessage: `Diagnostic IA : ${meta.labelFr} (Confiance 93.4%). Fiche mise à jour.`,
              },
            }));

            // 5. Passage au pot suivant après 2s
            setTimeout(() => {
              if (!get().robotState.isRunning) return;
              potIdx++;
              if (potIdx < get().plants.length) {
                runCycleForPot(potIdx);
              } else {
                set((s) => ({
                  robotState: {
                    ...s.robotState,
                    isRunning: false,
                    phase: "completed",
                    statusMessage: "Patrouille terminée : toutes les plantes sont à jour !",
                  },
                }));
              }
            }, 2000);
          }, 1400);
        }, 1200);
      }, 1200);
    };

    runCycleForPot(0);
  },

  stopRobot: () => {
    set((s) => ({
      robotState: {
        ...s.robotState,
        isRunning: false,
        phase: "idle",
        statusMessage: "Mission interrompue par l'opérateur.",
      },
    }));
  },

  refillJar: (plantId) => {
    set((s) => ({
      jars: {
        ...s.jars,
        [plantId]: {
          ...(s.jars[plantId] || {
            id: crypto.randomUUID(),
            plant_id: plantId,
            valve_status: "closed",
          }),
          level: 100,
          valve_status: "closed",
          last_filled: new Date().toISOString(),
        },
      },
    }));
    get().addAlert({
      plant_id: plantId,
      type: "success",
      message: "Jarre en terre cuite rechargée à 100% avec l'eau de pluie filtrée.",
    });
  },

  operateNoriaWell: () => {
    set((s) => ({
      noriaWell: {
        ...s.noriaWell,
        isOperating: true,
        waterExtractedLiters: s.noriaWell.waterExtractedLiters + 25,
      },
      rainwaterTank: {
        ...s.rainwaterTank,
        currentLiters: Math.min(s.rainwaterTank.capacityLiters, s.rainwaterTank.currentLiters + 25),
        level: Math.min(100, Math.round(((s.rainwaterTank.currentLiters + 25) / s.rainwaterTank.capacityLiters) * 100)),
      },
    }));

    setTimeout(() => {
      set((s) => ({
        noriaWell: {
          ...s.noriaWell,
          isOperating: false,
        },
      }));
    }, 2500);
  },

  activateTurbine: () => {
    set((s) => ({
      microTurbine: {
        ...s.microTurbine,
        isSpinning: true,
        powerWatts: 6.8,
        energyProducedWh: Number((s.microTurbine.energyProducedWh + 1.2).toFixed(1)),
      },
    }));
  },
}));
