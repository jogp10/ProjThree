import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class Flower extends MyObject {
  constructor(app) {
    super('flower');

    // Define colors and materials
    const petalColor = 0xff5733; // Orange color for the petals
    const stemColor = 0x228B22; // Green color for the stem

    const petalMaterial = new THREE.MeshPhongMaterial({
      color: petalColor,
      side: THREE.DoubleSide,
      emissive: 0x111111,
    });

    const stemMaterial = new THREE.MeshPhongMaterial({
      color: stemColor,
      side: THREE.DoubleSide,
      emissive: 0x111111,
    });

    // Create the flower petals using polygons (triangles)
    this.petals = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const petalGeometry = new THREE.CircleGeometry(0.07, 15, 0, Math.PI * 2);
      const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
      petalMesh.rotation.x = Math.PI / 2;

      // Calculate the rotation angle for each petal
      const angle = (i * Math.PI * 2) / 6;
      petalMesh.rotation.z = angle - Math.PI / 2;

      petalMesh.rotateX(-Math.PI);

      // Calculate the position of the petal
      const radius = 0.1;
      petalMesh.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
      
      this.petals.add(petalMesh);
    }
    this.group.add(this.petals);

    // Create the stem as a curved line
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.1, -0.2),
      new THREE.Vector3(0, -0.3, -0.4),
    ]);

    const stemGeometry = new THREE.TubeGeometry(stemCurve, 64, 0.01, 8, false);
    this.stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    this.group.add(this.stemMesh);

    // Create the circular base for the flower
    const baseGeometry = new THREE.CircleGeometry(0.07, 50, 0, Math.PI * 2);
    const baseMesh = new THREE.Mesh(baseGeometry, stemMaterial);
    baseMesh.position.set(0, 0.01, 0);
    baseMesh.rotateX(-Math.PI / 2);
    this.group.add(baseMesh);

    // shadows
    super.enableCastShadows(this.group);
  }
}

export { Flower };
