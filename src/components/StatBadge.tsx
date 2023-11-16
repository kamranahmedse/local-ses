import type { LucideIcon } from "lucide-react";
import { Zap } from "lucide-react";
import type {ReactElement} from "react";

type StatBadgeProps = {
  icon: any;
  label: string;
  value: string;
};
export function StatBadge(props: StatBadgeProps) {
  const { icon, label, value } = props;

  return (
    <span className="text-sm bg-gray-600 text-white py-0.5 px-2 rounded-full flex items-center gap-1">
      { icon }
      <span>
        {label}: <span className="text-yellow-300">{value}</span>
      </span>
    </span>
  );
}
