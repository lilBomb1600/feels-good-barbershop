"use client";
/* eslint-disable react-hooks/immutability -- R3F scenes mutate three.js objects (camera, textures, scene) every frame by design */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/*
 * The hero object: a barber pole in Feel Goods' red / cream / navy, standing on the shop's
 * black-and-white checkered floor. The cursor is a lamp (a point light plus a light pool on the floor).
 * Scroll spins the stripe and lifts the camera. Built from primitives, no model download.
 */

const RED = "#c8202f";
const CREAM = "#f4ecdc";
const NAVY = "#24466b";

const STRIPE_H = 2.2;
const STRIPE_Y = 0.36 + STRIPE_H / 2;
const R_IN = 0.3;
const R_GLASS = 0.345;

function useStripeTexture() {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const S = 512;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d")!;
    const band = 64; // 4 bands per 256 px period, so the tile repeats cleanly in both directions
    const colors = [RED, CREAM, NAVY, CREAM];
    for (let k = -2 * S; k < 2 * S; k += band) {
      const idx = (((k / band) % 4) + 4) % 4;
      g.fillStyle = colors[idx];
      g.beginPath();
      g.moveTo(k - 0.5, 0);
      g.lineTo(k + band + 0.5, 0);
      g.lineTo(k + band + 0.5 - S, S);
      g.lineTo(k - 0.5 - S, S);
      g.closePath();
      g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    // around: 2 color cycles; along: scaled so the helix sits near 45 degrees
    tex.repeat.set(1, STRIPE_H / (2 * Math.PI * R_IN));
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return tex;
  }, [gl]);
}

function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.75;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

type Materials = {
  chrome: THREE.Material;
  stripes: THREE.Material;
  glass: THREE.Material;
};

/**
 * Shader patches for the pole materials.
 * - glass: the sleeve only ADDS light (reflections, the lamp's highlight) and writes alpha equal to that
 *   light, so it never paints an opaque dark rim over the FEEL lettering behind the canvas.
 * - mirror: the reflection under the floor fades out with depth, the way it does on polished tile.
 */
const NL = String.fromCharCode(10);

function patch<M extends THREE.Material>(
  mat: M,
  { glass = false, mirror = false }: { glass?: boolean; mirror?: boolean },
) {
  const m = (mirror ? mat.clone() : mat) as M;
  const lines: string[] = [];
  if (mirror) lines.push("gl_FragColor *= smoothstep(-1.35, -0.02, vFadeY) * 0.85;");
  if (glass) lines.push("gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));");
  if (mirror) m.transparent = true;
  m.onBeforeCompile = (shader) => {
    if (mirror) {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", ["#include <common>", "varying float vFadeY;"].join(NL))
        .replace(
          "#include <project_vertex>",
          ["#include <project_vertex>", "vFadeY = (modelMatrix * vec4(transformed, 1.0)).y;"].join(NL),
        );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        ["#include <common>", "varying float vFadeY;"].join(NL),
      );
    }
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      ["#include <dithering_fragment>", ...lines].join(NL),
    );
  };
  m.customProgramCacheKey = () => `fg-${glass ? "glass" : "solid"}-${mirror ? "mirror" : "real"}`;
  return m;
}

function Pole({ m, mirror = false }: { m: Materials; mirror?: boolean }) {
  return (
    <group scale={[1, mirror ? -1 : 1, 1]}>
      <mesh position={[0, 0.03, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.5, 0.56, 0.06, 64]} />
      </mesh>
      <mesh position={[0, 0.16, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.36, 0.48, 0.2, 64]} />
      </mesh>
      <mesh position={[0, 0.31, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.41, 0.41, 0.1, 64]} />
      </mesh>
      <mesh position={[0, STRIPE_Y, 0]} material={m.stripes}>
        <cylinderGeometry args={[R_IN, R_IN, STRIPE_H, 96, 1, true]} />
      </mesh>
      <mesh position={[0, STRIPE_Y, 0]} material={m.glass} renderOrder={mirror ? -1 : 2}>
        <cylinderGeometry args={[R_GLASS, R_GLASS, STRIPE_H, 96, 1, true]} />
      </mesh>
      <mesh position={[0, 0.36 + STRIPE_H + 0.05, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.41, 0.41, 0.1, 64]} />
      </mesh>
      <mesh position={[0, 0.36 + STRIPE_H + 0.1, 0]} scale={[1, 0.72, 1]} material={m.chrome}>
        <sphereGeometry args={[0.39, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, 0.36 + STRIPE_H + 0.43, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.03, 0.05, 0.12, 24]} />
      </mesh>
      <mesh position={[0, 0.36 + STRIPE_H + 0.54, 0]} material={m.chrome}>
        <sphereGeometry args={[0.075, 32, 16]} />
      </mesh>
    </group>
  );
}

const floorVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const floorFrag = /* glsl */ `
  uniform vec2 uLight;
  uniform float uLightK;
  uniform vec3 uInk;
  uniform vec3 uCream;
  uniform float uRadius;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 p = vWorld.xz;
    // filtered checker so far tiles don't shimmer
    vec2 q = p / 0.62 + 0.5;
    vec2 w = fwidth(q) + 1e-4;
    vec2 i = 2.0 * (abs(fract((q - 0.5 * w) * 0.5) - 0.5) - abs(fract((q + 0.5 * w) * 0.5) - 0.5)) / w;
    float c = 0.5 - 0.5 * i.x * i.y;
    vec3 base = mix(uInk, uCream, c);
    // the vinyl tile flecks
    base *= 0.93 + 0.1 * hash(floor(p * 95.0));

    float d = length(p);
    float pool = exp(-pow(length(p - uLight) / 1.5, 2.0));
    float lit = 0.1 + uLightK * pool + 0.42 * exp(-d * d / 4.0);
    lit *= mix(0.3, 1.0, smoothstep(0.3, 1.3, d)); // contact shadow under the base
    vec3 col = base * lit;

    float fade = 1.0 - smoothstep(uRadius * 0.3, uRadius, d);
    // dark tiles show more of the reflection, like the real floor
    float alpha = fade * mix(0.74, 0.95, c);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

function Floor({ light }: { light: React.RefObject<THREE.Vector3> }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: floorVert,
        fragmentShader: floorFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uLight: { value: new THREE.Vector2(0.8, 1.2) },
          uLightK: { value: 1.25 },
          uInk: { value: new THREE.Color("#0c0908") },
          uCream: { value: new THREE.Color("#ece2cf") },
          uRadius: { value: 5.2 },
        },
      }),
    [],
  );
  useFrame(() => {
    const l = light.current;
    if (l) (mat.uniforms.uLight.value as THREE.Vector2).set(l.x, l.z);
  });
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={1}>
      <planeGeometry args={[16, 16]} />
    </mesh>
  );
}

function Rig({ onReady, still }: { onReady?: () => void; still: boolean }) {
  const stripeTex = useStripeTexture();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const lightTarget = useRef(new THREE.Vector3(0.9, 0, 1.4));
  const lightPos = useRef(new THREE.Vector3(0.9, 0, 1.4));
  const point = useRef<THREE.PointLight>(null);
  const pointer = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastScroll = useRef(0);
  const ready = useRef(false);

  const m = useMemo<Materials>(
    () => ({
      chrome: new THREE.MeshStandardMaterial({ color: "#e9e6e1", metalness: 1, roughness: 0.17 }),
      stripes: new THREE.MeshStandardMaterial({
        map: stripeTex,
        emissiveMap: stripeTex,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.32,
        roughness: 0.55,
        metalness: 0,
      }),
      // additive glass: only reflections and highlights add light, the stripes stay true underneath
      glass: patch(
        new THREE.MeshPhysicalMaterial({
          color: "#000000",
          roughness: 0.04,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.03,
          envMapIntensity: 2.4,
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneFactor,
        }),
        { glass: true },
      ),
    }),
    [stripeTex],
  );

  const mm = useMemo<Materials>(
    () => ({
      chrome: patch(m.chrome, { mirror: true }),
      stripes: patch(m.stripes, { mirror: true }),
      glass: patch(m.glass, { glass: true, mirror: true }),
    }),
    [m],
  );

  useEffect(
    () => () => {
      Object.values(m).forEach((x) => x.dispose());
      Object.values(mm).forEach((x) => x.dispose());
      stripeTex.dispose();
    },
    [m, mm, stripeTex],
  );

  useEffect(() => {
    lastScroll.current = window.scrollY;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
        t: performance.now(),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const delta = Math.min(dt, 1 / 20);
    const vh = window.innerHeight || 1;
    const sy = window.scrollY;
    const p = Math.min(sy / vh, 1.3);

    // stripe spin: a slow idle turn, plus whatever the page scroll adds
    const dScroll = sy - lastScroll.current;
    lastScroll.current = sy;
    if (!still) stripeTex.offset.x -= delta * 0.09 + dScroll * 0.0011;

    // the lamp: follows a mouse, drifts on its own for touch or when the mouse rests
    const t = state.clock.elapsedTime;
    const ptr = pointer.current;
    if (still) {
      lightTarget.current.set(1.1, 0, 1.5);
    } else if (ptr && performance.now() - ptr.t < 4000) {
      lightTarget.current.set(ptr.x * 3.4, 0, 0.6 + ptr.y * 2.2);
    } else {
      lightTarget.current.set(Math.sin(t * 0.35) * 2.2, 0, 1.3 + Math.cos(t * 0.27) * 0.9);
    }
    lightPos.current.lerp(lightTarget.current, 1 - Math.exp(-delta * 4));
    if (point.current) point.current.position.set(lightPos.current.x, 1.75, lightPos.current.z + 0.9);

    // camera: tall screens pull back and aim low so the pole sits above the copy; a touch of
    // parallax from the lamp; then the scroll lift
    const tall = size.width / size.height < 0.8;
    const z = tall ? 11.2 : 7.8;
    const look = tall ? 0.82 : 1.62;
    const px = still ? 0 : lightPos.current.x * 0.06;
    camera.position.set(px, 1.5 + p * 1.5, z - p * 1.2);
    camera.lookAt(0, look + p * 0.85, 0);

    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      <Environment />
      <ambientLight intensity={0.18} />
      <directionalLight position={[-3, 5, -4]} intensity={1.6} color="#cfd8ff" />
      <directionalLight position={[3, 6, 5]} intensity={0.55} color="#fff1e0" />
      <pointLight ref={point} intensity={9} distance={9} decay={1.6} color="#ffe2c4" />
      <Pole m={m} />
      <Pole m={mm} mirror />
      <Floor light={lightPos} />
    </>
  );
}

export default function PoleScene({
  active,
  onReady,
  still = false,
}: {
  active: boolean;
  onReady?: () => void;
  still?: boolean;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 34, near: 0.1, far: 60, position: [0, 1.5, 8.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: still }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden
    >
      <Rig onReady={onReady} still={still} />
    </Canvas>
  );
}
