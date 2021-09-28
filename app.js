import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default class Sketch {
    constructor(options) {
        this.container = options.domElement;
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 );
        this.camera.position.z = 1;
    
        this.scene = new THREE.Scene();
    
    
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        // the pixel to device ratio to save up resources
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild( this.renderer.domElement );
        // to retate our object
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.time = 0;
        this.resize();
        this.addObject();
        // render always last
        this.render();

        //windows resize canvas
        this.setupResize();
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize( this.width, this.height );
        //refix perspect from line 10
        this.camera.aspect =  this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    setupResize(){
        window.addEventListener("resize", this.resize.bind(this))
    }

    addObject() {
        this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.material = new THREE.MeshNormalMaterial();
    
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    render() {
        this.time += 0.05;

        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;
    
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({domElement: document.getElementById('container')});
