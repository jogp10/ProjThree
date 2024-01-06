uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

uniform float normalizationFactor;

varying vec2 vUv;

void main()
{
    vUv = uv;

	float z_offset = texture2D(uSampler2, vUv).r;
    vec3 offset = vec3(0.0, 0.0, z_offset) * 0.3;

    vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * normalizationFactor * offset, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}