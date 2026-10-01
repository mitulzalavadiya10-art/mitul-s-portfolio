"use client";

import { Component as LunarGravityCard } from "@/components/ui/lunar-gravity-card";

export default function Demo() {
  return (
    <div className="w-full bg-black font-sans">
      <LunarGravityCard className="w-full max-w-none rounded-none shadow-none" />
    </div>
  );
}

export { Demo as LunarGravitySection };
