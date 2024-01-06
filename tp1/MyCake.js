import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { Candle } from "./MyCandle.js";

class Cake extends MyObject {
  constructor(app, cutCake, withCandle, lightnedCandle, mapSize) {
    super("cake");

    const cakeRadius = 1;
    const cakeHeight = 0.3;
    const cakeAngle = (11 / 6) * Math.PI;
    const cakeColor = 0x8f6f649

    // build cake
    const cakeGeometry = new THREE.CylinderGeometry(
      cakeRadius,
      cakeRadius,
      cakeHeight,
      32,
      1,
      false,
      0,
      cutCake ? cakeAngle : 2 * Math.PI
    );
    const texture = new THREE.TextureLoader().load(
      "./textures/cake_topping.jpg"
    );
    const cakeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: "#000000"
    });
    
    this.mesh = new THREE.Mesh(
      cakeGeometry,
      cakeMaterial
    ); // Orange color
    this.mesh.position.set(0, cakeHeight / 2, 0);
    this.group.add(this.mesh);


    // build cake slice planes
    if (cutCake) {
      const polygon = new THREE.PlaneGeometry(cakeRadius, cakeHeight);

      let rectangle = new THREE.Mesh(polygon, cakeMaterial);
      rectangle.rotation.set(0, -Math.PI / 2, 0);
      rectangle.position.set(0, cakeHeight / 2, cakeRadius / 2);
      this.group.add(rectangle);

      let rectangle2 = new THREE.Mesh(polygon, cakeMaterial);
      rectangle2.rotation.set(Math.PI, Math.PI / 2 - cakeAngle, Math.PI);
      rectangle2.position.set(
        (-Math.sin((1 * Math.PI) / 6) * cakeRadius) / 2,
        cakeHeight / 2,
        (Math.cos((1 * Math.PI) / 6) * cakeRadius) / 2
      );
      this.group.add(rectangle2);

    }

    // Create and position the candle on top of the cake
    if (withCandle !== null && withCandle === true) {
      this.candle = new Candle(app, lightnedCandle, mapSize);
      super.addGroupOnTop(this.candle.group, this.mesh);
      this.group.add(this.candle.group);
    }

    // shadows
    super.enableCastShadows(this.group, false);
  }
}

export { Cake };
