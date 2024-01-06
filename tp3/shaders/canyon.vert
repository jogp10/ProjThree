uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

uniform float rugosity;
uniform float normalizationFactor;

varying vec2 vUv;

void main()
{
    vUv = uv;

	float z_offset = texture2D(uSampler2, vUv).r - 0.45;
    vec3 offset = vec3(z_offset, 0, z_offset);

    vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * offset * rugosity, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}