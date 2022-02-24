import {Player} from "./Player";
import {Pirate} from "./Pirate";
import {Treasure} from "./Treasure";
import {Vector3} from "three";
import {randFloat} from "three/src/math/MathUtils";

class Game {
    constructor() {
        this.player = new Player()
        this.score = 0
        this.health = 100
        this.pirates = []
        this.treasures = []
    }

    LoadModels(scene) {
        this.player.LoadModel(0.05, scene)
        this.SpawnTreasures(20, new Vector3(0, 0, 0), scene)
        this.SpawnPirates(5, new Vector3(0, 0, 0), scene)
    }

    SpawnTreasures(num, playerPos, scene) {
        while(num > 0) {
            let treasure = new Treasure()
            const dist = randFloat(10, 700)
            const angle = randFloat(0, 6.24)

            treasure.LoadModel(playerPos.x + (Math.sin(angle) * dist), 0, playerPos.z +(Math.cos(angle) * dist), 0.06, scene)
            this.treasures.push(treasure)
            num -= 1
        }
    }

    SpawnPirates(num, playerPos, scene) {
        while(num > 0) {
            let pirate = new Pirate()
            const dist = randFloat(10, 500)
            const angle = randFloat(0, 6.24)

            pirate.LoadModel(playerPos.x + (Math.sin(angle) * dist), 0, playerPos.z +(Math.cos(angle) * dist), 4, scene)
            this.pirates.push(pirate)
            num -= 1
        }
    }

    Update(camera) {
        const time = performance.now() * 0.001;
        if(this.player.object) {
            this.player.object.castShadow = true
            this.player.object.receiveShadow = true

            this.player.Update(camera)
            this.player.object.position.y = Math.sin(time) * 0.7 + 1;
            this.player.object.rotation.z = Math.cos(time*1.1) * 0.05
        }

        this.treasures.forEach( (treasure) => {
            if (treasure.object) {
                treasure.object.castShadow = true
                treasure.object.receiveShadow = true

                treasure.object.position.y = Math.sin(time) * 0.4 - 0.1
                treasure.object.rotation.x = Math.cos(time) * 0.1
                treasure.object.rotation.z = Math.sin(time) * 0.1
            }
        })

        this.pirates.forEach( (pirate) => {
            if (pirate.object) {
                pirate.object.castShadow = true
                pirate.object.receiveShadow = true

                pirate.Update()
                pirate.object.position.y = Math.cos(time) * 0.7;
            }
        })
    }
}

export {Game};