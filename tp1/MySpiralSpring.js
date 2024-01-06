import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class SpiralSpring extends MyObject {
  constructor(app) {
    super("spiralSpring");

    // Define the colors and materials
    const springColor = 0xb3b0ab;

    const springMaterial = new THREE.LineBasicMaterial({
      color: springColor,
      });

    let pointsCatmull = [];
    const numSegments = 10; // Number of spiral segments
    const pointsPerSegment = 100; // Number of points per segment
    const radius = 0.1; // Radius of the spiral
    const heightPerSegment = 0.1; // Height per spiral segment

    for (let segment = 0; segment < numSegments; segment++) {
      for (let i = 0; i < pointsPerSegment; i++) {
        const theta = (i * (Math.PI * 2)) / pointsPerSegment; // Angle in radians
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z =
          segment * heightPerSegment +
          (i / pointsPerSegment) * heightPerSegment;

        pointsCatmull.push(new THREE.Vector3(x, y, z));
      }
    }

    this.curveCatmull = new THREE.CatmullRomCurve3(
      pointsCatmull,
      false,
      "catmullrom"
    );

    let sampledPoints = this.curveCatmull.getPoints(1000);

    let geometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);

    this.springMesh = new THREE.Line(geometry, springMaterial);

    this.group.add(this.springMesh);
  }
}

export { SpiralSpring };
