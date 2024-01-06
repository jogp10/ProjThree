import * as THREE from "three";
import { MyObject } from "../MyObject.js";

class MyLight extends MyObject {
    light = null;
    type = null;

    constructor(lightData) {
        super(lightData.id);
       
        // Extract common light attributes
        const color = new THREE.Color(lightData.color);
        const intensity = lightData.intensity || 1.0;
                
        if (lightData.type === "spotlight") {
            this.type = "spotlight";

            const position = new THREE.Vector3().fromArray(lightData.position);
            const target = new THREE.Vector3().fromArray(lightData.target);
            const angle = lightData.angle || Math.PI / 4;
            const distance = lightData.distance;
            const decay = lightData.decay;
            const penumbra = lightData.penumbra;
            const castShadow = lightData.castshadow;
            const shadowFar = lightData.shadowfar;
            const shadowMapSize = lightData.shadowmapsize;

            const light = new THREE.SpotLight(color, intensity, distance, angle, decay);
            light.position.copy(position);
            light.target.position.set(target.x, target.y, target.z);
            light.target.updateMatrixWorld();
            light.penumbra = penumbra;
            light.castShadow = castShadow;
            light.shadow.camera.far = shadowFar;
            light.shadow.mapSize.set(shadowMapSize, shadowMapSize);

            this.light = light;
        } else if (lightData.type === "pointlight") {
            this.type = "pointlight";

            const position = new THREE.Vector3().fromArray(lightData.position);
            const distance = lightData.distance;
            const decay = lightData.decay;
            const castShadow = lightData.castshadow;
            const shadowFar = lightData.shadowfar;
            const shadowMapSize = lightData.shadowmapsize;

            const light = new THREE.PointLight(color, intensity, distance, decay);
            light.position.copy(position);
            light.castShadow = castShadow;
            light.shadow.camera.far = shadowFar;
            light.shadow.mapSize.set(shadowMapSize, shadowMapSize);

            this.light = light;
        } else if (lightData.type === "directionallight") {
            this.type = "directionallight";
            const position = new THREE.Vector3().fromArray(lightData.position);
            const castShadow = lightData.castshadow;
            const shadowLeft = lightData.shadowleft;
            const shadowRight = lightData.shadowright;
            const shadowBottom = lightData.shadowbottom;
            const shadowTop = lightData.shadowtop;
            const shadowFar = lightData.shadowfar;
            const shadowMapSize = lightData.shadowmapsize;

            const light = new THREE.DirectionalLight(color, intensity);
            light.position.copy(position);
            light.castShadow = castShadow;
            light.shadow.camera.left = shadowLeft;
            light.shadow.camera.right = shadowRight;
            light.shadow.camera.bottom = shadowBottom;
            light.shadow.camera.top = shadowTop;
            light.shadow.camera.far = shadowFar;
            light.shadow.mapSize.set(shadowMapSize, shadowMapSize);

            this.light = light;

        }

        this.light.visible = lightData.enabled;
        this.light.name = lightData.id;
    }
}

export { MyLight };
