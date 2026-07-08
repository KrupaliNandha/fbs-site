import {
  Search,
  Settings,
  Cpu,
  MapPin,
  PenTool,
  Link2,
  BarChart3,
  Eye,
  LucideIcon,
} from "lucide-react";

// Maps the "icon" string stored in seo-services.json to an actual Lucide component.
// JSON can only store strings, so this is the bridge back to real components.
export const iconMap: Record<string, LucideIcon> = {
  Search,
  Settings,
  Cpu,
  MapPin,
  PenTool,
  Link2,
  BarChart3,
  Eye,
};