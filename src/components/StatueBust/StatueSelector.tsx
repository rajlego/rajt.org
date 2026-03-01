"use client";

import { useState } from "react";
import { StatueBust } from "./StatueBust";

const STATUE_MODELS = [
  {
    id: "marble",
    name: "Marble",
    description: "Classical",
    url: "/models/optimized/face-marble.glb",
  },
  {
    id: "bronze",
    name: "Bronze",
    description: "Modern",
    url: "/models/optimized/face-bronze.glb",
  },
  {
    id: "stone",
    name: "Stone",
    description: "Weathered",
    url: "/models/optimized/face-stone.glb",
  },
  {
    id: "ethereal",
    name: "Ethereal",
    description: "Glowing",
    url: "/models/optimized/face-ethereal.glb",
  },
];

export function StatueSelector() {
  const [selectedModel, setSelectedModel] = useState(STATUE_MODELS[0]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="h-[500px] w-full max-w-2xl">
        <StatueBust
          key={selectedModel.id}
          modelUrl={selectedModel.url}
          className="h-full w-full"
          autoRotate={true}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {STATUE_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`group relative px-4 py-2 text-sm font-medium transition-all ${
              selectedModel.id === model.id
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <span className="relative z-10">{model.name}</span>
            {selectedModel.id === model.id && (
              <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
            )}
            <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-white/50 transition-all group-hover:w-full" />
          </button>
        ))}
      </div>

      <p className="text-sm text-white/40">{selectedModel.description}</p>
    </div>
  );
}
