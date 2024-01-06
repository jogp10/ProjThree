import * as THREE from "three";
import { MyObject } from "../MyObject.js";
// import { MyStraigth } from "./MyTrack/MyStraight.js";
// import { MyCurve } from "./MyTrack/MyCurve.js";

class MyTrack extends MyObject {
  //Curve related attributes
  segments = 1000;
  width = 10;
  textureRepeat = 1;
  showWireframe = false;
  showMesh = true;
  showLine = true;
  closedCurve = true;
  path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-52.5, 0, -82.5),
    new THREE.Vector3(-55, 0, -110),
    new THREE.Vector3(-45, 0, -115),
    new THREE.Vector3(90, 0, -50),
    new THREE.Vector3(20, 0, 55),
    new THREE.Vector3(-40, 0, 90),
    new THREE.Vector3(-95, 0, 115), // Turn 16
    new THREE.Vector3(-120, 0, 85),
    new THREE.Vector3(-80, 0, 55),
    new THREE.Vector3(-100, 0, 10),
    new THREE.Vector3(-5, 0, -10),
    new THREE.Vector3(0, 0, -45),
    new THREE.Vector3(-50, 0, -55),
    new THREE.Vector3(-52.5, 0, -82.5),
  ]);
  startingPoint = new THREE.Vector3(-56.5, 0.5, -81);

  constructor() {
    super("MyTrack");
    this.build();
  }

  build() {
    this.buildCurve();
  }

  /**
   * Creates the necessary elements for the curve
   */
  buildCurve() {
    this.createCurveMaterialsTextures();
    this.createCurveObjects();
  }

  /**
   * Create materials for the curve elements: the mesh, the line and the wireframe
   */
  createCurveMaterialsTextures() {
    const texture = new THREE.TextureLoader().load("./textures/track.jpg");
    texture.wrapS = THREE.RepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({ map: texture });
    this.material.map.repeat.set(30, 3);
    this.material.map.wrapS = THREE.RepeatWrapping;
    this.material.map.wrapT = THREE.RepeatWrapping;

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  }

  /**
   * Creates the mesh, the line and the wireframe used to visualize the curve
   */
  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3,
      this.closedCurve
    );
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    this.line = new THREE.Line(bGeometry, this.lineMaterial);

    this.curve = new THREE.Group();

    this.mesh.visible = this.showMesh;
    this.wireframe.visible = this.showWireframe;
    this.line.visible = this.showLine;

    this.curve.add(this.mesh);
    this.curve.add(this.wireframe);
    this.curve.add(this.line);

    //this.curve.rotateZ(Math.PI);
    this.curve.scale.set(1, -0.2, 1);
    this.curve.position.set(0, -1.2, 0);

    this.group.add(this.curve);
    this.group.name = "track";
  }
}

export { MyTrack };
