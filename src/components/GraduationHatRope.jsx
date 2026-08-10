/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './GraduationHatRope.css';

extend({ MeshLineGeometry, MeshLineMaterial });

/* ─── Braided gold rope texture ─────────────────────────────────────── */
function createRopeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0,    '#8a5c08');
  grad.addColorStop(0.25, '#f0cc60');
  grad.addColorStop(0.5,  '#fff0a0');
  grad.addColorStop(0.75, '#e5b044');
  grad.addColorStop(1,    '#8a5c08');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let y = 0; y < 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(64, y + 12);
    ctx.lineTo(64, y + 16);
    ctx.lineTo(0, y + 4);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ─── Main exported component ───────────────────────────────────────── */
export default function GraduationHatRope({
  gravity = [0, -35, 0],
  onPull  = () => {},
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /*
   * Camera math (important!):
   *   container: 120 × 100vh ≈ 120 × 776px  → aspect ≈ 0.155
   *   fov = 60 (vertical),  z = 5
   *   visible half-height  = tan(30°) × 5 = 2.887  → full = 5.774 world units
   *   visible half-width   = 2.887 × 0.155 = 0.448 → full = 0.896 world units
   *
   *   ROPE_TOP_Y = 2.7   ← near top of canvas (top 0.187 units are behind header)
   *   knot rests at   ROPE_TOP_Y - 3.5 = -0.8
   *   pull max Y      ROPE_TOP_Y - 5.2 = -2.5   ← near bottom of canvas
   *   → total pull travel ≈ 1.7 world units = ~228px on screen  ✓ large pull
   */
  return (
    <div className="hat-rope-wrapper" title="Pull to scroll to next section">
      <Canvas
        camera={{ fov: 60, position: [0, 0, 5] }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <ambientLight intensity={Math.PI * 1.1} />
        <directionalLight position={[3, 8, 5]} intensity={2.0} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <RopeHatScene isMobile={isMobile} onPull={onPull} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2.5} color="white"   position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3}   color="#ffe099" position={[-1,-1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3}   color="white"   position={[1,  1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

/* ─── Scene: physics rope + tassel ──────────────────────────────────── */
function RopeHatScene({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  onPull   = () => {},
}) {
  const band       = useRef();
  const fixedAnchor= useRef();
  const j1         = useRef();
  const j2         = useRef();
  const j3         = useRef();
  const knotRef    = useRef();

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic', canSleep: true, colliders: false,
    angularDamping: 3, linearDamping: 3,
  };
  const ropeTexture = useMemo(() => createRopeTexture(), []);

  const [curve] = useState(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3(),
    ])
  );

  const [dragged,      drag]           = useState(false);
  const [animatingPull,setAnimatingPull] = useState(false);
  const initialDragY  = useRef(null);
  const dragStartTime = useRef(0);

  /* World-space anchor positions (see camera math above) */
  const ROPE_X     =  0;
  const ROPE_TOP_Y =  2.7;   // anchor hidden behind header
  const PULL_MIN_Y = -2.0;   // pull limit (shorter rope = less travel)

  /* Rope joint lengths — distribute 4 segments across ~3.5 world units */
  useRopeJoint(fixedAnchor, j1,     [[0,0,0],[0,0,0], 0.85]);
  useRopeJoint(j1,          j2,     [[0,0,0],[0,0,0], 0.85]);
  useRopeJoint(j2,          j3,     [[0,0,0],[0,0,0], 0.85]);
  useSphericalJoint(j3,     knotRef,[[0,0,0],[0,0.4,0]]);

  /* ── Release: fire onPull if user dragged downward enough ── */
  useEffect(() => {
    if (!dragged) return;
    const release = () => {
      const dt = Date.now() - dragStartTime.current;
      let pulled = false;
      if (initialDragY.current !== null && knotRef.current) {
        const dy = initialDragY.current - knotRef.current.translation().y;
        if (dy > 0.2 || dt < 300) pulled = true;   // 0.2 world units ≈ 27px
      } else if (dt < 300) {
        pulled = true;
      }
      initialDragY.current = null;
      drag(false);
      if (pulled) onPull();
    };
    window.addEventListener('pointerup',     release);
    window.addEventListener('pointercancel', release);
    return () => {
      window.removeEventListener('pointerup',     release);
      window.removeEventListener('pointercancel', release);
    };
  }, [dragged, onPull]);

  /* ── Click bounce animation ── */
  const triggerClickPull = () => {
    if (animatingPull) return;
    setAnimatingPull(true);
    const startY   = knotRef.current?.translation().y ?? -0.8;
    let   elapsed  = 0;
    const duration = 300;
    const iv = setInterval(() => {
      elapsed += 16;
      const t   = Math.min(1, elapsed / duration);
      const off = Math.sin(t * Math.PI) * 2.2;  // pull 2.2 world units down
      if (knotRef.current) {
        [knotRef, j1, j2, j3, fixedAnchor].forEach(r => r.current?.wakeUp());
        knotRef.current.setNextKinematicTranslation({
          x: ROPE_X, y: Math.max(PULL_MIN_Y, startY - off), z: 0.1,
        });
      }
      if (t >= 1) {
        clearInterval(iv);
        setAnimatingPull(false);
        onPull();
      }
    }, 16);
  };

  /* ── Every frame: follow pointer + update rope curve ── */
  useFrame((state, delta) => {
    if (dragged && knotRef.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [knotRef, j1, j2, j3, fixedAnchor].forEach(r => r.current?.wakeUp());

      /* Clamp: knot can only move downward from rest; no left/right wander */
      const targetY = Math.max(PULL_MIN_Y, Math.min(ROPE_TOP_Y, vec.y - dragged.y));
      knotRef.current.setNextKinematicTranslation({
        x: ROPE_X,   // keep centred — no horizontal drift
        y: targetY,
        z: 0.1,
      });
    }

    /* Smooth lerp for intermediate joints */
    if (fixedAnchor.current) {
      [j1, j2, j3].forEach(ref => {
        if (!ref.current) return;
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const d = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)));
      });

      if (knotRef.current && j3.current?.lerped && j2.current?.lerped && j1.current?.lerped) {
        curve.points[0].copy(knotRef.current.translation());
        curve.points[1].copy(j3.current.lerped);
        curve.points[2].copy(j2.current.lerped);
        curve.points[3].copy(j1.current.lerped);
        curve.points[4].copy(fixedAnchor.current.translation());
        if (band.current?.geometry)
          band.current.geometry.setPoints(curve.getPoints(isMobile ? 20 : 40));
      }
    }
  });

  curve.curveType = 'chordal';

  /* ── Pointer handlers on the knot mesh ── */
  const handlePointerDown = (e) => {
    e.stopPropagation();
    dragStartTime.current = Date.now();
    if (!knotRef.current) return;
    const pos = new THREE.Vector3().copy(knotRef.current.translation());
    initialDragY.current = pos.y;
    drag(new THREE.Vector3().copy(e.point).sub(pos));
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    const dt = Date.now() - dragStartTime.current;
    let pulled = false;
    if (initialDragY.current !== null && knotRef.current) {
      const dy = initialDragY.current - knotRef.current.translation().y;
      if (dy > 0.2 || dt < 300) pulled = true;
    } else {
      pulled = true;
    }
    initialDragY.current = null;
    drag(false);
    if (pulled) onPull();
  };

  return (
    <>
      {/* Gold mount ring at top — sits behind header, invisible to user */}
      <mesh position={[ROPE_X, ROPE_TOP_Y + 0.1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.032, 16, 24]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Physics segments — 0.85 world units apart → shorter rope */}
      <group>
        <RigidBody ref={fixedAnchor} position={[ROPE_X, ROPE_TOP_Y,       0.1]} {...segmentProps} type="fixed" />
        <RigidBody ref={j1}          position={[ROPE_X, ROPE_TOP_Y - 0.85, 0.1]} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody ref={j2}          position={[ROPE_X, ROPE_TOP_Y - 1.7, 0.1]} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody ref={j3}          position={[ROPE_X, ROPE_TOP_Y - 2.55, 0.1]} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          ref={knotRef}
          position={[ROPE_X, ROPE_TOP_Y - 2.8, 0.1]}
          {...segmentProps}
          type={dragged || animatingPull ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.35, 0.55, 0.35]} />
          <group
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={(e) => { e.stopPropagation(); triggerClickPull(); }}
          >
            <TasselKnotModel />
          </group>
        </RigidBody>
      </group>

      {/* Wide invisible hit-area covering the rope */}
      <mesh
        position={[ROPE_X, ROPE_TOP_Y - 1.4, 0.1]}
        frustumCulled={false}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={(e) => { e.stopPropagation(); triggerClickPull(); }}
      >
        <cylinderGeometry args={[0.55, 0.55, 4.0, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Rope line — thinner lineWidth */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[100, isMobile ? 800 : 900]}
          useMap
          map={ropeTexture}
          repeat={[-4, 1]}
          lineWidth={0.12}
        />
      </mesh>
    </>
  );
}

/* ─── Gold tassel knot at rope end ──────────────────────────────────── */
function TasselKnotModel() {
  return (
    <group>
      {/* Collar cylinder */}
      <mesh position={[0, 0.06, 0]} frustumCulled={false}>
        <cylinderGeometry args={[0.14, 0.14, 0.24, 20]} />
        <meshStandardMaterial color="#ffe066" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Sphere bulge */}
      <mesh position={[0, -0.09, 0]} frustumCulled={false}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <meshStandardMaterial color="#ffe066" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Tassel fringe */}
      <mesh position={[0, -0.72, 0]} frustumCulled={false}>
        <cylinderGeometry args={[0.025, 0.24, 0.95, 18]} />
        <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}
