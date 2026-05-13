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
  ac: { label: "Điều hòa", Icon: AirVent },
  water_heater: { label: "Máy nước nóng", Icon: ShowerHead },
  balcony: { label: "Ban công", Icon: Flower2 },
  mezzanine: { label: "Gác lửng", Icon: Layers },
  fridge: { label: "Tủ lạnh", Icon: Refrigerator },
  washer: { label: "Máy giặt", Icon: WashingMachine },
  kitchen: { label: "Bếp riêng", Icon: ChefHat },
  wifi: { label: "WiFi miễn phí", Icon: Wifi },
  parking: { label: "Chỗ để xe", Icon: Car },
  security: { label: "An ninh 24/7", Icon: Shield },
  window: { label: "Cửa sổ thoáng", Icon: Wind },
  furnished: { label: "Nội thất đầy đủ", Icon: Sofa },
};
