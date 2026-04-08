import {
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    PositionalAudio,
    useCubeTexture,
    useGLTF,
    useHelper,
    useTexture,
} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DirectionalLightHelper, SpotLightHelper, SRGBColorSpace, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

function AnimatedBox() {
    const [wireframe, setWireframe] = useState(false);
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

    const handleClick = () => {
        setWireframe(wireframe === false ? true : false);
    };

    useFrame(() => {
        if (!boxRef.current) return;
        boxRef.current.rotation.x += speed;
        boxRef.current.rotation.y += speed;
        boxRef.current.rotation.z += speed;
    });

    return (
        <mesh ref={boxRef} position={[0, 3, 0]} castShadow onClick={handleClick}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
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
            position={[5, 8, 0]}
            angle={angle}
            penumbra={penumbra}
            castShadow
        />
    );
}

function DirectionalLightWithHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    const shadowRef = useRef<THREE.CameraHelper>(null!);
    useHelper(lightRef, DirectionalLightHelper, 2, 'crimson');
    useHelper(shadowRef, THREE.CameraHelper);

    return (
        <directionalLight ref={lightRef} position={[5, 8, 0]} castShadow>
            <orthographicCamera attach="shadow-camera" ref={shadowRef} top={8} right={8} />
        </directionalLight>
    );
}

function Model() {
    const result = useGLTF('/swordfish_ii.glb');
    return <primitive object={result.scene} position={[0, 2, 0]} />;
}

function SphereWithTexture() {
    const texture = useTexture('/texture2.jpg');

    return (
        <mesh position={[0, 1, -2]}>
            <sphereGeometry />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

function BoxWithTexture() {
    const texture1 = useTexture('/texture.jpg');
    const texture2 = useTexture('/texture2.jpg');
    const texture3 = useTexture('/texture3.jpg');
    const texture4 = useTexture('/texture4.jpg');
    const texture5 = useTexture('/texture5.jpg');
    const texture6 = useTexture('/texture6.jpg');

    return (
        <mesh position={[0, 2, -4]}>
            <boxGeometry />
            <meshBasicMaterial attach="material-0" map={texture1} />
            <meshBasicMaterial attach="material-1" map={texture2} />
            <meshBasicMaterial attach="material-2" map={texture3} />
            <meshBasicMaterial attach="material-3" map={texture4} />
            <meshBasicMaterial attach="material-4" map={texture5} />
            <meshBasicMaterial attach="material-5" map={texture6} />
        </mesh>
    );
}

function UpdateSceneBackground() {
    const { scene } = useThree();

    // const texture = useLoader(TextureLoader, '/stars.jpg');
    // texture.colorSpace = SRGBColorSpace;

    const texture = useCubeTexture(
        [
            'texture.jpg',
            'texture2.jpg',
            'texture3.jpg',
            'texture4.jpg',
            'texture5.jpg',
            'texture6.jpg',
        ],
        { path: '' },
    );

    scene.background = texture;

    return null;
}

function AudioComponent() {
    const { camera } = useThree();

    useEffect(() => {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/sound.mp3', (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);

            const handleCLick = () => {
                sound.play();
            };

            window.addEventListener('click', handleCLick);
        });
    }, []);
    return null;
}

function AudioComponent2() {
    const { camera } = useThree();
    const audioRef = useRef<THREE.PositionalAudio>(null);

    const handleCLick = () => {
        if (audioRef.current) audioRef.current.play();
    };

    window.addEventListener('click', handleCLick);

    return (
        <mesh position={[0, 0, 4]} onClick={handleCLick}>
            <boxGeometry ref={audioRef} />
            <meshNormalMaterial />
            <PositionalAudio
                ref={audioRef}
                url="/sound.mp3"
                distance={1}
                loop={false}
                autoplay={false}
            />
        </mesh>
    );
}

const App = () => {
    return (
        <div id="canvas-container">
            <Canvas shadows>
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport />
                </GizmoHelper>
                {/* <gridHelper args={[20, 20, 0xff22aa, 0x55ccff]} /> */}
                <axesHelper args={[10]} />
                <OrbitControls />
                <AnimatedBox />
                <DirectionalLightWithHelper />
                <ambientLight color={0xfcfcfc} intensity={0.2} />
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial />
                </mesh>
                {/* <pointLight intensity={50} position={[4, 2, 3]} /> */}
                <Model />
                <SphereWithTexture />
                <BoxWithTexture />
                <UpdateSceneBackground />
                <AudioComponent2 />
            </Canvas>
        </div>
    );
};
export default App;
