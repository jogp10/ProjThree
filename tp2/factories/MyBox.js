import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyBox extends MyObject {
  constructor(boxData, material) {
    super(boxData.id);

    this.material = material;

    if (boxData.representations.length > 0) {
      this.representations = boxData.representations[0];

      for (let attribute in this.representations) {
        switch (attribute) {
          case "xyz1":
            this.xyz1 = this.representations.xyz1;
            break;
          case "xyz2":
            this.xyz2 = this.representations.xyz2;
            break;
          case "partsx":
            this.partsX = this.representations.partsx;
            break;
          case "partsy":
            this.partsY = this.representations.partsy;
            break;
          case "partsz":
            this.partsZ = this.representations.partsz;
            break;
          case "distance":
            this.distance = this.representations.distance;
            break;
          default:
            break;
        }
      }
    }

    // Calculate width, height, and depth based on xyz1 and xyz2 coordinates
    const width = Math.abs(this.xyz2[0] - this.xyz1[0]);
    const height = Math.abs(this.xyz2[1] - this.xyz1[1]);
    const depth = Math.abs(this.xyz2[2] - this.xyz1[2]);

    let translate_x = (this.xyz1[0] + this.xyz2[0]) / 2;

    let translate_y = (this.xyz1[1] + this.xyz2[1]) / 2;

    let translate_z = (this.xyz1[2] + this.xyz2[2]) / 2;

    // Create a box geometry
    const geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      this.partsX,
      this.partsY,
      this.partsZ
    );

    this.mesh = new THREE.Mesh(geometry, this.material);

    this.mesh.translateX(translate_x);
    this.mesh.translateY(translate_y);
    this.mesh.translateZ(translate_z);

    this.group.add(this.mesh);
  }
}

export { MyBox };
