import {
  AirVent,
  ShowerHead,
  Flower2,
  Layers,
  Refrigerator,
  WashingMachine,
  ChefHat,
  Wifi,
  Car,
  Shield,
  Wind,
  Sofa,
  type LucideIcon,
} from "lucide-react";

export const AMENITY_MAP: Record<
  string,
  { label: string; Icon: LucideIcon }
> = {
  ac: { label: "Air conditioning", Icon: AirVent },
  water_heater: { label: "Water heater", Icon: ShowerHead },
  balcony: { label: "Balcony", Icon: Flower2 },
  mezzanine: { label: "Mezzanine", Icon: Layers },
  fridge: { label: "Refrigerator", Icon: Refrigerator },
  washer: { label: "Washing machine", Icon: WashingMachine },
  kitchen: { label: "Private kitchen", Icon: ChefHat },
  wifi: { label: "Free WiFi", Icon: Wifi },
  parking: { label: "Parking", Icon: Car },
  security: { label: "24/7 security", Icon: Shield },
  window: { label: "Ventilated windows", Icon: Wind },
  furnished: { label: "Fully furnished", Icon: Sofa },
};
