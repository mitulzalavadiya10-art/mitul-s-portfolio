"use client";

import { Component as LunarGravityCard } from "@/components/ui/lunar-gravity-card";

export default function Demo() {
  return (
    <div className="w-full py-8 md:py-16 bg-black flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 font-sans border-none">
      <div className="relative w-full max-w-[1680px]">
        <LunarGravityCard className="w-full max-w-none border-none rounded-none shadow-none" />
      </div>
    </div>
  );
}

export { Demo as LunarGravitySection };
