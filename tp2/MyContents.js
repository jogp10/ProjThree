import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyObject } from "./MyObject.js";
import { CameraFactory } from "./factories/MyCamera.js";
import { RawCube } from "./rawObjects/RawCube.js";
import { RawCylinder } from "./rawObjects/RawCylinder.js";
import { MyPlane } from "./factories/MyPlane.js";
import { MyCylinder } from "./factories/MyCylinder.js";
import { MySphere } from "./factories/MySphere.js";
import { MyBox } from "./factories/MyBox.js";
import { MyLight } from "./factories/MyLight.js";
import { MyNurbs } from "./factories/MyNurbs.js";
import { MyPolygon } from "./factories/MyPolygon.js";

/**
 *  This class contains the contents of our application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.axis = null;

    this.materialMapping = {};
    this.nodes = {};
    this.ambientLight = null;
    this.lights = {};
    this.helpers = [];
    this.helpersEnabled = false;

    // Create default material
    this.defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
    });

    this.activeScene = "t03g04";
  }

  /**
   * initializes the contents
   */
  init() {
    this.reader = new MyFileReader(this.app, this, this.onSceneLoaded);
    this.reader.open("scenes/" + this.activeScene + "/scene.xml");

    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }
  }

  /**
   * Called when the scene xml file load is complete
   * @param {MySceneData} data the entire scene data object
   */
  onSceneLoaded(data) {
    console.info(
      "scene data loaded " +
        data +
        ". visit MySceneData javascript class to check contents for each data item."
    );
    this.onAfterSceneLoadedAndBeforeRender(data);
  }

  /**
   * Outputs the contents of the object
   * @param {*} obj The object to be outputted
   * @param {*} indent  The indentation level
   */
  output(obj, indent = 0) {
    console.log(
      "" +
        new Array(indent * 4).join(" ") +
        " - " +
        obj.type +
        " " +
        (obj.id !== undefined ? "'" + obj.id + "'" : "")
    );
  }

  /**
   * Called after the xml scene file is loaded and before the render loop starts
   * @param {*} data The entire scene data object
   */
  onAfterSceneLoadedAndBeforeRender(data) {
    // Apply global settings
    this.applyGlobalSettings(data.options);
    this.applyFog(data.fog);
    this.createSkybox(data.skyboxes["default"]);

    // Create textures and materials
    for (var key in data.textures) {
      let texture = data.textures[key];

      const textureObj = MyObject.createTexture(texture);
      this.materialMapping[texture.id] = textureObj;
    }

    for (var key in data.materials) {
      let material = data.materials[key];

      // Create a material based on the materialData
      const materialObj = MyObject.createMaterial(
        material,
        this.materialMapping[material.textureref],
        this.materialMapping[material.bumpref]
      );
      this.materialMapping[material.id] = materialObj;
    }

    // Create cameras
    for (var key in data.cameras) {
      let camera = data.cameras[key];

      let cameraObj = new CameraFactory(camera).camera;
      this.app.cameras[camera.id] = cameraObj;
      this.app.camerasTargets[camera.id] = new THREE.Vector3(...camera.target);
    }
    this.app.setActiveCamera(data.activeCameraId); // Set the active camera

    // Create scene objects
    this.nodes = data.nodes;
    let group = this.createPrimitives(
      data.nodes[data.rootId],
      this.defaultMaterial,
      data.nodes[data.rootId].castShadows,
      data.nodes[data.rootId].receiveShadows
    );

    this.app.scene.add(group);
    this.addHelpers();
    
    console.log("End of before render");
  }

  /**
   * Creates the scene objects recursively
   * @param {*} node Node to be created
   * @param {*} material Material to be applied to the object
   * @param {*} castShadows Whether the object should cast shadows
   * @param {*} receiveShadows Whether the object should receive shadows
   * @returns 
   */
  createPrimitives(
    node,
    material,
    castShadows = false,
    receiveShadows = false
  ) {
    if ( // If the node is a light
      node.type === "spotlight" ||
      node.type === "directionallight" ||
      node.type === "pointlight"
    ) {
      return this.createLight(node);
    }
    if (node.type === "lod") { // If the node is a lod
      return this.createLod(node, material, castShadows, receiveShadows);
    }

    if (node === undefined || node.children === undefined) { // If the node is undefined
      return;
    }

    let group = new THREE.Group();

    for (let i = 0; i < node.children.length; i++) { // For each child of the node
      let object = null;
      const child = node.children[i];

      material =
        node.materialIds.length > 0
          ? this.materialMapping[node.materialIds[0]]
          : material;

      castShadows = node.castShadows !== false ? node.castShadows : castShadows;
      receiveShadows =
        node.receiveShadows !== false ? node.receiveShadows : receiveShadows;

      if (child.type === "primitive") { // If the child is a primitive
        object = this.createPrimitive(
          child,
          material,
          castShadows,
          receiveShadows
        );
      } else {
        object = this.createPrimitives( // If the child is a node
          child,
          material,
          castShadows,
          receiveShadows
        );
      }

      if (object !== undefined) {
        group.add(object);
      }
    }

    MyObject.applyTransformation(group, node.transformations); // Apply transformations

    return group;
  }

  /**
   * Creates a LOD object
   * @param {*} node Node LOD to be created
   * @param {*} material Material to be applied to the object
   * @param {*} castShadows Cast shadows
   * @param {*} receiveShadows Receive shadows
   * @returns 
   */
  createLod(node, material, castShadows, receiveShadows) {
    if (node === undefined || node.children === undefined) {
      return;
    }

    let lod = new THREE.LOD();

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      const object = this.createPrimitives(
        child.node,
        material,
        castShadows,
        receiveShadows
      );

      const minDist = parseFloat(child.mindist);

      if (!isNaN(minDist)) {
        lod.addLevel(object, minDist);
      }
    }

    return lod;
  }

  /**
   * Creates a primitive object
   * @param {*} child Primitive to be created
   * @param {*} material Material to be applied to the object
   * @param {*} castshadow Cast shadows
   * @param {*} receiveshadow Receive shadows
   * @returns 
   */
  createPrimitive(child, material, castshadow, receiveshadow) {
    let obj = null;

    switch (child.subtype) {
      case "rectangle":
      case "triangle":
        let plane = new MyPlane(child, material);
        obj = plane.mesh;
        break;
      case "cylinder":
        let cylinder = new MyCylinder(child, material);
        obj = cylinder.mesh;
        break;
      case "sphere":
        let sphere = new MySphere(child, material);
        obj = sphere.mesh;
        break;
      case "box":
        let box = new MyBox(child, material);
        obj = box.mesh;
        break;
      case "nurbs":
        let nurbs = new MyNurbs(child, material);
        obj = nurbs.mesh;
        break;
      case "polygon":
        let polygon = new MyPolygon(child, material);
        this.materialMapping[polygon.material.name] = polygon.material; // Add polygon material to the material mapping, so wireframe changes take effect
        obj = polygon.mesh;
        break;

      default:
        console.log(
          "Error: " + child.subtype + " is not a valid primitive type"
        );
        return undefined;
    }

    // Apply shadows
    obj.castShadow = castshadow;
    obj.receiveShadow = receiveshadow;

    return obj;
  }

  /**
   * Creates a light object
   * @param {*} child Light to be created
   * @returns Light object
   */
  createLight(child) {
    let light = new MyLight(child);
    this.lights[child.id] = light;

    // Add light helper
    if (child.type === "spotlight") {
      let helper = new THREE.SpotLightHelper(light.light);
   
    } else if (child.type === "directionallight") {
      let helper = new THREE.DirectionalLightHelper(light.light, 1);
    
    } else if (child.type === "pointlight") {
      let helper = new THREE.PointLightHelper(light.light, 1);
     
    }

    return light.light;
  }

  addHelpers() {

    Object.keys(this.lights).forEach((key) => {
      const light = this.lights[key];
      let helper = null;
      if (light.type === "spotlight") {
        helper = new THREE.SpotLightHelper(light.light);
       
      } else if (light.type === "directionallight") {
        helper = new THREE.DirectionalLightHelper(light.light, 1);
     
      } else if (light.type === "pointlight") {
        helper = new THREE.PointLightHelper(light.light, 1);
        
      }
      this.helpers.push(helper);
      
    }
   
    );
    
  }

  enableHelpers() {
    this.helpers.forEach((helper) => {
      this.app.scene.add(helper);
    });
  }
  disableHelpers() {
    this.helpers.forEach((helper) => {
      this.app.scene.remove(helper);
    });
  }
  update() {}

  /**
   * Applies the background color and ambient light
   * @param {*} options Global settings
   */
  applyGlobalSettings(options) {
    // Set the background color
    if (options.background && options.background.isColor) {
      const backgroundColor = new THREE.Color(
        options.background.r,
        options.background.g,
        options.background.b
      );
      this.app.scene.background = backgroundColor;
    }

    // Set ambient light
    if (options.ambient && options.ambient.isColor) {
      const ambientColor = new THREE.Color(
        options.ambient.r,
        options.ambient.g,
        options.ambient.b
      );
      this.ambientLight = new THREE.AmbientLight(ambientColor);
      this.app.scene.add(this.ambientLight);
    }
  }

  /**
   * Applies the fog to the scene
   * @param {*} fog Fog data
   */
  applyFog(fog) {
    if (fog !== null) {
      this.app.scene.fog = new THREE.Fog(
        new THREE.Color(fog.color.r, fog.color.g, fog.color.b),
        fog.near,
        fog.far
      );
      this.app.scene.fog.visible = true;
      
    }
  }

  /**
   * Creates the skybox and adds it to the scene
   * @param {*} skybox Skybox data
   * @returns 
   */
  createSkybox(skybox) {
    if (
      !skybox.right ||
      !skybox.left ||
      !skybox.up ||
      !skybox.down ||
      !skybox.front ||
      !skybox.back
    ) {
      console.error("Insufficient texture paths provided for the skybox.");
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    const materials = [];

    // Define the order of the textures for the cube
    const texturePaths = [
      skybox.right,
      skybox.left,
      skybox.up,
      skybox.down,
      skybox.front,
      skybox.back,
    ];

    for (const path of texturePaths) {
      const texture = textureLoader.load(path);

      const material = new THREE.MeshPhongMaterial({
        emissive: new THREE.Color(skybox.emissive),
        side: THREE.BackSide,
        map: texture,
        emissiveIntensity: skybox.intensity,
      });

      materials.push(material);
    }

    const geometry = new THREE.BoxGeometry(
      skybox.size[0],
      skybox.size[1],
      skybox.size[2]
    );

    const skyboxMesh = new THREE.Mesh(geometry, materials);

    skyboxMesh.position.set(skybox.center[0], skybox.center[1], skybox.center[2]);

    this.app.scene.add(skyboxMesh);
  }
}

export { MyContents };
