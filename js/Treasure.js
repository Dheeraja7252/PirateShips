import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

class Treasure {
    constructor() {
        this.points = 10
        // this.destroyed = false
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

                this.box = new THREE.Box3();
                this.box.setFromObject(this.object)

                this.helper = new THREE.BoxHelper(this.object)
                // scene.add(this.helper)
            }
        );
    }

    Update() {
        this.box.setFromObject(this.object)
        // this.helper.update()
    }

}

export {Treasure};