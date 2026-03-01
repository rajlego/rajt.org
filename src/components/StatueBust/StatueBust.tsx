"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Center,
  useProgress,
  Html,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// Enable Draco decoder for compressed models
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);

  // Clone and configure the scene
  const clonedScene = scene.clone();

  // Apply better materials for statue look
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center>
      <primitive object={clonedScene} scale={2} />
    </Center>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-white/20 border-t-white"></div>
        <p className="text-sm text-white/60 font-medium">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

interface StatueBustProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
}

export function StatueBust({
  modelUrl,
  className = "",
  autoRotate = true,
}: StatueBustProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.2}
            penumbra={1}
            intensity={1.5}
            castShadow
          />
          <spotLight
            position={[-5, 3, -5]}
            angle={0.2}
            penumbra={1}
            intensity={0.8}
          />
          <Model url={modelUrl} />
          <Environment preset="city" />
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={1.5}
            maxDistance={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
