"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;          // ms
  variant?: "up" | "scale" | "fade";
  className?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const variantClass = variant === "scale" ? "reveal-scale" : variant === "fade" ? "reveal-fade" : "";
  const visibleClass = shown ? "is-visible" : "";
  const extra = className ?? "";

  const Comp = Tag as any;
  return (
    <Comp
      ref={ref as any}
      className={`reveal ${variantClass} ${visibleClass} ${extra}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
