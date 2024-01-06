import * as THREE from "three";

class MySpriteSheet {
  constructor(textureURL, columns, rows) {
    this.textureURL = textureURL;
    this.columns = columns;
    this.rows = rows;
    this.texture = null;
    this.sprites = [];
    this.spriteWidth = 1 / this.columns;
    this.mapping = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7,
      i: 8,
      j: 9,
      k: 10,
      l: 11,
      m: 12,
      n: 13,
      o: 14,
      p: 15,
      q: 16,
      r: 17,
      s: 18,
      t: 19,
      u: 20,
      v: 21,
      w: 22,
      x: 23,
      y: 24,
      z: 25,
      0: 26,
      1: 27,
      2: 28,
      3: 29,
      4: 30,
      5: 31,
      6: 32,
      7: 33,
      8: 34,
      9: 35,
      "-": 36,
      X: 37,
      "?": 38,
      C: 39,
    };
    this.loadTexture();
  }

  loadTexture() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(this.textureURL);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.LinearMipMapLinearFilter;

    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    this.texture.repeat.set(1, 1);

    this.createSprites();
  }

  createSprites() {
    const spriteWidth = 1 / this.columns;
    const spriteHeight = 1 / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const material = new THREE.MeshBasicMaterial({
          map: this.texture.clone(), // Clone the texture for each sprite
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(spriteWidth, spriteHeight);
        const sprite = new THREE.Mesh(geometry, material);

        sprite.position.set(x * spriteWidth, -y * spriteHeight, 0);

        // Set UV coordinates based on the current character's position in the spritesheet
        sprite.geometry.setAttribute(
          "uv",
          new THREE.Float32BufferAttribute(
            [
              x / this.columns,
              1 - y / this.rows,
              (x + 1) / this.columns,
              1 - y / this.rows,
              x / this.columns,
              1 - (y + 1) / this.rows,
              (x + 1) / this.columns,
              1 - (y + 1) / this.rows,
            ],
            2
          )
        );

        sprite.material.color.setHex(0x0e2f44);
        this.sprites.push(sprite);
      }
    }
  }

  getSpriteByChar(character) {
    const index = this.mapping[character.toLowerCase()];
    if (index !== undefined) {
      return this.sprites[index];
    } else {
      console.error("Character not found in mapping.");
      return null;
    }
  }
  createTextGroup(text) {
    const textGroup = new THREE.Group();
    let offsetX = 0;

    // Create text on the front side
    for (const char of text) {
      if (char == " ") {
        offsetX += this.spriteWidth; // Update the offset

        continue;
      }
      const sprite = this.getSpriteByChar(char);
      if (sprite) {
        const spriteClone = sprite.clone();
        spriteClone.position.set(offsetX, 0, 0);
        spriteClone.scale.set(2, 2, 2);
        textGroup.add(spriteClone);
        offsetX += this.spriteWidth; // Update the offset
      }
    }

    // Create text on the back side
    const textBackGroup = textGroup.clone();
    textBackGroup.scale.set(1, 1, 1); // Flip the text

    // Adjust the positions of the text on both sides
    textGroup.position.set(-offsetX / 2, 0, 0);
    textBackGroup.position.set(offsetX / 2, 0, 0);
    textBackGroup.rotation.y = Math.PI;

    // Add both text groups to a parent group
    const parentGroup = new THREE.Group();
    parentGroup.add(textGroup);
    parentGroup.add(textBackGroup);

    return parentGroup;
  }
}

export { MySpriteSheet };
