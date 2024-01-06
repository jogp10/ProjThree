import * as THREE from "three";

class MyMenu {
  spriteSheet = null;
  startText = null;
  constructor(app, spriteSheet) {
    this.app = app;
    this.menu = new THREE.Group();
    this.difficulty = null;

    this.spriteSheet = spriteSheet;
    this.selectedDifficulty = false;
    this.startText = null;
    this.chooseDifficulty = null;
    this.difficulties = [];
    this.toRemove = [];
    this.selectedColor = 0x0fff00;
    this.finalDifficulty = null;
    this.textColor = 0x0e2f44;
    this.userNameText = null;
    this.userName = "";
    this.scene = 0;
    this.isTyping = true;
    this.caret = null;
    this.chooseCars = null;

    this.buildMenu();
  }
  getSelectedDifficulty() {
    if (this.selectedDifficulty) {
      return this.finalDifficulty;
    } else {
      return null;
    }
  }
  changeFinalDifficulty() {
    this.finalDifficulty = this.difficulty;
  }
  getDifficulties() {
    return this.difficulties;
  }
  changeDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  buildMenu() {
    // Create a Plane apply a texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load("textures/menu.jpg");
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1, 1);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });

    //Add light
    const light = new THREE.SpotLight(0xffffff, 1000);

    light.position.set(0, 0, 20);
    light.target.position.set(0, -30, 0);

    this.light = light;
    const helper = new THREE.SpotLightHelper(light);
    this.menu.add(light);

    const geometry = new THREE.PlaneGeometry(41, 25);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, 0);
    this.menu.add(plane);
    this.addText();

    const caretGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const tex = loader.load("textures/caret.png");
    const caretMaterial = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.caret = new THREE.Mesh(caretGeometry, caretMaterial);
    this.caret.position.set(1, 0, 1);
    this.scale(this.caret, 2);

    this.menu.position.set(0, -30, 0);
  }

  changeSelectedDifficulty() {
    this.selectedDifficulty = true;
  }

  addText() {
    let textGroup = null;

    textGroup = this.spriteSheet.createTextGroup("Choose Difficulty");
    this.scale(textGroup, 3, 7);
    textGroup.position.set(-10, 8, 0);
    this.chooseDifficulty = textGroup;
    this.toRemove.push(textGroup);
    this.menu.add(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Easy");
    textGroup.name = "dif";
    textGroup.type = "easy";
    this.scale(textGroup, 3);
    textGroup.position.set(-10, 6.5, 0);

    this.difficulties.push(textGroup);

    this.menu.add(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Medium");
    textGroup.name = "dif";
    textGroup.type = "medium";
    this.difficulties.push(textGroup);
    this.scale(textGroup, 3);
    textGroup.position.set(-10, 5, 0);
    this.menu.add(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Hard");
    textGroup.name = "dif";
    textGroup.type = "hard";
    this.difficulties.push(textGroup);

    this.scale(textGroup, 3);
    textGroup.position.set(-10, 3.5, 0);
    this.menu.add(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Start");
    this.scale(textGroup, 7);
    textGroup.position.set(0, 5, 0);
    textGroup.name = "start";
    textGroup.type = "start";
    this.startText = textGroup;
    this.toRemove.push(textGroup);
    this.menu.add(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Choose Cars");
    this.scale(textGroup, 4);
    textGroup.position.set(-4, 6, 0);
    textGroup.name = "start";
    textGroup.type = "chooseCars";
    this.chooseCars = textGroup;

    this.difficulties.forEach((dif) => {
      this.toRemove.push(dif);
    });
  }

  getUserName() {
    return this.userName;
  }

  secondText() {
    let textGroup = null;
    textGroup = this.spriteSheet.createTextGroup("Player Name");
    this.scale(textGroup, 4);
    textGroup.name = "player";
    textGroup.type = "player";
    textGroup.position.set(0, 8, 0);

    this.menu.add(textGroup);
    this.toRemove.push(textGroup);

    textGroup = this.spriteSheet.createTextGroup("Press Enter to Continue");
    textGroup.name = null;
    textGroup.type = null;
    this.scale(textGroup, 3);
    textGroup.position.set(0, 4, 0);
    this.menu.add(textGroup);
    this.toRemove.push(textGroup);
    this.toRemove.push(this.userNameText);
    this.toRemove.push(this.caret);
  }

  thirdText() {
    let textGroup = null;
    this.menu.add(this.chooseCars);
    this.toRemove.push(this.chooseCars);

    textGroup = this.spriteSheet.createTextGroup("Random Cars");
    this.scale(textGroup, 4);
    textGroup.position.set(4, 6, 0);
    this.menu.add(textGroup);
    textGroup.name = "start";
    textGroup.type = "randomCars";
    this.randomCars = textGroup;

    this.toRemove.push(textGroup);
  }
  buildPauseMenu() {
    let textGroup = null;
    textGroup = this.spriteSheet.createTextGroup("Paused");
    this.scale(textGroup, 5);
    textGroup.position.set(0, 8, 0);
    this.menu.add(textGroup);
    this.toRemove.push(textGroup);
    textGroup = this.spriteSheet.createTextGroup("Press Enter to Continue");

    this.scale(textGroup, 3);
    textGroup.position.set(0, 6, 0);
    this.menu.add(textGroup);
    this.toRemove.push(textGroup);
  }
  clear() {
    this.toRemove.forEach((text) => {
      this.menu.remove(text);
    });
    this.toRemove = [];
  }

  cleanMenu() {
    this.clear();
    this.app.scene.remove(this.menu);
  }
  scale(textGroup, number) {
    textGroup.scale.set(number, (2 * number) / 3, number);
  }

  recolorText() {
    switch (this.scene) {
      case 0:
        this.difficulties.forEach((dif) => {
          if (dif.type === this.getSelectedDifficulty()) {
            this.scale(dif, 4);
            dif.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (child.material.color.getHex() != 0x0ffff0) {
                  child.material.color.setHex(0x0ffff0);
                }
              }
            });
          } else {
            this.scale(dif, 3);

            dif.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material.color.setHex(this.textColor);
              }
            });
          }
        });
        this.startText.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material.color.getHex() != this.textColor) {
              child.material.color.setHex(this.textColor);
            }
          }
        });
        break;

      case 2:
        this.randomCars.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material.color.getHex() != this.textColor) {
              child.material.color.setHex(this.textColor);
            }
          }
        });

        this.chooseCars.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material.color.getHex() != this.textColor) {
              child.material.color.setHex(this.textColor);
            }
          }
        });
        break;
    }
  }

  setupKeyboardInput() {
    if (this.isTyping) {
      this.caret.position.set(0, 6, 0);
      this.scale(this.caret, 1.5);
      this.menu.add(this.caret);

      // Store the event listener reference for later removal
      this.keydownListener = (event) => {
        this.handleKeydown(event);
      };

      document.addEventListener("keydown", this.keydownListener);
    }
  }

  clearKeyboardInput() {
    // Remove the event listener when clearing keyboard input
    document.removeEventListener("keydown", this.keydownListener);
    this.isTyping = false;
  }

  handleKeydown(event) {
    const key = event.key;
    if (key === "Enter") {
      this.stopCaretBlinking();

      this.clearKeyboardInput();
      this.lastPickedObj = null;
      this.lastObj = null;
      this.scene = 2;
      this.clear();
      this.menu.remove(this.userNameText);
      this.thirdText();
      return;
    } else if (key === "Backspace") {
      this.userName = this.userName.slice(0, -1);
    } else if (key.match(/^[0-9a-zA-Z]$/)) {
      this.userName += key;
    }
    this.menu.remove(this.userNameText);
    this.userNameText = this.spriteSheet.createTextGroup(this.userName);
    this.scale(this.userNameText, 4);
    this.userNameText.position.set(0, 6, 0);
    this.menu.add(this.userNameText);

    this.caret.position.set(
      this.userNameText.position.x -
        (2 + this.userName.length) * this.spriteSheet.spriteWidth * 2,
      this.userNameText.position.y,
      this.userNameText.position.z
    );
  }

  startCaretBlinking() {
    this.caretVisible = false; // Set caret visible flag
    this.caretBlinkInterval = setInterval(() => {
      this.caret.visible = this.caretVisible; // Toggle caret visibility
      this.caretVisible = !this.caretVisible; // Invert visibility for next interval
    }, 500); // Set the interval duration (milliseconds) for blinking
  }

  stopCaretBlinking() {
    clearInterval(this.caretBlinkInterval);
    this.caret.visible = true;
  }

  menuCamera() {
    this.app.setActiveCamera("Menu");
  }
  
  addMenu() {
    this.app.scene.add(this.menu);
  }

  removeMenu() {
    this.app.scene.remove(this.menu);
  }
}

export { MyMenu };
