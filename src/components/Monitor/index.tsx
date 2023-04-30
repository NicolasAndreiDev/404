import { Canvas, extend, useFrame } from '@react-three/fiber';
import Monitor from '../MonitorJSX/Monitor';
import { useVideoTexture, Effects, MeshReflectorMaterial, Text, BakeShadows } from '@react-three/drei';
import { GlitchPass } from 'three-stdlib';
import { easing } from 'maath';

extend({ GlitchPass })

export default function MonitorComponent() {

    type TelaProps = {
        x: number,
        y: number,
        z: number,
        rotation: [x: number, y: number, z: number]
    }

    function Tela({ x, y, z, rotation = [x, y, z] }: TelaProps) {
        const image = useVideoTexture('tv.mp4')
        return (
            <mesh position={[x, y, z]} rotation={rotation} receiveShadow>
                <planeGeometry args={[1.2, 1.2, 1, 1]} />
                <meshBasicMaterial map={image} />
            </mesh>
        )
    }

    function CameraRig() {
        return(
            useFrame((state, delta) => {
                easing.damp3(state.camera.position, [0 + (state.pointer.x * state.viewport.width) / 10, (1 + state.pointer.y) / 2, 5.5], 0.8, delta);
                state.camera.lookAt(0, 0, 0);
            })
        )
    }

    function Postpro() {
        return (
            <Effects>
                {/* @ts-ignore */}
                <glitchPass/>
            </Effects>
        )
    }

    function Floor({x}: {x: number}){
        return(
        <mesh receiveShadow rotation={[x, 0, 0]} position={[0, -.5, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial blur={[300, 30]} resolution={2000} mixBlur={1} mixStrength={80} roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="rgb(15, 18, 25)" metalness={0.8} mirror={0}/>
        </mesh>
        )
    }

    return (
        <Canvas style={{ height: '100vh', backgroundColor: 'rgb(15, 18, 25)' }}>
            <Postpro />
            <CameraRig />
            <BakeShadows />
            <Floor x={-Math.PI / 2}/>
            <Floor x={0} />
            <Text position={[0, .2, 3]}>404</Text>
            <directionalLight position={[0, 130, 10]} intensity={.8} castShadow />
            <Monitor scale={.04} rotation-y={3.15} position={[0, -.5, 2]} />
            <Tela x={0} y={.45} z={1.29} rotation={[0, 0, 0]} />
            <Monitor scale={.04} rotation-y={-2.2} position={[-2, -.5, 2]} />
            <Tela x={2.6} y={.45} z={1.62} rotation={[0, -.93, 0]} />
            <Monitor scale={.04} rotation-y={2.2} position={[2, -.5, 2]} />
            <Tela x={-2.6} y={.45} z={1.62} rotation={[0, .93, 0]} />
        </Canvas>
    )
}