import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";
import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
  /**
   *
   * @param {MyApp} app The application object
   */
  constructor(app) {
    this.app = app;
    this.datgui = new GUI();
    this.contents = null;
    this.fog = null;
  }

  /**
   * Set the contents object
   * @param {MyContents} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;

    this.camerasNames = [];
    for (var cam of Object.values(this.app.cameras)) {
      if (cam.name) this.camerasNames.push(cam.name);
    }
  }

  /**
   * Initialize the gui interface
   */
  init() {
    const camerasFolder = this.datgui.addFolder("Camera");

    // Iterate through the available camera objects
    camerasFolder
      .add(this.app, "activeCameraName", this.camerasNames)
      .name("active camera")
      .onChange((value) => {
        this.app.setActiveCamera(value);
      });
    camerasFolder.open();

    const materialsFolder = this.datgui.addFolder("Materials");

    // Create a global wireframe toggle
    const materialController = materialsFolder
      .add({ wireframe: false }, "wireframe")
      .name("Toggle Wireframe");

    materialController.onChange((value) => {
      // Loop through all materials and toggle wireframe based on the global toggle value
      Object.keys(this.contents.materialMapping).forEach((name) => {
        const material = this.contents.materialMapping[name];
        if (material.isMaterial) {
          material.wireframe = value;
        }
      });
    });

    const objectToggleFolder = this.datgui.addFolder("Object Wireframes");

    const sceneObjects = Object.keys(this.contents.materialMapping);

    sceneObjects.forEach((name) => {
      const material = this.contents.materialMapping[name];
      if (material instanceof THREE.Material) {
        const objectController = objectToggleFolder
          .add(material, "wireframe")
          .name(`${name}`);

        objectController.onChange((value) => {
          // Toggle wireframe for the specific object's material
          material.wireframe = value;
        });
      }
    });

    objectToggleFolder.close();

    materialController.onChange((value) => {
      for (const materialName of Object.keys(this.contents.materialMapping)) {
        const material = this.contents.materialMapping[materialName];
        if (material) {
          material.wireframe = value;
        }
      }
    });

    const lightsFolder = this.datgui.addFolder("Lights");

    // Toggle each light
    for (const light of Object.values(this.contents.lights)) {
      lightsFolder
        .add(light.light, "visible")
        .name(light.name)
        .onChange((value) => {
          if (value) {
            light.light.visible = true;
          } else {
            light.light.visible = false;
          }
        });
    }
    this.fog = this.contents.app.scene.fog;
    // Create Toggle for fog
    const fogFolder = this.datgui.addFolder("Fog");
    fogFolder
      .add(this.contents.app.scene.fog, "near",0 ,100)
      .name("Fog Near")
      .onChange((value) => {
        this.contents.app.scene.fog.near = value;
      });

    fogFolder
    .add(this.contents.app.scene.fog, "far",0 ,150)
    .name("Fog Far")
    .onChange((value) => {
      this.contents.app.scene.fog.far = value;
    });

    fogFolder
    .add(this.contents.app.scene.fog, "visible")
    .name("Enable Fog")
    .onChange((value) => {
      if(value){
        this.contents.app.scene.fog = this.fog;
      }
      else{
        this.contents.app.scene.fog = null;
      }

    });

    // Toggle for Helpers
    const helpersFolder = this.datgui.addFolder("Helpers");
    helpersFolder
      .add(this.contents, "helpersEnabled")
      .name("Toggle Helpers")
      .onChange((value) => {
        if (value) {
          this.contents.enableHelpers();
        } else {
          this.contents.disableHelpers();
        }
      });



      
  }
}

export { MyGuiInterface };
