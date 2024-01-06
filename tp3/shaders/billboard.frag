varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

void main() {
    vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
    gl_FragColor.rgb = vec3( diffuse );
    gl_FragColor.a = 1.0;
}