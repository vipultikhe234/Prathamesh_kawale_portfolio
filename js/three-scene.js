/**
 * Prathamesh Kawale — 3D Mechanical Engine & Product Inspection Lab
 * Built with Three.js (r128)
 */

(function () {
  'use strict';

  // State Management
  const App3D = {
    hero: {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      assemblyGroup: null,
      parts: [],
      isExploded: false,
      isWireframe: false,
      animId: null
    },
    lab: {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      activeModelKey: 'rfid_storage',
      currentGroup: null,
      parts: [],
      renderMode: 'solid', // solid | wire | xray | stress
      explodeProgress: 0,
      hotspots: [],
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      animId: null
    }
  };

  // Model Specs Database for Lab & Modals
  window.PROJECT_DATA = {
    rfid_storage: {
      code: 'PRJ-NPD-01',
      title: '8-Drawer RFID Diamond Storage & Tracking Machine',
      category: 'Special Purpose Machine (SPM) / Induce Design',
      materialBadge: 'CRCA SHEET METAL & RF SHIELD COATING',
      summary: 'High-security automated inventory vault capable of securely tracking ~4,800 RFID-tagged diamond packets across 16 internal compartments. Engineered with custom central mechanical interlocks, anti-tilt prevention, and RF signal spill mitigation.',
      problem: 'Diamond vault operations faced severe inventory cross-reading and RFID signal bleed between adjacent stacked drawers, alongside security hazards where multiple heavy drawers opened at once could tilt the unit.',
      solution: 'Conducted 2 major mechanical redesign cycles. Fabricated internal isolated aluminum Faraday chambers with tuned antenna positions, and designed a robust mechanical central locking linkage that physically locks all other drawers when one is active.',
      cadSoftware: 'SolidWorks / CATIA V5',
      primaryMaterial: 'CRCA Sheet Metal (1.5mm - 2.5mm) & RF Shield Coating',
      mfgProcess: 'CNC Laser Cutting, CNC Press Brake Bending, Powder Coating',
      capacity: '16 Compartments (~4,800 Packets)',
      electronics: 'RFID Readers, Proximity Sensors, PoE Switch, SMPS, Motor Drivers',
      challenge: 'Resolved severe RF signal spill and cross-reading issues between compartments through 5 physical prototyping iterations and electromagnetic isolation baffles.',
      image: 'assets/images/rfid_storage.jpg',
      highlights: [
        'Designed complete 8-drawer mechanical layout, drawer slide mounts, and anti-tilt locking system.',
        'Created 2D manufacturing drawings, GD&T annotations, and comprehensive Bills of Materials (BOM).',
        'Conducted RF shielding R&D, antenna position tuning, and integration of PoE & SMPS power supplies.',
        'Delivered complete 3D rendering presentations for client review and stakeholder sign-off.'
      ],
      tableSpecs: [
        { param: 'Machine Dimensions', spec: '1200 x 600 x 1800 mm', method: 'Sheet Metal Enclosure' },
        { param: 'Drawer Interlock', spec: 'Mechanical Anti-Tilt Central Lock', method: 'CNC Milled Linkages' },
        { param: 'RFID Frequency', spec: 'UHF 865 - 868 MHz Isolated', method: 'Custom Antenna Cavity' },
        { param: 'Surface Treatment', spec: '7-Tank Process Powder Coating', method: 'Matte Charcoal & Cyan Accents' }
      ]
    },
    rfid_desktop: {
      code: 'PRJ-NPD-02',
      title: 'RFID Desktop Scanner Unit with FRP Enclosure',
      category: 'Industrial Product Design / Induce Design',
      materialBadge: 'FRP COMPOSITE & ALUMINIUM C-BENDS',
      summary: 'Compact desktop identification scanner designed for diamond packets and high-value small parts. Features a lightweight molded FRP composite outer shell, internal aluminum structural C-bends, and a gas spring-assisted hatch with custom stopper brackets.',
      problem: 'Desktop units required a lightweight yet highly durable enclosure that shielded RFID emissions while providing effortless one-handed operator access via a smooth hatch door.',
      solution: 'Selected Fiber-Reinforced Plastic (FRP) for the aesthetic outer body and paired it with CNC-bent aluminum C-channels for structural grounding. Integrated a miniature gas spring mechanism with tuned pivot angles to ensure controlled door dampening.',
      cadSoftware: 'SolidWorks / Creo',
      primaryMaterial: 'FRP (Fiberglass Composite) & Aluminium 6061-T6',
      mfgProcess: 'FRP Hand Layup / Compression Mold, CNC Sheet Bending',
      capacity: 'Single Tray High-Speed Scan (~100 items / batch)',
      electronics: 'UHF RFID Antenna Array, USB-C / PoE Interface, Status LEDs',
      challenge: 'Overcame RF leakage around door seams by implementing internal conductive shielding coatings and optimizing gasket compressions over 5 R&D build cycles.',
      image: 'assets/images/rfid_desktop.jpg',
      highlights: [
        'Developed mechanical design of FRP base, aluminum internal plates, brackets, and hinges.',
        'Engineered gas spring-based door mechanism with optimized pivot points and mechanical stoppers.',
        'Integrated RFID antenna array and reader chassis with noise-isolated grounding.',
        'Conducted 5 design & prototyping iterations to eliminate RF spill and achieve ergonomic compliance.'
      ],
      tableSpecs: [
        { param: 'Housing Material', spec: 'Molded FRP Composite Shell', method: 'Compression Tooling' },
        { param: 'Internal Chassis', spec: 'AL 6061-T6 (2.0mm C-Bends)', method: 'CNC Laser & Press Brake' },
        { param: 'Door Kinematics', spec: 'Gas Strut 50N with Pivot Stop', method: 'Kinematic Simulation' },
        { param: 'Shielding', spec: 'Conductive Nickel/Copper Coating', method: 'Aerosol Spray Shield' }
      ]
    },
    aed_enclosure: {
      code: 'PRJ-NPD-03',
      title: 'Automated External Defibrillator (AED) Enclosure',
      category: 'Medical Device NPD / Induce Design',
      materialBadge: 'VACUUM FORMED HIGH IMPACT POLYSTYRENE',
      summary: 'Ergonomic, life-saving emergency medical device casing designed for rugged durability, rapid deployment, and intuitive emergency usability. Engineered for vacuum forming manufacturing in High Impact Polystyrene (HIPS).',
      problem: 'Medical enclosures must withstand drop impacts, environmental exposure, and accommodate high-voltage electronics while maintaining ultra-fast intuitive operation for non-medical personnel.',
      solution: 'Designed an ergonomic clamshell structure featuring an integrated carrying handle, large high-contrast status screen bezel, protective shock-button flap, and rapid-release electrode pad bay using vacuum formed HIPS.',
      cadSoftware: 'Creo / SolidWorks / CATIA V5',
      primaryMaterial: 'High Impact Polystyrene (HIPS - Medical Grade)',
      mfgProcess: 'Thermoforming / Vacuum Forming & CNC Trimming',
      capacity: 'Full AED Electronic Assembly + Defibrillation Pads & Battery',
      electronics: 'High Voltage Capacitor Bay, LCD Diagnostic Display, Speaker',
      challenge: 'Optimized draft angles, corner radii, and uniform wall thickness distribution to eliminate thinning and webbing defects during vacuum forming.',
      image: 'assets/images/aed_enclosure.jpg',
      highlights: [
        'Engineered complete outer body / enclosure taking full account of DFM for vacuum forming.',
        'Selected HIPS for superior impact resistance, rigidity, and rapid cycle-time manufacturing.',
        'Designed internal mounting bosses and snap features for electronic board and capacitor subassemblies.',
        'Created photorealistic 3D Keyshot renderings and client support presentation decks.'
      ],
      tableSpecs: [
        { param: 'Plastic Material', spec: 'Medical-Grade HIPS (3.2mm sheet)', method: 'Vacuum Forming' },
        { param: 'Impact Rating', spec: 'IK08 High Energy Shock Resistance', method: 'FEA Drop Simulation' },
        { param: 'Assembly Style', spec: 'Clamshell with Ultrasonic / Fastener Bosses', method: 'CNC Machined Tool' },
        { param: 'Aesthetics', spec: 'High-Visibility Rescue Red & Arctic White', method: 'UV-Stabilized Masterbatch' }
      ]
    },
    suspension_spm: {
      code: 'PRJ-NPD-04',
      title: 'TATA - Hendrickson Heavy Suspension Scale Model',
      category: 'Automotive Scale Engineering / Induce Design',
      materialBadge: 'PRECISION MACHINED STEEL & LEAF SPRINGS',
      summary: 'High-accuracy engineering scale replica of the heavy commercial vehicle suspension system for client validation, trade exhibitions, and tooling clearance studies.',
      problem: 'Tooling manufacturers and automotive clients needed an exact, functioning physical prototype demonstrating multi-leaf spring deflection, axle kinematics, and wheel hub mounting tolerances.',
      solution: 'Modeled detailed scale components including leaf spring packs with parabolic curvature, U-bolt clamp assemblies, heavy axle housing, and dual-bearing wheel hubs with authentic mechanical motion.',
      cadSoftware: 'SolidWorks / CATIA V5',
      primaryMaterial: 'Mild Steel, Spring Steel Grade 65Mn, Brass Bushings',
      mfgProcess: 'CNC Milling, Wire EDM, Precision Turning',
      capacity: 'Heavy Vehicle Scale (1:5 Physical Functional Prototype)',
      electronics: 'Static Mechanical Kinematic Rig',
      challenge: 'Maintaining micro-tolerances and realistic leaf spring progressive spring rates at 1:5 scale to accurately mirror real-world heavy duty truck suspensions.',
      image: 'assets/images/rfid_storage.jpg',
      highlights: [
        'Engineered scale components: chassis rails, axle beams, leaf spring packs, and wheel hubs.',
        'Adapted CAD models according to differing client tooling requirements and feedback loops.',
        'Created exploded assembly layouts and 2D workshop drawings with tight GD&T limits.',
        'Demonstrated practical suspension deflection under scaled compressive loads.'
      ],
      tableSpecs: [
        { param: 'Assembly Scale', spec: '1:5 Precision Functional Model', method: 'Multi-Axis CNC Machining' },
        { param: 'Spring Mechanism', spec: 'Multi-Leaf Parabolic Spring Pack', method: 'Heat-Treated Spring Steel' },
        { param: 'Axle Interface', spec: 'Heavy-Duty Forged Axle Beam Replica', method: 'Machined Mild Steel' },
        { param: 'Fastening', spec: 'Scaled High-Tensile U-Bolts & Cast Brackets', method: 'Grade 8.8 Fasteners' }
      ]
    },
    oil_cutter: {
      code: 'PRJ-ACAD-01',
      title: 'Design & Fabrication of Industrial Oil Cake Cutter Machine',
      category: 'Academic Final Year Capstone SPM',
      materialBadge: 'MILD STEEL FRAME & TUNGSTEN CARBIDE CUTTERS',
      summary: 'Electromechanical Special Purpose Machine built to automate the hazardous and labor-intensive manual breaking of dense oil cake sheets produced in "lakdi ghani" oil extraction mills into cattle feed.',
      problem: 'Mill workers historically spent hours manually hammering dense oil cake slabs, causing severe physical strain, low output, inconsistent particle sizes, and high workplace dust.',
      solution: 'Engineered a dual-shaft cutting chamber equipped with counter-rotating tungsten-carbide teeth, powered by a 2HP single-phase motor through a belt-pulley speed reduction and spur gear transmission.',
      cadSoftware: 'SolidWorks / MATLAB (Kinematic & Torque calculations)',
      primaryMaterial: 'Mild Steel IS 2062 Frame, Tungsten Carbide Cutter Inserts',
      mfgProcess: 'Welding Fabrication, Lathe Turning, Gear Hobbing, Assembly',
      capacity: '150 - 200 kg/hr Sized Cattle Feed',
      electronics: '2HP Single-Phase Induction Motor, DOL Starter, Safety Interlock',
      challenge: 'Calculating necessary cutting torque to shear tough fibrous oil cake without stalling the 2HP motor while optimizing hopper angle to prevent material jamming.',
      image: 'assets/images/rfid_desktop.jpg',
      highlights: [
        'Designed entire electromechanical SPM: Dual shafts, hopper, spur gear train, frame, and cutters.',
        'Fabricated mild steel structural frame and welded hopper with anti-bridging geometry.',
        'Selected tungsten carbide cutter tips for maximum wear resistance and minimal maintenance.',
        'Reduced human effort by over 80% and improved cattle feed grain consistency dramatically.'
      ],
      tableSpecs: [
        { param: 'Drive Motor', spec: '2 HP Single-Phase AC (1440 RPM)', method: 'Belt Reduction to 280 RPM' },
        { param: 'Gearbox', spec: 'Spur Gear Pair (Module 4, 20° PA)', method: 'Case-Hardened Steel' },
        { param: 'Cutter Shafts', spec: 'Dual Counter-Rotating Hex Shafts', method: 'EN8 High Strength Steel' },
        { param: 'Cutter Inserts', spec: 'Tungsten Carbide Tip Blades', method: 'Brazed & Ground Edges' }
      ]
    }
  };

  // =========================================================================
  // 1. HERO 3D MECHANICAL MECHANISM (Planetary Gear / Turbine CAD Assembly)
  // =========================================================================
  function initHeroScene() {
    const container = document.getElementById('hero3dContainer');
    const canvas = document.getElementById('heroCanvas');
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    App3D.hero.scene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 7.5);
    App3D.hero.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    App3D.hero.renderer = renderer;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 4;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    App3D.hero.controls = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff8400, 1.8);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 15);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Build Mechanical CAD Assembly (Central Core, Rotor Ring, Planetary Gears, Caliper Arms)
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);
    App3D.hero.assemblyGroup = assemblyGroup;

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0x0088aa,
      emissiveIntensity: 0.6
    });

    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xff8400,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x663300,
      emissiveIntensity: 0.4
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true
    });

    // 1. Central Axle Hub
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 32);
    const hub = new THREE.Mesh(hubGeo, metalMat);
    hub.rotation.x = Math.PI / 2;
    hub.userData = { explodeOffset: new THREE.Vector3(0, 0, -1.2) };
    assemblyGroup.add(hub);
    App3D.hero.parts.push(hub);

    // 2. Central Sun Gear
    const sunGearGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.4, 24);
    const sunGear = new THREE.Mesh(sunGearGeo, amberMat);
    sunGear.rotation.x = Math.PI / 2;
    sunGear.userData = { explodeOffset: new THREE.Vector3(0, 0, 0) };
    assemblyGroup.add(sunGear);
    App3D.hero.parts.push(sunGear);

    // 3. Outer Ring Gear with teeth notches
    const ringGeo = new THREE.TorusGeometry(2.4, 0.25, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.userData = { explodeOffset: new THREE.Vector3(0, 0, 1.2) };
    assemblyGroup.add(ringMesh);
    App3D.hero.parts.push(ringMesh);

    // 4. Planetary Satellite Gears (4x)
    const planetGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 16);
    const planetGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const planet = new THREE.Mesh(planetGeo, cyanGlowMat);
      planet.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
      planet.rotation.x = Math.PI / 2;
      planet.userData = {
        angle: angle,
        explodeOffset: new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0.5)
      };
      planetGroup.add(planet);
      App3D.hero.parts.push(planet);
    }
    assemblyGroup.add(planetGroup);

    // 5. Surrounding CAD Measurement Caliper Rings
    const caliperRingGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const caliperRing = new THREE.Mesh(caliperRingGeo, wireMat);
    caliperRing.userData = { explodeOffset: new THREE.Vector3(0, 0, -1.8) };
    assemblyGroup.add(caliperRing);
    App3D.hero.parts.push(caliperRing);

    // 6. Mechanical Flange Brackets
    const bracketGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    for (let j = 0; j < 6; j++) {
      const bAngle = (j * Math.PI) / 3;
      const bracket = new THREE.Mesh(bracketGeo, metalMat);
      bracket.position.set(Math.cos(bAngle) * 2.1, Math.sin(bAngle) * 2.1, 0.3);
      bracket.rotation.z = bAngle;
      bracket.userData = { explodeOffset: new THREE.Vector3(Math.cos(bAngle) * 1.2, Math.sin(bAngle) * 1.2, 1.0) };
      assemblyGroup.add(bracket);
      App3D.hero.parts.push(bracket);
    }

    // Coordinates HUD element
    const coordEl = document.getElementById('heroCoordinates');

    // Hero Render Loop
    function animateHero() {
      App3D.hero.animId = requestAnimationFrame(animateHero);

      controls.update();

      // Slow internal counter-rotations
      sunGear.rotation.z += 0.02;
      planetGroup.rotation.z -= 0.01;
      for (let p of planetGroup.children) {
        p.rotation.z += 0.03;
      }

      // Update HUD Coordinates
      if (coordEl) {
        coordEl.textContent = `X: ${camera.position.x.toFixed(2)} Y: ${camera.position.y.toFixed(2)} Z: ${camera.position.z.toFixed(2)}`;
      }

      renderer.render(scene, camera);
    }
    animateHero();

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Button: Explode Assembly in Hero
    const explodeBtn = document.getElementById('heroExplodeBtn');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        App3D.hero.isExploded = !App3D.hero.isExploded;
        explodeHeroAssembly(App3D.hero.isExploded);
      });
    }

    // Button: Wireframe Toggle in Hero
    const wireBtn = document.getElementById('heroWireframeBtn');
    if (wireBtn) {
      wireBtn.addEventListener('click', () => {
        App3D.hero.isWireframe = !App3D.hero.isWireframe;
        scene.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = App3D.hero.isWireframe;
          }
        });
      });
    }
  }

  function explodeHeroAssembly(isExploded) {
    App3D.hero.parts.forEach((mesh) => {
      const target = isExploded && mesh.userData.explodeOffset
        ? mesh.userData.explodeOffset
        : new THREE.Vector3(0, 0, 0);

      gsap.to(mesh.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.2,
        ease: 'power3.out'
      });
    });
  }

  // =========================================================================
  // 2. INTERACTIVE 3D PRODUCT INSPECTION LAB
  // =========================================================================
  function initLabScene() {
    const container = document.getElementById('lab3dCanvasContainer');
    const canvas = document.getElementById('labCanvas');
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    App3D.lab.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 3, 6);
    App3D.lab.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    App3D.lab.renderer = renderer;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2.5;
    App3D.lab.controls = controls;

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(6, 10, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 2.5, 12);
    cyanRim.position.set(-5, 3, -4);
    scene.add(cyanRim);

    const amberFill = new THREE.PointLight(0xff8400, 2.0, 10);
    amberFill.position.set(4, -3, 3);
    scene.add(amberFill);

    // Floor CAD Blueprint Grid
    const grid = new THREE.GridHelper(10, 20, 0x00f0ff, 0x1e293b);
    grid.position.y = -1.8;
    scene.add(grid);

    // Load Default Model
    loadLabModel('rfid_storage');

    // Lab Animation Loop
    function animateLab() {
      App3D.lab.animId = requestAnimationFrame(animateLab);
      controls.update();
      renderer.render(scene, camera);
    }
    animateLab();

    // Canvas Resize Handler
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Model Selector Tabs
    const tabs = document.querySelectorAll('.model-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.dataset.model;
        loadLabModel(key);
      });
    });

    // Explode Slider
    const slider = document.getElementById('explodeSlider');
    const percentEl = document.getElementById('explodePercent');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        App3D.lab.explodeProgress = val;
        if (percentEl) percentEl.textContent = `${Math.round(val * 100)}%`;
        applyLabExplosion(val);
      });
    }

    // View Mode Buttons (Solid, Wireframe, X-Ray, FEA Stress)
    const modeBtns = document.querySelectorAll('.view-mode-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.id.replace('btnRender', '').toLowerCase();
        setLabRenderMode(mode);
      });
    });

    // Reset Camera Button
    const resetBtn = document.getElementById('btnResetView');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        gsap.to(camera.position, { x: 4, y: 3, z: 6, duration: 1 });
        controls.target.set(0, 0, 0);
      });
    }

    // Raycast on Hotspots
    canvas.addEventListener('click', onCanvasClick);
  }

  // =========================================================================
  // 3. PROCEDURAL 3D CAD MODEL BUILDERS FOR LAB
  // =========================================================================
  function loadLabModel(modelKey) {
    const scene = App3D.lab.scene;
    if (!scene) return;

    // Remove existing model group
    if (App3D.lab.currentGroup) {
      scene.remove(App3D.lab.currentGroup);
    }
    App3D.lab.parts = [];
    App3D.lab.hotspots = [];

    const group = new THREE.Group();
    App3D.lab.currentGroup = group;
    App3D.lab.activeModelKey = modelKey;

    // Reset Explode Slider
    const slider = document.getElementById('explodeSlider');
    const percentEl = document.getElementById('explodePercent');
    if (slider) slider.value = 0;
    if (percentEl) percentEl.textContent = '0%';
    App3D.lab.explodeProgress = 0;

    // Build specific 3D geometry
    if (modelKey === 'rfid_storage') {
      buildRfidStorageModel(group);
    } else if (modelKey === 'aed_enclosure') {
      buildAedEnclosureModel(group);
    } else if (modelKey === 'rfid_desktop') {
      buildRfidDesktopModel(group);
    } else if (modelKey === 'suspension_spm') {
      buildSuspensionModel(group);
    }

    scene.add(group);

    // Apply current render mode (solid/wire/etc.)
    setLabRenderMode(App3D.lab.renderMode);

    // Update UI Cards with Project Specs
    updateLabUI(modelKey);
  }

  // A) 8-Drawer RFID Diamond Storage Machine
  function buildRfidStorageModel(group) {
    // 1. Outer Frame / Cabinet Enclosure
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x1e2638, metalness: 0.8, roughness: 0.3 });
    const cabinetGeo = new THREE.BoxGeometry(2.4, 3.6, 1.8);
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.userData = { name: 'Main Chassis Frame', explodeOffset: new THREE.Vector3(0, 0, -1.5) };
    group.add(cabinet);
    App3D.lab.parts.push(cabinet);

    // 2. Front Center Lock Dial & Touchscreen
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.1, emissive: 0x004466 });
    const lockPanelGeo = new THREE.BoxGeometry(1.0, 1.2, 0.2);
    const lockPanel = new THREE.Mesh(lockPanelGeo, lockMat);
    lockPanel.position.set(0, 0.4, 0.95);
    lockPanel.userData = { name: 'Central Anti-Tilt Keypad & RFID Controller', explodeOffset: new THREE.Vector3(0, 0, 2.5) };
    group.add(lockPanel);
    App3D.lab.parts.push(lockPanel);

    // 3. 8 Slide-Out Drawers
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.1 });

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 2; col++) {
        const dX = col === 0 ? -0.58 : 0.58;
        const dY = 1.2 - row * 0.75;
        const drawerGeo = new THREE.BoxGeometry(1.05, 0.65, 1.6);
        const drawer = new THREE.Mesh(drawerGeo, drawerMat);
        drawer.position.set(dX, dY, 0.05);

        // Drawer Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16), handleMat);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0, 0, 0.85);
        drawer.add(handle);

        const dIndex = row * 2 + col + 1;
        drawer.userData = {
          name: `Drawer #${dIndex} [RF Isolated Chamber]`,
          explodeOffset: new THREE.Vector3(dX * 1.8, dY * 1.2, 1.2 + row * 0.3)
        };
        group.add(drawer);
        App3D.lab.parts.push(drawer);
      }
    }

    // Add Hotspot
    createLabHotspot(new THREE.Vector3(0, 0.4, 1.1), 'Central Lock Controller', 'Integrated mechanical interlocking system with anti-tilt prevention to restrict simultaneous drawer opening.');
    createLabHotspot(new THREE.Vector3(-0.6, 1.2, 0.9), 'RF Shielded Drawer Chamber', 'Faraday isolation compartments coated with RF-attenuating layers preventing tag cross-reading.');
  }

  // B) AED Enclosure (High Impact Polystyrene)
  function buildAedEnclosureModel(group) {
    // 1. Red Outer Body Shell (Vacuum Formed HIPS)
    const redHipsMat = new THREE.MeshStandardMaterial({ color: 0xd92626, metalness: 0.2, roughness: 0.35 });
    const baseGeo = new THREE.BoxGeometry(3.0, 2.2, 1.4);
    const body = new THREE.Mesh(baseGeo, redHipsMat);
    body.userData = { name: 'Main HIPS Outer Shell', explodeOffset: new THREE.Vector3(0, 0, -1.0) };
    group.add(body);
    App3D.lab.parts.push(body);

    // 2. Integrated Carrying Handle
    const handleGeo = new THREE.TorusGeometry(0.8, 0.16, 16, 32, Math.PI);
    const handle = new THREE.Mesh(handleGeo, redHipsMat);
    handle.position.set(0, 1.05, 0);
    handle.userData = { name: 'Ergonomic Top Handle', explodeOffset: new THREE.Vector3(0, 1.5, 0) };
    group.add(handle);
    App3D.lab.parts.push(handle);

    // 3. LCD Screen & Status Indicator Panel
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1, emissive: 0x003344 });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.1), screenMat);
    screen.position.set(-0.5, 0.1, 0.72);
    screen.userData = { name: 'High-Contrast Diagnostic LCD', explodeOffset: new THREE.Vector3(-0.5, 0.1, 2.0) };
    group.add(screen);
    App3D.lab.parts.push(screen);

    // 4. Defibrillator Shock Button (High Visibility Amber)
    const shockBtnMat = new THREE.MeshStandardMaterial({ color: 0xff8400, metalness: 0.4, roughness: 0.2, emissive: 0xaa4400 });
    const shockBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 24), shockBtnMat);
    shockBtn.rotation.x = Math.PI / 2;
    shockBtn.position.set(0.8, 0.3, 0.75);
    shockBtn.userData = { name: 'Protected Shock Button (Spring Loaded)', explodeOffset: new THREE.Vector3(1.2, 0.3, 2.2) };
    group.add(shockBtn);
    App3D.lab.parts.push(shockBtn);

    // 5. Electrode Pad Compartment Door (Transparent)
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, metalness: 0.1, roughness: 0.1 });
    const padDoor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.08), glassMat);
    padDoor.position.set(0.8, -0.4, 0.73);
    padDoor.userData = { name: 'Transparent Electrode Door', explodeOffset: new THREE.Vector3(1.5, -0.4, 2.0) };
    group.add(padDoor);
    App3D.lab.parts.push(padDoor);

    createLabHotspot(new THREE.Vector3(0, 1.1, 0), 'HIPS Molded Handle', 'Designed with uniform wall thickness and proper draft angles for seamless vacuum forming extraction.');
    createLabHotspot(new THREE.Vector3(0.8, 0.3, 0.8), 'Shock Actuation Bezel', 'Recessed emergency button designed to prevent accidental actuation during transit.');
  }

  // C) RFID Desktop Unit (FRP Composite & Gas Spring Hatch)
  function buildRfidDesktopModel(group) {
    // 1. FRP Composite Base
    const frpMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3, roughness: 0.4 });
    const baseGeo = new THREE.BoxGeometry(2.8, 1.4, 2.4);
    const base = new THREE.Mesh(baseGeo, frpMat);
    base.userData = { name: 'FRP Composite Base Housing', explodeOffset: new THREE.Vector3(0, -0.8, 0) };
    group.add(base);
    App3D.lab.parts.push(base);

    // 2. Gas-Spring Assisted Upper Hatch Door
    const hatchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const hatchGeo = new THREE.BoxGeometry(2.6, 0.3, 2.2);
    const hatch = new THREE.Mesh(hatchGeo, hatchMat);
    hatch.position.set(0, 0.85, 0);
    hatch.userData = { name: 'Gas Spring-Assisted Opening Door', explodeOffset: new THREE.Vector3(0, 1.8, 0.8) };
    group.add(hatch);
    App3D.lab.parts.push(hatch);

    // 3. Internal Aluminium C-Bends & Grounding Chassis
    const aluMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.8), aluMat);
    chassis.position.set(0, 0.2, 0);
    chassis.userData = { name: 'Aluminium 6061-T6 Internal C-Bends', explodeOffset: new THREE.Vector3(0, 0.6, -1.0) };
    group.add(chassis);
    App3D.lab.parts.push(chassis);

    // 4. RFID Antenna Scanning Bed
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.5, roughness: 0.2, emissive: 0x004455 });
    const ant = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.4), antennaMat);
    ant.position.set(0, 0.45, 0);
    ant.userData = { name: 'UHF RFID Antenna Array Deck', explodeOffset: new THREE.Vector3(0, 1.2, 0) };
    group.add(ant);
    App3D.lab.parts.push(ant);

    createLabHotspot(new THREE.Vector3(0, 0.9, 1.0), 'Gas Spring Pivot Hinge', 'Engineered with calibrated 50N gas struts and mechanical stoppers for smooth dampened door motion.');
    createLabHotspot(new THREE.Vector3(0, 0.45, 0), 'RF Shielded Antenna Bed', 'Internal conductive coating prevents stray electromagnetic emission into desktop workspace.');
  }

  // D) Heavy Suspension Scale Model
  function buildSuspensionModel(group) {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.25 });
    const axleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.2 });
    const springMat = new THREE.MeshStandardMaterial({ color: 0xff8400, metalness: 0.8, roughness: 0.3 });

    // 1. Central Axle Cylinder
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 4.2, 32), axleMat);
    axle.rotation.z = Math.PI / 2;
    axle.userData = { name: 'Heavy Vehicle Axle Beam', explodeOffset: new THREE.Vector3(0, 0, 0) };
    group.add(axle);
    App3D.lab.parts.push(axle);

    // 2. Parabolic Leaf Spring Packs (Left and Right)
    for (let side of [-1.3, 1.3]) {
      const springGroup = new THREE.Group();
      for (let leaf = 0; leaf < 4; leaf++) {
        const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 2.4 - leaf * 0.4), springMat);
        leafMesh.position.y = 0.28 + leaf * 0.09;
        springGroup.add(leafMesh);
      }
      springGroup.position.x = side;
      springGroup.userData = {
        name: side < 0 ? 'LH Parabolic Leaf Spring Pack' : 'RH Parabolic Leaf Spring Pack',
        explodeOffset: new THREE.Vector3(side * 1.5, 1.2, 0)
      };
      group.add(springGroup);
      App3D.lab.parts.push(springGroup);

      // U-Bolts
      const ubolt = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 24, Math.PI), steelMat);
      ubolt.position.set(side, 0.2, 0);
      ubolt.userData = { name: 'High-Tensile U-Bolt Clamping Kit', explodeOffset: new THREE.Vector3(side * 1.5, -0.8, 0) };
      group.add(ubolt);
      App3D.lab.parts.push(ubolt);
    }

    // 3. Wheel Hub Flanges (Left and Right)
    for (let side of [-2.0, 2.0]) {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 32), steelMat);
      hub.rotation.z = Math.PI / 2;
      hub.position.x = side;
      hub.userData = { name: side < 0 ? 'LH Wheel Hub & Bearings' : 'RH Wheel Hub & Bearings', explodeOffset: new THREE.Vector3(side * 1.4, 0, 0) };
      group.add(hub);
      App3D.lab.parts.push(hub);
    }

    createLabHotspot(new THREE.Vector3(-1.3, 0.6, 0), 'Parabolic Leaf Spring Assembly', 'Calculated camber arch and progressive deflection curves matching 1:5 scale truck suspension load.');
    createLabHotspot(new THREE.Vector3(2.0, 0, 0), 'Precision Machined Wheel Hub', 'Scaled bearing housings engineered according to client tooling and casting tolerances.');
  }

  // =========================================================================
  // 4. LAB HOTSPOT INTERACTION
  // =========================================================================
  function createLabHotspot(position, title, desc) {
    const geo = new THREE.SphereGeometry(0.12, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.userData = { isHotspot: true, title: title, desc: desc };

    // Outer pulsating ring
    const ringGeo = new THREE.RingGeometry(0.16, 0.22, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    mesh.add(ring);

    App3D.lab.currentGroup.add(mesh);
    App3D.lab.hotspots.push(mesh);
  }

  function onCanvasClick(e) {
    const canvas = App3D.lab.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    App3D.lab.mouse.x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    App3D.lab.mouse.y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    App3D.lab.raycaster.setFromCamera(App3D.lab.mouse, App3D.lab.camera);
    const intersects = App3D.lab.raycaster.intersectObjects(App3D.lab.hotspots, true);

    const callout = document.getElementById('hotspotCallout');
    const titleEl = document.getElementById('hotspotTitle');
    const descEl = document.getElementById('hotspotDesc');

    if (intersects.length > 0) {
      let hit = intersects[0].object;
      while (hit.parent && !hit.userData.isHotspot) hit = hit.parent;
      if (hit && hit.userData.isHotspot) {
        if (titleEl) titleEl.textContent = hit.userData.title;
        if (descEl) descEl.textContent = hit.userData.desc;
        if (callout) callout.classList.remove('hidden');
      }
    }
  }

  // Close Hotspot Box
  const closeHotspotBtn = document.getElementById('closeHotspotBtn');
  if (closeHotspotBtn) {
    closeHotspotBtn.addEventListener('click', () => {
      document.getElementById('hotspotCallout').classList.add('hidden');
    });
  }

  // =========================================================================
  // 5. EXPLODED VIEW & RENDER SHADER MODES
  // =========================================================================
  function applyLabExplosion(progress) {
    App3D.lab.parts.forEach((part) => {
      if (!part.userData.explodeOffset) return;
      const offset = part.userData.explodeOffset;
      part.position.set(offset.x * progress, offset.y * progress, offset.z * progress);
    });
  }

  function setLabRenderMode(mode) {
    App3D.lab.renderMode = mode;
    if (!App3D.lab.currentGroup) return;

    App3D.lab.currentGroup.traverse((child) => {
      if (child.isMesh && !child.userData.isHotspot) {
        if (!child.userData.originalMat) {
          child.userData.originalMat = child.material;
        }

        if (mode === 'wire') {
          child.material = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
        } else if (mode === 'xray') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x00a8ff,
            transparent: true,
            opacity: 0.35,
            wireframe: false,
            emissive: 0x004488,
            emissiveIntensity: 0.6
          });
        } else if (mode === 'stress') {
          // FEA Stress Heatmap Simulation
          child.material = new THREE.MeshStandardMaterial({
            color: child.position.y > 0.5 ? 0xef4444 : child.position.y < -0.2 ? 0x3b82f6 : 0x10b981,
            metalness: 0.2,
            roughness: 0.5
          });
        } else {
          // Default Solid
          child.material = child.userData.originalMat;
        }
      }
    });
  }

  // Update UI Specifications in Lab Panel
  function updateLabUI(modelKey) {
    const data = window.PROJECT_DATA[modelKey];
    if (!data) return;

    const codeEl = document.getElementById('labProjectCode');
    const titleEl = document.getElementById('labProjectTitle');
    const summaryEl = document.getElementById('labProjectSummary');
    const matBadge = document.getElementById('labMaterialBadge');
    const modelTitle = document.getElementById('labModelTitle');
    const cadEl = document.getElementById('labSpecCad');
    const materialEl = document.getElementById('labSpecMaterial');
    const mfgEl = document.getElementById('labSpecMfg');
    const capEl = document.getElementById('labSpecCapacity');
    const electEl = document.getElementById('labSpecElectronics');
    const challengeEl = document.getElementById('labChallengeText');

    if (codeEl) codeEl.textContent = data.code;
    if (titleEl) titleEl.textContent = data.title;
    if (summaryEl) summaryEl.textContent = data.summary;
    if (matBadge) matBadge.textContent = data.materialBadge;
    if (modelTitle) modelTitle.textContent = data.title.toUpperCase();
    if (cadEl) cadEl.textContent = data.cadSoftware;
    if (materialEl) materialEl.textContent = data.primaryMaterial;
    if (mfgEl) mfgEl.textContent = data.mfgProcess;
    if (capEl) capEl.textContent = data.capacity;
    if (electEl) electEl.textContent = data.electronics;
    if (challengeEl) challengeEl.textContent = data.challenge;
  }

  // Initialize Scenes on Load
  window.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initLabScene();
  });

})();
