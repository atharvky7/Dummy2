'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeViewerProps {
  activeSensorId: number | null;
  onObjectClick: (id: number) => void;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ activeSensorId, onObjectClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const interactiveObjectsRef = useRef<THREE.Mesh[]>([]);

  const handleObjectClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !sceneRef.current) return;

    const renderer = (mountRef.current.firstChild as THREE.WebGLRenderer);
    if (!renderer) return;
    
    const camera = sceneRef.current.getObjectByProperty('isPerspectiveCamera', true) as THREE.PerspectiveCamera;
    if (!camera) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveObjectsRef.current);
    if (intersects.length > 0) {
      const firstIntersected = intersects[0].object as THREE.Mesh;
      if (firstIntersected.userData.sensorId !== undefined) {
        onObjectClick(firstIntersected.userData.sensorId);
      }
    }
  }, [onObjectClick]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xe0e0e0);

    const camera = new THREE.PerspectiveCamera(50, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- Objects ---
    const positions: [number, number, number][] = [[-3, 2, 0], [2, 2.5, -2], [4, 1.5, 3]];
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    
    interactiveObjectsRef.current = [];
    positions.forEach((pos, i) => {
      const building = new THREE.Mesh(new THREE.BoxGeometry(2, pos[1], 3), buildingMaterial.clone());
      building.position.set(pos[0], pos[1] / 2, pos[2]);
      building.userData.sensorId = i; // Corresponds to sensorData[i]
      scene.add(building);
      interactiveObjectsRef.current.push(building);
    });

    // --- Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- Event Listeners ---
    const handleResize = () => {
        if (!mountNode) return;
        camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('click', handleObjectClick);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
          renderer.domElement.removeEventListener('click', handleObjectClick);
          mountNode.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [handleObjectClick]);

  useEffect(() => {
    interactiveObjectsRef.current.forEach(obj => {
      const color = obj.userData.sensorId === activeSensorId ? 0x10b981 : 0xcccccc;
      (obj.material as THREE.MeshStandardMaterial).color.set(color);
    });
  }, [activeSensorId]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeViewer;
