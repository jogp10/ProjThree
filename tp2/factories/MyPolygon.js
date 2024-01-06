import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyPolygon extends MyObject {
  constructor(polygonData, material) {
    super(polygonData.id + "_polygon");

    const geometry = new THREE.BufferGeometry();

    let stacks = null;
    let slices = null;
    let radius = null;
    let color_c = null;
    let color_p = null;
    let opacity_c = null;
    let opacity_p = null;

    if (polygonData.representations.length > 0) {
      this.representations = polygonData.representations[0];

      for (let attribute in this.representations) {
        switch (attribute) {
          case "slices":
            slices = this.representations.slices;
            break;
          case "radius":
            radius = this.representations.radius;
            break;
          case "stacks":
            stacks = this.representations.stacks;
            break;
          case "color_c":
            color_c = new THREE.Color(this.representations.color_c.r, this.representations.color_c.g, this.representations.color_c.b);
            opacity_c = this.representations.color_c.a;
            break;
          case "color_p":
            color_p = new THREE.Color(this.representations.color_p.r, this.representations.color_p.g, this.representations.color_p.b);
            opacity_p = this.representations.color_p.a;
            break;
          default:
            break;
        }
      }
    }

    const vertices = [];
    const colors = [];
  
    for (let stack = 0; stack <= stacks; stack++) {
      for (let slice = 0; slice <= slices; slice++) {
        const t = stack / stacks;

        const theta = (slice / slices) * Math.PI * 2;
        const x = t * radius * Math.cos(theta);
        const y = t * radius * Math.sin(theta);
  
        const color = new THREE.Color().lerpColors(color_c, color_p, t);
        const opacity = THREE.MathUtils.lerp(opacity_c, opacity_p, t);

        vertices.push(x, y, 0);
        colors.push(color.r, color.g, color.b, opacity);
      }
    }
  
    const indices = [];
    for (let stack = 0; stack < stacks; stack++) {
      for (let slice = 0; slice < slices; slice++) {
        const v1 = stack * (slices + 1) + slice;
        const v2 = v1 + 1;
        const v3 = (stack + 1) * (slices + 1) + slice;
        const v4 = v3 + 1;
  
        indices.push(v2, v1, v3);
        indices.push(v2, v3, v4);
      }
    }
  
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
    geometry.setIndex(indices);

    this.material = new THREE.MeshBasicMaterial({ vertexColors: !material.wireframe, wireframe: material.wireframe, name: material.name + "_polygon" });

    this.mesh = new THREE.Mesh(geometry, this.material);

    this.group.add(this.mesh);
  }
}

export { MyPolygon };
