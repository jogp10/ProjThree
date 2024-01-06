import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyCylinder extends MyObject {
  cylinder = null;
  base = 1.0; // Default value
  top = 1.0; // Default value
  height = 1.0; // Default value
  slices = 32; // Default value
  stacks = 1; // Default value
  capsClose = false; // Default value
  thetaStart = 0.0; // Default value
  thetaLength = 2 * Math.PI; // Default value
  distance = 0.0; // Default value
  material = null;

  constructor(cylinderData, material) {
    super(cylinderData.subtype + "_cylinder");

    this.material = material;

    if (cylinderData.representations.length > 0) {
      this.representations = cylinderData.representations[0];

      for (let attribute in this.representations) {
        switch (attribute) {
          case "base":
            this.base = this.representations.base;
            break;
          case "top":
            this.top = this.representations.top;
            break;
          case "height":
            this.height = this.representations.height;
            break;
          case "slices":
            this.slices = this.representations.slices;
            break;
          case "stacks":
            this.stacks = this.representations.stacks;
            break;
          case "capsclose":
            this.capsClose = this.representations.capsclose;
            break;
          case "thetastart":
            this.thetaStart = this.representations.thetastart;
            break;
          case "thetalength":
            this.thetaLength = this.representations.thetalength;
            break;
          case "distance":
            this.distance = this.representations.distance;
            break;
          default:
            break;
        }
      }
    }

    this.geometry = new THREE.CylinderGeometry(
      this.top,
      this.base,
      this.height,
      this.slices,
      this.stacks,
      !this.capsClose,
      this.thetaStart,
      this.thetaLength
    );
      
    this.cylinder = new THREE.Mesh(this.geometry, this.material);

    this.mesh = this.cylinder;
    this.mesh.castShadow = true;
    
  }
}

export { MyCylinder };
