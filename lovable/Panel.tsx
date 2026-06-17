import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  icon?: ReactNode;
  amber?: boolean;
  bodyClassName?: string;
}

export function Panel({
  children,
  className,
  title,
  icon,
  amber,
  bodyClassName,
}: PanelProps) {
  return (
    <div className={cn("panel relative flex flex-col", amber && "panel-amber", className)}>
      <Corners amber={amber} />
      {title && (
        <div className="relative flex items-center gap-2 px-4 pt-3 pb-2.5">
          {icon && (
            <span className={cn("text-[oklch(0.85_0.18_160)]", amber && "text-[oklch(0.85_0.18_70)]")}>
              {icon}
            </span>
          )}
          <h3
            className={cn(
              "text-[15px] font-semibold tracking-wide text-foreground",
              amber ? "text-glow-amber" : "text-glow-green",
            )}
          >
            {title}
          </h3>
          <span
            className="absolute left-3 right-3 bottom-0 h-px"
            style={{
              background: amber
                ? "linear-gradient(90deg, oklch(0.85 0.18 70 / 0.7), oklch(0.6 0.14 70 / 0.1) 70%, transparent)"
                : "linear-gradient(90deg, oklch(0.85 0.2 160 / 0.7), oklch(0.6 0.14 160 / 0.1) 70%, transparent)",
            }}
          />
        </div>
      )}
      <div className={cn("flex-1 px-4 py-3", bodyClassName)}>{children}</div>
    </div>
  );
}

function Corners({ amber }: { amber?: boolean }) {
  const color = amber ? "oklch(0.85 0.18 70)" : "oklch(0.85 0.2 160)";
  const style = { borderColor: color } as const;
  return (
    <>
      <span
        className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 rounded-tl-[10px]"
        style={style}
      />
      <span
        className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 rounded-tr-[10px]"
        style={style}
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 rounded-bl-[10px]"
        style={style}
      />
      <span
        className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 rounded-br-[10px]"
        style={style}
      />
    </>
  );
}
