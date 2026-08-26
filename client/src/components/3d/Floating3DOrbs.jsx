import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Floating3DOrbs = ({ className = 'absolute inset-0 pointer-events-none' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Floating Geometry Meshes (Octahedrons, Torus, Spheres)
    const items = [];
    const colors = [0xFF3F6C, 0xFF5722, 0x00DFD8, 0xFFD700, 0x7928CA];

    for (let i = 0; i < 8; i++) {
      let geo;
      if (i % 3 === 0) geo = new THREE.OctahedronGeometry(0.35 + Math.random() * 0.3);
      else if (i % 3 === 1) geo = new THREE.TorusGeometry(0.4, 0.08, 12, 24);
      else geo = new THREE.IcosahedronGeometry(0.3, 0);

      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.45,
        wireframe: i % 2 === 1,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );

      scene.add(mesh);
      items.push({
        mesh,
        geo,
        mat,
        rotSpeedX: (Math.random() - 0.5) * 0.8,
        rotSpeedY: (Math.random() - 0.5) * 0.8,
        floatSpeed: 0.5 + Math.random() * 0.8,
        initialY: mesh.position.y,
        timeOffset: Math.random() * Math.PI * 2,
      });
    }

    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFF3F6C, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

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
      const elapsed = clock.getElapsedTime();

      items.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX * 0.02;
        item.mesh.rotation.y += item.rotSpeedY * 0.02;
        item.mesh.position.y = item.initialY + Math.sin(elapsed * item.floatSpeed + item.timeOffset) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      items.forEach((it) => {
        it.geo.dispose();
        it.mat.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} className={className} />;
};

export default Floating3DOrbs;
