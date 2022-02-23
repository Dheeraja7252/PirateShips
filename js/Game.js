import {Player} from "./Player";
import {Pirate} from "./Pirate";
import {Treasure} from "./Treasure";

class Game {
    constructor() {
        this.player = new Player()
        this.score = 0
        this.health = 100
        this.enemies = new Pirate()
        this.treasures = new Treasure()
    }

    async LoadModels(scene) {
        await this.player.LoadModel(0.01, scene)
        await this.enemies.LoadModel(10, 0, 0, 0.8, scene)
        await this.treasures.LoadModel(-5, 0, 0, 0.01, scene)
    }

    // Update() {
    //     this.player.Update()
    // }
}

export {Game};