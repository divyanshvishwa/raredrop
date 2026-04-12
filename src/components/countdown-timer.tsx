"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO date string
  label?: string;
}

export function CountdownTimer({ targetDate, label = "Drop ends in" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
        {label}
      </p>
      <div className="flex gap-3">
        {blocks.map((b) => (
          <div key={b.label} className="flex flex-col items-center">
            <span className="font-mono text-2xl font-extrabold tabular-nums sm:text-3xl">
              {String(b.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
