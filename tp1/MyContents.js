import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { Table } from "./MyTable.js";
import { Cake } from "./MyCake.js";
import { Plate } from "./MyPlate.js";
import { Frame } from "./MyFrame.js";
import { Window } from "./MyWindow.js";
import { Lamp } from "./MyLamp.js";
import { BeetlePainting } from "./MyBeetlePainting.js";
import { SpiralSpring } from "./MySpiralSpring.js";
import { Newspaper } from "./MyNewspaper.js";
import { Jar } from "./MyJar.js";
import { Flower } from "./MyFlower.js";
import { LightProjector } from "./MyLightProjector.js";
import { Mirror } from "./MyMirror.js";
import { Carpet } from "./MyCarpet.js";
import { Curtain } from "./MyCurtain.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;

    this.axis = null;
    this.axisEnable = false;
    this.lastaxisEnable = null;

    // Plane related attributes
    this.diffusePlaneColor = "#DEB887";
    this.specularPlaneColor = "#777777";
    this.planeShininess = 30;

    const texture = new THREE.TextureLoader().load("textures/floor.jpg");
    this.planeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      specular: this.specularPlaneColor,
      emissive: "#000000",
      shininess: this.planeShininess,
    });

    // Walls related attributes
    this.wallsMeshSize = 15.0;
    this.wallsDisplacement = new THREE.Vector3(0, 5, 0);
    this.diffuseWallsColor = "#add8e6";
    this.specularWallsColor = "#777777";
    this.wallsShininess = this.planeShininess;

    // Scene related attributes
    this.wallsEnable = true;
    this.wallsMesh = null;
    this.walls = [];
    this.lastwallsEnable = null;

    this.floorMesh = null;

    this.tableEnable = true;
    this.tableMesh = null;
    this.lastTableEnabled = null;

    this.plateEnable = true;
    this.plateMesh = null;
    this.lastPlateEnabled = null;

    this.cakeEnable = true;
    this.cakeMesh = null;
    this.lastCakeEnabled = null;

    this.candleEnable = true;
    this.candleMesh = null;
    this.cakeSliceEnable = true;
    this.cakeLightEnable = true;

    this.frameEnable = true;
    this.frameHeight = 3;
    this.frameWidth = 2.5;
    this.frameMesh1 = null;
    this.frameMesh2 = null;
    this.projector1Mesh = null;
    this.projector2Mesh = null;
    this.lastFrameEnabled = null;

    this.windowEnable = true;
    this.windowMesh = null;
    this.windowReplacementMesh = null;
    this.lastWindowEnabled = null;

    this.lampEnable = true;
    this.lampMesh1 = null;
    this.lastLampEnabled = null;
    this.lampOnEnable = true;

    this.beetlePaintingEnable = true;
    this.beetlePaintingMesh = null;
    this.lastBeetlePaintingEnabled = null;

    this.spiralSpringEnable = true;
    this.spiralSpringMesh = null;
    this.lastSpiralSpringEnabled = null;

    this.newspaperEnable = true;
    this.newspaperMesh = null;
    this.lastNewspaperEnabled = null;

    this.jarEnable = true;
    this.jarMesh = null;
    this.lastJarEnabled = null;

    this.flowerEnable = true;
    this.flowerMesh = null;
    this.flowerMesh2 = null;
    this.lastFlowerEnabled = null;

    this.mirrorEnable = true;
    this.mirrorMesh = null;
    this.lastMirrorEnabled = null;

    this.carpetEnable = true;
    this.carpetMesh = null;
    this.lastCarpetEnabled = null;

    this.curtainEnable = true;
    this.curtainMesh = null;
    this.curtainMesh2 = null;
    this.lastCurtainEnabled = null;

    this.shadowEnable = true;
    this.lastShadowEnabled = null;
    this.mapSize = 2048;
  }

  /**
   * Builds a wall mesh with material assigned
   * @param {number} rotation - The rotation of the wall
   * @param {THREE.Vector3} position - The position of the wall
   */
  buildWall(rotation, position) {
    // Calculate the width and height of the wall based on wallsMeshSize
    const wallWidth = this.wallsMeshSize;
    const wallHeight = 10;

    // Create a Wall Mesh with adjusted dimensions
    const wall = new THREE.PlaneGeometry(wallWidth, wallHeight);

    // Create window material
    const wallTexture = new THREE.TextureLoader().load("textures/wall.jpg");

    let wallMesh = new THREE.MeshLambertMaterial({
      map: wallTexture,
    });

    wallMesh = new THREE.Mesh(wall, wallMesh);
    wallMesh.rotation.y = rotation; // Adjust the rotation axis
    wallMesh.position.set(position.x, wallHeight / 2, position.z); // Adjust the position in x, y, and z coordinates

    // shadows
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;

    return wallMesh;
  }

  createWallWithWindow(rotation, position) {
    const wallWidth = this.wallsMeshSize;
    const wallHeight = 10;
    const holeWidth = 5;
    const holeHeight = 3;
    const wallPosition = new THREE.Vector3(0, -0.5, 0);

    // Create the left and right plane geometries
    const leftGeometry = new THREE.PlaneGeometry(
      (wallWidth - holeWidth) / 2,
      wallHeight
    );
    const rightGeometry = new THREE.PlaneGeometry(
      (wallWidth - holeWidth) / 2,
      wallHeight
    );

    // Create the top and bottom plane geometries with space in between
    const topGeometry = new THREE.PlaneGeometry(
      holeWidth,
      wallHeight / 2 - holeHeight / 2 - wallPosition.y
    );
    const bottomGeometry = new THREE.PlaneGeometry(
      holeWidth,
      wallHeight / 2 - holeHeight / 2 + wallPosition.y
    );

    // Create texture
    const wallTexture = new THREE.TextureLoader().load("textures/wall.jpg");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;

    // Create materials for the wall and the window opening
    const wallMaterial = new THREE.MeshLambertMaterial({
      map: wallTexture,
    });

    const leftMesh = new THREE.Mesh(leftGeometry, wallMaterial);
    const rightMesh = new THREE.Mesh(rightGeometry, wallMaterial);
    const topMesh = new THREE.Mesh(topGeometry, wallMaterial);
    const bottomMesh = new THREE.Mesh(bottomGeometry, wallMaterial);

    leftMesh.position.set((wallWidth - holeWidth) / 4 + holeWidth / 2, 0, 0);
    rightMesh.position.set(-(wallWidth - holeWidth) / 4 - holeWidth / 2, 0, 0);
    topMesh.position.set(
      0,
      (wallHeight / 2 - holeHeight / 2) / 2 +
        holeHeight / 2 +
        wallPosition.y / 2,
      0
    );
    bottomMesh.position.set(
      0,
      -(wallHeight / 2 - holeHeight / 2) / 2 -
        holeHeight / 2 +
        wallPosition.y / 2,
      0
    );

    // Create a group to contain all the wall and window meshes
    const wallGroup = new THREE.Group();
    wallGroup.add(leftMesh);
    wallGroup.add(rightMesh);
    wallGroup.add(topMesh);
    wallGroup.add(bottomMesh);

    wallGroup.rotation.y = rotation; // Adjust the rotation axis
    wallGroup.position.set(position.x, wallHeight / 2, position.z); // Adjust the position in x, y, and z coordinates

    // shadows
    wallGroup.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return wallGroup;
  }

  /**
   * Builds the walls mesh with material assigned to create a room
   */
  buildWalls() {
    // Calculate the room size for walls based on wallsMeshSize
    const halfRoomSize = this.wallsMeshSize / 2;

    let rotation = 0;
    const positions = [
      new THREE.Vector3(0, 0, -halfRoomSize),
      new THREE.Vector3(-halfRoomSize, 0, 0),
      new THREE.Vector3(0, 0, halfRoomSize),
      new THREE.Vector3(halfRoomSize, 0, 0),
    ];

    this.wallsMesh = new THREE.Group();
    this.walls = [];
    for (let i = 0; i < 4; i++) {
      let wall = null;
      if (i == 2 && this.windowEnable)
        wall = this.createWallWithWindow(rotation, positions[i]);
      else wall = this.buildWall(rotation, positions[i]);
      this.walls.push(wall);
      this.wallsMesh.add(wall);
      rotation += Math.PI / 2;
    }
  }

  buildCake() {
    const cake = new Cake(
      this.app,
      this.cakeSliceEnable,
      this.candleEnable,
      this.cakeLightEnable,
      this.mapSize
    );
    this.cakeMesh = cake.group;

    this.cakeMesh.position.y = 1.76;
    this.cakeMesh.scale.set(0.4, 0.6, 0.4);
  }

  buildTable() {
    const table = new Table(this.app, "textures/wood.jpg");
    this.tableMesh = table.group;

    this.tableMesh.receiveShadow = true;
  }

  buildPlate() {
    const plate = new Plate(this.app, this.app.scene);
    this.plateMesh = plate.group;

    this.plateMesh.position.y = 1.7;
    this.plateMesh.scale.set(0.3, 0.3, 0.3);

    this.plateMesh.receiveShadow = true;
  }

  buildFrame() {
    const frame1 = new Frame(
      this.app,
      "textures/pinheiro.jpg",
      this.frameWidth,
      this.frameHeight
    );
    const frame2 = new Frame(
      this.app,
      "textures/ricardo.jpg",
      this.frameWidth,
      this.frameHeight
    );
    this.frameMesh1 = frame1.group;
    this.frameMesh2 = frame2.group;

    this.frameMesh1.position.set(this.wallsMeshSize / 2, 4, 0);
    this.frameMesh1.rotation.y = -Math.PI / 2;

    this.frameMesh2.position.set(-this.wallsMeshSize / 2, 4, 0);
    this.frameMesh2.rotation.y = Math.PI / 2;

    this.frameMesh1.receiveShadow = true;
    this.frameMesh2.receiveShadow = true;
  }

  buildAmbientLight() {
      // add an ambient light
    this.ambientLight = new THREE.AmbientLight(0x111111);
  }

  buildWindow() {
    const window = new Window(
      this.app.scene,
      "textures/landscape.jpeg",
      this.mapSize,
      this.wallsMeshSize
    );
    this.windowMesh = window.group;

    this.windowMesh.position.set(0, 4.5, this.wallsMeshSize / 2);

    this.ambientLightWindow = new THREE.AmbientLight(0x333333);
  }

  buildLamp() {
    const lamp = new Lamp(this.app, this.lampOnEnable, this.mapSize, this.wallsMeshSize);
    const lamp2 = new Lamp(this.app, this.lampOnEnable, this.mapSize, this.wallsMeshSize);
    this.lampMesh1 = lamp.group;
    this.lampMesh2 = lamp2.group;
    this.lampMesh1.position.set(3, 6, 3);
    this.lampMesh2.position.set(-3, 6, -3);
  }

  buildFloor() {
    // Create a Plane Mesh with basic material
    let plane = new THREE.PlaneGeometry(this.wallsMeshSize, this.wallsMeshSize);
    this.floorMesh = new THREE.Mesh(plane, this.planeMaterial);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -0;

    this.floorMesh.receiveShadow = true;
    this.floorMesh.castShadow = true;
  }

  buildBeetlePainting() {
    const beetlePainting = new BeetlePainting(this.app);
    this.beetlePaintingMesh = beetlePainting.group;
    this.beetlePaintingMesh.position.set(0, 4, -this.wallsMeshSize / 2 + 0.05);
    this.beetlePaintingMesh.scale.set(0.5, 0.5, 0.5);
  }

  buildSpiralSpring() {
    const spiralSpring = new SpiralSpring(this.app);
    this.spiralSpringMesh = spiralSpring.group;
    this.spiralSpringMesh.position.set(1, 1.8, 0);
    this.spiralSpringMesh.scale.set(1, 1, 0.5);
  }

  buildNewspaper() {
    const newspaper = new Newspaper(
      this.app.scene,
      "textures/newspaper_texture.jpg"
    );
    this.newspaperMesh = newspaper.group;
    this.newspaperMesh.rotation.set(0, Math.PI / 2, -Math.PI / 2);
    this.newspaperMesh.scale.set(0.5, 0.5, 0.5);
    this.newspaperMesh.position.set(-1.4, 1.77, 0);
  }

  buildJar() {
    const jar = new Jar(this.app);
    this.jarMesh = jar.group;
    this.jarMesh.position.set(1.5, 1.7, 0.6);
    this.jarMesh.scale.set(0.7, 0.7, 0.7);
  }

  buildFlower() {
    const flower = new Flower(this.app);

    this.flowerMesh = flower.group;

    this.flowerMesh.position.set(-1.7, 1.82, -0.3);

    this.flowerMesh.rotateZ((2 * Math.PI) / 9);
    this.flowerMesh.rotateY((4 * Math.PI) / 10 + Math.PI);
  }

  buildFlowerInsideJar() {
    const flower = new Flower(this.app);
    const flower2 = new Flower(this.app);
    this.flowerMesh = flower.group;
    this.flowerMesh2 = flower2.group;

    this.flowerMesh2.rotateY(Math.PI);
    this.flowerMesh.position.set(1.4, 2.25, 0.5);
    this.flowerMesh2.position.set(1.7, 2.25, 0.7);

    this.flowerMesh.rotateZ(-Math.PI / 9);
    this.flowerMesh.rotateY((4 * Math.PI) / 10 + Math.PI);

    //this.flowerMesh2.rotateX(Math.PI)
    this.flowerMesh2.rotateZ(-Math.PI / 9);
    this.flowerMesh2.rotateY((4 * Math.PI) / 10 + Math.PI);
  }

  buildProjectors() {
    const projector1 = new LightProjector(
      this.app.scene,
      this.frameMesh2,
      this.mapSize
    );
    const projector2 = new LightProjector(
      this.app.scene,
      this.frameMesh1,
      this.mapSize
    );
    this.projector1Mesh = projector1.group;
    this.projector2Mesh = projector2.group;
    this.projector1Mesh.position.set(-2, 0.23, 0);
    this.projector2Mesh.position.set(2, 0.23, 0);
    this.projector2Mesh.rotation.y = Math.PI;
  }

  buildCarpet() {
    const carpet = new Carpet(this.app, "textures/carpet.jpg");

    this.carpetMesh = carpet.group;
    this.carpetMesh.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  }

  buildMirror() {
    const mirror = new Mirror(this.app, this.wallsMeshSize);

    this.mirrorMesh = mirror.group;
    this.mirrorMesh.position.set(
      -this.wallsMeshSize / 2 + Math.cos(Math.PI / 15) + 0.6,
      3,
      -this.wallsMeshSize / 2 + Math.cos(Math.PI / 15) + 0.6
    );
  }

  buildRoof() {
    const roof = new THREE.PlaneGeometry(
      this.wallsMeshSize,
      this.wallsMeshSize
    );
    const texture = new THREE.TextureLoader().load("textures/roof.jpg");

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      specular: "#111111",
      emissive: "#000000",
      shininess: 30,
    });

    this.roofMesh = new THREE.Mesh(roof, material);
    this.roofMesh.position.set(0, 10, 0);
    this.roofMesh.rotation.set(Math.PI / 2, 0, Math.PI / 2);

    this.roofMesh.receiveShadow = true;

    this.app.scene.add(this.roofMesh);
  }

  buildCurtain() {
    const curtain = new Curtain(this.app, "textures/curtain.jpg", "right");
    const curtain2 = new Curtain(this.app, "textures/curtain.jpg", "left");

    this.curtainMesh = curtain.group;
    this.curtainMesh.rotateY(Math.PI);
    this.curtainMesh.position.set(4, 2.5, this.wallsMeshSize / 2 - 0.5);
    
    this.curtainMesh2 = curtain2.group;
    this.curtainMesh2.position.set(-4, 2.5, this.wallsMeshSize / 2 - 0.5);
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    this.buildBeetlePainting();
    this.buildWalls();
    this.buildTable();
    this.buildPlate();
    this.buildCake();
    this.buildFrame();
    this.buildAmbientLight();
    this.buildWindow();
    this.buildLamp();
    this.buildFloor();
    this.buildSpiralSpring();
    this.buildNewspaper();
    this.buildJar();
    this.buildFlower();
    this.buildFlowerInsideJar();
    this.buildProjectors();
    this.buildCarpet();
    this.buildMirror();
    this.buildRoof();
    this.buildCurtain();

    this.addMeshesToScene();
  }

  addMeshesToScene() {
    this.beetlePaintingEnable && this.app.scene.add(this.beetlePaintingMesh) & (this.lastBeetlePaintingEnabled = this.beetlePaintingEnable);
    this.wallsEnable && this.app.scene.add(this.wallsMesh) & (this.lastwallsEnable = this.wallsEnable);
    this.tableEnable && this.app.scene.add(this.tableMesh) & (this.lastTableEnabled = this.tableEnable);
    this.plateEnable && this.app.scene.add(this.plateMesh) & (this.lastPlateEnabled = this.plateEnable);
    this.cakeEnable && this.app.scene.add(this.cakeMesh)  & (this.lastCakeEnabled = this.cakeEnable);
    this.frameEnable && this.app.scene.add(this.frameMesh1) & (this.lastFrameEnabled = this.frameEnable);
    this.frameEnable && this.app.scene.add(this.frameMesh2) & (this.lastFrameEnabled = this.frameEnable);
    this.frameEnable && this.app.scene.add(this.projector1Mesh);
    this.frameEnable && this.app.scene.add(this.projector2Mesh);
    this.windowMesh ? this.app.scene.add(this.ambientLightWindow) :  this.app.scene.add(this.ambientLight);
    this.windowEnable && this.app.scene.add(this.windowMesh)  & (this.lastWindowEnabled = this.windowEnable);
    this.lampEnable && this.app.scene.add(this.lampMesh1) & (this.lastLampEnabled = this.lampEnable);
    this.lampEnable && this.app.scene.add(this.lampMesh2) & (this.lastLampEnabled = this.lampEnable);
    this.app.scene.add(this.floorMesh) & (this.lastFloorEnabled = this.floorEnable);
    this.spiralSpringEnable && this.app.scene.add(this.spiralSpringMesh)  & (this.lastSpiralSpringEnabled = this.spiralSpringEnable);
    this.newspaperEnable && this.app.scene.add(this.newspaperMesh)  & (this.lastNewspaperEnabled = this.newspaperEnable);
    this.jarEnable && this.app.scene.add(this.jarMesh)  & (this.lastJarEnabled = this.jarEnable);
    this.flowerEnable && this.app.scene.add(this.flowerMesh)  & (this.lastFlowerEnabled = this.flowerEnable);
    this.flowerEnable && this.app.scene.add(this.flowerMesh2)  & (this.lastFlowerEnabled = this.flowerEnable);
    this.carpetEnable && this.app.scene.add(this.carpetMesh)  & (this.lastCarpetEnabled = this.carpetEnable);
    this.mirrorEnable && this.app.scene.add(this.mirrorMesh)  & (this.lastMirrorEnabled = this.mirrorEnable);
    this.roofEnable && this.app.scene.add(this.roofMesh) & (this.lastRoofEnabled = this.roofEnable);
    this.curtainEnable && this.app.scene.add(this.curtainMesh) & (this.lastCurtainEnabled = this.curtainEnable);
    this.curtainEnable && this.app.scene.add(this.curtainMesh2) & (this.lastCurtainEnabled = this.curtainEnable);
  }

  /**
   * updates the diffuse plane color and the material
   * @param {THREE.Color} value
   */
  updateDiffusePlaneColor(value) {
    this.diffusePlaneColor = value;
    this.planeMaterial.color.set(this.diffusePlaneColor);
  }
  /**
   * updates the specular plane color and the material
   * @param {THREE.Color} value
   */
  updateSpecularPlaneColor(value) {
    this.specularPlaneColor = value;
    this.planeMaterial.specular.set(this.specularPlaneColor);
  }
  /**
   * updates the plane shininess and the material
   * @param {number} value
   */
  updatePlaneShininess(value) {
    this.planeShininess = value;
    this.planeMaterial.shininess = this.planeShininess;
  }
  updateFrameHeight(value) {
    this.frameHeight = value;
    this.rebuildFrame();
  }
  updateFrameWidth(value) {
    this.frameWidth = value;
    this.rebuildFrame();
  }
  updateShadowMapSize(value) {
    this.mapSize = value;
    this.rebuildScene();
  }

  rebuildScene() {
    // call all rebuild methods:
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter(
        (propName) =>
          propName !== "constructor" &&
          typeof this[propName] === "function" &&
          propName.startsWith("rebuild") &&
          propName !== "rebuildScene"
      )
      .forEach((propName) => this[propName]())
      .forEach((propName) => this[propName]());
  }

  /**
   * rebuilds the walls mesh if required
   * this method is called from the gui interface
   */
  rebuildWalls() {
    // remove wallsMesh if exists
    if (this.wallsMesh !== undefined && this.wallsMesh !== null) {
      this.app.scene.remove(this.wallsMesh);
      this.app.scene.remove(this.floorMesh);
      this.app.scene.remove(this.roofMesh);
    }
    this.buildWalls();
    this.buildFloor();
    this.buildRoof();

    this.lastwallsEnable = null;
  }

  /**
   * rebuilds the table mesh if required
   * this method is called from the gui interface
   */
  rebuildTable() {
    // remove tableMesh if exists
    if (this.tableMesh !== undefined && this.tableMesh !== null) {
      this.app.scene.remove(this.tableMesh);
    }
    this.buildTable();
    this.lastTableEnabled = null;
  }

  /**
   * rebuilds the cake mesh if required
   * this method is called from the gui interface
   */
  rebuildCake() {
    // remove cakeMesh if exists
    if (this.cakeMesh !== undefined && this.cakeMesh !== null) {
      this.app.scene.remove(this.cakeMesh);
    }
    this.buildCake();
    this.lastCakeEnabled = null;
  }

  /**
   * rebuilds the plate mesh if required
   * this method is called from the gui interface
   */
  rebuildPlate() {
    // remove plateMesh if exists
    if (this.plateMesh !== undefined && this.plateMesh !== null) {
      this.app.scene.remove(this.plateMesh);
    }
    this.buildPlate();
    this.lastPlateEnabled = null;
  }

  rebuildFrame() {
    // remove frameMesh1 if exists
    if (this.frameMesh1 !== undefined && this.frameMesh1 !== null) {
      this.app.scene.remove(this.frameMesh1);
    }
    if (this.frameMesh2 !== undefined && this.frameMesh2 !== null) {
      this.app.scene.remove(this.frameMesh2);
    }
    this.buildFrame();
    this.lastFrameEnabled = null;
  }

  rebuildWindow() {
    // remove windowMesh if exists
    if (this.windowMesh !== undefined && this.windowMesh !== null) {
      this.app.scene.remove(this.windowMesh);
      this.app.scene.remove(this.ambientLightWindow);
    }
    this.buildWindow();
    this.lastWindowEnabled = null;
  }

  rebuildLamp() {
    // remove lampMesh1 if exists
    if (this.lampMesh1 !== undefined && this.lampMesh1 !== null) {
      this.app.scene.remove(this.lampMesh1);
      this.app.scene.remove(this.lampMesh2);
    }
    this.buildLamp();
    this.lastLampEnabled = null;
  }

  rebuildBeetlePainting() {
    // remove beetlePaintingMesh if exists
    if (
      this.beetlePaintingMesh !== undefined &&
      this.beetlePaintingMesh !== null
    ) {
      this.app.scene.remove(this.beetlePaintingMesh);
    }
    this.buildBeetlePainting();
    this.lastBeetlePaintingEnabled = null;
  }

  rebuildSpiralSpring() {
    // remove spiralSpringMesh if exists
    if (this.spiralSpringMesh !== undefined && this.spiralSpringMesh !== null) {
      this.app.scene.remove(this.spiralSpringMesh);
    }
    this.buildSpiralSpring();
    this.lastSpiralSpringEnabled = null;
  }

  rebuildNewspaper() {
    // remove newspaperMesh if exists
    if (this.newspaperMesh !== undefined && this.newspaperMesh !== null) {
      this.app.scene.remove(this.newspaperMesh);
    }
    this.buildNewspaper();
    this.lastNewspaperEnabled = null;
  }

  rebuildJar() {
    // remove jarMesh if exists
    if (this.jarMesh !== undefined && this.jarMesh !== null) {
      this.app.scene.remove(this.jarMesh);
    }
    this.buildJar();
    this.lastJarEnabled = null;
  }

  rebuildFlower() {
    // remove flowerMesh if exists
    if (
      this.flowerMesh !== undefined &&
      this.flowerMesh !== null ) {
      this.app.scene.remove(this.flowerMesh);
    }
    if (
      this.flowerMesh2 !== undefined &&
      this.flowerMesh2 !== null ) {
      this.app.scene.remove(this.flowerMesh2);
    }
    if (this.jarEnable) this.buildFlowerInsideJar();
    else this.buildFlower();
    this.lastFlowerEnabled = null;
  }

  rebuildProjectors() {
    if (this.projector1Mesh !== undefined && this.projector1Mesh !== null) {
      this.app.scene.remove(this.projector1Mesh);
    }
    if (this.projector2Mesh !== undefined && this.projector2Mesh !== null) {
      this.app.scene.remove(this.projector2Mesh);
    }
    this.buildProjectors();
    this.lastFrameEnabled = null;
  }

  rebuildCarpet() {
    if (this.carpetMesh !== undefined && this.carpetMesh !== null) {
      this.app.scene.remove(this.carpetMesh);
    }
    this.buildCarpet();
    this.lastCarpetEnabled = null;
  }

  rebuildMirror() {
    if (this.mirrorMesh !== undefined && this.mirrorMesh !== null) {
      this.app.scene.remove(this.mirrorMesh);
    }
    this.buildMirror();
    this.lastMirrorEnabled = null;
  }

  rebuildCurtain() {
    if (this.curtainMesh !== undefined && this.curtainMesh !== null) {
      this.app.scene.remove(this.curtainMesh);
    }
    if (this.curtainMesh2 !== undefined && this.curtainMesh2 !== null) {
      this.app.scene.remove(this.curtainMesh2);
    }
    this.buildCurtain();
    this.lastCurtainEnabled = null;
  }

  updateMeshesIfRequired() {
    if (this.axisEnable !== this.lastaxisEnable) {
      this.lastaxisEnable = this.axisEnable;
      if (this.axisEnable) {
        this.app.scene.add(this.axis);
      } else {
        this.app.scene.remove(this.axis);
      }
    }
    if (this.wallsEnable !== this.lastwallsEnable) {
      this.lastwallsEnable = this.wallsEnable;
      if (this.wallsEnable) {
        this.app.scene.add(this.wallsMesh);
        this.app.scene.add(this.floorMesh);
        this.app.scene.add(this.roofMesh);
      } else {
        this.app.scene.remove(this.wallsMesh);
        this.app.scene.remove(this.floorMesh);
        this.app.scene.remove(this.roofMesh);
      }
    }
    if (this.tableEnable !== this.lastTableEnabled) {
      this.lastTableEnabled = this.tableEnable;
      if (this.tableEnable) {
        this.app.scene.add(this.tableMesh);
      } else {
        this.app.scene.remove(this.tableMesh);
      }
    }
    if (this.cakeEnable != this.lastCakeEnabled) {
      this.lastCakeEnabled = this.cakeEnable;
      if (this.cakeEnable) {
        this.app.scene.add(this.cakeMesh);
      } else {
        this.app.scene.remove(this.cakeMesh);
      }
    }
    if (this.plateEnable !== this.lastPlateEnabled) {
      this.lastPlateEnabled = this.plateEnable;
      if (this.plateEnable) {
        this.app.scene.add(this.plateMesh);
      } else {
        this.app.scene.remove(this.plateMesh);
      }
    }
    if (this.frameEnable !== this.lastFrameEnabled) {
      this.lastFrameEnabled = this.frameEnable;
      if (this.frameEnable) {
        this.app.scene.add(this.frameMesh1);
        this.app.scene.add(this.frameMesh2);
        this.app.scene.add(this.projector1Mesh);
        this.app.scene.add(this.projector2Mesh);
      } else {
        this.app.scene.remove(this.frameMesh1);
        this.app.scene.remove(this.frameMesh2);
        this.app.scene.remove(this.projector1Mesh);
        this.app.scene.remove(this.projector2Mesh);
      }
    }
    if (this.windowEnable !== this.lastWindowEnabled) {
      this.lastWindowEnabled = this.windowEnable;
      if (this.windowEnable) {
        this.app.scene.add(this.windowMesh);
        this.app.scene.add(this.ambientLightWindow);
        this.app.scene.remove(this.ambientLight);
      } else {
        this.app.scene.remove(this.windowMesh);
        this.app.scene.add(this.ambientLight);
        this.app.scene.remove(this.ambientLightWindow);
      }
    }
    if (this.lampEnable !== this.lastLampEnabled) {
      this.lastLampEnabled = this.lampEnable;
      if (this.lampEnable) {
        this.app.scene.add(this.lampMesh1);
        this.app.scene.add(this.lampMesh2);
      } else {
        this.app.scene.remove(this.lampMesh1);
        this.app.scene.remove(this.lampMesh2);
      }
    }
    if (this.beetlePaintingEnable !== this.lastBeetlePaintingEnabled) {
      this.lastBeetlePaintingEnabled = this.beetlePaintingEnable;
      if (this.beetlePaintingEnable) {
        this.app.scene.add(this.beetlePaintingMesh);
      } else {
        this.app.scene.remove(this.beetlePaintingMesh);
      }
    }
    if (this.spiralSpringEnable !== this.lastSpiralSpringEnabled) {
      this.lastSpiralSpringEnabled = this.spiralSpringEnable;
      if (this.spiralSpringEnable) {
        this.app.scene.add(this.spiralSpringMesh);
      } else {
        this.app.scene.remove(this.spiralSpringMesh);
      }
    }
    if (this.newspaperEnable !== this.lastNewspaperEnabled) {
      this.lastNewspaperEnabled = this.newspaperEnable;
      if (this.newspaperEnable) {
        this.app.scene.add(this.newspaperMesh);
      } else {
        this.app.scene.remove(this.newspaperMesh);
      }
    }
    if (this.jarEnable !== this.lastJarEnabled) {
      this.lastJarEnabled = this.jarEnable;
      if (this.jarEnable) {
        this.app.scene.add(this.jarMesh);
        this.rebuildFlower();
      } else {
        this.app.scene.remove(this.jarMesh);
        if (this.flowerEnable) {
          this.rebuildFlower();
        }
      }
    }
    if (this.flowerEnable !== this.lastFlowerEnabled) {
      this.lastFlowerEnabled = this.flowerEnable;
      if (this.flowerEnable) {
        this.app.scene.add(this.flowerMesh);
        if (this.jarEnable) this.app.scene.add(this.flowerMesh2);
      } else {
        this.app.scene.remove(this.flowerMesh);
        this.app.scene.remove(this.flowerMesh2);
      }
    }
    if (this.carpetEnable !== this.lastCarpetEnabled) {
      this.lastCarpetEnabled = this.carpetEnable;
      if (this.carpetEnable) {
        this.app.scene.add(this.carpetMesh);
      } else {
        this.app.scene.remove(this.carpetMesh);
      }
    }
    if (this.mirrorEnable !== this.lastMirrorEnabled) {
      this.lastMirrorEnabled = this.mirrorEnable;
      if (this.mirrorEnable) {
        this.app.scene.add(this.mirrorMesh);
      } else {
        this.app.scene.remove(this.mirrorMesh);
      }
    }
    if (this.curtainEnable !== this.lastCurtainEnabled) {
      this.lastCurtainEnabled = this.curtainEnable;
      if (this.curtainEnable) {
        this.app.scene.add(this.curtainMesh);
        this.app.scene.add(this.curtainMesh2);
      } else {
        this.app.scene.remove(this.curtainMesh);
        this.app.scene.remove(this.curtainMesh2);
      }
    }
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    // check if meshes needs to be updated
    this.updateMeshesIfRequired();
  }
}

export { MyContents };
