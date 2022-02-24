import {Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Player {
    constructor() {
        this.direction = new Vector3(0, 0, -1)
        this.speed = 0.01
        this.acc = 0.005
        this.turn = 0.05
    }

    async LoadModel(scale, scene) {
        const source = "../models/ship/scene.gltf"
        const loader = new GLTFLoader();
        await loader.load(source,  (gltf) => {
                const object = gltf.scene
                object.position.set(0, 5, 0)
                object.rotation.y = 3.14
                object.scale.multiplyScalar(scale)
                scene.add(object)
                this.object = object
            }
        );
    }

    Update(camera) {
        if(this.object) {
            this.object.position.addScaledVector(this.direction, this.speed)
            camera.position.addScaledVector(this.direction, this.speed)
        }
    }
}

export {Player};