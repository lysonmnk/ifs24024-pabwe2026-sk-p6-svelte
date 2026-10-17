import { Globe, EyeOff, Lock } from "lucide-svelte";

export const TYPE_META = {
  public: {
    label: "Publik",
    icon: Globe,
    badge: "bg-pine-100 text-pine-800",
    accent: "border-l-pine-600",
  },
  unlisted: {
    label: "Tidak Terdaftar",
    icon: EyeOff,
    badge: "bg-amber-100 text-amber-900",
    accent: "border-l-amber-500",
  },
  private: {
    label: "Privat",
    icon: Lock,
    badge: "bg-slate-200 text-slate-900",
    accent: "border-l-slate-500",
  },
};

export const TYPE_OPTIONS = Object.entries(TYPE_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));
