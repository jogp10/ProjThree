import * as THREE from "three";

class MyObject extends THREE.Object3D {
  constructor(name) {
    super();
    this.group = new THREE.Group();
    this.name = name;
  }

  // Function to add an object on top of another object
  addGroupOnTop(groupToAdd, meshBase) {
    if (groupToAdd && meshBase) {
      // Calculate the position for the group on top
      const baseBoundingBox = new THREE.Box3().setFromObject(meshBase);
      const groupBoundingBox = new THREE.Box3().setFromObject(groupToAdd);
      const baseSize = new THREE.Vector3();
      baseBoundingBox.getSize(baseSize);
      const groupSize = new THREE.Vector3();
      groupBoundingBox.getSize(groupSize);
      const yOffset = baseSize.y;

      // Position the group on top
      groupToAdd.position.copy(meshBase.position);
      groupToAdd.position.y = yOffset;
    }
  }

  enableShadows(group, withRecursion = true) {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].castShadow = true;
      group.children[i].receiveShadow = true;
      if (group.children[i].children.length > 0 && withRecursion) {
        this.enableShadows(group.children[i]);
      }
    }
  }

  enableReceiveShadows(group, withRecursion = true) {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].receiveShadow = true;
      if (group.children[i].children.length > 0 && withRecursion) {
        this.enableReceiveShadows(group.children[i]);
      }
    }
  }

  enableCastShadows(group, withRecursion = true) {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].castShadow = true;
      if (group.children[i].children.length > 0 && withRecursion) {
        this.enableCastShadows(group.children[i]);
      }
    }
  }

  disableShadows(group, withRecursion = true) {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].castShadow = false;
      group.children[i].receiveShadow = false;
      if (group.children[i].children.length > 0 && withRecursion) {
        this.disableShadows(group.children[i]);
      }
    }
  }
}

export { MyObject };
