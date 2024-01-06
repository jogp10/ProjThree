import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyPowerUp extends MyObject {
  constructor(type, pos, file1, file2) {
    super("power-up");
    this.type = type; // Type of power-up (e.g., "speed", "shield", "ammo", etc.)
    this.pos = pos; // Position of the power-up in the scene
    this.active = false; // Indicates if the power-up has been activated
    this.texture = null;
    this.vertShader = null;
    this.fragShader = null;
    this.uniformValues = null;
    this.material = null;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.textures = {
      speed: "textures/speed.jpg",
      place: "textures/place.jpg",
    };
    // Create the power-up object Box

    this.vertShader = file1;
    this.fragShader = file2;

    this.texture = new THREE.TextureLoader().load(this.textures[this.type]);

    this.uniformValues = {
      uSampler1: { type: "sampler2D", value: this.texture },
      time: { type: "f", value: 0 },
    };

    this.build();
  }

  build() {
    var vertexShaderLoader = new THREE.FileLoader();
    vertexShaderLoader.load(this.vertShader, (vertexShader) => {
      var fragmentShaderLoader = new THREE.FileLoader();
      fragmentShaderLoader.load(this.fragShader, (fragmentShader) => {
        if (vertexShader !== undefined && fragmentShader !== undefined) {
          this.material = new THREE.ShaderMaterial({
            uniforms: this.uniformValues !== null ? this.uniformValues : {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
          });

          let box = new THREE.BoxGeometry(1, 1, 1);
          this.boxMesh = new THREE.Mesh(box, this.material);

          this.boxMesh.rotation.x = -Math.PI / 2;
          this.position.copy(this.pos);

          this.group.add(this.boxMesh);
          this.group.position.copy(this.pos);
        }
      });
    });
  }

  update() {
    if (this.material != null) {
      const timeElapsed = this.clock.getElapsedTime();
      this.material.uniforms.time.value = timeElapsed;
    }
  }
}

export { MyPowerUp };
