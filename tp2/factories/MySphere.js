import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MySphere extends MyObject {
  constructor(sphereData, material) {
    super(sphereData.subtype + "_sphere");

    this.material = material;

    if (sphereData.representations.length > 0) {
      this.representations = sphereData.representations[0];

      for (let attribute in this.representations) {
        switch (attribute) {
          case "radius":
            this.radius = this.representations.radius;
            break;
          case "slices":
            this.slices = this.representations.slices;
            break;
          case "stacks":
            this.stacks = this.representations.stacks;
            break;
          case "thetastart":
            this.thetaStart = this.representations.thetastart;
            break;
          case "thetalength":
            this.thetaLength = this.representations.thetalength;
            break;
          case "phistart":
            this.phiStart = this.representations.phistart;
            break;
          case "philength":
            this.phiLength = this.representations.philength;
            break;
          case "distance":
            this.distance = this.representations.distance;
            break;
          default:
            break;
        }
      }
    }

    // Create a sphere geometry
    this.geometry = new THREE.SphereGeometry(
      this.radius,
      this.slices,
      this.stacks,
      this.phiStart,
      this.phiLength,
      this.thetaStart,
      this.thetaLength
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.group.add(this.mesh);
  }
}

export { MySphere };
