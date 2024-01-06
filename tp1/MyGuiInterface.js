import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

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
  }

  /**
   * Set the contents object
   * @param {MyContents} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    const data = {
      "diffuse color": this.contents.diffusePlaneColor,
      "specular color": this.contents.specularPlaneColor,
    };

    // adds a folder to the gui interface for the room
    const roomFolder = this.datgui.addFolder("Scene");

    roomFolder
      .add(this.contents, "wallsMeshSize", 10, 100)
      .name("size")
      .onChange(() => {
        this.contents.rebuildWalls();
        this.contents.rebuildFrame();
        this.contents.rebuildWindow();
        this.contents.rebuildBeetlePainting();
        this.contents.rebuildProjectors();
        this.contents.rebuildMirror();
        this.contents.rebuildCurtain();
      });
    roomFolder.add(this.contents, "axisEnable", true).name("axis");
    roomFolder.add(this.contents, "wallsEnable", true).name("walls");
    roomFolder.add(this.contents, "tableEnable", true).name("table");
    roomFolder.add(this.contents, "plateEnable", true).name("plate");
    roomFolder.add(this.contents, "cakeEnable", true).name("cake");
    roomFolder
      .add(this.contents, "candleEnable", true)
      .name("cake with candle")
      .onChange(() => {
        this.contents.rebuildCake();
      });
    roomFolder
      .add(this.contents, "cakeSliceEnable", true)
      .name("cake with slice")
      .onChange(() => {
        this.contents.rebuildCake();
      });
    roomFolder
      .add(this.contents, "cakeLightEnable", true)
      .name("candle lightned")
      .onChange(() => {
        this.contents.rebuildCake();
      });
    roomFolder.add(this.contents, "frameEnable", true).name("frames & projectors");
    roomFolder
    .add(this.contents, "frameHeight", 1, 5)
    .name("frame height")
    .onChange((value) => {
      this.contents.updateFrameHeight(value);
    });
    roomFolder
    .add(this.contents, "frameWidth", 1, 8)
    .name("frame width")
    .onChange((value) => {
      this.contents.updateFrameWidth(value);
    });
    roomFolder
      .add(this.contents, "windowEnable", true)
      .name("window")
      .onChange(() => {
        this.contents.rebuildWalls();
      });
    roomFolder.add(this.contents, "lampEnable", true).name("lamps");
    roomFolder
      .add(this.contents, "lampOnEnable", true)
      .name("lamps on/off")
      .onChange(() => {
        this.contents.rebuildLamp();
      });
    roomFolder.add(this.contents, "mirrorEnable", true).name("mirror");
    roomFolder
      .add(this.contents, "beetlePaintingEnable", true)
      .name("beetle car painting");
    roomFolder.add(this.contents, "spiralSpringEnable", true).name("spring");
    roomFolder.add(this.contents, "newspaperEnable", true).name("newspaper");
    roomFolder.add(this.contents, "jarEnable", true).name("jar");
    roomFolder.add(this.contents, "flowerEnable", true).name("flower");
    //roomFolder.add(this.contents, "toyCarEnable", true).name("toy car");
    roomFolder.add(this.contents, "carpetEnable", true).name("carpet");
    //roomFolder.add(this.contents, "phoneEnable", true).name("phone");
    roomFolder.close();

    // adds a folder to the gui interface for the plane
    const planeFolder = this.datgui.addFolder("Ground");
    planeFolder.addColor(data, "diffuse color").onChange((value) => {
      this.contents.updateDiffusePlaneColor(value);
    });
    planeFolder.addColor(data, "specular color").onChange((value) => {
      this.contents.updateSpecularPlaneColor(value);
    });
    planeFolder
      .add(this.contents, "planeShininess", 0, 1000)
      .name("shininess")
      .onChange((value) => {
        this.contents.updatePlaneShininess(value);
      });
    planeFolder.close();

    // adds a folder to the gui interface for the camera
    const cameraFolder = this.datgui.addFolder("Camera");
    cameraFolder
      .add(this.app, "activeCameraName", [
        "Perspective",
        "Perspective 2",
        "Cake",
        "Corner",
        "Left",
        "Top",
        "Front",
        "Right",
        "Back",
      ])
      .name("active camera").onChange((value) => {
        this.app.setActiveCamera(value);
      });
    cameraFolder.close();
  }
}

export { MyGuiInterface };
