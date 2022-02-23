import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Treasure {
    constructor() {
        this.points = 10
        this.destroyed = false
    }

    async LoadModel(posX, posY, posZ, scale, scene) {
        const source = "../models/treasure/scene.gltf"
        const loader = new GLTFLoader();
        await loader.load(source,  (gltf) => {
                const object = gltf.scene
                object.position.set(posX, posY, posZ)
                object.scale.multiplyScalar(scale)
                scene.add(object)
                this.object = object
            }
        );
    }
}

export {Treasure};