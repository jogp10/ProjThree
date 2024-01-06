import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyPlane extends MyObject {
  constructor(planeData, material) {
    super(planeData.subtype + "_plane");

    this.material = material;

    this.representations = planeData.representations[0];

    let translate_x,
      translate_y,
      translate_z = 0;

    for (let attribute in this.representations) {
      if (planeData.subtype === "rectangle") {
        switch (attribute) {
          case "parts_x":
            this.partsX = this.representations.parts_x;
            break;
          case "parts_y":
            this.partsY = this.representations.parts_y;
            break;
          case "distance":
            this.distance = this.representations.distance;
            break;
          case "xy1":
            this.xy1 = this.representations.xy1;
            break;
          case "xy2":
            this.xy2 = this.representations.xy2;
            break;
          case "type":
            this.type = this.representations.type;
            break;
          default:
            break;
        }
      } else if (planeData.subtype === "triangle") {
        switch (attribute) {
          case "xyz1":
            this.xyz1 = this.representations.xyz1;
            break;
          case "xyz2":
            this.xyz2 = this.representations.xyz2;
            break;
          case "xyz3":
            this.xyz3 = this.representations.xyz3;
            break;
          case "distance":
            this.distance = this.representations.distance;
            break;
          default:
            break;
        }
      }
    }

    if (this.xy1 && this.xy2 && planeData.subtype === "rectangle") {
      this.width = Math.abs(this.xy2[0] - this.xy1[0]);
      this.height = Math.abs(this.xy2[1] - this.xy1[1]);

      translate_x = this.xy1[0] + this.width / 2;
      translate_y = this.xy1[1] + this.height / 2;
      translate_z = 0;

      // Create a plane geometry
      this.geometry = new THREE.PlaneGeometry(
        this.width,
        this.height,
        this.partsX,
        this.partsY
      );

      if (this.material.map !== undefined && this.material.map !== null) {
        this.material.map.repeat.set(
          material.map.repeat.x / this.width,
          material.map.repeat.y / this.height
        );
      }

      this.mesh = new THREE.Mesh(this.geometry, this.material);

      this.mesh.translateX(translate_x);
      this.mesh.translateY(translate_y);
      this.mesh.translateZ(translate_z);
    } else if (
      this.xyz1 &&
      this.xyz2 &&
      this.xyz3 &&
      planeData.subtype === "triangle"
    ) {
      translate_x = (this.xyz1[0] + this.xyz2[0] + this.xyz3[0]) / 3;
      translate_y = (this.xyz1[1] + this.xyz2[1] + this.xyz3[1]) / 3;
      translate_z = (this.xyz1[2] + this.xyz2[2] + this.xyz3[2]) / 3;

      this.geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        this.xyz1[0],
        this.xyz1[1],
        this.xyz1[2],
        this.xyz2[0],
        this.xyz2[1],
        this.xyz2[2],
        this.xyz3[0],
        this.xyz3[1],
        this.xyz3[2],
      ]);

      // itemSize = 3 because there are 3 values (components) per vertex
      this.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    this.group.add(this.mesh);
  }
}

export { MyPlane };
