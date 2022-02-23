import {Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Player {
    constructor() {
        this.direction = new Vector3(0, 0, 1)
        this.speed = 0.5
    }

    async LoadModel(scale, scene) {
        const source = "../models/ship/scene.gltf"
        const loader = new GLTFLoader();
        await loader.load(source,  (gltf) => {
                const object = gltf.scene
                object.scale.multiplyScalar(scale)
                scene.add(object)
                this.object = object
            }
        );
    }

    Update() {
        this.object.position.addScaledVector(this.direction, this.speed)
    }
}

export {Player};