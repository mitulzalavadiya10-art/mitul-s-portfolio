import { Canvas } from "@react-three/fiber";
import Mesh from "./mesh";
import { images } from "./data";

interface SceneProps {
    onSelectImage?: (img: typeof images[0]) => void;
    onLoaded?: () => void;
}

export default function Scene({ onSelectImage, onLoaded }: SceneProps) {
    return (
        <Canvas
            flat
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
            }}
            camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 100 }}
            dpr={[1, 2]}
        >
            <Mesh onSelectImage={onSelectImage} onLoaded={onLoaded} />
        </Canvas>
    );
}
