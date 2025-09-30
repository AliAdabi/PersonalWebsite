import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeJSViewer = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const modelRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 8);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        rendererRef.current = renderer;

        // Add renderer to DOM
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Orbit Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 2;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI;
        controlsRef.current = controls;

        // Enhanced lighting setup for bright, well-lit object
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Main directional light (key light)
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight1.position.set(10, 10, 5);
        directionalLight1.castShadow = true;
        directionalLight1.shadow.mapSize.width = 2048;
        directionalLight1.shadow.mapSize.height = 2048;
        scene.add(directionalLight1);

        // Fill light from opposite side
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight2.position.set(-10, -10, -5);
        scene.add(directionalLight2);

        // Top light
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight3.position.set(0, 15, 0);
        scene.add(directionalLight3);

        // Front light
        const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight4.position.set(0, 0, 10);
        scene.add(directionalLight4);

        // Point light for additional illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);

        // Hemisphere light for natural lighting
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemisphereLight);

        // Add a grid helper for reference
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
        scene.add(gridHelper);

        // Load OBJ model
        const loader = new OBJLoader();
        loader.load(
            '/base.obj',
            (object) => {
                // Center the model
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);

                // Scale the model to fit in view
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                object.scale.setScalar(scale);

                // Add enhanced material to the model
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshPhongMaterial({
                            color: 0xcccccc,
                            side: THREE.DoubleSide,
                            shininess: 150,
                            specular: 0x666666,
                            emissive: 0x111111
                        });
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                scene.add(object);
                modelRef.current = object;

                // Update controls target to model center
                controls.target.copy(center);
                controls.update();
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading OBJ file:', error);
                // Add a fallback cube if OBJ fails to load
                const geometry = new THREE.BoxGeometry(2, 2, 2);
                const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);
                modelRef.current = cube;
            }
        );

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);

            const currentMount = mountRef.current;
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1
            }}
        />
    );
};

export default ThreeJSViewer;
