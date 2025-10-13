// Disco Elysium-style post-processing shaders for VROOM VROOM
// Implements painterly effects, oil painting filter, and atmospheric rendering

class DiscoElysiumShaders {
    constructor() {
        this.vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        // Oil painting effect shader
        this.oilPaintingShader = `
            uniform sampler2D tDiffuse;
            uniform vec2 resolution;
            uniform float brushSize;
            uniform float intensity;
            varying vec2 vUv;

            vec3 getAverageColor(vec2 coord, float radius) {
                vec3 color = vec3(0.0);
                float total = 0.0;

                for(float x = -radius; x <= radius; x++) {
                    for(float y = -radius; y <= radius; y++) {
                        vec2 offset = vec2(x, y) / resolution;
                        vec3 sample = texture2D(tDiffuse, coord + offset).rgb;
                        float weight = 1.0 - length(vec2(x, y)) / radius;
                        color += sample * weight;
                        total += weight;
                    }
                }

                return color / total;
            }

            void main() {
                vec3 color = getAverageColor(vUv, brushSize);

                // Add brush stroke texture
                float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
                color = mix(color, color * 0.8, noise * 0.2);

                // Desaturate for muted palette
                float gray = dot(color, vec3(0.299, 0.587, 0.114));
                color = mix(vec3(gray), color, 0.7);

                // Add slight vignette
                float vignette = 1.0 - length(vUv - 0.5) * 0.3;
                color *= vignette;

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Watercolor edge detection shader
        this.watercolorShader = `
            uniform sampler2D tDiffuse;
            uniform vec2 resolution;
            uniform float edgeStrength;
            varying vec2 vUv;

            float sobel(vec2 coord) {
                vec2 texel = 1.0 / resolution;

                float tl = length(texture2D(tDiffuse, coord + vec2(-texel.x, -texel.y)).rgb);
                float tm = length(texture2D(tDiffuse, coord + vec2(0.0, -texel.y)).rgb);
                float tr = length(texture2D(tDiffuse, coord + vec2(texel.x, -texel.y)).rgb);
                float ml = length(texture2D(tDiffuse, coord + vec2(-texel.x, 0.0)).rgb);
                float mm = length(texture2D(tDiffuse, coord).rgb);
                float mr = length(texture2D(tDiffuse, coord + vec2(texel.x, 0.0)).rgb);
                float bl = length(texture2D(tDiffuse, coord + vec2(-texel.x, texel.y)).rgb);
                float bm = length(texture2D(tDiffuse, coord + vec2(0.0, texel.y)).rgb);
                float br = length(texture2D(tDiffuse, coord + vec2(texel.x, texel.y)).rgb);

                float gx = -1.0 * tl + -2.0 * ml + -1.0 * bl + tr + 2.0 * mr + br;
                float gy = -1.0 * tl + -2.0 * tm + -1.0 * tr + bl + 2.0 * bm + br;

                return length(vec2(gx, gy));
            }

            void main() {
                vec3 color = texture2D(tDiffuse, vUv).rgb;
                float edge = sobel(vUv);

                // Darken edges for painted look
                color = mix(color, color * 0.3, edge * edgeStrength);

                // Add paper texture
                float paper = fract(sin(dot(vUv * 500.0, vec2(12.9898, 78.233))) * 43758.5453);
                color = mix(color, color * 1.1, paper * 0.05);

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Atmospheric fog shader
        this.atmosphericShader = `
            uniform sampler2D tDiffuse;
            uniform sampler2D tDepth;
            uniform float fogDensity;
            uniform vec3 fogColor;
            varying vec2 vUv;

            void main() {
                vec3 color = texture2D(tDiffuse, vUv).rgb;
                float depth = texture2D(tDepth, vUv).r;

                // Apply exponential fog
                float fogFactor = exp(-fogDensity * depth);
                color = mix(fogColor, color, fogFactor);

                // Add slight color grading
                color.r *= 1.02;
                color.g *= 0.98;
                color.b *= 1.05;

                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }

    createOilPaintingPass(renderer, scene, camera) {
        const renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight
        );

        const material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                brushSize: { value: 3.0 },
                intensity: { value: 0.8 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.oilPaintingShader
        });

        return { renderTarget, material };
    }

    createWatercolorPass() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                edgeStrength: { value: 0.4 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.watercolorShader
        });

        return material;
    }

    createAtmosphericPass() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                tDepth: { value: null },
                fogDensity: { value: 0.02 },
                fogColor: { value: new THREE.Vector3(0.7, 0.7, 0.8) }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.atmosphericShader
        });

        return material;
    }

    // Apply all post-processing effects
    applyEffects(renderer, scene, camera, composer) {
        // Render scene normally first
        renderer.render(scene, camera);

        // Then apply post-processing chain
        // This would integrate with Three.js EffectComposer
        // Implementation depends on specific Three.js version
    }
}

// Color palette inspired by Disco Elysium
const DiscoElysiumPalette = {
    // Muted, desaturated colors
    sky: 0x8B9DC3,      // Grayish blue
    ground: 0x6B7353,   // Muted green
    road: 0x4A4A4A,     // Dark gray
    building1: 0x7D6D61, // Brown gray
    building2: 0x8E7F7F, // Reddish gray
    police: 0x4A5F7A,   // Muted blue
    player: 0x8B4513,   // Saddle brown

    // UI colors
    uiBackground: 0x2C2416,
    uiText: 0xC8B88B,
    uiHighlight: 0xE8D7C3,

    // Atmospheric colors
    fogColor: 0xB0B8C0,
    shadowColor: 0x3A3A3A,
    lightColor: 0xFFF5E6
};

export { DiscoElysiumShaders, DiscoElysiumPalette };