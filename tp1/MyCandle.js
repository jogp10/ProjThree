import * as THREE from "three";
import { Flame } from "./MyFlame.js";
import { MyObject } from "./MyObject.js";

class Candle extends MyObject {
  constructor(app, lightnedCandle, mapSize) {
    super("candle");

    const candleRadiusTop = 0.1;
    const candleRadiusBottom = 0.1;
    const candleHeight = 0.3;
    const candleColor = "#f3e3c2"; // Yellow color
    const emissive = (lightnedCandle !== null && lightnedCandle === true) ? 0x444444 : 0x000000;

    const candleGeometry = new THREE.CylinderGeometry(
      candleRadiusTop,
      candleRadiusBottom,
      candleHeight,
      32
    );

    this.mesh = new THREE.Mesh(
      candleGeometry,
      new THREE.MeshPhongMaterial({
        color: candleColor,
        specular: 0xffffff,
        shininess: 30,
        emissive: emissive
      })
    );
    this.mesh.position.set(0, candleHeight / 2, 0);
    this.group.add(this.mesh);

    // Create and position the flame on top of the candle
    if (lightnedCandle !== null && lightnedCandle === true) {
      this.flame = new Flame(app, mapSize);
      super.addGroupOnTop(this.flame.group, this.mesh);
      this.group.add(this.flame.group);
    }

    // shadows
    super.enableCastShadows(this.group, false);
  }
}

export { Candle };
