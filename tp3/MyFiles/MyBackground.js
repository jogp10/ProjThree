import * as THREE from "three";
import { MyObject } from "../MyObject.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MyCanyon } from "./MyCanyon.js";

class MyBackground extends MyObject {
  constructor(uSampler1, uSampler2, file1, file2) {
    super("background");
    this.texture = uSampler1;
    this.LGray = uSampler2;
    this.vertShader = file1;
    this.fragShader = file2;

    this.cactusModel = new THREE.Object3D();

    new OBJLoader().load("textures/cactus.obj", (object) => {
      this.cactusModel = object;

      this.cactusModel.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          var material = new THREE.MeshPhongMaterial({ color: 0x44ff44 }); // Set color (in this case, green)
          child.material = material;
        }
      });

      this.build();
    });
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
            normalizationFactor: { type: "f", value: 1 },
          };

          const material = new THREE.ShaderMaterial({
            uniforms: uniformValues !== null ? uniformValues : {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
          });

          const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, 50, 50),
            material
          );
          plane.position.y = -6.3;
          plane.scale.set(30, 30, 30);
          plane.rotation.x = -Math.PI / 2;

          this.buildCanyons();
          this.buildCactus();

          this.group.add(plane);
        }
      });
    });
  }

  buildCanyons() {
    this.canyons = new THREE.Group();

    const canyon = new MyCanyon(
      19,
      10,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon.group.position.x = 90;
    canyon.group.position.z = -85;
    this.canyons.add(canyon.group);

    const canyon2 = new MyCanyon(
      22,
      5,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon2.group.position.x = 80;
    canyon2.group.position.z = 20;
    this.canyons.add(canyon2.group);

    const canyon3 = new MyCanyon(
      32,
      10,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon3.group.position.x = -25;
    canyon3.group.position.z = -25;
    this.canyons.add(canyon3.group);

    const canyon4 = new MyCanyon(
      34,
      15,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon4.group.position.x = -60;
    canyon4.group.position.z = 30;
    this.canyons.add(canyon4.group);

    const canyon5 = new MyCanyon(
      42,
      20,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon5.group.position.x = 45;
    canyon5.group.position.z = 75;
    this.canyons.add(canyon5.group);

    const canyon6 = new MyCanyon(
      52,
      25,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon6.group.position.x = 45;
    canyon6.group.position.z = -35;
    this.canyons.add(canyon6.group);

    const canyon7 = new MyCanyon(
      57,
      25,
      5,
      "textures/coral_ground_02_diff.jpg",
      "textures/coral_ground_02_disp.png",
      "shaders/canyon.vert",
      "shaders/canyon.frag"
    );
    canyon7.group.position.x = -95;
    canyon7.group.position.z = -105;
    this.canyons.add(canyon7.group);

    this.canyons.position.y = -5;
    this.group.add(this.canyons);
  }

  buildCactus() {
    this.cactus = new THREE.Group();

    var cactusPositions = [
      { x: 40, z: -100 },
      { x: 0, z: 35 },
      { x: -50, z: 70 },
      { x: -30, z: -80 },
    ];

    var cactusRotations = [
      { x: 0, y: -Math.PI / 5, z: 0 },
      { x: 0, y: Math.PI / 2, z: 0 },
      { x: 0, y: (3 * Math.PI) / 4, z: 0 },
      { x: 0, y: Math.PI / 3, z: 0 },
    ];

    var cactusScales = [
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 0.3, y: 0.3, z: 0.3 },
      { x: 0.5, y: 0.5, z: 0.5 },
    ];

    cactusPositions.forEach((position, index) => {
      var cactus = this.cactusModel.clone();

      var randomGreenColor = Math.random() * (255 - 150) + 150;
      randomGreenColor = 0x000000 | (Math.floor(randomGreenColor) << 8);

      cactus.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.color.setHex(randomGreenColor);
        }
      });

      cactus.position.x = position.x;
      cactus.position.y = -3;
      cactus.position.z = position.z;

      // Apply rotation and scale from arrays
      if (cactusRotations[index]) {
        cactus.rotation.x = cactusRotations[index].x;
        cactus.rotation.y = cactusRotations[index].y;
        cactus.rotation.z = cactusRotations[index].z;
      }

      if (cactusScales[index]) {
        cactus.scale.x = cactusScales[index].x;
        cactus.scale.y = cactusScales[index].y;
        cactus.scale.z = cactusScales[index].z;
      }

      this.cactus.add(cactus);
    });

    this.group.add(this.cactus);
  }
}

export { MyBackground };
