import type { LucideIcon } from "lucide-react";

/** Editable illustration placeholder — replace with your own image later. */
export function IllustrationPlaceholder({
  icon: Icon,
  label,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-violet/40 bg-gradient-to-br from-violet/5 via-white to-coral/5 ${className}`}
      data-editable-placeholder="true"
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.62_0.22_290/0.25)_1px,transparent_0)] [background-size:14px_14px]" />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-white/80 shadow-glow-violet">
          <Icon className="size-8 text-[color:var(--color-violet-deep)]" strokeWidth={1.75} />
        </div>
        <p className="max-w-[80%] text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-violet-deep)]">
          Editable
        </span>
      </div>
    </div>
  );
}
