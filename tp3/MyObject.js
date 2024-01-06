import * as THREE from "three";

class MyObject extends THREE.Object3D {
  constructor(name) {
    super();
    this.group = new THREE.Group();
    this.name = name;
  }

  /**
   * Filter options for the texture
   */
  static filterOptions = {
    LinearFilter: THREE.LinearFilter,
    LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
    LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
    NearestFilter: THREE.NearestFilter,
    NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
    NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
  };

  /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     *
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
    // * @param {*} size if size not null inscribe the value in the mipmap. null by default
    // * @param {*} color a color to be used for demo
  */
  static loadMipmap(parentTexture, level, path) {
    // load texture. On loaded call the function to create the mipmap for the specified level
    new THREE.TextureLoader().load(
      path,
      function (
        mipmapTexture // onLoad callback
      ) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.scale(1, 1);

        // const fontSize = 48
        const img = mipmapTexture.image;
        canvas.width = img.width;
        canvas.height = img.height;

        // first draw the image
        ctx.drawImage(img, 0, 0);

        // set the mipmap image in the parent texture in the appropriate level
        parentTexture.mipmaps[level] = canvas;
      },
      undefined, // onProgress callback currently not supported
      function (err) {
        console.error(
          "Unable to load the image " +
            path +
            " as mipmap level " +
            level +
            ".",
          err
        );
      }
    );
  }

  /**
   * Create a video element and return it
   * @param {*} filepath Path to source of video
   * @returns Video obj
   */
  static createVideoDocument(filepath) {
    const video = document.createElement("video");
    video.style.display = "none";

    video.width = 640;
    video.height = 264;
    video.autoplay = true;
    video.muted = true;
    video.preload = "auto";
    video.loop = true;

    const source = document.createElement("source");

    source.type = "video/mp4";
    source.src = filepath;

    video.appendChild(source);

    document.body.appendChild(video);

    return video;
  }

  /**
   * Create a texture object based on the textureData
   * @param {*} textureData The texture data
   * @returns
   */
  static createTexture(textureData) {
    let textureObj = null;

    if (textureData.isVideo) {
      let video = MyObject.createVideoDocument(textureData.filepath);
      textureObj = new THREE.VideoTexture(video);
      textureObj.name = textureData.id;
      textureObj.colorSpace = THREE.SRGBColorSpace;
      return textureObj;
    }

    textureObj = new THREE.TextureLoader().load(textureData.filepath);
    textureObj.name = textureData.id;

    textureObj.anisotropy = textureData.anisotropy || 1;

    textureObj.generateMipmaps = textureData.mipmaps;

    if (!textureObj.generateMipmaps) {
      let mipmapCount = 0;

      while (1) {
        let mipmapString = "mipmap" + mipmapCount;

        if (!textureData[mipmapString]) {
          break;
        }

        MyObject.loadMipmap(textureObj, mipmapCount, textureData[mipmapString]);
        mipmapCount++;
      }
    } else {
      textureObj.minFilter = this.filterOptions[textureData.minFilter];
      textureObj.magFilter = this.filterOptions[textureData.magFilter];
    }

    return textureObj;
  }

  /**
   * Create a material object based on the materialData
   * @param {*} materialData Material data
   * @param {*} texture Texture object associated with the material
   * @param {*} bumpTexture Bump texture object associated with the material
   * @returns material object
   */
  static createMaterial(materialData, texture, bumpTexture) {
    let material =
      materialData.textureref !== null && texture.isVideoTexture
        ? new THREE.MeshBasicMaterial()
        : new THREE.MeshPhongMaterial();

    material.name = materialData.id;

    // Set material properties based on the materialData
    if (materialData.color !== undefined) {
      material.color = new THREE.Color(
        materialData.color.r,
        materialData.color.g,
        materialData.color.b
      );

      if (materialData.color.a < 1.0) {
        material.transparent = true;
        material.opacity = materialData.color.a;
      }
    }

    if (materialData.specular !== undefined) {
      material.specular = new THREE.Color(
        materialData.specular.r,
        materialData.specular.g,
        materialData.specular.b
      );
    }

    if (materialData.shininess !== undefined) {
      material.shininess = materialData.shininess;
    }

    if (materialData.twosided === true) {
      material.side = THREE.DoubleSide;
    }

    if (materialData.wireframe !== undefined) {
      material.wireframe = materialData.wireframe;
    }

    // Assign a texture if defined in the materialData
    if (materialData.textureref !== null) {
      material.map = texture;

      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;

      material.map.repeat.set(
        materialData.texlength_s,
        materialData.texlength_t
      );
    }

    if (material.type !== "MeshBasicMaterial") {
      if (materialData.emissive !== undefined) {
        material.emissive = new THREE.Color(
          materialData.emissive.r,
          materialData.emissive.g,
          materialData.emissive.b
        );
      }
    }

    if (materialData.bumpref !== undefined && materialData.bumpref !== null) {
      material.bumpMap = bumpTexture;
      material.bumpScale = materialData.bumpscale;
    }

    material.flatShading = materialData.shading;

    material.alphaTest = 0.5;

    return material;
  }

  /**
   * Apply the transformations to the group
   * @param {*} group Group object to apply the transformations
   * @param {*} transformations Transformations to apply
   * @returns
   */
  static applyTransformation(group, transformations) {
    if (
      group === undefined ||
      group.children === undefined ||
      transformations === undefined ||
      transformations.length === 0
    ) {
      return;
    }

    for (const transformation of transformations) {
      const type = transformation.type;
      let values = null;
      switch (type) {
        case "T":
          values = transformation.translate;
          group.translateX(values[0]);
          group.translateY(values[1]);
          group.translateZ(values[2]);
          break;

        case "R":
          values = transformation.rotation;
          group.rotation.x = values[0];
          group.rotation.y = values[1];
          group.rotation.z = values[2];

          break;

        case "S":
          values = transformation.scale;
          group.scale.set(values[0], values[1], values[2]);

          break;
      }
    }
  }
}

export { MyObject };
