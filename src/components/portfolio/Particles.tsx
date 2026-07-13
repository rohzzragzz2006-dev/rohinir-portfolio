import { useMemo } from "react";

export function Particles({ count = 22 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 6 + Math.random() * 18,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 8,
        hue: Math.random() > 0.5 ? "violet" : "coral",
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full blur-xl opacity-60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background:
              p.hue === "violet"
                ? "radial-gradient(circle, oklch(0.78 0.14 290 / 0.9), transparent 70%)"
                : "radial-gradient(circle, oklch(0.78 0.15 25 / 0.85), transparent 70%)",
            animation: `float-slow ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
