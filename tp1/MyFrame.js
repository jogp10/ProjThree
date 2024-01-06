import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Frame extends MyObject {
  constructor(app, texture, width, height) {
    super("frame");
    this.texture = texture;
    
    // Frame dimensions
    const frameWidth = width !== undefined && width !== null ? width : 2;
    const frameHeight = height !== undefined && height !== null ? height : 3;
    const mountWidth = 0.2; 
    const mountDepth = 0.1;

    const frameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
    const frameTexture = new THREE.TextureLoader().load(this.texture);
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;

    const diffuseframeColor = "rgb(255,255,255)";
    const specularframeColor = "rgb(0,0,0)";
    const frameShininess = 0;

    this.frameMaterial = new THREE.MeshPhongMaterial({
      color: diffuseframeColor,
      specular: specularframeColor,
      shininess: frameShininess,
      map: frameTexture,
    });

    this.frame = new THREE.Mesh(frameGeometry, this.frameMaterial);

    this.frame.position.set(0, 0, mountDepth - 0.04);

    // Create four mounts
    this.mounts = new THREE.Group();
    const mountGeometry = new THREE.BoxGeometry(
      mountWidth,
      frameHeight,
      mountDepth
    );
    const mountGeometry2 = new THREE.BoxGeometry(
      mountWidth,
      frameWidth,
      mountDepth
    );
    const mountMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });

    // Create and position mounts on each side of the frame
    for (let i = 0; i < 4; i++) {
      let mount = null;
      (i == 0 || i == 1) ?
        mount = new THREE.Mesh(mountGeometry2, mountMaterial) :
        mount = new THREE.Mesh(mountGeometry, mountMaterial);

      // Position the mounts based on which side they are on
      switch (i) {
        case 0: // Top
          mount.position.set(
            0,
            frameHeight / 2 - mountWidth / 2,
            mountDepth / 2
          );
          mount.rotation.set(0, 0, Math.PI / 2);
          break;
        case 1: // Bottom
          mount.position.set(
            0,
            -frameHeight / 2 + mountWidth / 2,
            mountDepth / 2
          );
          mount.rotation.set(0, 0, Math.PI / 2);
          break;
        case 2: // Left
          mount.position.set(
            -frameWidth / 2 + mountWidth / 2,
            0,
            mountDepth / 2
          );
          break;
        case 3: // Right
          mount.position.set(
            frameWidth / 2 - mountWidth / 2,
            0,
            mountDepth / 2
          );
          break;
      }
      this.mounts.add(mount);
    }

    this.group.add(this.mounts);
    this.group.add(this.frame);
  }
}

export { Frame };
