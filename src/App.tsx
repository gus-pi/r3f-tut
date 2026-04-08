import { GizmoHelper, GizmoViewport, OrbitControls, useHelper } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';
import { SpotLightHelper } from 'three';

function AnimatedBox() {
    const boxRef = useRef<THREE.Mesh>(null);

    const { color, speed } = useControls({
        color: '#00bfff',
        speed: {
            value: 0.005,
            min: 0.0,
            max: 0.03,
            step: 0.001,
        },
    });

    useFrame(() => {
        if (!boxRef.current) return;
        boxRef.current.rotation.x += speed;
        boxRef.current.rotation.y += speed;
        boxRef.current.rotation.z += speed;
    });

    return (
        <mesh ref={boxRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function LightWithHelper() {
    const lightRef = useRef<THREE.SpotLight>(null!);

    useHelper(lightRef, SpotLightHelper, 'orange');

    const { angle, penumbra } = useControls({
        angle: Math.PI / 8,
        penumbra: {
            value: 0.0,
            min: 0.0,
            max: 1.0,
            step: 0.1,
        },
    });

    return (
        <spotLight
            ref={lightRef}
            intensity={50}
            position={[4, 2, 3]}
            angle={angle}
            penumbra={penumbra}
        />
    );
}

const App = () => {
    return (
        <div id="canvas-container">
            <Canvas>
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport />
                </GizmoHelper>
                <gridHelper args={[20, 20, 0xff22aa, 0x55ccff]} />
                <axesHelper args={[10]} />
                <OrbitControls />
                <AnimatedBox />
                {/* <LightWithHelper /> */}
                <ambientLight color={0xfcfcfc} intensity={0.2} />
                <pointLight intensity={50} position={[4, 2, 3]} />
            </Canvas>
        </div>
    );
};
export default App;
