import * as THREE from 'three';
import {Game} from "./js/Game";

let camera, scene, renderer, game;

async function init() {
    // Init scene
    scene = new THREE.Scene();

    // Init camera (PerspectiveCamera)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Position camera
    camera.position.x = -3
    camera.position.y = 5
    camera.position.z = 5
    camera.lookAt(0, 0, 0)

    // Init renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set size (whole window)
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Render to canvas element
    document.body.appendChild(renderer.domElement);

    // init game components
    game = new Game()
    await game.LoadModels(scene)
    const light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
    scene.add( light );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    document.body.addEventListener( 'keydown', onKeyDown, false );
}

// Draw the scene every time the screen is refreshed
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function onKeyDown(event) {
    let move = 0.05
    if(event.key == "ArrowUp") {
        game.player.object.position.y += move;
        camera.position.y += move;
    }
    if(event.key == "ArrowDown") {
        game.player.object.position.y -= move;
        camera.position.y -= move;
    }
    if(event.key == "ArrowLeft") {
        game.player.object.position.x -= move;
        camera.position.x -= move;
    }
    if(event.key == "ArrowRight") {
        game.player.object.position.x += move;
        camera.position.x += move;
    }
}

function onWindowResize() {
    // Camera frustum aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    // After making changes to aspect
    camera.updateProjectionMatrix();
    // Reset size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

await init();
animate();
