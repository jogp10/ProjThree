import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Carpet extends MyObject {
  constructor(app, texture) {
    super("carpet");
    this.texture = texture;

    const carpetHeight = 0.1;
    const carpetWidth = 4;
    const carpetLength = 6;

    const carpetGeometry = new THREE.BoxGeometry(carpetWidth, carpetLength, carpetHeight);
    const carpetTexture = new THREE.TextureLoader().load(texture);

    const carpetMaterial = new THREE.MeshPhongMaterial({
      map: carpetTexture,
      specular: "#111111",
      emissive: "#000000",
      shininess: 30,
    });

    this.carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    
    this.group.add(this.carpet);

    // shadows
    super.enableReceiveShadows(this.group);
  }
}

export { Carpet };
