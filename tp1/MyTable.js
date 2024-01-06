import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class Table extends MyObject {
  constructor(app, texture) {
    super("table");
    this.texture = texture;

    // Tabletop
    const tabletopWidth = 4;
    const tabletopHeight = 0.2;
    const tabletopDepth = 2;

    const tabletopGeometry = new THREE.BoxGeometry(
      tabletopWidth,
      tabletopHeight,
      tabletopDepth
    );
    // Texture
    const tableTexture = new THREE.TextureLoader().load(this.texture);
    tableTexture.rotation = Math.PI / 2;
    const tabletopMaterial = new THREE.MeshPhongMaterial({
      color: 0x654321,
      map: tableTexture
    });

    this.tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);

    // Legs
    const legRadius = 0.1;
    const legHeight = 1.5;

    const legGeometry = new THREE.CylinderGeometry(
      legRadius,
      legRadius,
      legHeight,
      32
    );
    const legMaterial = new THREE.MeshPhongMaterial({
      color: 0x370101,
      specular: 0xbf8948,
    }); // SaddleBrown color

    // Create four legs
    this.legs = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      this.legs.add(new THREE.Mesh(legGeometry, legMaterial));
    }

    // Position tabletop and legs
    this.tabletop.position.set(0, legHeight + tabletopHeight / 2, 0);

    this.legs.children[0].position.set(
      -tabletopWidth / 2 + legRadius,
      legHeight / 2,
      -tabletopDepth / 2 + legRadius
    );
    this.legs.children[1].position.set(
      tabletopWidth / 2 - legRadius,
      legHeight / 2,
      -tabletopDepth / 2 + legRadius
    );
    this.legs.children[2].position.set(
      -tabletopWidth / 2 + legRadius,
      legHeight / 2,
      tabletopDepth / 2 - legRadius
    );
    this.legs.children[3].position.set(
      tabletopWidth / 2 - legRadius,
      legHeight / 2,
      tabletopDepth / 2 - legRadius
    );

    this.group.add(this.tabletop);
    this.group.add(this.legs);

    // shadows
    super.enableShadows(this.group);
  }
}

export { Table };
