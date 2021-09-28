import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import testTexture from './chibigril.png';

export default class Sketch {
    constructor(options) {
        this.container = options.domElement;
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.camera = new THREE.PerspectiveCamera( 30, this.width / this.height, 10, 1000 );
        this.camera.position.z = 600;

        // webGl units related to the html units (sync dimimensions)
        // (* 180/Math.PI is to convert the angle from radiance to degres)
        // this.geometry = new THREE.PlaneBufferGeometry(350, 350,100,100)
        // the object will have the dimison above 350 x 350
        this.camera.fov = 2 * Math.atan((this.height/2)/600) * 180/Math.PI;

    
        this.scene = new THREE.Scene();
    
    
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
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
        this.geometry = new THREE.PlaneBufferGeometry(350, 350,100,100);
        this.material = new THREE.ShaderMaterial( {
            wireframe: false,
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                uTexture: {value: new THREE.TextureLoader().load(testTexture)}
            },
        
            vertexShader: vertex,
        
            fragmentShader: fragment
        
        } );;
    
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    render() {
        this.time += 0.05;
        // set up the time animation
        this.material.uniforms.time.value = this.time
        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;
    
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({domElement: document.getElementById('container')});
