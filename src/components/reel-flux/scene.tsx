import { Canvas } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import Mesh from "./mesh";
import { images } from "./data";

interface SceneProps {
    onSelectImage?: (img: typeof images[0]) => void;
}

export default function Scene({ onSelectImage }: SceneProps) {
    return (
        <Canvas
            gl={async (props) => {
                const renderer = new THREE.WebGPURenderer({
                    ...(props as THREE.WebGPURendererParameters),
                    antialias: true,
                    alpha: true,
                });
                await renderer.init();
                return renderer;
            }}
            flat
            camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 100 }}
            dpr={[1, 2]}
        >
            <Mesh onSelectImage={onSelectImage} />
        </Canvas>
    );
}
