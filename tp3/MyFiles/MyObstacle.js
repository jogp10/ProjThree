import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyObstacle extends THREE.Object3D {
  constructor(app, type) {
    super();
    this.app = app;
    this.type = type;
    this.name = "obstacle";
    this.models = {
      stop: "./textures/stop.glb",
      slow: "./textures/slow.glb",
      change: "./textures/change.glb",
    };

    this.model = this.models[this.type];

    const loader = new GLTFLoader();
    loader.load(this.models[type], (gltf) => {
      const model = gltf.scene;
      this.add(model);
      cloneMaterialsRecursive(model);
    });
    this.position.set(0, 1, 0);
    this.scale.set(0.6, 0.6, 0.6);
    this.rotateY(Math.PI / 2);
    this.name = "powerup";
  }

  clone() {
    const newObstacle = new MyObstacle(this.app, this.type);

    newObstacle.copy(this);

    return newObstacle;
  }
  restoreOriginalColors() {
    this.traverse((child) => {
      if (child instanceof THREE.Mesh && child.originalMaterial) {
        child.material = child.originalMaterial; // Restore the original material
      }
    });
  }
}

function cloneMaterialsRecursive(object) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.originalMaterial = child.material.clone();
    }
  });

  // Recursively check children's children
  object.children.forEach((child) => {
    cloneMaterialsRecursive(child);
  });
}

export { MyObstacle };
