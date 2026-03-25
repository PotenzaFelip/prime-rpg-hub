let scene, camera, renderer, world, controls, dice = [];
let needsSum = false;
const DEFAULTS = { grav: -85, force: 30, damp: 0.7, stop: 0.4 };
let cfg = { ...DEFAULTS };

// --- FUNÇÕES GLOBAIS (PARA O HTML) ---
window.toggleConfig = () => {
    const p = document.getElementById('config-panel');
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
};

window.resetPhysics = () => {
    cfg = { ...DEFAULTS };
    world.gravity.set(0, cfg.grav, 0);
    ['grav', 'force', 'damp', 'stop'].forEach(id => {
        const el = document.getElementById(id);
        const valEl = document.getElementById(`v-${id}`);
        if(el) el.value = cfg[id];
        if(valEl) valEl.innerText = cfg[id];
    });
};

// --- MOTOR 3D E INICIALIZAÇÃO ---
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 35, 35);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('view-dice').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(15, 30, 15); light.castShadow = true;
    scene.add(light);

    world = new CANNON.World();
    world.gravity.set(0, cfg.grav, 0);

    // Chão da Mesa
    const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(25, 0.5, 25)) });
    world.addBody(floorBody);
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), new THREE.MeshPhongMaterial({color: 0x111111}));
    floorMesh.position.y = -0.5; floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Paredes Invisíveis (Norte, Sul, Leste, Oeste)
    createWall(0, 5, 25, 50, 10, 1);
    createWall(0, 5, -25, 50, 10, 1);
    createWall(25, 5, 0, 1, 10, 50);
    createWall(-25, 5, 0, 1, 10, 50);

    setupPhysicsListeners();
    animate();
}

function createWall(x, y, z, w, h, d) {
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2)) });
    body.position.set(x, y, z); 
    world.addBody(body);
}

function setupPhysicsListeners() {
    ['grav', 'force', 'damp', 'stop'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                cfg[id] = val;
                document.getElementById(`v-${id}`).innerText = val;
                if(id === 'grav') world.gravity.set(0, val, 0);
            });
        }
    });
}

// --- LABELS DOS NÚMEROS ---
function createLabel(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.beginPath(); ctx.arc(64,64,60,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = color; ctx.font = 'bold 80px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas), 
        depthTest: false 
    }));
    sprite.scale.set(3.5, 3.5, 1);
    return sprite;
}

// --- ROLAGENS ---
window.rollDice = function(type) {
    const size = 1.6;
    const colors = { d4: '#e74c3c', d6: '#e67e22', d8: '#f1c40f', d10: '#9b59b6', d12: '#2ecc71', d20: '#3498db' };
    let geo, shape;

    switch(type) {
        case 'd4': geo = new THREE.TetrahedronGeometry(size); shape = new CANNON.Sphere(size*0.8); break;
        case 'd6': geo = new THREE.BoxGeometry(size, size, size); shape = new CANNON.Box(new CANNON.Vec3(size/2,size/2,size/2)); break;
        case 'd8': geo = new THREE.OctahedronGeometry(size); shape = new CANNON.Sphere(size*0.9); break;
        case 'd10': geo = new THREE.CylinderGeometry(0, size, size*1.3, 10); shape = new CANNON.Sphere(size); break;
        case 'd12': geo = new THREE.DodecahedronGeometry(size); shape = new CANNON.Sphere(size); break;
        case 'd20': geo = new THREE.IcosahedronGeometry(size, 0); shape = new CANNON.Sphere(size); break;
    }

    const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color: colors[type], shininess: 80 }));
    mesh.castShadow = true; scene.add(mesh);

    const body = new CANNON.Body({ mass: 2, shape: shape, position: new CANNON.Vec3(0, 15, 0) });
    body.angularDamping = cfg.damp;
    body.velocity.set((Math.random()-0.5)*cfg.force, -30, (Math.random()-0.5)*cfg.force);
    body.angularVelocity.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50);
    
    world.addBody(body);
    dice.push({ mesh, body, type, color: colors[type], rolling: true, val: 0, label: null });
    needsSum = true;
};

window.rollAll = () => {
    dice.forEach(d => {
        if(d.label) { scene.remove(d.label); d.label = null; }
        d.body.position.set((Math.random()-0.5)*5, 15, (Math.random()-0.5)*5);
        d.body.velocity.set((Math.random()-0.5)*cfg.force, -30, (Math.random()-0.5)*cfg.force);
        d.body.angularDamping = cfg.damp;
        d.rolling = true;
    });
    needsSum = true;
};

window.clearTable = () => {
    dice.forEach(d => { 
        scene.remove(d.mesh); 
        if(d.label) scene.remove(d.label); 
        world.removeBody(d.body); 
    });
    dice = [];
};

window.clearLog = () => document.getElementById('log').innerHTML = '';

function animate() {
    requestAnimationFrame(animate);
    world.step(1/60);
    controls.update();
    let allStopped = true;

    dice.forEach(d => {
        d.mesh.position.copy(d.body.position);
        d.mesh.quaternion.copy(d.body.quaternion);
        
        const motion = d.body.velocity.length() + d.body.angularVelocity.length();
        
        if(motion < cfg.stop && d.rolling) {
            d.rolling = false;
            d.body.velocity.set(0,0,0); d.body.angularVelocity.set(0,0,0);
            
            // Gerar valor baseado no tipo do dado
            d.val = Math.floor(Math.random() * parseInt(d.type.substring(1))) + 1;
            
            // Criar e adicionar o número flutuante
            d.label = createLabel(d.val.toString(), d.color);
            scene.add(d.label);
            
        } else if (motion >= cfg.stop) {
            allStopped = false;
            if(d.label) { scene.remove(d.label); d.label = null; }
        }

        // Faz o label seguir o dado um pouco acima
        if(d.label) {
            d.label.position.set(d.mesh.position.x, d.mesh.position.y + 3.5, d.mesh.position.z);
        }
    });

    if(allStopped && needsSum && dice.length > 0) {
        const log = document.getElementById('log');
        let formula = []; let total = 0;
        dice.forEach(d => { formula.push(`${d.type}(${d.val})`); total += d.val; });
        
        const entry = document.createElement('div');
        entry.className = 'sum-entry';
        entry.innerHTML = `<strong>TOTAL: ${total}</strong><br><small>${formula.join(' + ')}</small>`;
        log.prepend(entry);
        needsSum = false;
    }
    renderer.render(scene, camera);
}

window.onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', window.onResize);
init();