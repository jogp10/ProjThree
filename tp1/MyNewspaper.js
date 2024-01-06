import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class Newspaper extends MyObject {
  constructor(app, texture) {
    super("newspaper");

    const newspaperTexture = new THREE.TextureLoader().load(texture);
    newspaperTexture.rotation = Math.PI / 2;
    newspaperTexture.wrapS = newspaperTexture.wrapT = THREE.RepeatWrapping;
    newspaperTexture.anisotropy = 16;
    newspaperTexture.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.MeshLambertMaterial({
      map: newspaperTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.samplesU = 16;
    this.samplesV = 16;

    let newspaperMesh = this.createNurbsSurfaces();
    this.group.add(newspaperMesh);
    
    this.enableCastShadows(this.group);
  }

  createNurbsSurfaces() {
    // declare local variables
    let controlPoints;
    let surfaceData;
    let mesh;
    let orderU = 6;
    let orderV = 1;

    // build nurb #1
    controlPoints = [
      // U = 0
      [
        // V = 0..1
        [0, -1.5, -0.5, 1],
        [0, 1.5, -0.5, 1],
      ],
      // U = 1
      [
        // V = 0..1
        [-0.1, -1.5, 0, 1],
        [-0.1, 1.5, 0, 1],
      ],
      // U = 2
      [
        // V = 0..1
        [-0.3, -1.5, 1.0, 1],
        [-0.3, 1.5, 1.0, 1],
      ],

      // Middle
      // U = 3
      [
        // V = 0..1
        [0, -1.5, 3.0, 1],
        [0, 1.5, 3.0, 1],
      ],
      // U = 4
      [
        // V = 0..1
        [0.3, -1.5, 1.0, 1],
        [0.3, 1.5, 1.0, 1],
      ],
      // U = 5
      [
        // V = 0..1
        [0.1, -1.5, 0, 1],
        [0.1, 1.5, 0, 1],
      ],
      // U = 6
      [
        // V = 0..1
        [0, -1.5, -0.5, 1],
        [0, 1.5, -0.5, 1],
      ],
    ];

    // Create the NURBS surface and add it to the scene
    surfaceData = MyNurbsBuilder.build(
      controlPoints,
      orderU,
      orderV,
      this.samplesU,
      this.samplesV
    );

    mesh = new THREE.Mesh(surfaceData, this.material);
    return mesh;
  }
}

export { Newspaper };
