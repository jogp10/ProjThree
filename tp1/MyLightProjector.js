import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class LightProjector extends MyObject {
  constructor(app, targetFrame, mapSize) {
    super("lightProjector");

    // create a spot light
    const color = 0xF1E398
    this.spotLight = new THREE.SpotLight(
      color,
      30,
      0,
      Math.PI / 6,
      0.5,
      1.8
    );

    this.spotLight.position.set(-2, 0.3, 0);
    this.spotLight.target = targetFrame;
    this.spotLight.lookAt(targetFrame.position);

    // Create the light projector using a cylinder geometry
    const projectorRadius = 0.2;
    const projectorHeight = 0.25;
    const projectorGeometry = new THREE.CylinderGeometry(
      projectorRadius,
      projectorRadius,
      projectorHeight,
      32
    );
    const projectorMaterial = new THREE.MeshBasicMaterial({
      color: 0x222222,
    });

    const miniLightGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05);
    const miniLightMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
    });

    this.projector = new THREE.Mesh(projectorGeometry, projectorMaterial);

    this.miniLights = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const miniLight = new THREE.Mesh(miniLightGeometry, miniLightMaterial);
      miniLight.position.set(-0.06, projectorHeight / 2, 0.1 * (i%2 ? -1 : 1));
      this.miniLights.add(miniLight);
    }

    const miniLight = new THREE.Mesh(miniLightGeometry, miniLightMaterial);
    miniLight.position.set(0.1, projectorHeight / 2, 0);
    this.miniLights.add(miniLight);

    // Mounts
    this.mounts = new THREE.Group();
    const mountGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.05);
    const mountGeometry2 = new THREE.BoxGeometry(0.35, 0.1, 0.05);

    const mountMaterial = new THREE.MeshBasicMaterial({ color: 0x2d2d2d });

    for (let i = 0; i < 2; i++) {
      const mount = new THREE.Mesh(mountGeometry, mountMaterial);
      mount.position.set(0, -0.2, 0.15 * (i%2 ? -1 : 1));
      mount.rotateY(Math.PI / 2);
      this.mounts.add(mount);
    }
    
    const biggerMount = new THREE.Mesh(mountGeometry2, mountMaterial);
    biggerMount.position.set(0.05, -0.3, 0);
    biggerMount.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    this.mounts.add(biggerMount);

    // Add the projector to the group
    this.projectorLight = new THREE.Group();
    this.projectorLight.add(this.projector);
    this.projectorLight.add(this.miniLights);
    this.projectorLight.add(this.mounts);
    this.projectorLight.rotation.z = Math.PI / 4;

    this.group.add(this.spotLight);
    this.group.add(this.projectorLight);

    // shadows
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = mapSize;
    this.spotLight.shadow.mapSize.height = mapSize;
    this.spotLight.shadow.camera.near = 2;
    this.spotLight.shadow.camera.far = 25;

    super.enableShadows(this.mounts);
  }
}

export { LightProjector };
