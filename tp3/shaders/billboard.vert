#include <packing>

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;


float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    vUv = uv;

    float depth = 1.0 - readDepth( tDepth, vUv );
    depth = exp(depth);
    
    vec3 offset = vec3(depth);    

    vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * offset, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}