import * as THREE from "three";
import { MyObject } from "../MyObject.js";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";
class MyNurbs extends MyObject {
  constructor(nurbsData, material) {
    super(nurbsData.id + "_nurbs");
    this.material = material;

    this.representations = nurbsData.representations[0];

    for (let attribute in this.representations) {
      switch (attribute) {
        case "degree_u":
          this.degreeU = this.representations.degree_u;
          break;
        case "degree_v":
          this.degreeV = this.representations.degree_v;
          break;

        case "parts_u":
          this.partsU = this.representations.parts_u;
          break;
        case "parts_v":
          this.partsV = this.representations.parts_v;
          break;
        case "distance":
          this.distance = this.representations.distance;
          break;
        case "controlpoints":
          this.controlpoints = this.representations.controlpoints;
          break;
      }
    }
    let controlpoints = [];

    controlpoints = this.formatControlPoints(
      this.controlpoints,
      this.degreeU,
      this.degreeV
    );

    let surfaceData = MyNurbsBuilder.build(
      controlpoints,
      this.degreeU,
      this.degreeV,
      this.partsU,
      this.partsV
    );

    this.mesh = new THREE.Mesh(surfaceData, this.material);

    this.group.add(this.mesh);
  }

  formatControlPoints(controlPoints, degreeU, degreeV) {
    const numUPoints = controlPoints.length / (degreeU + 1);

    const formattedPoints = [];

    for (let u = 0; u < controlPoints.length / numUPoints; u++) {
      const uPoints = [];

      for (let v = 0; v <= degreeV; v++) {
       
        const index = u * (degreeV+1) + v;
     
        uPoints.push([
          controlPoints[index].xx,
          controlPoints[index].yy,
          controlPoints[index].zz,
          1,
        ]);
      }

      formattedPoints.push(uPoints);
    }

    return formattedPoints;
  }
}

export { MyNurbs };
