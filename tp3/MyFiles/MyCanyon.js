import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyCanyon extends MyObject {
  constructor(height, radius, rugosity, uSampler1, uSampler2, file1, file2) {
    super("MyCanyon");
    this.height = height;
    this.radius = radius;
    this.rugosity = rugosity;
    this.texture = uSampler1;
    this.LGray = uSampler2;
    this.vertShader = file1;
    this.fragShader = file2;
    this.build();
  }

  build() {
    var vertexShaderLoader = new THREE.FileLoader();
    vertexShaderLoader.load(this.vertShader, (vertexShader) => {
      var fragmentShaderLoader = new THREE.FileLoader();
      fragmentShaderLoader.load(this.fragShader, (fragmentShader) => {
        if (vertexShader !== undefined && fragmentShader !== undefined) {
          const texture1 = new THREE.TextureLoader().load(this.texture);
          const texture2 = new THREE.TextureLoader().load(this.LGray);

          const uniformValues = {
            uSampler1: { type: "sampler2D", value: texture1 },
            uSampler2: { type: "sampler2D", value: texture2 },
            rugosity: { type: "f", value: this.rugosity },
            normalizationFactor: { type: "f", value: 1 },
          };

          const material = new THREE.ShaderMaterial({
            uniforms: uniformValues !== null ? uniformValues : {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
          });

          // Canyon (cylinder with rugosity)
          const cylinder = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.height,
            50,
            10
          );

          const canyon = new THREE.Mesh(cylinder, material);
          canyon.position.y = this.height / 2;

          this.group.add(canyon);
        }
      });
    });
  }
}

export { MyCanyon };
