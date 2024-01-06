import * as THREE from "three";
import { MyObject } from "../MyObject.js";
import { MyFinish } from "./MyFinish.js";

class MyCheckpoint extends MyObject {
  constructor(position, number, visible = false) {
    super();
    this.number = number; // Set the checkpoint number
    this.position.copy(position); // Set the checkpoint position
    let checkpointMesh = null;

    // Create a visual representation of the checkpoint
    if (number) {
      const plane = new THREE.PlaneGeometry(5, 3); // Adjust the size as needed
      const tex = new THREE.TextureLoader().load("./textures/checkpoint.png");
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      checkpointMesh = new THREE.Mesh(plane, mat);

      checkpointMesh.position.set(0, 1.4, 0); // Offset slightly above the ground
      this.scale.set(3, 3, 3);
      this.rotateY(Math.PI);
    } else {
      const finishLine = new MyFinish(new THREE.Vector3(0, 0, 0));
      finishLine.group.rotation.y = Math.PI / 2 + 0.48;
      checkpointMesh = finishLine.group;
    }
    this.add(checkpointMesh); // Add the visual mesh to the MyCheckpoint object
  }
}

export { MyCheckpoint };
