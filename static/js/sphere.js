const sphere = (() => {

    const container = document.getElementById("sphere");

    const COLOR = 0x2BEE34;

    let width = container.clientWidth || 250;
    let height = container.clientHeight || 250;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(COLOR, 2.2, 15);
    keyLight.position.set(2, 2, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x6dff74, 1.2, 15);
    rimLight.position.set(-2, -1, -2);
    scene.add(rimLight);

    const geometry = new THREE.IcosahedronGeometry(1.3, 4);
    const basePositions = geometry.attributes.position.array.slice();

    const material = new THREE.MeshPhongMaterial({
        color: COLOR,
        emissive: 0x0c3d0f,
        shininess: 60,
        transparent: true,
        opacity: 0.95
    });

    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    const wireGeometry = new THREE.IcosahedronGeometry(1.32, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x9dffa0,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wire);

    function makeGlowTexture(){

        const size = 256;

        const canvas = document.createElement("canvas");

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0,
            size / 2, size / 2, size / 2
        );

        gradient.addColorStop(0, "rgba(43,238,52,0.9)");
        gradient.addColorStop(0.4, "rgba(43,238,52,0.4)");
        gradient.addColorStop(1, "rgba(43,238,52,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);

    }

    const glowMaterial = new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(5, 5, 1);
    scene.add(glow);

    const rings = [];

    for(let i = 0; i < 3; i++){

        const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 64);

        const ringMat = new THREE.MeshBasicMaterial({
            color: COLOR,
            transparent: true,
            opacity: 0
        });

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        rings.push({ mesh: ring, delay: i * 0.5 });

    }

    const states = ["idle", "listening", "thinking", "speaking"];

    let current = "idle";

    function setState(state){

        if(!states.includes(state)) return;

        if(current === state) return;

        current = state;

    }

    function idle(){ setState("idle"); }
    function listening(){ setState("listening"); }
    function thinking(){ setState("thinking"); }
    function speaking(){ setState("speaking"); }

    const clock = new THREE.Clock();

    function distort(intensity, speed, t){

        const pos = geometry.attributes.position;

        for(let i = 0; i < pos.count; i++){

            const ix = i * 3;

            const bx = basePositions[ix];
            const by = basePositions[ix + 1];
            const bz = basePositions[ix + 2];

            const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;

            const nx = bx / len, ny = by / len, nz = bz / len;

            const noise =
                Math.sin(nx * 4 + t * speed) *
                Math.cos(ny * 4 + t * speed * 0.8) *
                Math.sin(nz * 4 + t * speed * 1.2);

            const offset = 1 + noise * intensity;

            pos.setXYZ(i, bx * offset, by * offset, bz * offset);

        }

        pos.needsUpdate = true;

        geometry.computeVertexNormals();

    }

    function animate(){

        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        core.rotation.y += 0.003;
        wire.rotation.y -= 0.002;
        wire.rotation.x += 0.001;

        switch(current){

            case "idle": {

                core.position.y = Math.sin(t * 0.9) * 0.12;
                core.scale.setScalar(1 + Math.sin(t * 1.2) * 0.02);
                distort(0.04, 1.2, t);

                keyLight.intensity = 2.0 + Math.sin(t * 1.5) * 0.3;
                glow.material.opacity = 0.7 + Math.sin(t * 1.5) * 0.1;
                glow.scale.setScalar(3.4 + Math.sin(t * 1.5) * 0.15);

                rings.forEach(r => r.mesh.material.opacity = 0);

                break;

            }

            case "listening": {

                core.position.y = Math.sin(t * 3) * 0.06;
                core.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
                distort(0.03, 2.5, t);

                keyLight.intensity = 2.8 + Math.sin(t * 4) * 0.5;
                glow.material.opacity = 0.85;
                glow.scale.setScalar(3.6 + Math.sin(t * 4) * 0.2);

                rings.forEach((r) => {

                    const local = (t * 0.6 + r.delay) % 1.5;

                    r.mesh.scale.setScalar(1 + local * 0.9);
                    r.mesh.material.opacity = Math.max(0, 0.5 - local * 0.35);

                });

                break;

            }

            case "thinking": {

                core.position.y = 0;
                core.rotation.x = Math.sin(t * 2) * 0.15;
                core.scale.setScalar(1 + Math.sin(t * 6) * 0.015);
                distort(0.09, 4, t);

                keyLight.intensity = 2.2 + Math.sin(t * 6) * 0.6;
                keyLight.position.x = Math.sin(t * 2) * 3;
                keyLight.position.z = Math.cos(t * 2) * 3;

                glow.material.opacity = 0.75 + Math.sin(t * 5) * 0.15;
                glow.scale.setScalar(3.5 + Math.sin(t * 5) * 0.1);

                rings.forEach(r => r.mesh.material.opacity = 0);

                break;

            }

            case "speaking": {

                core.position.y = 0;

                const pulse = Math.abs(Math.sin(t * 8));

                core.scale.setScalar(1 + pulse * 0.08);
                distort(0.06, 6, t);

                keyLight.intensity = 2.4 + pulse * 0.8;
                glow.material.opacity = 0.75 + pulse * 0.2;
                glow.scale.setScalar(3.5 + pulse * 0.3);

                rings.forEach(r => r.mesh.material.opacity = 0);

                break;

            }

        }

        renderer.render(scene, camera);

    }

    animate();

    window.addEventListener("resize", () => {

        width = container.clientWidth || width;
        height = container.clientHeight || height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    });

    return {
        setState,
        idle,
        listening,
        thinking,
        speaking,
        get state(){ return current; }
    };

})();