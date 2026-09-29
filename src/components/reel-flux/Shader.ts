import * as THREE from "three";

export const shaderUniforms = {
    uVelocity: { value: 0 },
    uWaveFreq: { value: 1.15 },
    uAmpY: { value: 0.48 },
    uAmpZ: { value: 0.80 },
    uTwistZ: { value: 0.35 },
};

const MAX_VELOCITY = 1.6;

export function updateVelocityUniform(lenisVelocity: number, alpha = 0.12): void {
    const target = THREE.MathUtils.clamp(lenisVelocity * 0.011, -MAX_VELOCITY, MAX_VELOCITY);
    shaderUniforms.uVelocity.value = THREE.MathUtils.lerp(shaderUniforms.uVelocity.value, target, alpha);
}

export function updateWaveDimensions(stride: number, planeHeight: number): void {
    const wavelength = stride * 1.82;
    shaderUniforms.uWaveFreq.value = (Math.PI * 2) / wavelength;
    shaderUniforms.uAmpY.value = planeHeight * 0.8;
    shaderUniforms.uAmpZ.value = planeHeight * 0.8;
    shaderUniforms.uTwistZ.value = planeHeight * 0.20;
}

const vertexShader = `
uniform float uVelocity;
uniform float uWaveFreq;
uniform float uAmpY;
uniform float uAmpZ;
uniform float uTwistZ;

varying vec2 vUv;
varying float vCosW;

void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    float worldX = worldPos.x;
    float localY = position.y;

    float wavePhase = worldX * uWaveFreq;
    float sinW = sin(wavePhase);
    float cosW = cos(wavePhase);
    vCosW = cosW;

    float dynY = sinW * uVelocity * uAmpY;
    float dynZ = cosW * uVelocity * uAmpZ;
    float twistZ = localY * sinW * uVelocity * uTwistZ;
    float dispX = sinW * cosW * uVelocity * -0.05;

    vec3 displaced = position + vec3(dispX, dynY, dynZ + twistZ);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform float uVelocity;

varying vec2 vUv;
varying float vCosW;

void main() {
    vec2 coverUv = (vUv - 0.5) * uScale + 0.5 + uOffset;
    vec4 baseColor = texture2D(uTexture, coverUv);

    float luma = dot(baseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 gray = vec3(luma);

    float sat = 0.80;
    vec3 satColor = mix(gray, baseColor.rgb, sat);

    float lift = 0.018;
    float gain = 1.02;
    vec3 tonedRgb = satColor * gain + vec3(lift);

    float curveHighlight = clamp(vCosW * uVelocity * 0.05, 0.0, 0.06);
    vec3 finalRgb = tonedRgb + vec3(curveHighlight);

    gl_FragColor = vec4(finalRgb, baseColor.a);
}
`;

export function createSliderMaterial(tex: THREE.Texture, planeAspect: number) {
    const img = tex.image as { width?: number; height?: number } | undefined;
    const imageAspect = (img && img.width && img.height) ? img.width / img.height : planeAspect;

    let scale = new THREE.Vector2(1, 1);
    let offset = new THREE.Vector2(0, 0);

    // If image aspect ratio is close to card aspect ratio (within 15%), display full image 1:1 without cutting
    if (Math.abs(imageAspect - planeAspect) < 0.15) {
        scale = new THREE.Vector2(1, 1);
        offset = new THREE.Vector2(0, 0);
    } else if (imageAspect > planeAspect) {
        // Landscape photo wider than card: fit height, center horizontally
        scale = new THREE.Vector2(planeAspect / imageAspect, 1);
        offset = new THREE.Vector2(0, 0);
    } else {
        // Image is taller than card: fit width, align to top to preserve logo and header
        const s = imageAspect / planeAspect;
        scale = new THREE.Vector2(1, s);
        offset = new THREE.Vector2(0, (1.0 - s) * 0.48);
    }

    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTexture: { value: tex },
            uScale: { value: scale },
            uOffset: { value: offset },
            uVelocity: shaderUniforms.uVelocity,
            uWaveFreq: shaderUniforms.uWaveFreq,
            uAmpY: shaderUniforms.uAmpY,
            uAmpZ: shaderUniforms.uAmpZ,
            uTwistZ: shaderUniforms.uTwistZ,
        },
        side: THREE.DoubleSide,
    });
}
