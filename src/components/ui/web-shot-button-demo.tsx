import { ArrowRight } from "lucide-react";
import { Component as WebShotButton } from "@/components/ui/web-shot-button";

export default function WebShotButtonDemo() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-10">
      <WebShotButton>
        Explore components
        <ArrowRight />
      </WebShotButton>
    </div>
  );
}

