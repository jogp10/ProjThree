import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class CameraFactory extends MyObject {
  camera = null;
  target = null;
  position = null;

  constructor(cameraData) {
    super(cameraData.id + "_camera");

    this.position = cameraData.location;
    this.target = cameraData.target;

    switch (cameraData.type) {
      case "perspective":
        this.camera = new THREE.PerspectiveCamera(
          cameraData.angle,
          window.innerWidth / window.innerHeight,
          cameraData.near,
          cameraData.far
        );
        break;
      case "orthogonal":
        this.camera = new THREE.OrthographicCamera(
          cameraData.left,
          cameraData.right,
          cameraData.top,
          cameraData.bottom,
          cameraData.near,
          cameraData.far
        );
        break;
      default:
        return null;
    }
    this.camera.name = cameraData.id;
    this.camera.position.set(...cameraData.location);
    this.camera.lookAt(new THREE.Vector3(...cameraData.target));
  }
}

export { CameraFactory };
