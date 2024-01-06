import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Lamp extends MyObject {
  constructor(app, onoff, mapSize, roomSize) {
    super("lamp");

    const lampBaseRadius = 0.5;
    const lampColor = 0x777777;
    const lampPoleRadius = 0.07;
    const lampPoleHeight = 3;

    // Lamp pole
    const lampPoleGeometry = new THREE.CylinderGeometry(
      lampPoleRadius,
      lampPoleRadius,
      lampPoleHeight,
      32
    );
    const lampPoleMaterial = new THREE.MeshBasicMaterial({
      color: lampColor,
    });

    this.lampPole = new THREE.Mesh(lampPoleGeometry, lampPoleMaterial);
    this.lampPole.position.set(0, lampBaseRadius + lampPoleHeight / 2, 0);
    this.group.add(this.lampPole);

    // Lamp base
    const lampBaseGeometry = new THREE.SphereGeometry(
      lampBaseRadius,
      32,
      32,
      Math.PI / 2, // Starting angle
      Math.PI, // angle (180 degrees)
      0, // Azimuthal start angle
      Math.PI // Azimuthal angle (180 degrees)
    );
    const lampBaseMaterial = new THREE.MeshBasicMaterial({
      color: lampColor,
    });

    this.lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
    this.lampBase.rotateZ(Math.PI / 2);
    this.group.add(this.lampBase);

    if (onoff) {
      const lampLightRadius = lampBaseRadius;

      // Yellow plane to simulate light
      const lampLightGeometry = new THREE.CircleGeometry(lampLightRadius, 32);
      const lampLightMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00, // Yellow color for lamp light
        emissive: 0xffff00,
        specular: 0xffffff,
        shininess: 30,
      });

      const lampLight = new THREE.Mesh(lampLightGeometry, lampLightMaterial);
      lampLight.rotation.set(Math.PI / 2, 0, 0);

      this.group.add(lampLight);

      // Point light yellowish
      this.pointLight = new THREE.PointLight(0xffffff, 50, 0, 2.5);

      this.pointLight.castShadow = true;
      this.pointLight.shadow.mapSize.width = mapSize;
      this.pointLight.shadow.mapSize.height = mapSize;
      this.pointLight.shadow.camera.near = 3;
      this.pointLight.shadow.camera.far = roomSize+5;

      this.group.add(this.pointLight);
    }
  }
}

export { Lamp };
