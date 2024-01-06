import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class RawCylinder extends MyObject {
    constructor(id, base, top, height, slices, stacks, material) {
        super(id);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.material = material;

        this.createCylinder();
    }

    createCylinder() {
        const geometry = new THREE.CylinderGeometry(this.base, this.top, this.height, this.slices, this.stacks);
        const cylinder = new THREE.Mesh(geometry, this.material);
        this.group.add(cylinder);
    }
}

export { RawCylinder };