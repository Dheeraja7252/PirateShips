import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

class Pirate {
    constructor() {
        this.speed = 0.5
        this.damage = 10
        // this.destroyed = false;
    }

    async LoadModel(posX, posY, posZ, scale, scene) {
        const source = "../models/pirate/scene.gltf"
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
        this.box.setFromObject(this.object)
        let dir = target.clone().sub(this.object.position).normalize()
        this.object.position.addScaledVector(dir, this.speed)
        // this.object.lookAt(target.x, target.y, target.z)
        // this.object.rotation.y -= 3.14/2
        this.helper.update()
    }
}

export {Pirate};