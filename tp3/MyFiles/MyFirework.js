import * as THREE from "three";

class MyFirework {
  constructor(app, pos = new THREE.Vector3(0, 0, 0)) {
    this.app = app;
    this.pos = pos;

    this.done = false;
    this.dest = [];

    this.vertices = null;
    this.colors = null;
    this.geometry = null;
    this.points = null;

    this.material = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      opacity: 1,
      vertexColors: true,
      transparent: true,
      depthTest: false,
    });

    this.height = 2;
    this.speed = 5;

    this.launch();
  }

  /**
   * compute particle launch
   */

  launch() {
    let color = new THREE.Color();
    color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);
    let colors = [color.r, color.g, color.b];

    let x = THREE.MathUtils.randFloat(-2, 2) + this.pos.x;
    let y =
      THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.1) +
      this.pos.y;
    let z = THREE.MathUtils.randFloat(-2, 2) + this.pos.z;
    this.dest.push(x, y, z);
    let vertices = [this.pos.x, this.pos.y, this.pos.z];

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.castShadow = true;
    this.points.receiveShadow = true;
    this.app.scene.add(this.points);
    // console.log("firework launched");
  }

  /**
   * compute explosion
   * @param {*} vector
   */
  explode(origin, n, rangeBegin, rangeEnd) {
    // console.log("firework exploded");

    this.app.scene.remove(this.points);
    this.points.geometry.dispose();

    let vertices = [];
    this.dest = [];
    let colors = [];

    let color = new THREE.Color();
    color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.7);

    for (let i = 0; i < n; i++) {
      // Position
      let x = origin[0];
      let y = origin[1];
      let z = origin[2];
      vertices.push(x, y, z);

      let theta = 2 * Math.PI * Math.random();
      let phi = Math.acos(2 * Math.random() - 1);
      let radius = Math.cbrt(Math.random()) * rangeEnd; // cube root to distribute points evenly

      let dest_x = radius * Math.sin(phi) * Math.cos(theta) + origin[0];
      let dest_y = radius * Math.sin(phi) * Math.sin(theta) + origin[1];
      let dest_z = radius * Math.cos(phi) + origin[2];

      this.dest.push(dest_x, dest_y, dest_z);

      // Color

      colors.push(color.r, color.g, color.b);
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    this.points = new THREE.Points(this.geometry, this.material);
    this.app.scene.add(this.points);
  }

  /**
   * cleanup
   */
  reset() {
    // console.log("firework reseted");
    this.app.scene.remove(this.points);
    this.dest = [];
    this.vertices = null;
    this.colors = null;
    this.geometry = null;
    this.points = null;
  }

  /**
   * update firework
   * @returns
   */
  update() {
    // do only if objects exist
    if (this.points && this.geometry) {
      let verticesAtribute = this.geometry.getAttribute("position");
      let vertices = verticesAtribute.array;
      let count = verticesAtribute.count;

      // lerp particle positions
      let j = 0;
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] += (this.dest[i] - vertices[i]) / this.speed;
        vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed;
        vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed;
      }
      verticesAtribute.needsUpdate = true;

      // only one particle?
      if (count === 1) {
        //is YY coordinate higher close to destination YY?
        if (
          Math.abs(Math.ceil(vertices[1]) - this.dest[1]) <
          this.height * 0.1
        ) {
          // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
          this.explode(vertices, 80, -this.height * 0.2, this.height * 0.5);
          return;
        }
      }

      // are there a lot of particles (aka already exploded)?
      if (count > 1) {
        // fade out exploded particles
        this.material.opacity -= 0.015;
        this.material.needsUpdate = true;
      }

      // remove, reset and stop animating
      if (this.material.opacity <= 0) {
        this.reset();
        this.done = true;
        return;
      }
    }
  }
}

export { MyFirework };
