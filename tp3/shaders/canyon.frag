uniform sampler2D uSampler1;

varying vec2 vUv;

void main()
{
    // Set the repeat factor (adjust as needed)
    float repeatFactor = 2.5;

    // Use fract to create a repeating pattern
    vec2 uv = fract(vUv * repeatFactor);

    gl_FragColor = texture2D(uSampler1, uv);
}