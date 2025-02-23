import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Leaf3D {
    constructor(containerId) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        this.container = element;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableZoom = false;

        this.addLights();
        this.createLeafWithTexture();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    createLeafWithTexture() {
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
            'assets/images/logo.png',
            (texture) => {
                const geometry = new THREE.PlaneGeometry(4, 4);
                const material = new THREE.MeshPhysicalMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    metalness: 0.1,
                    roughness: 0.5,
                    clearcoat: 0.3
                });

                this.leaf = new THREE.Mesh(geometry, material);
                this.leaf.rotation.x = 0;
                this.scene.add(this.leaf);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );
    }

    addLights() {
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -5, -5);
        this.scene.add(fillLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.leaf && this.controls && !this.controls.enabled) {
            const time = Date.now() * 0.001;
            this.leaf.rotation.y = Math.sin(time * 0.5) * 0.1;
            this.leaf.rotation.z = Math.cos(time * 0.5) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Leaf3D('leaf-container');
});

export default Leaf3D;