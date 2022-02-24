import * as THREE from 'three';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import {Game} from "./js/Game";

let container;
let camera, scene, renderer;
let controls, water, sun;
let game, offset, cameraDirection;

init();
animate();

function init() {
    container = document.getElementById( 'container' );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild( renderer.domElement );

    //

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    offset = new THREE.Vector3(-10, 20, 30)
    cameraDirection = new THREE.Vector3(10, -20, -60)
    camera.position.copy(offset)
    const targ = camera.position.clone().add(cameraDirection)
    camera.lookAt(targ.x, targ.y, targ.z)
    scene.add(camera)

    // sun
    sun = new THREE.Vector3();

    // Water
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    function updateSun() {
        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        scene.environment = pmremGenerator.fromScene( sky ).texture;
    }

    updateSun();

    // GUI

    // const gui = new GUI();
    //
    // const folderSky = gui.addFolder( 'Sky' );
    // folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
    // folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
    // folderSky.open();
    //
    // const waterUniforms = water.material.uniforms;
    //
    // const folderWater = gui.addFolder( 'Water' );
    // folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    // folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
    // folderWater.open();

    //

    game = new Game()
    game.LoadModels(scene)

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1); // soft white light
    scene.add( ambientLight );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    window.addEventListener( 'resize', onWindowResize );
    document.body.addEventListener( 'keydown', onKeyDown, false );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function onKeyDown(event) {
    if(event.key == "ArrowUp") {
        game.player.speed += game.player.acc
    }
    if(event.key == "ArrowDown") {
        game.player.speed -= game.player.acc
        if (game.player.speed < 0)
            game.player.speed = 0
    }
    if(event.key == "ArrowLeft") {
        let axis = new THREE.Vector3(0, 1, 0)
        camera.position.sub(offset)

        game.player.object.rotation.y += game.player.turn
        game.player.direction.applyAxisAngle(axis, game.player.turn)
        offset.applyAxisAngle(axis, game.player.turn)
        cameraDirection.applyAxisAngle(axis, game.player.turn)

        camera.position.add(offset)
        let targ = camera.position.clone().add(cameraDirection)
        camera.lookAt(targ.x, targ.y, targ.z)
    }
    if(event.key == "ArrowRight") {
        let axis = new THREE.Vector3(0, 1, 0)
        camera.position.sub(offset)

        game.player.object.rotation.y -= game.player.turn
        game.player.direction.applyAxisAngle(axis, -game.player.turn)
        offset.applyAxisAngle(axis, -game.player.turn)
        cameraDirection.applyAxisAngle(axis, -game.player.turn)

        camera.position.add(offset)
        let targ = camera.position.clone().add(cameraDirection)
        camera.lookAt(targ.x, targ.y, targ.z)
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    game.Update(camera, offset)
    renderer.render( scene, camera );
}
