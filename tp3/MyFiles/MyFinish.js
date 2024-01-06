import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyFinish extends MyObject {
  constructor(pos) {
    super("finish");
    this.pos = pos;
    this.build();
  }

  build() {
    // 1st pole
    let poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
    let poleMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 }); // Use MeshPhongMaterial for more realistic shading
    let poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
    poleMesh.position.set(0, 1, -9);

    // 2nd pole
    let poleMesh2 = poleMesh.clone();
    poleMesh2.position.set(0, 1, 9);

    // Banner connecting poles
    let bannerGeometry = new THREE.PlaneGeometry(18, 1);
    let textureLoader = new THREE.TextureLoader();
    let bannerTexture = textureLoader.load("textures/checkers.png"); // Load checker texture
    let bannerMaterial = new THREE.MeshPhongMaterial({
      map: bannerTexture,
      side: THREE.DoubleSide,
    }); // Apply texture to material
    let bannerMesh = new THREE.Mesh(bannerGeometry, bannerMaterial);
    bannerMesh.rotation.y = Math.PI / 2;
    bannerMesh.position.set(0, 2.5, 0);

    this.group.add(poleMesh);
    this.group.add(poleMesh2);
    this.group.add(bannerMesh);
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.scale.set(1, 2.5, 1);
  }
}

export { MyFinish };
