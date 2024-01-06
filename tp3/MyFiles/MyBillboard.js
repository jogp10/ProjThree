import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyBillboard extends MyObject {
  constructor(app, pos, file1, file2) {
    super("billboard");
    this.app = app;
    this.pos = pos;
    this.texture = null;
    this.vertShader = file1;
    this.fragShader = file2;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.uniformValues = {
      cameraNear: { type: "f", value: 0.2 },
      cameraFar: { type: "f", value: 35 },
      tDiffuse: { type: "t", value: null },
      tDepth: { type: "t", value: null },
    };
    this.material = null;
    this.clock = new THREE.Clock();
    this.lastTime = 0;
    this.clock.start();

    this.build();

    // Create a custom render target with a depth texture
    this.target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this.target.texture.minFilter = THREE.NearestFilter;
    this.target.texture.magFilter = THREE.NearestFilter;
    this.target.stencilBuffer = false;
    this.target.depthBuffer = true;
    this.target.depthTexture = new THREE.DepthTexture();
    this.target.depthTexture.format = THREE.DepthFormat;
    this.target.depthTexture.type = THREE.FloatType;
  }

  build() {
    var vertexShaderLoader = new THREE.FileLoader();
    vertexShaderLoader.load(this.vertShader, (vertexShader) => {
      var fragmentShaderLoader = new THREE.FileLoader();
      fragmentShaderLoader.load(this.fragShader, (fragmentShader) => {
        if (vertexShader !== undefined && fragmentShader !== undefined) {
          this.billboard = new THREE.Group();

          this.material = new THREE.ShaderMaterial({
            uniforms: this.uniformValues !== null ? this.uniformValues : {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
          });

          // Create a plane for the screen
          let planeGeometry = new THREE.PlaneGeometry(8, 8, 100, 100);
          let screenMesh = new THREE.Mesh(planeGeometry, this.material);
          screenMesh.rotation.x = -Math.PI / 2;

          // Create a box for the display structure
          let structureMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Adjust the color as needed
            roughness: 0.75,
            metalness: 0.5,
          });
          let boxGeometry = new THREE.BoxGeometry(10, 1, 8.5);
          let structureMesh = new THREE.Mesh(boxGeometry, structureMaterial);

          screenMesh.position.set(0, -0.5, 0);

          this.billboard.add(screenMesh);
          this.billboard.add(structureMesh);
          this.billboard.rotation.x = Math.PI / 2;
          this.billboard.position.set(0, 11 / 2 + 5, 0);

          this.billboard2 = this.billboard.clone();
          this.billboard3 = this.billboard.clone();

          this.billboard2.rotation.z = (-2 * Math.PI) / 3;
          this.billboard2.position.set(
            -5 * Math.cos((-2 * Math.PI) / 3),
            11 / 2 + 5,
            5 * Math.sin((-2 * Math.PI) / 3)
          );

          this.billboard3.rotation.z = (2 * Math.PI) / 3;
          this.billboard3.position.set(
            5 * Math.cos((2 * Math.PI) / 3),
            11 / 2 + 5,
            -5 * Math.sin((2 * Math.PI) / 3)
          );

          // Pole
          let poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Adjust the color as needed
            roughness: 0.75,
            metalness: 0.5,
          });
          let poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 11, 10);
          let poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
          poleMesh.position.set(0, 11 / 2 - 3, 5 * Math.cos((2 * Math.PI) / 3));

          this.group.add(this.billboard);
          this.group.add(this.billboard2);
          this.group.add(this.billboard3);
          this.group.add(poleMesh);
          this.group.position.copy(this.pos);
        }
      });
    });
  }

  update() {
    if (
      (this.material === null) | (this.material === undefined) ||
      this.clock.getElapsedTime() < this.lastTime + 9
    )
      return;
    this.lastTime = this.clock.getElapsedTime();

    this.app.renderer.setRenderTarget(this.target);
    this.app.renderer.render(this.app.scene, this.app.activeCamera);

    this.material.uniforms.tDiffuse.value = this.target.texture;
    this.material.uniforms.tDepth.value = this.target.depthTexture;

    this.app.renderer.setRenderTarget(null);
    this.app.renderer.clear();
    this.app.renderer.render(this.app.scene, this.app.activeCamera);
  }
}

export { MyBillboard };
