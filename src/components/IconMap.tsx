import { BrainCircuit, Cpu, Network, ShieldCheck, type LucideIcon } from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  BrainCircuit,
  Cpu,
  Network,
};

export function DynamicIcon({ name, ...props }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name] ?? ShieldCheck;
  return <Icon {...props} />;
}
