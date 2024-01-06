import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MyObject } from "../MyObject.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class MyVehicle extends MyObject {
  position = null
  velocity = null
  angle = null
  speed = null
  acceleration = null
  deceleration = null
  maxSpeed = null
  steeringAngle = null
  steeringIncrement = null
  steeringClamp = null
  app = null
  type = null


  constructor(model, app, type) {
    super("car");

    this.app = app;
    this.model = model;
    this.type = type;
    this.position = new THREE.Vector3(0, 0, 0);
    this.angle = 0;
    this.speed = 0;
    this.acceleration = 0.002;
    this.deceleration = 0.001;
    this.maxSpeed = .15;
    this.carMaxSpeed = .30;
    this.steeringAngle = 0;
    this.steeringIncrement = 0;
    this.steeringMaxIncrement = 0.1;
    this.steeringClamp = 0.4; // Maximum steering angle
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.wheels = [];
    this.inTrack = true;
    this.checkpoint = 0;
    this.lap = 1;
    this.speetPowerUp = false
    this.powerUpsDuration = 5; // Duration of the speed power-up in seconds
    this.obstacleDuration = 5; // Duration of the speed obstacle in seconds
    this.speedPowerUpStartTime = 0;
    this.numberOfLaps = 3;
    this.rear_axle = null;
    this.lapTimes = [];
    this.started = false;
    this.finished = false;
    this.speedObstacleStartTime = 0;
    this.stopObstacleStartTime = 0;
    this.slowObstacleStartTime = 0;
    this.changeObstacleStartTime = 0;
    this.carCollision = false;


    const startTime = performance.now(); // Start time before loading the model
 

    const loader = new GLTFLoader(); // Instantiate GLTFLoader
    // if model ends with glb or obj
    if (this.checkFileType(this.model) === 'glb') {
      loader.load(
        this.model, // Load the model and texture
        (gltf) => {

          var model = gltf.scene

          const boundingBox = new THREE.Box3().setFromObject(model);


          // Get dimensions (width, height, depth)
          this.width = boundingBox.max.x - boundingBox.min.x;
          this.height = boundingBox.max.y - boundingBox.min.y;
          this.depth = boundingBox.max.z - boundingBox.min.z;
  
          this.createBoundingBox();

          //model.scale.set(0.01,0.01,0.01)
          if (this.type === "fire-truck") {
            model.rotation.y = Math.PI / 2;
            model.scale.set(1.4, 1.4, 1.4)
            // Remove wheels
            model.children[0].children[0].visible = false;
            model.children[0].children[3].visible = false;
          }
          else if (this.type === "ferrari") {
            model.rotation.y = -Math.PI / 2;
            model.position.set(0, -0.2, 0)
          }
          else if (this.type === "cybertruck") {
            model.rotation.y = -Math.PI / 2;
            model.scale.set(0.8, 0.8, 0.8)
            model.position.set(-0.2, -0.2, 0)
          }

          cloneMaterialsRecursive(model);
          this.group.add(model);
        },
        (xhr) => {
          const loadTime = performance.now() - startTime; // Calculate load time
          if ((xhr.loaded / xhr.total) * 100 == 100) {
            // console.log(this.type, ` :Vehicle loaded in ${loadTime.toFixed(2)} milliseconds`);
          }
        },
        (error) => {
          console.error('An error happened', error);
        }
      );
    }
    else if (this.checkFileType(this.model) === 'obj') {

      new OBJLoader().load(
        this.model,
        (object) => {
          // if doesnt have child
          const boundingBox = new THREE.Box3().setFromObject(object);

          // Get dimensions (width, height, depth)
          this.width = boundingBox.max.x - boundingBox.min.x;
          this.height = boundingBox.max.y - boundingBox.min.y;
          this.depth = boundingBox.max.z - boundingBox.min.z;
          this.createBoundingBox();


          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {


              if (child.name === "Object_Vehicle_Exterior_mm_badges") {
                child.material = new THREE.MeshPhongMaterial({
                  color: 0x000000,
                });

              } else if (child.name === "Object_Vehicle_Exterior_mm_lights") {
                child.material = new THREE.MeshPhongMaterial({
                  color: 0xffffff,
                });

              } else if (child.name === "Object_Vehicle_Exterior_mm_windows") {
                // WINDOW MATERIAL
                child.material = new THREE.MeshPhysicalMaterial({
                  roughness: 0,
                  transmission: 1,
                  opacity: 0.3,
                  transparent: true,

                });

              }
              else if (child.name === "Object_indicator_lights") {
                child.material = new THREE.MeshPhongMaterial({
                  color: 0xffffff,
                });

              }
              else {
                // black
                child.material = new THREE.MeshPhongMaterial({
                  color: 0x000000,
                });

              }
              /*child.originalMaterial = child.material.clone();
              child.geometry.computeBoundsTree();
              let helper = new MeshBVHVisualizer(child, 0xffff00);
              helper.visible = true;
              helper.update();
              this.group.add(helper);*/
            }
            cloneMaterialsRecursive(object);
            this.group.add(object);
          });
        },
        (xhr) => {

          const loadTime = performance.now() - startTime; // Calculate load time
          if ((xhr.loaded / xhr.total) * 100 == 100) {
            // console.log(this.type, ` :Vehicle loaded in ${loadTime.toFixed(2)} milliseconds`);
          }
        },
        (error) => {
          console.error('An error happened', error);
        }
      );
    }
    this.scale.set(2, 2, 2)

    for (let i = 0; i < 4; i++) {
      let wheel = new THREE.Object3D();
      new OBJLoader().load(
        "./textures/wheel.obj",
        (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {

              if (child.name == "object_1") {
                // Red
                child.material.color.setHex(0xffffff);
              }
              if (child.name == "object_0") {
                // Black
                child.material.color.setHex(0x000000);
              }
              child.originalMaterial = child.material.clone();
            }
          });

          wheel.add(object);
        },
        (progress) => {
        },
        (error) => {
          console.error('An error happened', error);
        }
      );
      this.wheels.push(wheel)

    }
    this.wheels.forEach((wheel) => {
      wheel.scale.set(0.005, 0.005, 0.008)

      this.group.add(wheel);
    });
    if (this.type === "fire-truck") {
      this.wheels[0].scale.set(0.005, 0.005, 0.02)
      this.wheels[0].position.set(.97, -0.3, 0.4)
      this.wheels[1].scale.set(0.005, 0.005, 0.02)
      this.wheels[1].position.set(.97, -0.3, -0.4)
      this.wheels[2].scale.set(0.005, 0.005, 0.02)
      this.wheels[2].position.set(-.9, -0.3, 0.4)
      this.wheels[3].scale.set(0.005, 0.005, 0.02)
      this.wheels[3].position.set(-.9, -0.3, -0.4)
    }
    else if (this.type === "cybertruck") {
      this.wheels[0].position.set(0.6, -0.3, 0.42)
      this.wheels[1].position.set(.6, -0.3, -0.42)
      this.wheels[2].position.set(-.9, -0.3, 0.42)
      this.wheels[3].position.set(-.9, -0.3, -0.42)
    }
    else {
      this.wheels[0].position.set(.75, -0.3, 0.5)
      this.wheels[1].position.set(.75, -0.3, -0.5)
      this.wheels[2].position.set(-.75, -0.3, 0.5)
      this.wheels[3].position.set(-.75, -0.3, -0.5)

    }

    const rearAxleCenter = new THREE.Vector3(
      (this.wheels[2].position.x + this.wheels[3].position.x) / 2,
      (this.wheels[2].position.y + this.wheels[3].position.y) / 2,
      (this.wheels[2].position.z + this.wheels[3].position.z) / 2
    );

    // Create a new pivot at the calculated rear axle center
    this.pivot = new THREE.Group();
    this.pivot.position.copy(rearAxleCenter);

    // Reposition the main body of the car relative to the new pivot

    this.remove(this.group); // Remove the existing model from the scene
    this.group.position.set(0, .5, 0); // Adjust as needed based on the actual model's center
    this.pivot.add(this.group); // Add the model to the pivot


    // Set the pivot as the main object for the MyVehicle class
    this.add(this.pivot);


    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    // Keyboard event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  createBoundingBox() {
    const boxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const boundingBoxHelper = new THREE.Mesh(boxGeometry, boxMaterial);

    boundingBoxHelper.position.set(-0.8, this.height / 2 - 0.1, 0);
    if (this.type === "fire-truck" || this.type === "ferrari" || this.type === "cybertruck") boundingBoxHelper.rotation.y = Math.PI / 2;
    if (this.type === "cybertruck") {
      boundingBoxHelper.scale.set(0.8, 0.8, 0.8)
      //boundingBoxHelper.position.set(0, 0, 0)
      boundingBoxHelper.position.y = 0.20
    }
    this.boundingBox = new THREE.Box3().setFromObject(boundingBoxHelper);


    return boundingBoxHelper; // Return the created bounding box helper if needed
  }



  update() {
    if (this.up && !this.down) {
      this.speed += this.acceleration;
    }
    else if (this.down && !this.up) {
      this.speed -= this.acceleration;
    }
    else {
      if (this.speed > 0) {
        this.speed -= this.deceleration * 0.5;
      }
      else if (this.speed < 0) {
        this.speed += this.deceleration * 0.5;
      }
      if (this.speed < 0.01 && this.speed > -0.01) {
        this.speed = 0;
      }
    }
    if (this.left && !this.right) {
      if(this.changeObstacleActive){
        this.steeringIncrement -= 0.0004 * (1 / Math.abs(this.speed));
      }
      else{
        this.steeringIncrement += 0.0004 * (1 / Math.abs(this.speed));
      }

      if (this.steeringIncrement > this.steeringMaxIncrement) {
        this.steeringIncrement = this.steeringMaxIncrement;
      }
      else if (this.steeringIncrement < -this.steeringMaxIncrement) {
        this.steeringIncrement = -this.steeringMaxIncrement;
      }
    }
    else if (this.right && !this.left) {
      if(this.changeObstacleActive){
        this.steeringIncrement += 0.0004 * (1 / Math.abs(this.speed));
      }
      else{
        this.steeringIncrement -= 0.0004 * (1 / Math.abs(this.speed));
      }
      if (this.steeringIncrement < -this.steeringMaxIncrement) {
        this.steeringIncrement = -this.steeringMaxIncrement;
      }
      else if (this.steeringIncrement > this.steeringMaxIncrement) {
        this.steeringIncrement = this.steeringMaxIncrement;
      }
    }
    else {
      if (this.steeringIncrement > 0) {
        this.steeringIncrement -= 0.003;
      }
      else if (this.steeringIncrement < 0) {
        this.steeringIncrement += 0.003;
      }
      if (this.steeringIncrement < 0.01 && this.steeringIncrement > -0.01) {
        this.steeringIncrement = 0;
      }
    }

    this.steeringAngle = this.speed != 0 ? this.steeringIncrement * 1 : 0;

    // Update car's position based on speed and angle
    
    this.position.z += this.speed * -(Math.sin(this.angle));
    this.position.x += this.speed * (Math.cos(this.angle));
  
    // Update car's angle based on steering
    if (Math.abs(this.speed) > 0) {
      if ( this.speed > 0 )
        this.angle += 0.3 * this.steeringAngle;
      else 
        this.angle -= 0.3 * this.steeringAngle;
      this.angle = this.angle % (2 * Math.PI);
    }


    // Limit speed
    if (Math.abs(this.speed) > this.maxSpeed) {
      this.speed = this.maxSpeed * Math.sign(this.speed);
    }
    //console.log("Position:", this.position, "Angle:", this.angle, "Speed:", this.speed, "Steering Angle:", this.steeringAngle)
    //console.log("Up:", this.up, "Down:", this.down, "Left:", this.left, "Right:", this.right)
    this.position.set(this.position.x, this.position.y, this.position.z);


    this.rotation.y = this.angle - Math.PI;



    const cameraOffset = new THREE.Vector3(0, 5, 10); // Adjust the values as needed

    // Calculate camera position based on car's angle and position

    const maxCameraAngle = Math.PI / 3;
    const relativeCameraOffset = cameraOffset.applyMatrix4(
      new THREE.Matrix4().makeRotationY(this.angle - Math.PI / 2 + this.steeringAngle * maxCameraAngle)
    );

    const cameraPosition = new THREE.Vector3().addVectors(
      this.position,
      relativeCameraOffset
    );
    if (this.app.activeCameraName == "3rdPerson") {
      this.app.activeCamera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      this.app.controls.target.set(this.position.x, this.position.y, this.position.z);
    }

    this.app.contents.velocity = Math.round(this.speed * 100);
    this.app.contents.maxVelocity = Math.round(this.carMaxSpeed * 100);
    const wheelRotationSpeed = this.speed * 2; // Adjust the multiplier as needed

    // Rotate the wheels based on the speed
    this.wheels.forEach((wheel, index) => {

      wheel.rotation.z += wheelRotationSpeed;

      if (index > 1) {
        // Apply steering rotation to the third and fourth wheels
        const maxSteeringAngle = Math.PI / 6;
        const steeringRotation = this.steeringIncrement * maxSteeringAngle * 10;
        wheel.rotation.y = steeringRotation;
      }
    });

    this.checkPowerUpTimer();
    this.checkObstacleTimer();
  }

  rotateWheels(angle, duration) {
    // duration is 40
    const wheelRotationSpeed = 50 / duration  * this.maxSpeed;
    const wheelRotationAngle = angle / 1 * 0.1
    this.wheels.forEach((wheel, index) => {

      wheel.rotation.z += wheelRotationSpeed;

      if (index > 1) {
        // Apply steering rotation to the third and fourth wheels
        const maxSteeringAngle = Math.PI / 6;
        const steeringRotation = wheelRotationAngle * maxSteeringAngle * 10;
 
        wheel.rotation.y = steeringRotation * 3;
      }
    });
  }

  placeAtStart(start) {

    this.position.copy(start);
    this.angle = 1.8;
  }
  checkCollisionWithOpponent(opponent) {
    const carSphere = new THREE.Sphere(this.position);
    const opponentSphere = new THREE.Sphere(opponent.position);
    const distance = carSphere.center.distanceTo(opponentSphere.center);
    // console.log(distance, Math.abs(carSphere.radius + opponentSphere.radius));
    if (distance < Math.abs(carSphere.radius + opponentSphere.radius) + 0.5 && !this.carCollision) {
      this.maxSpeed /= 3;
      this.carCollision = true;	
      // console.log("Car collision");
    }
    else if(distance > Math.abs(carSphere.radius + opponentSphere.radius) + 0.5 && this.carCollision){
      this.maxSpeed *= 3;
      this.carCollision = false;
      // console.log("Car collision ended");
    }

  }
  


  checkPowerUpTimer() {
    if (this.speedPowerUpActive) {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - this.speedPowerUpStartTime) / 1000; // Convert to seconds
      this.app.contents.changeH3Element("pu1", "Speed boost for " + (this.powerUpsDuration - elapsedTime).toFixed(1) + " seconds");
      // Check if the duration has passed
      if (elapsedTime >= this.powerUpsDuration) {
        this.maxSpeed /= 2; // Restore original speed
        this.speedPowerUpActive = false;
        // console.log("Speed power-up expired");
        this.app.contents.removeH3Element("pu1");
      }
    }
  }

  checkObstacleTimer() {

    if(this.stopObstacleActive){
      const currentTime = performance.now();
      const elapsedTime = (currentTime - this.stopObstacleStartTime) / 1000; // Convert to seconds
      if(elapsedTime >= this.obstacleDuration){
        this.stopObstacleActive = false;
       
      }
    }
    if(this.slowObstacleActive){
      const currentTime = performance.now();
      const elapsedTime = (currentTime - this.slowObstacleStartTime) / 1000; // Convert to seconds
      this.app.contents.changeH3Element("obs2", "Slowed down for " + (this.obstacleDuration - elapsedTime).toFixed(1) + " seconds");

      if(elapsedTime >= this.obstacleDuration){
        this.maxSpeed *= 2;
        this.slowObstacleActive = false;
        // console.log("Slow obstacle expired");
        this.app.contents.removeH3Element("obs2");
      }
    }
    if(this.changeObstacleActive){
      const currentTime = performance.now();
      const elapsedTime = (currentTime - this.changeObstacleStartTime) / 1000; // Convert to seconds
      this.app.contents.changeH3Element("obs3", "Switched Car directions for " + (this.obstacleDuration - elapsedTime).toFixed(1) + " seconds");

      if(elapsedTime >= this.obstacleDuration){
        this.changeObstacleActive = false;
        // console.log("Change obstacle expired");
        this.app.contents.removeH3Element("obs3");
      }    
    }
  }



  checkTrackCollision(track) {
    const carPosition = this.position.clone();
    const raycaster = new THREE.Raycaster();
    const rayDirection = new THREE.Vector3(
      0,
      -1,
      0
    ); // Cast a ray downwards
    raycaster.set(carPosition, rayDirection);

    const intersects = raycaster.intersectObject(track, true); // Check for intersections
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const distance = intersection.distance; // Distance to the intersection point
   
  

      if (!this.inTrack) {
        this.maxSpeed *= 2;
        this.inTrack = true;
        this.app.contents.removeH3Element("out-of-track");
      }

      return true;
      
    }
    if (this.inTrack) {
      this.maxSpeed /= 2;
      this.inTrack = false;
      this.app.contents.addH3Element("Out of track", "out-of-track", "out-of-track");
      // console.log("Out of track");
    }
    else return false;
  }

  powerUpCollision(powerUp) {
    
    if (powerUp.type === "speed" && !this.speedPowerUpActive) {
      this.maxSpeed *= 2;
      // console.log("Speed power-up collected");
      const text = "Speed boost for " + this.powerUpsDuration + " seconds";
      this.app.contents.addH3Element(text,  "pu1","pu");
      this.speedPowerUpActive = true;
      this.speedPowerUpStartTime = performance.now();
    }
    else if(powerUp.type === "place"){
      // Change to parking lot camera
      this.app.contents.changeToChooseObstacle()
      this.app.scene.remove(powerUp)
      // remove from powerups
      const index = this.app.contents.powerUps.indexOf(powerUp);
      this.app.contents.powerUps.splice(index, 1);
    }
  }

  checkObstacleCollision(obstacle) {
    if (this.checkCollision(obstacle, this.pivot, -1)) {
      this.handleObstacleCollision(obstacle);
      return true;
    }
    return false;
  }

  checkCollision(object1, object2, margin = 0) {
    // Calculate bounding box for object 1
    const box1 = new THREE.Box3().setFromObject(object1);
    const min1 = box1.min;
    const max1 = box1.max;

    // Calculate bounding box for object 2 with added margin
    const box2 = new THREE.Box3().setFromObject(object2);
    const min2 = box2.min.clone().subScalar(margin);
    const max2 = box2.max.clone().addScalar(margin);

    // Check for overlap on all axes (x, y, z)
    const collisionX = max1.x >= min2.x && min1.x <= max2.x;
    const collisionY = max1.y >= min2.y && min1.y <= max2.y;
    const collisionZ = max1.z >= min2.z && min1.z <= max2.z;

    // If there's overlap on all axes, collision detected
    return collisionX && collisionY && collisionZ;
  }

  checkpointCollision(checkpoint) {
    const checkpointBoundingBox = new THREE.Box3().setFromObject(checkpoint);
    const carBoundingBox = new THREE.Box3().setFromObject(this.pivot);
    if (carBoundingBox.intersectsBox(checkpointBoundingBox)) {
      if (checkpoint.number != this.checkpoint) {
        this.handleCheckpointCollision(checkpoint);

      }
      return true;
    }
    return false;
  }

  handleCheckpointCollision(checkpoint) {
    if (checkpoint.number === 0 && this.checkpoint === this.app.contents.checkpoints.length - 1) {
      this.app.contents.checkpoints.forEach((checkpoint) => {
        checkpoint.visible = true;
      }
      )
      this.checkpoint = 0;
      this.app.contents.setLapTimeHud(this.lap);
      this.lap++;

      // console.log("Lap: ", this.lap);
      if (this.lap > this.numberOfLaps) {
          this.finished = true;
      }
    }
    else if (checkpoint.number === this.checkpoint + 1) {
      this.checkpoint = checkpoint.number;
      // console.log("Lap", this.lap, "Checkpoint: ", checkpoint.number);
      checkpoint.visible = false;
    }


  }


  handleObstacleCollision(obstacle) {

    if(obstacle.type === "stop" && !this.stopObstacleActive){
      this.speed = -0.02;
      this.stopObstacleActive = true;
      this.stopObstacleStartTime = performance.now();

    }
    else if(obstacle.type === "slow" && !this.slowObstacleActive){
      const text = "Slowed down for " + this.obstacleDuration + " seconds";
      this.app.contents.addH3Element(text,  "obs2","obs");
      this.maxSpeed /= 2;
      this.slowObstacleActive = true;
      this.slowObstacleStartTime = performance.now();

    }
    else if(obstacle.type === "change" && !this.changeObstacleActive){
      const text = "Switched Car directions for " + this.obstacleDuration + " seconds";
      this.app.contents.addH3Element(text,  "obs3","obs");
      this.changeObstacleActive = true;
      this.changeObstacleStartTime = performance.now();

    }

  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        if (!this.started) {
          this.app.contents.startTimer();
          this.started = true;
          this.app.contents.opponent.start();
          // console.log("Started");
        }
        this.up = true;
        break;
      case 'KeyS':
        this.down = true;
        break;
      case 'KeyA':
        this.left = true;
        break;
      case 'KeyD':
        this.right = true;
        break;
      default:
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
        this.up = false;
        break;
      case 'KeyS':
        this.down = false;
        break;
      case 'KeyA':
        this.left = false;
        break;
      case 'KeyD':
        this.right = false;
        break;
      default:
        break;
    }
  }
  updateTimers(time){
 
    if(this.speedObstacleStartTime != 0){
      this.speedObstacleStartTime += time;

    }
    if(this.speedPowerUpStartTime != 0){
      this.speedPowerUpStartTime += time;

    }
    if(this.stopObstacleStartTime != 0){
      this.stopObstacleStartTime += time;

    }
    if(this.slowObstacleStartTime != 0){
      this.slowObstacleStartTime += time;

    }
    if(this.changeObstacleStartTime != 0){
      this.changeObstacleStartTime += time;

    }


  }

  checkFileType(model) {
    const extension = model.toLowerCase().split('.').pop(); // Extract the file extension

    switch (extension) {
      case 'glb':
        return 'glb'; // GLB file
      case 'obj':
        return 'obj'; // OBJ file
      // Add more cases for other file types if needed
      default:
        return 'unknown'; // Unknown file type
    }
  }
  restoreOriginalColors() {
    this.traverse((child) => {
      if (child instanceof THREE.Mesh && child.originalMaterial) {
        child.material = child.originalMaterial; // Restore the original material
      }
    });
  }

  getLapTime(lapNumber) {
    if (lapNumber <= this.lapTimes.length) return this.lapTimes[lapNumber - 1];
    else return null;
  }

  deconstructor() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

}

function cloneMaterialsRecursive(object) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.originalMaterial = child.material.clone();
    }
  });

  // Recursively check children's children
  object.children.forEach((child) => {
    cloneMaterialsRecursive(child);
  });
}

export { MyVehicle };
