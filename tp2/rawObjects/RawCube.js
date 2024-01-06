import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class RawCube extends MyObject {
    constructor(id, width, height, depth, material) {
        super(id);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;

        this.createCube();
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const cube = new THREE.Mesh(geometry, this.material);
        this.group.add(cube);
    }
}

export { RawCube };