import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Pirate {
    constructor() {
        this.speed = 0.2
        this.damage = 10
        this.destroyed = false;
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
            }
        );
    }

    Update(target) {
        let dir = target.clone().sub(this.object.position).normalize()
        this.object.position.addScaledVector(dir, this.speed)
        this.object.lookAt(target.x, target.y, target.z)
        this.object.rotation.y -= 3.14/2
    }
}

export {Pirate};