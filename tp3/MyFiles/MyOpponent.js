import * as THREE from "three";

class MyOpponent {
  constructor(car, track, app, difficulty) {
    this.car = car;
    this.track = track;
    this.app = app;
    this.clock = new THREE.Clock();

    this.mixerTime = 0;
    this.mixerPause = true;
    this.difficultyTimes = { easy: 50, medium: 40, hard: 30 };
    this.enableAnimationPosition = true;
    this.animationMaxDuration = this.difficultyTimes[difficulty];
    this.difficulty = difficulty;

    // Assuming you have an array of positions from the track path
    const positions = this.track.path.getSpacedPoints(300); // Assuming you have an array of positions from the track path

    // Creating keyframes for position
    const times = []; // Array to hold the times for each keyframe
    const values = []; // Array to hold the position values for each keyframe

    //visual debuging the path and the controls points
    // this.debugKeyFrames(positions);

    positions.forEach((position, index) => {
      const time = (index * this.animationMaxDuration) / positions.length; // Assuming the animation should last 5 seconds
      times.push(time); // Storing time values for each keyframe
      values.push(position.x, position.y + 0.3, position.z); // Storing x, y, z values of the position
    });

    const positionKF = new THREE.VectorKeyframeTrack(
      ".position", // Property to animate - Assuming you're animating the object's position
      times, // Time values for each keyframe
      values,
      THREE.InterpolateSmooth // Interpolation method
    );
    const yAxis = new THREE.Vector3(0, 1, 0);
    let q = [];

    for (let i = 0; i < positions.length; i++) {
      const value = positions[i];

      //if (index === positions.length - 1) return
      let angle = 0;
      if (i === positions.length - 1) {
        angle = -Math.PI / 2;
      } else {
        const position = new THREE.Vector3(value.x, value.y, value.z);
        const nextPosition = new THREE.Vector3(
          positions[i + 1].x,
          positions[i + 1].y,
          positions[i + 1].z
        );
        const direction = new THREE.Vector3()
          .subVectors(nextPosition, position)
          .normalize();
        angle = Math.atan2(direction.x, direction.z);
        angle += Math.PI / 2;
      }

      const quaternion = new THREE.Quaternion().setFromAxisAngle(yAxis, angle);
      q.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }

    let quaternionKF = new THREE.QuaternionKeyframeTrack(
      ".quaternion", // Property to animate - Assuming you're animating the object's position
      times, // Time values for each keyframe
      q,
      THREE.InterpolateSmooth // Interpolation method
    );

    const positionClip = new THREE.AnimationClip(
      "positionAnimation",
      this.animationMaxDuration,
      [positionKF]
    );
    const rotationClip = new THREE.AnimationClip(
      "rotationAnimation",
      this.animationMaxDuration,
      [quaternionKF]
    );

    this.mixer = new THREE.AnimationMixer(this.car);

    this.positionAction = this.mixer.clipAction(positionClip);
    this.rotationAction = this.mixer.clipAction(rotationClip);

    this.positionAction.play();
    this.rotationAction.play();
  }

  debugKeyFrames(positions) {
    for (let i = 0; i < positions.length; i++) {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.scale.set(0.2, 0.2, 0.2);
      sphere.position.set(...positions[i].toArray());

      this.app.scene.add(sphere);
    }
  }

  checkAnimationStateIsPause() {
    if (this.mixerPause) this.mixer.timeScale = 0;
    else this.mixer.timeScale = 1;
  }

  checkTracksEnabled() {
    const actions = this.mixer._actions;
    for (let i = 0; i < actions.length; i++) {
      const track = actions[i]._clip.tracks[0];

      if (
        track.name === ".position" &&
        this.enableAnimationPosition === false
      ) {
        actions[i].stop();
      } else {
        if (!actions[i].isRunning()) actions[i].play();
      }
    }
  }

  start() {
    this.mixerPause = false;
  }

  pause() {
    this.mixerPause = true;
  }

  getCurrentAndNextPosition() {
    const time = this.mixer.time;
    const positionAttribute = this.positionAction.getClip().tracks[0].values;

    const duration = this.animationMaxDuration;
    const numberOfKeyframes = positionAttribute.length / 3; // Assuming x, y, z for each keyframe

    const currentKeyframe = Math.floor((time / duration) * numberOfKeyframes);
    const nextKeyframe = (currentKeyframe + 1) % numberOfKeyframes;
    const previousKeyframe = (currentKeyframe - 1) % numberOfKeyframes;

    const currentPosition = new THREE.Vector3().fromArray(
      positionAttribute,
      currentKeyframe * 3
    );
    const nextPosition = new THREE.Vector3().fromArray(
      positionAttribute,
      nextKeyframe * 3
    );
    const previousPosition = new THREE.Vector3().fromArray(
      positionAttribute,
      previousKeyframe * 3
    );

    return { currentPosition, nextPosition, previousPosition };
  }

  getWheelRotationAngle() {
    const { currentPosition, nextPosition, previousPosition } =
      this.getCurrentAndNextPosition();

    // Calculate direction vectors
    const prevDir = new THREE.Vector3()
      .subVectors(currentPosition, previousPosition)
      .normalize();
    const nextDir = new THREE.Vector3()
      .subVectors(nextPosition, currentPosition)
      .normalize();
    const crossProduct = new THREE.Vector3().crossVectors(prevDir, nextDir);

    // Calculate angles between vectors
    const angle = prevDir.angleTo(nextDir);

    // Normalize the angle between 0 and 1
    const maxCurveAngle = Math.PI / 4; // Change this value to set the maximum curve angle
    const normalizedAngle = THREE.MathUtils.clamp(angle / maxCurveAngle, 0, 1);

    if (crossProduct.y > 0) {
      return normalizedAngle;
    } else if (crossProduct.y < 0) {
      return -normalizedAngle;
    } else {
      return 0;
    }
  }

  update() {
    const delta = this.clock.getDelta();
    this.mixer.update(delta);
    if (!this.mixerPause) {
      this.car.rotateWheels(
        this.getWheelRotationAngle(),
        this.animationMaxDuration
      );
    }

    this.checkAnimationStateIsPause();
    this.checkTracksEnabled();
  }
}

export { MyOpponent };
