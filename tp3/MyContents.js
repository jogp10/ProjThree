import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyVehicle } from "./MyFiles/MyVehicle.js";
import { MyPowerUp } from "./MyFiles/MyPowerUp.js";
import { MyGameState } from "./MyFiles/MyGameState.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MyTrack } from "./MyFiles/MyTrack.js";
import { MySpriteSheet } from "./MyFiles/MySpriteSheet.js";
import { MyMenu } from "./MyFiles/MyMenu.js";
import { MyObstacle } from "./MyFiles/MyObstacle.js";
import { MyBackground } from "./MyFiles/MyBackground.js";
import { MyCheckpoint } from "./MyFiles/MyCheckpoint.js";
import { MyOpponent } from "./MyFiles/MyOpponent.js";
import { MyBillboard } from "./MyFiles/MyBillboard.js";
import { MyFirework } from "./MyFiles/MyFirework.js";

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

    this.dict = {
      audi: 0,
      cybertruck: 1,
      muscle: 2,
      "fire-truck": 3,
      ferrari: 4,
    };

    this.car = null;
    this.carEnabled = true;
    this.lastCarEnabled = null;
    this.car = null;
    this.oppCar = null;
    this.carOppEnabled = true;
    this.cars = [];
    this.powerUps = [];
    this.billboards = [];
    this.activeCarName = "audi";

    this.userCarName = null;
    this.oppCarName = null;

    this.parking = new THREE.Group();
    this.textSprites = [];

    this.obstacles = [];
    this.parkingLotObstacles = [];

    this.finalSprites = [];
    this.winner = null;

    // hud related attributes
    this.timeElapsed = 0;
    this.startTime = 0;
    this.velocity = 0;
    this.maxVelocity = 0;
    this.lapNumber = 1;
    this.totalLaps = 3;
    this.bestLapTime = -1;
    this.selectingCar = "user";
    this.gameState = new MyGameState();
    this.track = null;
    this.checkpoints = [];
    this.parkingLotLoaded = false;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 1;
    this.raycaster.far = 20;
    this.pickedObject = null;
    this.selecting = false;
    this.pointer = new THREE.Vector2();
    this.intersectedObj = null;
    this.pickingColor = 0x0ffff0;
    this.lastObj = null;
    this.opponent = null;
    this.newObstacle = null;

    this.spriteSheet = new MySpriteSheet("textures/font.png", 8, 5);
    // structure of layers: each layer will contain its objects
    // this can be used to select objects that are pickeable

    // define the objects ids that are not to be pickeable
    // NOTICE: not a ThreeJS facility
    this.notPickableObjIds = [];
    // this.notPickableObjIds = ["col_0_0", "col_2_0", "col_1_1"]
    // this.notPickableObjIds = ["myplane", "col_0_0", "col_2_0", "col_1_1"]
  }

  initVariables() {
    this.car = null;
    this.carEnabled = true;
    this.lastCarEnabled = null;
    this.car = null;
    this.oppCar = null;
    this.carOppEnabled = true;
    this.cars = [];
    this.powerUps = [];
    this.billboards = [];
    this.activeCarName = "audi";

    this.userCarName = null;
    this.oppCarName = null;

    this.parking = new THREE.Group();
    this.textSprites = [];

    this.obstacles = [];
    this.parkingLotObstacles = [];

    this.finalSprites = [];
    this.winner = null;

    // hud related attributes
    this.timeElapsed = 0;
    this.startTime = 0;
    this.velocity = 0;
    this.maxVelocity = 0;
    this.lapNumber = 1;
    this.totalLaps = 3;
    this.bestLapTime = -1;
    this.selectingCar = "user";
    this.gameState = new MyGameState();
    this.track = null;
    this.checkpoints = [];
    this.parkingLotLoaded = false;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 1;
    this.raycaster.far = 20;
    this.pickedObject = null;
    this.selecting = false;
    this.pointer = new THREE.Vector2();
    this.intersectedObj = null;
    this.pickingColor = 0x0ffff0;
    this.lastObj = null;
    this.opponent = null;
    this.newObstacle = null;

    this.notPickableObjIds = [];
  }

  /**
   * builds the box mesh with material assigned
   */
  buildBox() {
    let boxMaterial = new THREE.MeshPhongMaterial({
      color: "#ffff77",
      specular: "#000000",
      emissive: "#000000",
      shininess: 90,
    });

    // Create a Cube Mesh with basic material
    let box = new THREE.BoxGeometry(
      this.boxMeshSize,
      this.boxMeshSize,
      this.boxMeshSize
    );
    this.boxMesh = new THREE.Mesh(box, boxMaterial);
    this.boxMesh.rotation.x = -Math.PI / 2;
    this.boxMesh.position.y = this.boxDisplacement.y;
  }

  startTimer() {
    this.startTime = performance.now();
  }

  getTimer() {
    if (this.startTime === 0) return 0;
    return performance.now() - this.startTime;
  }

  pauseTimer() {
    this.timeElapsed = performance.now() - this.startTime;
  }

  resumeTimer() {
    if (this.startTime != 0) {
      let time = -this.startTime;
      this.startTime = performance.now() - this.timeElapsed;
      time += this.startTime;

      this.car.updateTimers(time);
    }
  }
  endTimer() {
    this.timeElapsed = performance.now() - this.startTime;
    this.startTime = 0;
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      // this.app.scene.add(this.axis);
    }

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 5000, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);

    // this.initTrack();
    this.initializeBasedOnGameState();

    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    const texts = ["audi", "cybertruck", "muscle", "fire-truck", "ferrari"];
    texts.forEach((text) => {
      const textGroup = this.spriteSheet.createTextGroup(text);
      textGroup.scale.set(0.6, 0.6, 0.6);
      this.textSprites.push(textGroup);
    });

    const finaltexts = ["YOU WON", "You Lost", "R to restart"];
    finaltexts.forEach((text) => {
      const textGroup = this.spriteSheet.createTextGroup(text);
      this.finalSprites.push(textGroup);
    });
  }

  downloadScreenshot(dataUrl, name) {
    // Convert data URL to Blob
    var byteString = atob(dataUrl.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Create a Blob and download link
    var blob = new Blob([ab], { type: "image/png" }); // Adjust type if needed
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  initBackground() {
    this.createSkybox(
      "textures/skybox/px.png",
      "textures/skybox/nx.png",
      "textures/skybox/py.png",
      "textures/skybox/ny.png",
      "textures/skybox/pz.png",
      "textures/skybox/nz.png"
    );
    this.background = new MyBackground(
      "textures/GroundSand005_COL.jpg",
      "textures/GroundSand005_DISP.jpg",
      "shaders/terrain.vert",
      "shaders/terrain.frag"
    );
    this.app.scene.add(this.background.group);
  }

  initTrack() {
    this.track = new MyTrack();
    this.app.scene.add(this.track.group);
  }

  initBillboard() {
    this.billboards = []
    const billboard = new MyBillboard(
      this.app,
      new THREE.Vector3(10, 0, -70),
      "shaders/billboard.vert",
      "shaders/billboard.frag"
    );
    this.billboards.push(billboard);
    const billboard2 = new MyBillboard(
      this.app,
      new THREE.Vector3(-90, 0, 90),
      "shaders/billboard.vert",
      "shaders/billboard.frag"
    );
    this.billboards.push(billboard2);
    const billboard3 = new MyBillboard(
      this.app,
      new THREE.Vector3(15, 0, 15),
      "shaders/billboard.vert",
      "shaders/billboard.frag"
    );
    this.billboards.push(billboard3);

    this.billboards.forEach((billboard) => {
      this.app.scene.add(billboard.group);
    });
  }

  initCarsState() {
    this.boundPointerMoveHandler = this.onPointerMove.bind(this);

    this.initCars();

    this.selectCarsScene();
    const myCarDiv = document.getElementById("my-car");
    const oppCar = document.getElementById("opp-car");

    document.getElementById("car-selection").style.display = "block";

    document.addEventListener("pointermove", this.boundPointerMoveHandler);

    document.addEventListener("click", () => {
      this.clickHandler(myCarDiv, oppCar);
    });

    // Start the game
    document.getElementById("start-game2").addEventListener("click", () => {
      if (this.selectingCar === "done") {
        document.getElementById("start-game2").style.display = "none";
        document.getElementById("car-selection").style.display = "none";

        // Remove cars from scene
        for (let i = 0; i < this.cars.length; i++) {
          const car = this.cars[i];
          this.app.scene.remove(car);
        }

        // Add cars to scene
        this.addCarsToScene(this.userCarName, this.oppCarName);

        document.removeEventListener(
          "pointermove",
          this.boundPointerMoveHandler
        );
        document.removeEventListener("click", this.clickHandler);

        this.app.activeCameraName = "3rdPerson";

        this.clearParkingLot();
        this.gameState.setGameState("RUNNING");
        this.gameState.setGameStarted();
        this.initializeBasedOnGameState();
      }
    });
  }

  initFinalState() {
    // Implement initialization for the 'final' game state
    // Example: Present race results, restart race option, etc.
    // Add final state setup here...
    this.boundPointerMoveHandler = this.onPointerMove.bind(this);

    const buffs = document.getElementsByClassName("buffs")[0];
    buffs.style.display = "none";
    const card = document.getElementsByClassName("card")[0];
    card.style.display = "none";

    this.clearTrack();
    this.selectCarsScene(false);
    if (this.cars === undefined || this.cars.length === 0)
      this.initRandomCars();
    this.moveCarsToGarage();

    let text = this.spriteSheet.createTextGroup(
      this.menu.getUserName() === "" ? "You" : this.menu.getUserName()
    );
    text.position.set(2.5, -19.9, 0.8);
    text.rotation.y = Math.PI / 2 + Math.PI / 9;
    text.scale.set(0.8, 0.8, 0.8);
    this.app.scene.add(text);

    text = this.spriteSheet.createTextGroup(this.opponent.difficulty);
    text.position.set(2.5, -19.9, -0.8);
    text.rotation.y = Math.PI / 2 - Math.PI / 9;
    text.scale.set(0.8, 0.8, 0.8);
    this.app.scene.add(text);

    const sprite = this.finalSprites[this.winner]; // 0 if user, 1 if opponent
    sprite.position.set(0, -19, 0);
    sprite.rotation.y = Math.PI / 2;
    sprite.scale.set(1.5, 1.5, 1.5);
    this.app.scene.add(sprite);

    const retrySprite = this.finalSprites[2];
    retrySprite.position.set(3, -19.5, -2);
    retrySprite.rotation.y = Math.PI / 2 - Math.PI / 7;
    retrySprite.scale.set(0.6, 0.6, 0.6);
    this.app.scene.add(retrySprite);

    this.boundPointerMoveHandler = this.handleRestartListener.bind(this);
    document.addEventListener("keydown", this.boundPointerMoveHandler);
  }

  restart() {
    this.clearScreen();
    let textDiv = document.querySelector("#buffs .text");
    while(textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }

    document.removeEventListener("keydown", this.boundPointerMoveHandler);
    while(this.app.scene.children.length > 0){ 
      this.app.scene.remove(this.app.scene.children[0]); 
    }

    this.car.deconstructor();
    this.initVariables();
    this.gameState = new MyGameState();
    this.gameState.setGameState("INITIAL");
    this.init();
  }

  initInitialState() {
    // Implement initialization for the 'initial' game state
    // Example: Initialize cars, power-ups, lights, etc.
    // console.log("init initial");
    this.menu = new MyMenu(this.app, this.spriteSheet);
    this.menu.addMenu();
    this.app.setActiveCamera("Menu");
    this.boundPointerMoveHandler = this.onPointerMove.bind(this);
    this.clickMenuHandler = this.clickMenuHandler.bind(this);
    document.addEventListener("pointermove", this.boundPointerMoveHandler);
    document.addEventListener("click", this.clickMenuHandler);
  }

  clickMenuHandler() {
    // console.log("click")
    if (this.selecting) {
      if (this.pickedObject === "start") {
        this.menu.clear();
        switch (this.menu.scene) {
          case 0:
            this.pickedObject = null;

            this.menu.scene = 1;
            this.menu.secondText();
            this.menu.setupKeyboardInput();
            this.menu.startCaretBlinking();
            break;
        }
      } else if (["easy", "medium", "hard"].includes(this.pickedObject)) {
        this.menu.changeSelectedDifficulty();

        this.menu.changeFinalDifficulty();
        // console.log("selected difficulty", this.menu.finalDifficulty);
      } else if (
        this.pickedObject === "chooseCars" ||
        this.pickedObject === "randomCars"
      ) {
        document.removeEventListener(
          "pointermove",
          this.boundPointerMoveHandler
        );
        this.lastPickedObj = null;
        this.lastObj = null;
        // console.log("removig listeners")
        document.removeEventListener("click", this.clickMenuHandler);
        this.menu.cleanMenu();
        if (this.pickedObject === "chooseCars") {
          this.gameState.setGameState("CARS");
          this.initializeBasedOnGameState();
        } else {
          const mycar = Math.floor(Math.random() * 5);
          const oppcar = Math.floor(Math.random() * 5);
          Object.keys(this.dict).forEach((key) => {
            if (this.dict[key] === mycar) {
              this.userCarName = key;
            }
            if (this.dict[key] === oppcar) {
              this.oppCarName = key;
            }
          });

          this.initRandomCars();
          this.app.scene.add(this.car);
          this.app.scene.add(this.oppCar);
          this.app.activeCameraName = "3rdPerson";
          this.gameState.setGameState("RUNNING");
          this.gameState.setGameStarted();
          this.initializeBasedOnGameState();
        }
      }
    }
  }

  addCarsToScene(userCarName, oppCarName) {
    // console.log(this.cars);
    // console.log("user car name", userCarName);
    // console.log("opp car name", oppCarName);

    this.setActiveCar(userCarName);
    this.setOppActiveCar(oppCarName);
  }

  moveCarsToGarage() {
    this.car.position.set(1, -19.5, 1.5);
    this.oppCar.position.set(1, -19.5, -1.5);
    this.car.scale.set(0.75, 0.75, 0.75);
    this.oppCar.scale.set(0.75, 0.75, 0.75);
    this.car.rotation.y = Math.PI / 7 + Math.PI;
    this.oppCar.rotation.y = -Math.PI / 7 + Math.PI;
    this.app.scene.add(this.car);
    this.app.scene.add(this.oppCar);
  }

  clickHandler(myCarDiv, oppCar) {
    // console.log("click")
    if (this.selecting) {
      // console.log("selecting")
      if (this.selectingCar === "user" && this.pickedObject != null) {
        this.selectingCar = "opp";
        document.getElementById("car-name").style.display = "block";
        document.getElementById("car-name").innerHTML = this.pickedObject;
        oppCar.style.display = "block";
        this.userCarName = this.pickedObject;
      } else if (this.selectingCar === "opp" && this.pickedObject != null) {
        this.selectingCar = "done";
        document.getElementById("opp-car-name").style.display = "block";
        document.getElementById("opp-car-name").innerHTML = this.pickedObject;
        this.oppCarName = this.pickedObject;
        document.getElementById("start-game2").style.display = "block";
      }
    }
  }

  selectCarsScene(withCars = true) {
    if (!this.parkingLotLoaded) this.buildParkingLot();
    else this.app.scene.add(this.parking);
    if (withCars) this.placeCarsInParkingLot();
    this.app.setActiveCamera("Parking Lot");
  }

  clearParkingLot() {
    this.app.scene.remove(this.parking);
    this.cars.forEach((car) => {
      car.scale.set(2, 2, 2);
    });
    this.textSprites.forEach((sprite) => {
      this.app.scene.remove(sprite);
    });
    this.textSprites = [];
  }

  clearTrack() {
    this.app.scene.remove(this.track.group);
    this.app.scene.remove(this.opponent.group);
    this.app.scene.remove(this.car);
    this.app.scene.remove(this.oppCar);
    this.app.scene.remove(this.background.group);
    this.app.scene.remove(this.stop);
    this.app.scene.remove(this.slow);
    this.app.scene.remove(this.change);
    this.powerUps.forEach((powerUp) => {
      this.app.scene.remove(powerUp.group);
    });
    this.billboards.forEach((billboard) => {
      this.app.scene.remove(billboard.group);
    });
    this.obstacles.forEach((obstacle) => {
      this.app.scene.remove(obstacle);
    });
    this.checkpoints.forEach((checkpoint) => {
      this.app.scene.remove(checkpoint);
    });
    this.textSprites.forEach((sprite) => {
      this.app.scene.remove(sprite);
    });
  }

  changeToChooseObstacle() {
    this.gameState.setGameState("CHOOSE_OBSTACLE");
    this.initializeBasedOnGameState();
    this.clearScreen();
  }

  initChooseObstacleState() {
    this.pauseTimer();
    this.opponent.pause();
    this.pickedObject = null;
    if (!this.parkingLotLoaded) this.buildParkingLot();
    else this.app.scene.add(this.parking);
    this.app.setActiveCamera("Choose Object");
    this.placeObstacles();

    this.boundPointerMoveHandler = this.onPointerMove.bind(this);

    document.addEventListener("pointermove", this.boundPointerMoveHandler);

    document.addEventListener("click", () => {
      this.clickObstacleHandler();
    });
    document.addEventListener(
      "keydown",
      this.handleObstacleListener.bind(this)
    );
  }

  handleObstacleListener(event) {
    switch (event.key) {
      case "c":
        this.newObstacle.rotation.y += Math.PI / 8;
        break;
    }
  }

  handleRestartListener(event) {
    switch (event.key) {
      case "r":
        this.restart()
        break;
    }
  }

  clickObstacleHandler() {
    switch (this.gameState.getCurrentState()) {
      case "chooseObstacle":
        if (this.selecting) {
          switch (this.pickedObject) {
            case "stop":
              this.newObstacle = this.parkingLotObstacles[0].clone();
              break;
            case "slow":
              this.newObstacle = this.parkingLotObstacles[1].clone();
              break;
            case "change":
              this.newObstacle = this.parkingLotObstacles[2].clone();
              break;
          }

          this.app.scene.add(this.newObstacle);
          this.obstacles.push(this.newObstacle);
          this.app.setActiveCamera("Place Object");
          this.pickedObject = null;
          this.gameState.setGameState("PLACE_OBSTACLE");
          document.getElementsByClassName("rotation")[0].style.display =
            "block";
        }

        break;
      case "placeObstacle":
        if (this.selecting) {
          this.pickedObject = null;
          this.gameState.setGameState("RUNNING");
          this.app.setActiveCamera("3rdPerson");
          this.newObstacle = null;
          document.removeEventListener(
            "pointermove",
            this.boundPointerMoveHandler
          );
          document.removeEventListener("click", this.clickObstacleHandler);
          document.removeEventListener(
            "keydown",
            this.handleObstacleListener.bind(this)
          );
          document.getElementsByClassName("rotation")[0].style.display = "none";
          this.resumeTimer();
          this.removeObstacles();
          this.initScreen();
          this.opponent.start();
        }
        break;
    }
  }

  placeObstacles() {
    this.stop = this.parkingLotObstacles[0];
    this.slow = this.parkingLotObstacles[1];
    this.change = this.parkingLotObstacles[2];
    this.stop.scale.set(0.12, 0.12, 0.12);
    this.stop.rotation.y = Math.PI / 2;
    this.slow.scale.set(0.12, 0.12, 0.12);
    this.slow.rotation.y = Math.PI / 2;
    this.change.scale.set(0.12, 0.12, 0.12);
    this.change.rotation.y = Math.PI / 2;

    this.stop.position.set(0, -20, 1.5);
    this.slow.position.set(0, -20, 0);
    this.change.position.set(0, -20, -1.7);

    let text = this.spriteSheet.createTextGroup("stop");
    text.position.set(0, -18.5, 1.4);
    text.rotateY((-2 * Math.PI) / 5);
    this.textSprites.push(text);

    text = this.spriteSheet.createTextGroup("slow");
    text.position.set(0, -18.5, -0.1);
    text.rotateY(-Math.PI / 2);
    this.textSprites.push(text);

    text = this.spriteSheet.createTextGroup("switch directions");
    text.scale.set(0.8, 0.8, 0.8);
    text.position.set(0, -18.5, -1.7);
    text.rotateY((-3 * Math.PI) / 5);
    this.textSprites.push(text);

    this.textSprites.forEach((sprite) => {
      this.app.scene.add(sprite);
    });

    //obs2.position.set(0, -19, 1.5);
    //obs2.scale.set(0.1, 0.1, 0.1);
    this.app.scene.add(this.stop);
    this.app.scene.add(this.slow);
    this.app.scene.add(this.change);

    //this.app.scene.add(obs2);
  }

  removeObstacles() {
    this.textSprites.forEach((sprite) => {
      this.app.scene.remove(sprite);
    });
    this.textSprites = [];
    this.app.scene.remove(this.parkingLotObstacles[0]);
    this.app.scene.remove(this.parkingLotObstacles[1]);
    this.app.scene.remove(this.parkingLotObstacles[2]);
  }

  placeCarsInParkingLot() {
    for (let i = 0; i < 3; i++) {
      const car = this.cars[i];
      car.position.set(2.6 - i * 1.6, 0.2 - 20, 2);
      car.rotation.y = -Math.PI / 2;
      car.scale.set(0.8, 0.8, 0.8);
      car.castShadow = true; // Enable shadows for this car
      const sprite = this.textSprites[i];
      sprite.position.set(2.6 - i * 1.6, 1 - 20, 1.5);
      sprite.rotation.y = -Math.PI / 6 - i * 0.3;
      this.app.scene.add(sprite);
      this.app.scene.add(car);
    }
    for (let i = this.cars.length - 1; i > 2; i--) {
      const car = this.cars[i];
      car.position.set(2.6 + (i - 4) * 1.6, 0.2 - 20, -2);
      car.rotation.y = Math.PI / 2;
      car.scale.set(0.8, 0.8, 0.8);
      car.castShadow = true; // Enable shadows for this car
      const sprite = this.textSprites[i];
      sprite.position.set(2.6 + (i - 4) * 1.6, 1 - 20, -1.5);
      sprite.rotation.y = Math.PI / 6 - (i - 4) * 0.3;
      this.app.scene.add(sprite);
      this.app.scene.add(car);
    }
  }

  buildParkingLot() {
    const textureLoader = new THREE.TextureLoader();

    const loader = new GLTFLoader(); // Instantiate GLTFLoader
    const startTime = performance.now(); // Get start time
    loader.load(
      "./textures/parking.glb", // Load the model and texture
      (gltf) => {
        var model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(-1.5, 0, 0);
        this.parking.add(model);
      },
      (xhr) => {
        const loadTime = performance.now() - startTime; // Calculate load time
        if ((xhr.loaded / xhr.total) * 100 == 100) {
          // console.log(`Model loaded in ${loadTime.toFixed(2)}ms`);
        }
      },
      (error) => {
        console.error("An error happened", error);
      }
    );
    this.parkingLotLoaded = true;

    // Add Walls
    const wallGeometry = new THREE.PlaneGeometry(9.75, 2);
    const wallGeometry2 = new THREE.PlaneGeometry(8.65, 2);
    // double sie
    const wallTexture = textureLoader.load("./textures/parking-wall.jpg");

    const wallMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#555555",
      emissive: "#000000",
      shininess: 30,
      side: THREE.DoubleSide,
      map: wallTexture,
    });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wall3 = new THREE.Mesh(wallGeometry2, wallMaterial);
    const wall4 = new THREE.Mesh(wallGeometry2, wallMaterial);
    wall1.position.set(0, 1, 4.3);
    wall2.position.set(0, 1, -4.3);
    wall3.position.set(4.85, 1, 0);
    wall3.rotation.y = Math.PI / 2;
    wall4.position.set(-4.8, 1, 0);
    wall4.rotation.y = Math.PI / 2;
    this.parking.add(wall1);
    this.parking.add(wall2);
    this.parking.add(wall3);
    this.parking.add(wall4);

    // Roof
    const roofGeometry = new THREE.PlaneGeometry(9.7, 8.6);

    const roofMaterial = new THREE.MeshPhongMaterial({
      map: wallTexture,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 2, 0);
    roof.rotation.x = Math.PI / 2;

    this.parking.add(roof);

    // add Lights
    let lights = [];
    for (let i = 0; i < 3; i++) {
      let light = new THREE.PointLight(0xffffff, 1, 0, 0.5);
      light.position.set(3.2 - i * 1.6, 1.99, 1.5);
      light.castShadow = true; // Enable shadows
      //light.target.position.set(3.2 - i*1.6, 0, 1.5);
      lights.push(light);
    }
    for (let i = 0; i < 3; i++) {
      let light = new THREE.PointLight(0xffffff, 1, 5, 1.5);
      light.position.set(3.2 - i * 1.6, 1.99, -1.5);
      light.castShadow = true; // Enable shadows
      //light.target.position.set(3.2 - i*1.6, 0, -1.5);
      lights.push(light);
    }

    lights.forEach((light) => {
      this.parking.add(light);
      const helper = new THREE.PointLightHelper(light, 0.1);
      //this.app.scene.add(helper);
    });

    this.parking.position.set(0, -20, 0);
    this.app.scene.add(this.parking);
  }

  initRunningState() {
    // console.log("init running");
    this.initCheckpoints();
    this.initPowerUps();
    this.initObstacles();
    this.initializeHud();
    this.initTrack();
    this.initOpponent();
    this.initBackground();
    this.placeCars();
    this.initBillboard();
    this.initMenuListener();
    this.initScreen();
  }

  initMenuListener() {
    document.addEventListener("keydown", this.handleMenuListener.bind(this));
  }

  removeMenuListener() {
    document.removeEventListener("keydown", this.handleMenuListener.bind(this));
  }

  handleMenuListener(event) {
    switch (event.key) {
      case "Escape":
        this.gameState.setGameState("PAUSE");
        this.initializeBasedOnGameState();
        break;
      case "Enter":
        if (this.gameState.getCurrentState() === "pause") {
          this.gameState.setGameState("RUNNING");
          this.app.setActiveCamera("3rdPerson");
          this.opponent.start();
          this.menu.clear();
          this.resumeTimer();
          this.initScreen();
        }
        break;
    }
  }

  addH3Element(text, id, textClass) {
    const buffs = document.querySelector("#buffs .container-row .text");

    const h3Element = document.createElement("h3");
    h3Element.setAttribute("id", id); // Set the ID
    h3Element.setAttribute("class", textClass); // Set the class
    const textNode = document.createTextNode(text);
    h3Element.appendChild(textNode);
    buffs.appendChild(h3Element);
  }

  changeH3Element(id, text) {
    const h3Element = document.getElementById(id);
    if (h3Element && text !== h3Element.innerHTML) h3Element.innerHTML = text;
  }

  removeH3Element(id) {
    const h3Element = document.getElementById(id);
    if (h3Element) h3Element.remove();
  }

  placeCars() {
    this.car.placeAtStart(this.track.startingPoint);
  }

  initOpponent() {
    let diff = this.menu.getSelectedDifficulty();
    if (!diff) diff = "easy";
    // console.log("difficulty", diff);
    this.opponent = new MyOpponent(this.oppCar, this.track, this.app, diff);
  }

  initializeBasedOnGameState() {
    switch (this.gameState.getCurrentState()) {
      case "initial":
        this.initInitialState();
        break;
      case "cars":
        this.initCarsState();
        break;
      case "running":
        this.initRunningState();
        break;
      case "pause":
        this.initPauseState();
        break;
      case "chooseObstacle":
        this.initChooseObstacleState();
        break;
      case "final":
        this.initFinalState();
        break;
      default:
        break;
    }
  }

  initPauseState() {
    // console.log("Pause");
    this.app.scene.add(this.menu.menu);
    this.menu.buildPauseMenu();
    this.app.setActiveCamera("Menu");
    this.opponent.pause();
    this.clearScreen();
    this.pauseTimer();
  }

  clearScreen() {
    document.getElementById("hud").style.display = "none";
    document.getElementsByClassName("card")[0].style.display = "none";
    document.getElementById("buffs").style.display = "none";
  }

  initScreen() {
    document.getElementById("hud").style.display = "block";
    document.getElementsByClassName("card")[0].style.display = "block";
    document.getElementById("buffs").style.display = "block";
  }

  initializeHud() {
    // console.log("Initializing HUD")
    document.getElementById("hud").style.display = "block";
    const card = document.getElementsByClassName("card")[0];
    card.style.display = "block";

    const rating = document.getElementsByClassName("rating")[0];
    const block = document.getElementsByClassName("block");
    for (let i = 0; i < 100; i++) {
      rating.innerHTML += '<div class="block"></div>';
      block[i].style.transform = "rotate(" + i * 3.6 + "deg)";
      block[i].style.animationDelay = `${i / 60}s`;
    }
  }

  setLapTimeHud(lapNumber) {
    let time = this.getTimer();
    const bestLap = document.getElementById("best-lap");
    if (lapNumber > 1) {
      time = time - this.car.lapTimes[lapNumber - 2];
    }
    if (this.bestLapTime === -1 || time < this.bestLapTime) {
      this.bestLapTime = time;
      bestLap.innerHTML = `${Math.floor(time / 1000 / 60)}:${Math.floor(
        (time / 1000) % 60
      )}:${time % 1000}`;
    }

    const lap = document.getElementById(`lap-${lapNumber}`);
    const minutes = Math.floor(time / 1000 / 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = time % 1000;
    lap.innerHTML = `${minutes}:${seconds}:${milliseconds}`;
    this.car.lapTimes.push(time);
  }

  updateHud() {
    const timer = document.getElementById("timer");

    let timeElapsed = this.getTimer();
    const totalSeconds = Math.floor(timeElapsed / 1000); // Convert to total seconds

    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the time into 'h:mm:ss' format
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    timer.innerHTML = formattedTime;

    const blocks = document.querySelectorAll(".rating .block");
    const counter = document.querySelector(".rating .counter");
    let normalizedVelocity = Math.abs(this.velocity / this.maxVelocity) * 100;
    // 2 decimal places
    normalizedVelocity = normalizedVelocity.toFixed(0);
    counter.innerHTML = normalizedVelocity;

    if (blocks) {
      blocks.forEach((block, index) => {
        let idx = index + 1;
        if (idx <= normalizedVelocity) {
          block.classList.add("color-red");
        } else {
          block.classList.remove("color-red");
        }
      });
    }
  }

  initRandomCars() {
    this.car = this.getMyVehicle(this.userCarName);
    this.oppCar = this.getMyVehicle(this.oppCarName);
  }

  getMyVehicle(carname) {
    let car = null;
    switch (carname) {
      case "audi":
        car = new MyVehicle("./textures/audi-car.obj", this.app, "audi");
        break;
      case "cybertruck":
        car = new MyVehicle(
          "./textures/cybertruck.glb",
          this.app,
          "cybertruck"
        );
        break;
      case "muscle":
        car = new MyVehicle("./textures/muscle-car.obj", this.app, "muscle");
        break;
      case "fire-truck":
        car = new MyVehicle(
          "./textures/fire-truck.glb",
          this.app,
          "fire-truck"
        );
        break;
      case "ferrari":
        car = new MyVehicle("./textures/ferrari.glb", this.app, "ferrari");
        break;
    }
    return car;
  }

  initCheckpoints() {
    this.checkpoints = []
    const checkpoint1 = new MyCheckpoint(new THREE.Vector3(-53, 0, -87.5), 0);
    checkpoint1.rotation.y = -0.2;
    const checkpoint2 = new MyCheckpoint(new THREE.Vector3(51.3, 0, -81), 1);
    checkpoint2.rotation.y = 2.1;
    const checkpoint3 = new MyCheckpoint(new THREE.Vector3(82.5, 0, -18), 2);
    checkpoint3.rotation.y = 0.5;
    const checkpoint4 = new MyCheckpoint(new THREE.Vector3(-34.5, 0, 87), 3);
    checkpoint4.rotation.y = 1.1;
    const checkpoint5 = new MyCheckpoint(new THREE.Vector3(-119.5, 0, 86.3), 4);
    checkpoint5.rotation.y = 0.2;
    const checkpoint6 = new MyCheckpoint(new THREE.Vector3(-94, 0, 27.5), 5);
    checkpoint6.rotation.y = -0.4;
    const checkpoint7 = new MyCheckpoint(new THREE.Vector3(-44, 0, -0.85), 6);
    checkpoint7.rotation.y = 1.55;

    this.checkpoints.push(checkpoint1);
    this.checkpoints.push(checkpoint2);
    this.checkpoints.push(checkpoint3);
    this.checkpoints.push(checkpoint4);
    this.checkpoints.push(checkpoint5);
    this.checkpoints.push(checkpoint6);
    this.checkpoints.push(checkpoint7);
    this.checkpoints.forEach((checkpoint) => {
      this.app.scene.add(checkpoint);
    });
  }

  initCars() {
    this.cars = [];
    // console.log("init cars");
    const carPaths = [
      "./textures/audi-car.obj",
      "./textures/cybertruck.glb",
      "./textures/muscle-car.obj",
      "./textures/fire-truck.glb",
      "./textures/ferrari.glb",
    ];

    const carNames = ["audi", "cybertruck", "muscle", "fire-truck", "ferrari"];
    let car = null;
    for (let i = 0; i < carPaths.length; i++) {
      car = new MyVehicle(carPaths[i], this.app, carNames[i]);
      this.cars.push(car);
    }
  }

  setActiveCar(carId) {
    this.app.scene.remove(this.car);
    this.carEnabled = true;
    this.car = this.cars[this.dict[carId]];
    this.activeCarName = carId;
    this.app.scene.add(this.car);
  }

  setOppActiveCar(carId) {
    if (this.oppCarName != this.activeCarName) {
      this.app.scene.remove(this.oppCar);
      // console.log("Creating opp car", carId);
      this.carOppEnabled = true;
      this.oppCar = this.cars[this.dict[carId]];

      this.oppCarName = carId;
      this.app.scene.add(this.oppCar);
    } else {
      this.oppCarName = carId;
      const carPaths = [
        "./textures/audi-car.obj",
        "./textures/cybertruck.glb",
        "./textures/muscle-car.obj",
        "./textures/fire-truck.glb",
        "./textures/ferrari.glb",
      ];
      switch (carId) {
        case "audi":
          this.oppCar = new MyVehicle(carPaths[0], this.app, "audi");
          break;
        case "cybertruck":
          this.oppCar = new MyVehicle(carPaths[1], this.app, "cybertruck");
          break;
        case "muscle":
          this.oppCar = new MyVehicle(
            carPaths[2],
            "/tp1/textures/muscle.jpg",
            this.app,
            "muscle"
          );
          break;
        case "fire-truck":
          this.oppCar = new MyVehicle(carPaths[3], this.app, "fire-truck");
          break;
        case "ferrari":
          this.oppCar = new MyVehicle(carPaths[4], this.app, "ferrari");
          break;
      }

      this.oppCarName = carId;
      this.app.scene.add(this.oppCar);
    }
  }

  initPowerUps() {
    this.powerUps = []
    // console.log("init powerups");

    const powerUp = new MyPowerUp(
      "speed",
      new THREE.Vector3(92, 1, -30),
      "shaders/powerup.vert",
      "shaders/powerup.frag"
    );
    this.powerUps.push(powerUp);

    const powerUp2 = new MyPowerUp(
      "speed",
      new THREE.Vector3(84, 1, -30),
      "shaders/powerup.vert",
      "shaders/powerup.frag"
    );
    this.powerUps.push(powerUp2);

    const powerUp3 = new MyPowerUp(
      "speed",
      new THREE.Vector3(-80, 1, 0),
      "shaders/powerup.vert",
      "shaders/powerup.frag"
    );
    this.powerUps.push(powerUp3);

    const powerUp4 = new MyPowerUp(
      "speed",
      new THREE.Vector3(-80, 1, 5),
      "shaders/powerup.vert",
      "shaders/powerup.frag"
    );
    this.powerUps.push(powerUp4);

    const powerUp5 = new MyPowerUp(
      "place",
      new THREE.Vector3(25, 1, -85),
      "shaders/powerup.vert",
      "shaders/powerup.frag"
    );
    this.powerUps.push(powerUp5);

    this.powerUps.forEach((element) => {
      this.app.scene.add(element.group);
    });
  }

  initObstacles() {
    this.obstacles = [];
    const obstacle = new MyObstacle(this.app, "stop");
    obstacle.rotation.y = -Math.PI / 2;

    this.parkingLotObstacles.push(obstacle.clone());

    obstacle.position.set(83, 0, -55);

    this.obstacles.push(obstacle);

    const obstacle2 = new MyObstacle(this.app, "slow");
    obstacle2.rotation.y = Math.PI / 4;

    this.parkingLotObstacles.push(obstacle2.clone());

    obstacle2.position.set(-110, 0, 99);
    this.obstacles.push(obstacle2);

    const obstacle3 = new MyObstacle(this.app, "change");
    obstacle3.rotation.y = -Math.PI / 2;

    obstacle3.position.set(-44, 0, -5.7);
    this.obstacles.push(obstacle3);

    this.parkingLotObstacles.push(obstacle3.clone());
    this.obstacles.forEach((element) => {
      this.app.scene.add(element);
    });
  }

  checkCollision(object1, object2) {
    const distance = object1.center.distanceTo(object2.center);
    const sumRadii = Math.abs(object2.radius) + 1 + Math.abs(object1.radius);
    return distance <= sumRadii;
  }

  checkCarCollision() {
    const carSphere = new THREE.Sphere(this.car.position /* radius */);
    this.powerUps.forEach((powerUp) => {
      const powerUpSphere = new THREE.Sphere(powerUp.position /* radius */);

      // Check for collision between car and power-up
      if (this.checkCollision(carSphere, powerUpSphere)) {
        this.car.powerUpCollision(powerUp);
      }
    });

    this.obstacles.forEach((obstacle) => {
      this.car.checkObstacleCollision(obstacle);
    });

    this.checkpoints.forEach((checkpoint) => {
      this.car.checkpointCollision(checkpoint);
    });
    this.car.checkCollisionWithOpponent(this.oppCar);
  }

  checkFinished() {
    // Check if either car or opponent car has this.finished = true
    if (
      this.car.finished ||
      this.getTimer() >
        this.opponent.animationMaxDuration * this.car.numberOfLaps * 1000
    ) {
      this.endTimer();
      if (this.car.finished) this.winner = 0;
      else this.winner = 1;
      this.gameState.setGameState("FINAL");
      this.initializeBasedOnGameState();
    }
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

  updateCarIfRequired() {
    if (this.carEnabled !== this.lastCarEnabled) {
      this.lastCarEnabled = this.carEnabled;
      if (this.carEnabled) {
        this.app.scene.add(this.car);
      } else {
        this.app.scene.remove(this.car);
      }
    }

    if (this.carOppEnabled !== this.lastCarOppEnabled) {
      this.lastCarOppEnabled = this.carOppEnabled;
      if (this.carOppEnabled) {
        this.app.scene.add(this.oppCar);
      } else {
        this.app.scene.remove(this.oppCar);
      }
    }
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {
    switch (this.gameState.getCurrentState()) {
      case "initial":
        this.updateInitial();
        break;
      case "cars":
        this.updateCars();
        break;
      case "running":
        this.updateRunning();
        break;
      case "pause":
        this.updatePause();
        break;
      case "chooseObstacle":
        this.updateChooseObstacle();
        break;
      case "final":
        this.updateFinal();
        break;
      default:
        break;
    }
  }

  updatePlaceObject() {}

  updateChooseObstacle() {}

  updateCars() {}

  updateInitial() {}

  updateRunning() {
    this.car.update();
    this.checkCarCollision();
    this.car.checkTrackCollision(this.track.group);
    this.opponent.update();

    this.updateHud();
    this.powerUps.forEach((powerUp) => {
      powerUp.update();
    });
    this.billboards.forEach((billboard) => {
      billboard.update();
    });
    this.checkFinished();
  }

  updateFinal() {
    if (this.fireworks === undefined) this.fireworks = [];

    // add new fireworks every 15% of the calls
    if (Math.random() < 0.3) {
      let pos =
        Math.random() < 0.5
          ? new THREE.Vector3(-5, -20, -2)
          : new THREE.Vector3(-5, -20, 2);
      this.fireworks.push(new MyFirework(this.app, pos));
      // console.log("firework added");
    }

    // for each fireworks
    for (let i = 0; i < this.fireworks.length; i++) {
      // is firework finished?
      if (this.fireworks[i].done) {
        // remove firework
        this.fireworks.splice(i, 1);
        // console.log("firework removed")
        continue;
      }
      // otherwise upsdate  firework
      this.fireworks[i].update();
    }
  }

  updatePause() {
    this.opponent.update();
  }

  // Picking
  onPointerMove(event) {
    //of the screen is the origin
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

    //2. set the picking ray from the camera position and mouse coordinates
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

    this.raycaster.far = 1000;

    //3. compute intersections
    let objects = [];
    if (this.gameState.getCurrentState() === "initial") {
      switch (this.menu.scene) {
        case 0:
          for (let i = 0; i < this.menu.difficulties.length; i++) {
            objects.push(this.menu.difficulties[i]);
          }
          objects.push(this.menu.startText);
          break;
        case 1:
          break;
        case 2:
          objects.push(this.menu.chooseCars);
          objects.push(this.menu.randomCars);
      }
    } else if (this.gameState.getCurrentState() === "cars") {
      for (let i = 0; i < this.cars.length; i++) {
        objects.push(this.cars[i]);
      }
    } else if (this.gameState.getCurrentState() === "chooseObstacle") {
      for (let i = 0; i < this.parkingLotObstacles.length; i++) {
        objects.push(this.parkingLotObstacles[i]);
      }
    } else if (this.gameState.getCurrentState() === "placeObstacle") {
      objects.push(this.track.group);
    }
    var intersects = this.raycaster.intersectObjects(objects, true);

    this.pickingHelper(intersects);

    this.transverseRaycastProperties(intersects);
  }

  transverseRaycastProperties(intersects) {
    if (intersects.length === 0) this.selecting = false;
    else this.selecting = true;
    for (var i = 0; i < intersects.length; i++) {
      const type = this.checkParent(intersects[i].object).type;

      if (this.pickedObject != type) {
        this.pickedObject = type;
      }

      /*
        An intersection has the following properties :
            - object : intersected object (THREE.Mesh)
            - distance : distance from camera to intersection (number)
            - face : intersected face (THREE.Face3)
            - faceIndex : intersected face index (number)
            - point : intersection point (THREE.Vector3)
            - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
    }
  }

  checkParent(intersect) {
    let i = 0;
    while (true) {
      try {
        i++;

        if (
          intersect.name === "car" ||
          intersect.name === "dif" ||
          intersect.name === "start" ||
          intersect.name === "powerup" ||
          intersect.name === "track"
        ) {
          break;
        } else {
          intersect = intersect.parent;
        }
      } catch (e) {
        intersect = intersect.parent;
      }
    }

    return intersect;
  }

  restoreColorOfFirstPickedObj() {
    switch (this.gameState.getCurrentState()) {
      case "cars":
        //this.lastPickedObj.restoreOriginalColors();
        if (this.lastPickedObj != null) {
          try {
            this.lastPickedObj.restoreOriginalColors();
            this.lastPickedObj = null;
          } catch (e) {
            console.error("error", this.lastPickedObj);
          }
        }

        break;
      case "initial":
        this.menu.recolorText();
        break;
      case "chooseObstacle":
        //this.lastPickedObj.restoreOriginalColors();
        if (this.lastPickedObj != null) {
          try {
            this.lastPickedObj.restoreOriginalColors();
            this.lastPickedObj = null;
          } catch (e) {
            console.log("error", this.lastPickedObj);
          }
        }

        break;
    }
  }

  changeColorOfFirstPickedObj(obj) {
    const car = this.checkParent(obj);

    if (obj != this.lastPickedObj) {
      this.lastPickedObj = car;

      if (this.lastObj === null) {
        // console.log("first time picking", car.type);
        this.lastObj = car;
      }

      this.cars.forEach((car) => {
        if (car != this.lastPickedObj) car.restoreOriginalColors();
      });
      this.colorObject(this.lastPickedObj, this.pickingColor);
    } else {
      this.lastPickedObj = car;
    }
  }

  changeColor(obj) {
    const object = this.checkParent(obj);

    if (obj != this.lastPickedObj) {
      this.lastPickedObj = object;
      if (this.lastObj === null) {
        this.menu.changeDifficulty(object.type);
        this.lastObj = obj;
        this.colorObject(this.lastPickedObj, this.pickingColor);
      }
    } else {
      this.lastPickedObj = object;
    }
  }

  colorObject(object, color) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone the material before altering its color
        child.material = child.material.clone();
        // Set the color of the cloned material
        child.material.color.set(color);
      }
    });
  }

  pickingHelper(intersects) {
    if (this.gameState.getCurrentState() === "initial") {
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (this.notPickableObjIds.includes(obj.name)) {
          this.menu.recolorText();
          this.lastObj = null;
          console.error("Object cannot be picked !");
        } else this.changeColor(obj);
      } else {
        this.menu.recolorText();
        this.lastObj = null;
        this.pickedObject = null;
      }
    } else if (this.gameState.getCurrentState() === "cars") {
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (this.notPickableObjIds.includes(obj.name)) {
          this.restoreColorOfFirstPickedObj();
          console.error("Object cannot be picked !");
        } else this.changeColorOfFirstPickedObj(obj);
      } else {
        this.restoreColorOfFirstPickedObj();
      }
    } else if (this.gameState.getCurrentState() === "chooseObstacle") {
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (this.notPickableObjIds.includes(obj.name)) {
          this.restoreColorOfFirstPickedObj();
          console.error("Object cannot be picked !");
        } else this.changeColorOfFirstPickedObj(obj);
      } else {
        this.restoreColorOfFirstPickedObj();
      }
    } else if (this.gameState.getCurrentState() === "placeObstacle") {
      if (intersects.length > 0) {
        this.newObstacle.position.set(
          intersects[0].point.x,
          -0.2,
          intersects[0].point.z
        );
        this.newObstacle.scale.set(0.6, 0.6, 0.6);
      }
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  /**
   * Creates the skybox and adds it to the scene
   * @param {*} skybox Skybox data
   * @returns
   */
  createSkybox(right, left, up, down, front, back) {
    const textureLoader = new THREE.TextureLoader();
    const materials = [];

    // Define the order of the textures for the cube
    const texturePaths = [right, left, up, down, front, back];

    for (const path of texturePaths) {
      const texture = textureLoader.load(path);

      const material = new THREE.MeshPhongMaterial({
        emissive: "#333333",
        color: "#ffffff",
        side: THREE.BackSide,
        map: texture,
        emissiveIntensity: 1.0,
      });

      materials.push(material);
    }

    const geometry = new THREE.BoxGeometry(300, 270, 300);

    const skyboxMesh = new THREE.Mesh(geometry, materials);

    skyboxMesh.position.set(0, 5, 0);

    this.app.scene.add(skyboxMesh);
  }
}

export { MyContents };
