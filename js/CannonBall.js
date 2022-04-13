import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

class CannonBall {
    constructor(direction) {
        this.direction = direction.clone()
        this.direction.y -= 0.005
        this.speed = 1
        this.damage = 10
    }

    async LoadModel(posX, posY, posZ, scale, scene) {
        const geometry = new THREE.SphereGeometry( 1, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0x111111 } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(posX, 4, posZ)
        scene.add( sphere );
        this.object = sphere

        this.box = new THREE.Box3();
        this.box.setFromObject(this.object)
    }

    Update() {
        this.object.position.addScaledVector(this.direction, this.speed)
        this.box.setFromObject(this.object)
    }
}

export {CannonBall};