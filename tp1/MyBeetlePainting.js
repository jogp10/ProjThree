import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class BeetlePainting extends MyObject {
  constructor(app) {
    super("beetle");

    // variables to hold the curves

    this.polyline = null;

    this.quadraticBezierCurve = null;

    this.cubicBezierCurve = null;

    this.numberOfSamples = 16;

    this.beetleGroup = null;

    this.carColor = 0x000000;
    this.carSpoilerColor = 0x440000;
    // hull material and geometry

    this.hullMaterial = new THREE.LineBasicMaterial({
      color: 0x111111,
    });    

    // Define the colors and materials
    const boardColor = 0x777777; // Gray color for the board
    const lineColor = 0x000000; // Black color for the lines

    const boardMaterial = new THREE.MeshPhongMaterial({
      color: boardColor,
      specular: 0xffffff,
      shininess: 30,
    });

    // Create and add the painting board
    const boardWidth = 4;
    const boardHeight = 3;
    const boardGeometry = new THREE.PlaneGeometry(
      boardWidth,
      boardHeight,
      1,
      1
    );
    this.board = new THREE.Mesh(boardGeometry, boardMaterial);
    this.group.add(this.board);

    // Create and add the beetle silhouette made with curves/arcs
    this.beetleGroup = new THREE.Group();

    // Position the beetle silhouette
    this.beetleGroup.position.set(-1, -1, 0);

    this.initPolyline(this.beetleGroup);
    this.initCubicBezierCurve(this.beetleGroup);

    this.group.add(this.beetleGroup);

    // shadows
    super.enableReceiveShadows(this.group);
  }
  initPolyline(beetleGroup) {
    // define vertex points
    let points = [
      new THREE.Vector3(-0.6, 0, 0),

      new THREE.Vector3(-0.6, 0.6, 0),

      new THREE.Vector3(-0.4, 0.6, 0),

      new THREE.Vector3(-0.3, 0.8, 0),

      new THREE.Vector3(-0.8, 0.8, 0),

      new THREE.Vector3(-0.9, 0.6, 0),

      new THREE.Vector3(-0.7, 0.6, 0),

      new THREE.Vector3(-0.7, -0.1, 0),
    ];

    let position = new THREE.Vector3(0.2, 1.2, 0);

    //this.drawHull(position, points);

    // define geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // create the line from material and geometry
    this.polyline = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: this.carSpoilerColor })
    );

    // set initial position
    this.polyline.position.set(position.x, position.y, position.z);

    // rotate the line
    this.polyline.rotation.set(0, 0, Math.PI / 8);

    // add the line to the scene
    beetleGroup.add(this.polyline);
  }
  initCubicBezierCurve(beetleGroup) {
    let points = [
      new THREE.Vector3(-0.6, -0.5, 0.0), // starting point

      new THREE.Vector3(-0.6, 0.3, 0.0), // control point 1

      new THREE.Vector3(0.4, 0.3, 0.0), // control point 2

      new THREE.Vector3(0.4, -0.5, 0.0), // ending point
    ];

    // Big curve
    let points2 = [
      new THREE.Vector3(-0.6, 0, 0), // starting point

      new THREE.Vector3(-0.6, 1, 0.0), // control point 1

      new THREE.Vector3(0, 1.5, 0.0), // control point 2

      new THREE.Vector3(1,  1.5, 0.0), // ending point
    ];

    let points3 = [
      new THREE.Vector3(1,  1.5, 0.0), // ending point

      new THREE.Vector3(1.7,  1.5, 0.0), // control point 1

      new THREE.Vector3(2, 1.1, 0.0), // control point 2

      new THREE.Vector3(2, .8, 0.0) // ending point
    ];

    let points4 = [
      new THREE.Vector3(2, .8, 0.0),

      new THREE.Vector3(2.6, .8, 0.0),

      new THREE.Vector3(2.6, .2, 0.0),

      new THREE.Vector3(2.6, 0, 0.0), // ending point
    ];

    let position = new THREE.Vector3(0, 0.5, 0);

    let position2 = new THREE.Vector3(2.2, 0.5, 0);

    let position3 = new THREE.Vector3(0, 0, 0);

    //this.drawHull(position, points);
    //this.drawHull(position3, points2);
    //this.drawHull(position3, points3);

    let curve = new THREE.CubicBezierCurve3(
      points[0],
      points[1],
      points[2],
      points[3]
    );

    let curve2 = new THREE.CubicBezierCurve3(
      points[0],
      points[1],
      points[2],
      points[3]
    );

    let curve3 = new THREE.CubicBezierCurve3(
      points2[0],
      points2[1],
      points2[2],
      points2[3]
    );

    let curve4 = new THREE.CubicBezierCurve3(
      points3[0],
      points3[1],
      points3[2],
      points3[3]
    );

    let curve5 = new THREE.CubicBezierCurve3(
      points4[0],
      points4[1],
      points4[2],
      points4[3]
    );

    // sample a number of points on the curve

    let sampledPoints = curve.getPoints(this.numberOfSamples);

    let sampledPoints2 = curve2.getPoints(this.numberOfSamples);

    let sampledPoints3 = curve3.getPoints(this.numberOfSamples);

    let sampledPoints4 = curve4.getPoints(this.numberOfSamples);

    let sampledPoints5 = curve5.getPoints(this.numberOfSamples);

    this.curveGeometry = new THREE.BufferGeometry().setFromPoints(
      sampledPoints
    );

    this.curveGeometry2 = new THREE.BufferGeometry().setFromPoints(
      sampledPoints2
    );

    this.curveGeometry3 = new THREE.BufferGeometry().setFromPoints(
      sampledPoints3
    );

    this.curveGeometry4 = new THREE.BufferGeometry().setFromPoints(
      sampledPoints4
    );

    this.curveGeometry5 = new THREE.BufferGeometry().setFromPoints(
      sampledPoints5
    );

    this.lineMaterial = new THREE.LineBasicMaterial({ color: this.carColor });

    this.lineObj = new THREE.Line(this.curveGeometry, this.lineMaterial);

    this.lineObj2 = new THREE.Line(this.curveGeometry2, this.lineMaterial);

    this.lineObj3 = new THREE.Line(this.curveGeometry3, this.lineMaterial);

    this.lineObj4 = new THREE.Line(this.curveGeometry4, this.lineMaterial);

    this.lineObj5 = new THREE.Line(this.curveGeometry5, this.lineMaterial);

    this.lineObj.position.set(position.x, position.y, position.z);

    this.lineObj2.position.set(position2.x, position2.y, position2.z);

    this.lineObj3.position.set(position3.x, position3.y, position3.z);

    this.lineObj4.position.set(position3.x, position3.y, position3.z);

    this.lineObj5.position.set(position3.x, position3.y, position3.z);

    beetleGroup.add(this.lineObj);
    beetleGroup.add(this.lineObj2);
    beetleGroup.add(this.lineObj3);
    beetleGroup.add(this.lineObj4);
    beetleGroup.add(this.lineObj5);


  }

  drawHull(position, points) {
    // change opacity

    this.hullMaterial.opacity = 0.5;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(geometry, this.hullMaterial);

    // set initial position

    line.position.set(position.x, position.y, position.z);
    return line;
  }
}

export { BeetlePainting };
