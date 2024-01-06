import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class Jar extends MyObject {
  constructor(app) {
    super("flower");

    // Define materials
    const glassMaterial = new THREE.MeshStandardMaterial({
      transparent: true, 
      opacity: 0.2,
      roughness: 0.2,
    });
    const lidMaterial = new THREE.MeshLambertMaterial({
      color: 0x333333, // Dark gray color for the lid
      side: THREE.DoubleSide,
    });

    // Define control points for the jar's body and lid
    const bodyControlPoints = [
      // U = 0
      [
        // V = 0..5
        [0.0, 0, 0, 1],
        [0.3, 0, 0, 1],
        [0.5, 0, 0, 1],
        [0.4, 0.6, 0, 1],
        [0.3, 0.6, 0, 1],
      ],
      // U = 1
      [
        [0.0, 0, 0.0, 1],
        [0.3, 0, 0.3, 1],
        [0.5, 0, 0.5, 1],
        [0.4, 0.6, 0.4, 1],
        [0.3, 0.6, 0.3, 1],
      ],
      // U = 2
      [
        [-0.0, 0, 0.0, 1],
        [-0.3, 0, 0.3, 1],
        [-0.5, 0, 0.5, 1],
        [-0.4, 0.6, 0.4, 1],
        [-0.3, 0.6, 0.3, 1],
      ],
      // U = 3
      [
        [-0.0, 0, 0, 1],
        [-0.3, 0, 0, 1],
        [-0.5, 0, 0, 1],
        [-0.4, 0.6, 0, 1],
        [-0.3, 0.6, 0, 1],
      ],
      // U = 4
      [
        [-0.0, 0, -0.0, 1],
        [-0.3, 0, -0.3, 1],
        [-0.5, 0, -0.5, 1],
        [-0.4, 0.6, -0.4, 1],
        [-0.3, 0.6, -0.3, 1],
      ],
      // U = 5
      [
        [0.0, 0, -0.0, 1],
        [0.3, 0, -0.3, 1],
        [0.5, 0, -0.5, 1],
        [0.4, 0.6, -0.4, 1],
        [0.3, 0.6, -0.3, 1],
      ],
      // U = 6
      [
        [0.0, 0, 0, 1],
        [0.3, 0, 0, 1],
        [0.5, 0, 0, 1],
        [0.4, 0.6, 0, 1],
        [0.3, 0.6, 0, 1],
      ],
    ];

    const lidControlPoints = [
      // U = 0
      [
        // V = 0..5
        [0.3, 0.6, 0, 1],
        [0.3, 0.7, 0, 1],
      ],
      // U = 1
      [
        [0.3, 0.6, 0.3, 1],
        [0.3, 0.7, 0.3, 1],
      ],
      // U = 2
      [
        [-0.3, 0.6, 0.3, 1],
        [-0.3, 0.7, 0.3, 1],
      ],
      // U = 3
      [
        [-0.3, 0.6, 0, 1],
        [-0.3, 0.7, 0, 1],
      ],
      // U = 4
      [
        [-0.3, 0.6, -0.3, 1],
        [-0.3, 0.7, -0.3, 1],
      ],
      // U = 5
      [
        [0.3, 0.6, -0.3, 1],
        [0.3, 0.7, -0.3, 1],
      ],
      // U = 6
      [
        [0.3, 0.6, 0, 1],
        [0.3, 0.7, 0, 1],
      ],
    ];

    // Create NURBS surfaces for the body and lid
    const bodyGeometry = MyNurbsBuilder.build(bodyControlPoints, 6, 4, 32, 32);
    const lidGeometry = MyNurbsBuilder.build(lidControlPoints, 6, 1, 32, 32);

    const body = new THREE.CircleGeometry(0.2, 32, 0, 2 * Math.PI);
    const bodyMesh = new THREE.Mesh(body, glassMaterial);
    bodyMesh.rotation.x = -Math.PI / 2;
    bodyMesh.position.x = 0.05;
    bodyMesh.scale.x = 1.2;

    this.jarBody = new THREE.Mesh(bodyGeometry, glassMaterial);
    this.group.add(this.jarBody);

    const lid = new THREE.CircleGeometry(0.2, 32, 0, 2 * Math.PI);
    const lidMesh = new THREE.Mesh(lid, lidMaterial);
    lidMesh.rotation.x = -Math.PI / 2;
    lidMesh.position.y = 0.7;
    lidMesh.position.x = 0.05;
    lidMesh.scale.x = 1.3;

    this.jarLid = new THREE.Mesh(lidGeometry, lidMaterial);
    this.group.add(this.jarLid);

    // shadows
    super.enableCastShadows(this.group);
  }
}

export { Jar };
