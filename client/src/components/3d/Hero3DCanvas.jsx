import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, Zap, Layers, RefreshCw } from 'lucide-react';

const PALETTES = {
  rose: {
    primary: 0xFF3F6C,
    secondary: 0xFF5722,
    accent: 0xFFD700,
    backgroundLight: 0xFFF1F3,
    label: 'Rose Luxury'
  },
  neon: {
    primary: 0x00DFD8,
    secondary: 0x7928CA,
    accent: 0xFF0080,
    backgroundLight: 0x0F172A,
    label: 'Cyber Glow'
  },
  gold: {
    primary: 0xFFB800,
    secondary: 0xFF6B00,
    accent: 0xFFE600,
    backgroundLight: 0x1E1B18,
    label: 'Royal Gold'
  }
};

const Hero3DCanvas = () => {
  const mountRef = useRef(null);
  const [activePalette, setActivePalette] = useState('rose');
  const [isWireframe, setIsWireframe] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);

  const sceneStateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    palette: PALETTES.rose,
    wireframe: false,
    speed: 1,
  });

  useEffect(() => {
    sceneStateRef.current.palette = PALETTES[activePalette];
    sceneStateRef.current.wireframe = isWireframe;
    sceneStateRef.current.speed = speedMultiplier;
  }, [activePalette, isWireframe, speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Hero Geometry: Faceted Icosahedron / Luxury Crystal
    const crystalGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: sceneStateRef.current.palette.primary,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      wireframe: isWireframe,
      flatShading: true,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    mainGroup.add(crystalMesh);

    // 2. Outer Orbiting Torus Rings
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: sceneStateRef.current.palette.secondary,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: isWireframe,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: sceneStateRef.current.palette.accent,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: isWireframe,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 3. Floating Micro-Spheres
    const spheresGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: sceneStateRef.current.palette.accent,
      metalness: 0.9,
      roughness: 0.1,
      emissive: sceneStateRef.current.palette.primary,
      emissiveIntensity: 0.3,
    });

    const sphereInstances = [];
    for (let i = 0; i < 12; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 2.0 + Math.sin(i) * 0.5;
      sphere.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      spheresGroup.add(sphere);
      sphereInstances.push({ mesh: sphere, angle, radius, speed: 0.01 + Math.random() * 0.01 });
    }
    mainGroup.add(spheresGroup);

    // 4. Background Star / Dust Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Dynamic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(sceneStateRef.current.palette.primary, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(sceneStateRef.current.palette.secondary, 3, 20);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    // Mouse Movement Handler for 3D Parallax
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      sceneStateRef.current.targetX = x * 0.8;
      sceneStateRef.current.targetY = y * 0.6;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSpeed = sceneStateRef.current.speed;

      // Smooth mouse tracking interpolation
      sceneStateRef.current.mouseX += (sceneStateRef.current.targetX - sceneStateRef.current.mouseX) * 0.05;
      sceneStateRef.current.mouseY += (sceneStateRef.current.targetY - sceneStateRef.current.mouseY) * 0.05;

      // Update materials based on state
      const p = sceneStateRef.current.palette;
      crystalMat.color.setHex(p.primary);
      crystalMat.wireframe = sceneStateRef.current.wireframe;
      ringMat1.color.setHex(p.secondary);
      ringMat1.wireframe = sceneStateRef.current.wireframe;
      ringMat2.color.setHex(p.accent);
      ringMat2.wireframe = sceneStateRef.current.wireframe;
      pointLight1.color.setHex(p.primary);
      pointLight2.color.setHex(p.secondary);

      // Rotations
      crystalMesh.rotation.x += 0.3 * delta * currentSpeed;
      crystalMesh.rotation.y += 0.5 * delta * currentSpeed;

      ring1.rotation.x += 0.4 * delta * currentSpeed;
      ring1.rotation.z += 0.2 * delta * currentSpeed;

      ring2.rotation.y -= 0.3 * delta * currentSpeed;
      ring2.rotation.x += 0.2 * delta * currentSpeed;

      // Floating spheres orbit
      sphereInstances.forEach((item) => {
        item.angle += item.speed * currentSpeed;
        item.mesh.position.x = Math.cos(item.angle) * item.radius;
        item.mesh.position.z = Math.sin(item.angle) * item.radius;
      });

      // Particle system slow float
      particleSystem.rotation.y += 0.05 * delta;

      // Parallax effect on mainGroup
      mainGroup.rotation.y = sceneStateRef.current.mouseX * 0.8;
      mainGroup.rotation.x = -sceneStateRef.current.mouseY * 0.8;

      // Floating sinusoidal bobbing
      mainGroup.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden group">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
      />

      {/* Floating 3D Interactive Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-bold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="tracking-wider uppercase">Interactive 3D Stage</span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-xl">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/20">
          {Object.keys(PALETTES).map((pKey) => (
            <button
              key={pKey}
              onClick={() => setActivePalette(pKey)}
              className={`w-5 h-5 rounded-full transition-transform ${
                activePalette === pKey ? 'scale-125 ring-2 ring-white shadow-neon-pink' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background:
                  pKey === 'rose'
                    ? 'linear-gradient(135deg, #FF3F6C, #FF5722)'
                    : pKey === 'neon'
                    ? 'linear-gradient(135deg, #00DFD8, #7928CA)'
                    : 'linear-gradient(135deg, #FFB800, #FF6B00)',
              }}
              title={PALETTES[pKey].label}
            />
          ))}
        </div>

        {/* Wireframe Toggle */}
        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
            isWireframe ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title="Toggle 3D Wireframe"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        {/* Rotation Speed Toggle */}
        <button
          onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.2 : 1))}
          className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-bold flex items-center gap-1 transition-colors"
          title="Change Spin Speed"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-[10px]">{speedMultiplier}x</span>
        </button>
      </div>

      {/* Subtle bottom guide tooltip */}
      <div className="absolute bottom-4 left-4 z-20 text-[10px] font-semibold text-white/70 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-md pointer-events-none hidden sm:block">
        ✨ Move cursor to tilt 3D perspective
      </div>
    </div>
  );
};

export default Hero3DCanvas;
