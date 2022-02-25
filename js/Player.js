import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
// import { OBB } from 'three/examples/jsm/math/OBB';

class Player {
    constructor() {
        this.direction = new THREE.Vector3(0, 0, -1)
        this.speed = 0.5
        this.acc = 0.05
        this.turn = 0.05
    }

    async LoadModel(scale, scene) {
        const source = "../models/ship/scene.gltf"
        const loader = new GLTFLoader();
        await loader.load(source,  (gltf) => {
                gltf.scene.updateMatrixWorld(true)
                const object = gltf.scene
                object.position.set(0, 5, 0)
                object.rotation.y = 3.14
                object.scale.multiplyScalar(scale)
                scene.add(object)
                this.object = object

                this.box = new THREE.Box3();
                this.box.setFromObject(this.object)

                this.helper = new THREE.BoxHelper(this.object)
                // scene.add(this.helper)
            }
        );
    }

    Update(camera) {
        this.object.position.addScaledVector(this.direction, this.speed)
        camera.position.addScaledVector(this.direction, this.speed)
        this.box.setFromObject(this.object)
        this.helper.update()
    }
}

export {Player};