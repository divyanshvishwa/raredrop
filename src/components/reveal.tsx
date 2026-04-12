"use client";

import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
}

export function Reveal({ children, className = "", variant = "up", delay }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  }[variant];

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/** Wraps each child with staggered reveal delays */
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  staggerDelay?: number;
}

export function StaggerReveal({ children, className = "", variant = "up", staggerDelay = 0.08 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = el.querySelectorAll(".stagger-item");
          items.forEach((item) => item.classList.add("visible"));
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  }[variant];

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={`stagger-item ${variantClass}`}
              style={{ transitionDelay: `${i * staggerDelay}s` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
