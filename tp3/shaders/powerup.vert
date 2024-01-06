uniform sampler2D uSampler1;
uniform float time;

varying vec2 vUv;

void main()
{
    vUv = uv;

    float pulsationFrequency = 3.0;
    float pulsationAmplitude = 0.2;
    float rotationSpeedX = 1.0;
    float rotationSpeedY = 1.0;

    float pulsationOffset = 1.0 + sin(time * pulsationFrequency) * pulsationAmplitude;

    float angleX = time * rotationSpeedX;
    float angleY = time * rotationSpeedY;

    mat3 rotationMatrixX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(angleX), -sin(angleX),
        0.0, sin(angleX), cos(angleX)
    );

    mat3 rotationMatrixY = mat3(
        cos(angleY), 0.0, sin(angleY),
        0.0, 1.0, 0.0,
        -sin(angleY), 0.0, cos(angleY)
    );

    vec3 rotatedPosition = rotationMatrixY * (rotationMatrixX * (position * pulsationOffset));

    vec4 modelViewPosition = modelViewMatrix * vec4(rotatedPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
