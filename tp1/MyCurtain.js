import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class Curtain extends MyObject {
  constructor(app, texture, side) {
    super("curtain");

    const curtainTexture = new THREE.TextureLoader().load(texture);
    curtainTexture.rotation = Math.PI / 2;
    curtainTexture.wrapS = curtainTexture.wrapT = THREE.RepeatWrapping;
    curtainTexture.anisotropy = 16;
    curtainTexture.colorSpace = THREE.SRGBColorSpace;
    this.frequency = 0.15
    this.material = new THREE.MeshLambertMaterial({
        map: curtainTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });

    this.samplesU = 32;
    this.samplesV = 32;
    for(let i = 0; i < 4; i++){

        let curtainMesh = this.createNurbsSurfaces();
        curtainMesh.position.set(this.frequency*4*i, 0, 0);
        this.group.add(curtainMesh);
    }

    // Curtain Holder
    const holderGeometry = new THREE.BoxGeometry(this.frequency*4 * 7, 0.1, 0.2);

    const lateralHolderGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);

    const holderMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,

    });
    const holderMesh = new THREE.Mesh(holderGeometry, holderMaterial);

    const lateralHolderMesh = new THREE.Mesh(lateralHolderGeometry, holderMaterial);
    if(side == "left"){
        lateralHolderMesh.position.set(0.05, 4.05, 0.3);
    }

    else if(side == "right"){
        lateralHolderMesh.position.set(0.05, 4.05, -0.3);
    }
    
    holderMesh.position.set(this.frequency*4 * 3.5, 4.05, 0);
    this.group.add(holderMesh);
    this.group.add(lateralHolderMesh);

    // shadows
    super.enableCastShadows(this.group);
}

  createNurbsSurfaces() {
    // Declare local variables
    let controlPoints = [];
    let surfaceData;
    let mesh;

  
    let amplitude = .5;
    let p = [0,amplitude,0,-amplitude]
    
    for (let i = 0; i < 5; i++) {
        controlPoints.push([
          [i * this.frequency, 0, p[i % 4], 1],
          [i * this.frequency, 4, p[i % 4], 1]
        ]);
      }
      
    
    let orderU = controlPoints.length - 1;
    let orderV = 1;

    surfaceData = MyNurbsBuilder.build(
      controlPoints,
      orderU,
      orderV,
      this.samplesU,
      this.samplesV
    );

    mesh = new THREE.Mesh(surfaceData, this.material);

    return mesh;
  }
}

export { Curtain };
