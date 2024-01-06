import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Flame extends MyObject {
  constructor(app, mapSize) {
    super("flame");

    const flameHeight = 0.15;
    const flameRadius = 0.1;
    const flameColor = 0x664400; // Red color

    const flameGeometry = new THREE.ConeGeometry(flameRadius, flameHeight, 32, 1, true);
    const flameMaterial = new THREE.MeshPhongMaterial({ color: flameColor, transparent: true, opacity: 0.8, emissive: flameColor })

    const flameMesh = new THREE.Mesh(
      flameGeometry,
      flameMaterial
    );
    flameMesh.position.set(0, flameHeight, 0);
    this.group.add(flameMesh);

    
    const flameMesh2 = new THREE.Mesh(
      flameGeometry,
      flameMaterial
    );
    flameMesh2.position.set(0, 0, 0);
    flameMesh2.rotateX(Math.PI);
    this.group.add(flameMesh2);

    const flameLightIntensity = 3;
    const flameLight = new THREE.PointLight(flameColor, flameLightIntensity, 9, 0.7);
    this.group.add(flameLight);

    // shadows
    flameLight.castShadow = true;
    flameLight.shadow.mapSize.width = mapSize;
    flameLight.shadow.mapSize.height = mapSize;
    flameLight.shadow.camera.near = 0.1;
    flameLight.shadow.camera.far = 2;
  }
}

export { Flame };
