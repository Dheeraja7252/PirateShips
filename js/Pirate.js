import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

class Pirate {
    constructor(time) {
        this.speed = 0.5
        this.damage = 10
        this.lastFired = time
    }

    async LoadModel(posX, posY, posZ, scale, scene) {
        // const source = "../models/pirate/scene.gltf"
        const source = "../models/kenny/Models/glTF format/ship_dark.gltf"
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

    Update(target) {
        let dir = target.clone().sub(this.object.position)
        this.object.position.addScaledVector(dir.normalize(), this.speed)

        let lookAt = this.object.position.clone().sub(dir)
        this.object.lookAt(lookAt.x, lookAt.y, lookAt.z)
        // this.object.rotation.y -= 3.14
        // this.helper.update()
        this.box.setFromObject(this.object)
    }
}

export {Pirate};