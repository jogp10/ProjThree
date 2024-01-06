import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Plate extends MyObject {
  constructor(app) {
    super("plate");

    const plateTopRadius = 2;
    const plateBottomRadius = 1.8;
    const plateHeight = 0.2;

    const plateGeometry = new THREE.CylinderGeometry(
      plateTopRadius,
      plateBottomRadius,
      plateHeight,
      32
    );

    this.plateMesh = new THREE.Mesh(
      plateGeometry,
      new THREE.MeshPhongMaterial({ color: 0xaaaaaa })
    ); // Gray/white-ish color

    this.plateMesh.position.set(0, plateHeight / 2, 0);

    this.group.add(this.plateMesh);

    // shadows
    super.enableShadows(this.group);
  }
}

export { Plate };
