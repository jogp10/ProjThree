import * as THREE from 'three';
import { MyObject } from './MyObject.js';
import { Reflector } from 'three/addons/objects/Reflector.js';


class Mirror extends MyObject {
  constructor(app, wallSize) {
    super('mirror');

    // Define colors and materials
    const mirrorColor = 0xadd8e6; // Light blue for the mirror surface
    const mirrorWidth = 3;  
    const mirrorHeight = 6;
    const mirrorDepth = 0.1;

    const texture = new THREE.TextureLoader().load( 'textures/black.jpg' );

    const frameMaterial = new THREE.MeshPhongMaterial({
      map: texture,
    });

    // Create the mirror surface as a rectangle
    const mirrorGeometry = new THREE.BoxGeometry(mirrorWidth, mirrorHeight, mirrorDepth);
    const mirrorMesh = new Reflector(mirrorGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x777777,
        });
   
    this.group.add(mirrorMesh);

    // Create the wooden frame for the mirror
    this.frames = new THREE.Group();
    const mountWidth = 0.1;
    const frameGeometry = new THREE.BoxGeometry(mirrorWidth + mountWidth*2, 0.2, mirrorDepth + 0.1);
    const frameGeometry2 = new THREE.BoxGeometry(mirrorHeight + mountWidth*2, 0.2, mirrorDepth + 0.1);

    for (let i = 0; i < 4; i++) {
      i < 2 ?
        this.frames.add(new THREE.Mesh(frameGeometry, frameMaterial)):
        this.frames.add(new THREE.Mesh(frameGeometry2, frameMaterial));
      
    }

    this.frames.children[0].position.set(0, mirrorHeight/2, 0)
    this.frames.children[1].position.set(0, -mirrorHeight/2, 0)
    this.frames.children[2].rotation.z = Math.PI/2;
    this.frames.children[2].position.set(-mirrorWidth/2, 0, 0)
    this.frames.children[3].rotation.z = Math.PI/2;
    this.frames.children[3].position.set(mirrorWidth/2, 0, 0)

    this.group.add(this.frames);


    // Create the back of the mirror
    const box = new THREE.Mesh(new THREE.PlaneGeometry(mirrorWidth, mirrorHeight), new THREE.MeshBasicMaterial( { color: 0x000000} ) );
    box.rotation.y = Math.PI;
    box.position.set(0, 0, -0.1);

    box.castShadow = true;

    this.group.add(box);


    this.group.rotateY(Math.PI/4);
    this.group.rotateX(-Math.PI/15);  

    // Shadows
  }
}

export { Mirror };
