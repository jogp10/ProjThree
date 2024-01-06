import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Window extends MyObject {
  constructor(app, texture, mapSize, roomSize) {
    super("window");

    this.texture = texture;

    // Create a half-sphere geometry for outside representation
    const radius = 4; 
    const widthSegments = 20; 
    const heightSegments = 20;
    const phiStart = 0; 
    const phiLength = Math.PI; 
    const thetaStart = 0;
    const thetaLength = Math.PI;

    const halfSphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      thetaStart,
      thetaLength,
      phiStart,
      phiLength
    );

    this.windowTexture = new THREE.TextureLoader().load(this.texture);
    this.windowTexture.wrapS = THREE.RepeatWrapping;
    this.windowTexture.wrapT = THREE.RepeatWrapping;
    this.windowMaterial = new THREE.MeshPhongMaterial({
      map: this.windowTexture,
      side: THREE.BackSide
    });

    this.halfSphere = new THREE.Mesh(halfSphereGeometry, this.windowMaterial);

    this.group.add(this.halfSphere);

    // Window dimensions
    const [windowWidth, windowHeight, windowDepth] = [5, 3, 0.1];
    const mountWidth = 0.1; // Width of each mount
    const mountDepth = 0.2; // Depth of each mount

    // Create mounts (window structure)
    const mountMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513, // Brown color
      side: THREE.FrontSide,
    });

    this.mounts = [];
    this.mount = new THREE.Group();
    const horizontalMountGeometry = new THREE.BoxGeometry(
      mountWidth,
      windowWidth,
      mountDepth
    );

    const verticalMountGeometry = new THREE.BoxGeometry(
      mountWidth,
      windowHeight,
      mountDepth
    );

    // Create and position mounts on each side of the window (around the window, frame)
    for (let i = 0; i < 4; i++) {
      let mountGeometry =
        i < 2
          ? horizontalMountGeometry
          : verticalMountGeometry;
      this.mounts[i] = new THREE.Mesh(mountGeometry, mountMaterial);
      switch (i) {
        case 0: // Top
          this.mounts[i].position.set(
            0,
            windowHeight / 2,
            windowDepth / 2 - mountDepth / 2
          );
          this.mounts[i].rotation.set(0, 0, Math.PI / 2);
          break;
        case 1: // Bottom
          this.mounts[i].position.set(
            0,
            -windowHeight / 2,
            windowDepth / 2 - mountDepth / 2
          );
          this.mounts[i].rotation.set(0, 0, Math.PI / 2);
          break;
        case 2: // Left
          this.mounts[i].position.set(
            -windowWidth / 2 + mountWidth / 2,
            0,
            windowDepth / 2 - mountDepth / 2
          );
          break;
        case 3: // Right
          this.mounts[i].position.set(
            windowWidth / 2 - mountWidth / 2,
            0,
            windowDepth / 2 - mountDepth / 2
          );
          break;
      }
    }

    // Create and position the middle horizontal and vertical mounts (a cross)
    const middleMountWidth = 0.1; // Width of middle mounts
    const middleMountDepth = 0.2; // Depth of middle mounts

    const middleMountHorizontalGeometry = new THREE.BoxGeometry(
      windowWidth - mountDepth,
      middleMountWidth,
      middleMountDepth
    );

    const middleMountVerticalGeometry = new THREE.BoxGeometry(
      middleMountWidth,
      windowHeight - mountWidth,
      middleMountDepth
    );

    const middleMountMaterial = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xbbbbbb,
      shininess: 50,
      reflectivity: 0.5,
    });

    this.middleMountHorizontal = new THREE.Mesh(
      middleMountHorizontalGeometry,
      middleMountMaterial
    );
    this.middleMountHorizontal.position.set(
      0,
      0,
      windowDepth / 2 - mountDepth / 2
    );

    this.middleMountVertical = new THREE.Mesh(
      middleMountVerticalGeometry,
      middleMountMaterial
    );
    this.middleMountVertical.position.set(
      0,
      0,
      windowDepth / 2 - mountDepth / 2
    );

    for (let i = 0; i < this.mounts.length; i++) {
      this.mount.add(this.mounts[i]);
    }
    this.mount.add(this.middleMountHorizontal);
    this.mount.add(this.middleMountVertical);
    this.group.add(this.mount);

    // Create glass window
    const PlaneGeometry = new THREE.BoxGeometry(windowWidth, windowHeight,0.1);

    const material = new THREE.MeshStandardMaterial({
      transparent: true, 
      opacity: 0.3,
      roughness: 0.2,
    });

    this.window = new THREE.Mesh(PlaneGeometry, material);
    this.window.rotateX(Math.PI);
    
    this.group.add(this.window);

    // Create spotlight to illuminate the paisage
    this.paisagelight = new THREE.PointLight(0xffffff, 10, 5.5, 0);
    this.paisagelight.position.set(0, 0, 3);
    this.group.add(this.paisagelight);

    // Create sunlight to illuminate the room
    this.sunLight = new THREE.PointLight(0xffffff, 100 / roomSize, 0, 1);
    this.sunLight.position.set(0, 1, 10);
    this.sunLight.target = this.mount;
    this.group.add(this.sunLight);

    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = mapSize;
    this.sunLight.shadow.mapSize.height = mapSize;
    this.sunLight.shadow.camera.near = 9;
    this.sunLight.shadow.camera.far = roomSize + 15;

    // Create reflection to sunlight
    this.reflectionLight = new THREE.DirectionalLight(0xffffff, (1 / roomSize));
    this.reflectionLight.position.set(0, 0, -roomSize);
    this.reflectionLight.target = this.mount;
    this.group.add(this.reflectionLight);

    // shadows
    super.enableCastShadows(this.mount);
  }
}

export { Window };
