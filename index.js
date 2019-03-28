particlesJS.load("animated", "./particles.json", function() {
    //console.log("particles.js loaded");
  });
  
  class App {
    constructor() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
  
      this.DELTA_TIME = 0;
      this.LAST_TIME = Date.now();
  
      this.scene = new Scene(this.width, this.height);
      this.plane = new Plane();
  
      this.scene.add(this.plane.mesh);
  
      const root = document.body.querySelector(".app");
      root.appendChild(this.scene.renderer.domElement);
  
      this.update = this.update.bind(this);
  
      this.addListeners();
  
      requestAnimationFrame(this.update);
    }
  
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
  
      this.scene.resize(this.width, this.height);
    }
  
    addListeners() {
      window.addEventListener("resize", this.onResize.bind(this));
    }
  
    update() {
      this.DELTA_TIME = Date.now() - this.LAST_TIME;
      this.LAST_TIME = Date.now();
  
      this.plane.update(this.DELTA_TIME);
      this.scene.render();
  
      requestAnimationFrame(this.update);
    }
  }
  
  class Plane {
    constructor() {
      this.size = 3000;
      this.segments = 200;
  
      this.options = new Options();
      this.options.initGUI();
  
      this.uniforms = {
        u_amplitude: { value: this.options.amplitude },
        u_frequency: { value: this.options.frequency },
        u_time: { value: 0.0 },
        fogColor: { type: "c", value: "#002135" },
        fogNear: { type: "f", value: 1 },
        fogFar: { type: "f", value: 1000 }
      };
  
      this.geometry = new THREE.PlaneBufferGeometry(
        this.size,
        this.size,
        this.segments,
        this.segments
      );
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: document.getElementById("planeVS").innerHTML,
        fragmentShader: document.getElementById("planeFS").innerHTML,
        side: THREE.DoubleSide,
        wireframe: true,
        fog: true,
        lights: false
      });
  
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.x = 0;
      this.mesh.position.y = -100;
      this.mesh.position.z = 0;
      this.mesh.rotation.x = 360;
    }
  
    //dt - DELTA_TIME
    update(dt) {
      this.uniforms.u_amplitude.value = this.options.amplitude;
      this.uniforms.u_frequency.value = this.options.frequency;
      this.uniforms.u_time.value += dt / 5500;
    }
  }
  
  class Scene extends THREE.Scene {
    constructor(width, height) {
      super();
  
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.background = "#002135";
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(this.background, 0);
  
      this.fog = new THREE.Fog(this.background, 1, 1000);
  
      this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 100000);
      this.camera.position.x = 0;
      this.camera.position.y = -100;
      this.camera.position.z = 250;
  
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.enabled = false;
    }
  
    render() {
      this.renderer.autoClearColor = true;
      this.renderer.render(this, this.camera);
    }
  
    resize(newWidth, newHeight) {
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize(newWidth, newHeight);
    }
  }
  
  class Options {
    constructor() {
      this.amplitude = 20.0;
      this.frequency = 0.011;
  
      this.gui = new dat.GUI();
    }
  
    initGUI() {
      this.gui.close();
  
      this.gui.add(this, "amplitude", 1.0, 15.0);
      this.gui.add(this, "frequency", 0.01, 0.1);
    }
  }
  
  new App();
  