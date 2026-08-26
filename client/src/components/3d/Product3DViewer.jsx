import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, RefreshCcw, Eye, Palette } from 'lucide-react';

const SHAPE_PRESETS = {
  sneaker: { label: 'Sneaker', icon: '👟' },
  watch: { label: 'Luxury Watch', icon: '⌚' },
  bag: { label: 'Tote Bag', icon: '👜' },
  gem: { label: 'Solitaire Gem', icon: '💎' },
  sunglasses: { label: 'Eyewear', icon: '🕶️' }
};

const FINISHES = [
  { name: 'Metallic Ruby', hex: 0xFF3F6C, metal: 0.85, rough: 0.15 },
  { name: 'Matte Onyx', hex: 0x222225, metal: 0.2, rough: 0.7 },
  { name: 'Cyber Cyan', hex: 0x00DFD8, metal: 0.9, rough: 0.1 },
  { name: 'Champagne Gold', hex: 0xE5B869, metal: 0.95, rough: 0.2 },
  { name: 'Pure White', hex: 0xF8F8FA, metal: 0.1, rough: 0.3 }
];

const Product3DViewer = ({ categoryName = 'Fashion', productName = 'Product' }) => {
  const mountRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState('sneaker');
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5.5);

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const meshGroupRef = useRef(null);
  const sceneStateRef = useRef({
    finish: FINISHES[0],
    shape: 'sneaker',
    wireframe: false,
    autoRotate: true,
    zoom: 5.5,
  });

  useEffect(() => {
    sceneStateRef.current.finish = selectedFinish;
    sceneStateRef.current.shape = selectedShape;
    sceneStateRef.current.wireframe = isWireframe;
    sceneStateRef.current.autoRotate = autoRotate;
    sceneStateRef.current.zoom = zoomLevel;
  }, [selectedFinish, selectedShape, isWireframe, autoRotate, zoomLevel]);

  // Set default shape according to category
  useEffect(() => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('watch')) setSelectedShape('watch');
    else if (cat.includes('bag') || cat.includes('handbag')) setSelectedShape('bag');
    else if (cat.includes('jewel') || cat.includes('ring') || cat.includes('gem')) setSelectedShape('gem');
    else if (cat.includes('sunglass') || cat.includes('eyewear')) setSelectedShape('sunglasses');
    else setSelectedShape('sneaker');
  }, [categoryName]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF9FAFB);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, zoomLevel);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xFFE5EC, 1.2);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFF3F6C, 2.5, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Circular Studio Turntable Podium
    const podiumGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xEAEAEC,
      roughness: 0.4,
      metalness: 0.1,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -1.1;
    podium.receiveShadow = true;
    scene.add(podium);

    // Glowing Podium Edge Ring
    const edgeRingGeo = new THREE.TorusGeometry(2.41, 0.02, 16, 64);
    const edgeRingMat = new THREE.MeshBasicMaterial({ color: 0xFF3F6C });
    const edgeRing = new THREE.Mesh(edgeRingGeo, edgeRingMat);
    edgeRing.rotation.x = Math.PI / 2;
    edgeRing.position.y = -0.98;
    scene.add(edgeRing);

    // Dynamic Product Mesh Group
    const productGroup = new THREE.Group();
    productGroup.position.y = 0.1;
    scene.add(productGroup);
    meshGroupRef.current = productGroup;

    // Helper to generate 3D geometric shapes
    const buildModel = (shapeType, finish, wireframe) => {
      // Clear previous children
      while (productGroup.children.length > 0) {
        const obj = productGroup.children[0];
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
        productGroup.remove(obj);
      }

      const baseMat = new THREE.MeshPhysicalMaterial({
        color: finish.hex,
        metalness: finish.metal,
        roughness: finish.rough,
        clearcoat: finish.metal > 0.5 ? 0.8 : 0.2,
        clearcoatRoughness: 0.1,
        wireframe: wireframe,
        flatShading: shapeType === 'gem',
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: wireframe,
      });

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xE5B869,
        metalness: 0.95,
        roughness: 0.15,
        wireframe: wireframe,
      });

      if (shapeType === 'sneaker') {
        // Sole
        const soleGeo = new THREE.BoxGeometry(2.4, 0.35, 1.1);
        const sole = new THREE.Mesh(soleGeo, accentMat);
        sole.position.set(0, -0.4, 0);
        sole.castShadow = true;
        productGroup.add(sole);

        // Body Upper
        const upperGeo = new THREE.BoxGeometry(2.2, 0.7, 1.0);
        const upper = new THREE.Mesh(upperGeo, baseMat);
        upper.position.set(-0.05, 0.1, 0);
        upper.castShadow = true;
        productGroup.add(upper);

        // Ankle Collar
        const collarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.7, 24);
        const collar = new THREE.Mesh(collarGeo, baseMat);
        collar.position.set(0.4, 0.6, 0);
        productGroup.add(collar);

        // Swoosh / Accent Stripe
        const stripeGeo = new THREE.TorusGeometry(0.7, 0.06, 12, 32, Math.PI);
        const stripe = new THREE.Mesh(stripeGeo, goldMat);
        stripe.rotation.z = -0.3;
        stripe.position.set(0, 0.1, 0.52);
        productGroup.add(stripe);
      } else if (shapeType === 'watch') {
        // Watch Bezel / Case
        const caseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.25, 36);
        const caseMesh = new THREE.Mesh(caseGeo, goldMat);
        caseMesh.rotation.x = Math.PI / 2;
        caseMesh.castShadow = true;
        productGroup.add(caseMesh);

        // Dial Face
        const dialGeo = new THREE.CircleGeometry(0.85, 36);
        const dialMesh = new THREE.Mesh(dialGeo, baseMat);
        dialMesh.position.z = 0.13;
        productGroup.add(dialMesh);

        // Strap
        const strapGeo = new THREE.BoxGeometry(0.7, 2.6, 0.12);
        const strapMesh = new THREE.Mesh(strapGeo, accentMat);
        strapMesh.castShadow = true;
        productGroup.add(strapMesh);
      } else if (shapeType === 'bag') {
        // Bag Main Body
        const bagGeo = new THREE.BoxGeometry(1.8, 1.5, 0.9);
        const bagMesh = new THREE.Mesh(bagGeo, baseMat);
        bagMesh.castShadow = true;
        productGroup.add(bagMesh);

        // Bag Handles
        const handleGeo = new THREE.TorusGeometry(0.6, 0.06, 16, 32, Math.PI);
        const handle1 = new THREE.Mesh(handleGeo, goldMat);
        handle1.position.set(0, 0.75, 0.25);
        productGroup.add(handle1);

        const handle2 = new THREE.Mesh(handleGeo, goldMat);
        handle2.position.set(0, 0.75, -0.25);
        productGroup.add(handle2);
      } else if (shapeType === 'gem') {
        // Brilliant Cut Diamond Geometry
        const gemGeo = new THREE.OctahedronGeometry(1.2, 2);
        const gemMesh = new THREE.Mesh(gemGeo, baseMat);
        gemMesh.castShadow = true;
        productGroup.add(gemMesh);

        // Orbiting Ring
        const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, goldMat);
        ringMesh.rotation.x = Math.PI / 3;
        productGroup.add(ringMesh);
      } else {
        // Sunglasses Frame
        const lensGeo1 = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 24);
        const lens1 = new THREE.Mesh(lensGeo1, baseMat);
        lens1.rotation.x = Math.PI / 2;
        lens1.position.set(-0.6, 0, 0);
        productGroup.add(lens1);

        const lens2 = lens1.clone();
        lens2.position.set(0.6, 0, 0);
        productGroup.add(lens2);

        const bridgeGeo = new THREE.BoxGeometry(0.4, 0.06, 0.06);
        const bridge = new THREE.Mesh(bridgeGeo, goldMat);
        bridge.position.set(0, 0.1, 0);
        productGroup.add(bridge);

        const frameGeo = new THREE.TorusGeometry(0.48, 0.04, 12, 32);
        const frame1 = new THREE.Mesh(frameGeo, accentMat);
        frame1.position.set(-0.6, 0, 0);
        productGroup.add(frame1);

        const frame2 = new THREE.Mesh(frameGeo, accentMat);
        frame2.position.set(0.6, 0, 0);
        productGroup.add(frame2);
      }
    };

    buildModel(selectedShape, selectedFinish, isWireframe);

    // Interactive Drag Controls (Turntable 360)
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !productGroup) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      productGroup.rotation.y += deltaX * 0.01;
      productGroup.rotation.x += deltaY * 0.01;

      // Clamp X rotation to avoid flip
      productGroup.rotation.x = Math.max(-0.6, Math.min(0.6, productGroup.rotation.x));

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prev) => Math.max(3.5, Math.min(8.0, prev + e.deltaY * 0.005)));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize Handler
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

      camera.position.z = sceneStateRef.current.zoom;

      if (sceneStateRef.current.autoRotate && !isDraggingRef.current && productGroup) {
        productGroup.rotation.y += 0.8 * delta;
        // Subtle floating bob
        productGroup.position.y = 0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container) {
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('wheel', onWheel);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      podiumGeo.dispose();
      podiumMat.dispose();
      edgeRingGeo.dispose();
      edgeRingMat.dispose();
    };
  }, [selectedShape, selectedFinish, isWireframe]);

  const handleResetView = () => {
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.set(0, 0, 0);
      meshGroupRef.current.position.set(0, 0.1, 0);
    }
    setZoomLevel(5.5);
  };

  return (
    <div className="relative w-full bg-slate-50 rounded-2xl border border-gray-200 overflow-hidden shadow-inner flex flex-col">
      {/* Top Controls Bar */}
      <div className="p-3 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-extrad-pink text-white uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> 3D 360° Studio
          </span>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Interactive Product Model
          </span>
        </div>

        {/* 3D Geometry Shape Selector */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {Object.keys(SHAPE_PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedShape(key)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                selectedShape === key
                  ? 'bg-white text-extrad-dark shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-extrad-dark'
              }`}
              title={SHAPE_PRESETS[key].label}
            >
              <span>{SHAPE_PRESETS[key].icon}</span>
              <span className="hidden md:inline">{SHAPE_PRESETS[key].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Area */}
      <div className="relative w-full h-[380px] sm:h-[460px]">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Side Tools */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-md transition-all ${
              autoRotate
                ? 'bg-extrad-pink text-white border-extrad-pink shadow-neon-pink'
                : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
            }`}
            title={autoRotate ? 'Pause 360° Spin' : 'Auto 360° Spin'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-md transition-all ${
              isWireframe
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
            }`}
            title="Toggle Wireframe Mesh"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(3.5, z - 0.5))}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-md transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(8.0, z + 0.5))}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-md transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-md transition-all"
            title="Reset Camera"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Interactive Helper Hint */}
        <div className="absolute bottom-4 left-4 z-20 text-[11px] font-bold text-gray-600 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm pointer-events-none flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-extrad-pink" />
          <span>Click & Drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* Bottom Material Finish Customizer */}
      <div className="p-3.5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-extrad-pink" />
          <span className="text-xs font-black text-extrad-dark uppercase tracking-wider">
            Material Texture & Shade:
          </span>
        </div>

        <div className="flex items-center gap-2">
          {FINISHES.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelectedFinish(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                selectedFinish.name === f.name
                  ? 'border-extrad-pink bg-extrad-peach text-extrad-dark shadow-sm scale-105'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs"
                style={{ backgroundColor: `#${f.hex.toString(16).padStart(6, '0')}` }}
              />
              <span className="text-[11px]">{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product3DViewer;
