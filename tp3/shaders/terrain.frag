uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

varying vec2 vUv;

void main()
{
    gl_FragColor = texture2D(uSampler1,  vUv);
}