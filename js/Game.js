import {Player} from "./Player";
import {Pirate} from "./Pirate";
import {Treasure} from "./Treasure";
import {CannonBall} from "./CannonBall";
import {randFloat} from "three/src/math/MathUtils";
import * as THREE from 'three';

class Game {
    constructor() {
        this.player = new Player()
        this.score = 0
        this.health = 100
        this.pirates = []
        this.treasures = []
        this.cannonBalls = []
        this.gameOver = false
        this.turn = 0
        this.acc = 0
        this.fireAtPlayer = 0
        this.clock = new THREE.Clock()
    }

    async LoadModels(scene) {
        await this.player.LoadModel(2, scene)
        await this.SpawnTreasures(20, new THREE.Vector3(0, 0, 0), scene)
        await this.SpawnPirates(5, new THREE.Vector3(0, 0, 0), scene)
    }

    async SpawnTreasures(num, playerPos, scene) {
        while(num > 0) {
            let treasure = new Treasure()
            const dist = randFloat(100, 1000)
            const angle = randFloat(0, 6.24)

            await treasure.LoadModel(playerPos.x + (Math.sin(angle) * dist), 0, playerPos.z +(Math.cos(angle) * dist), 0.06, scene)
            this.treasures.push(treasure)
            num -= 1
        }
    }

    async SpawnPirates(num, playerPos, scene) {
        while(num > 0) {
            let pirate = new Pirate(Math.ceil(this.clock.getElapsedTime()))
            const dist = randFloat(500, 1000)
            const angle = randFloat(0, 6.24)

            await pirate.LoadModel(playerPos.x + (Math.sin(angle) * dist), -1, playerPos.z +(Math.cos(angle) * dist), 4, scene)
            this.pirates.push(pirate)
            num -= 1
        }
    }

    async PlayerFire(scene) {
        console.log("Fire")
        // const target = this.player.object.position.clone().addScaledVector(this.player.direction, 10);
        const cannonBall = new  CannonBall(this.player.direction);
        let start = this.player.object.position.clone();
        start.addScaledVector(this.player.direction, 30)
        await cannonBall.LoadModel(start.x, start.y, start.z, 1, scene)
        if(this.player.speed < 0.5)
            cannonBall.speed = 1.5
        else
            cannonBall.speed = 3 * this.player.speed
        this.cannonBalls.push(cannonBall)
    }

    async PiratesFire(scene) {
        const time = Math.ceil(this.clock.getElapsedTime())
        for(let pirate of this.pirates){
            if(time < pirate.lastFired + 5)
                continue

            let dir = this.player.object.position.clone()
            dir.sub(pirate.object.position).normalize()

            const cannonBall = new  CannonBall(dir);
            let start = pirate.object.position.clone();
            start.addScaledVector(dir, 50)
            await cannonBall.LoadModel(start.x, start.y, start.z, 1, scene)
            if(this.player.speed < 0.5)
                cannonBall.speed = 1
            else
                cannonBall.speed = 2 * this.player.speed
            this.cannonBalls.push(cannonBall)
            pirate.lastFired = time
        }
    }

    Update(camera, scene) {
        this.PiratesFire(scene)

        const time = performance.now() * 0.001;
        if(this.player.object) {
            this.player.Update(camera)
            this.player.object.position.y = Math.sin(time*1.5) * 0.7 + 0.5;
            this.player.object.rotation.z = Math.cos(time*2) * 0.05
        }
        else return

        this.treasures.forEach( (treasure) => {
            if (treasure.object) {
                treasure.object.position.y = Math.sin(time) * 0.4 + 0.2
                treasure.object.rotation.x = Math.cos(time) * 0.1
                treasure.object.rotation.z = Math.sin(time) * 0.1
            }
        })

        this.pirates.forEach( (pirate) => {
            if (pirate.object) {
                pirate.Update(this.player.object.position)
                pirate.object.position.y = Math.cos(time) * 0.7 - 2;
            }
        })

        this.cannonBalls.forEach( (cannonBall) => {
            if(cannonBall.object) {
                cannonBall.Update()
            }
        })

        this.HandleCollisions(scene)

        if(this.pirates.length < 5)
            this.SpawnPirates(2, this.player.object.position, scene)
        if(this.treasures.length < 5)
            this.SpawnTreasures(5, this.player.object.position, scene)
    }

    HandleCollisions(scene) {
        let treasuresRemaining = []
        // collecting treasures
        this.treasures.forEach( (treasure) => {
            if(treasure.object && treasure.box.intersectsBox(this.player.box)) {
                // remove treasure, increase score
                scene.remove(treasure.object)
                this.score += treasure.points
                console.log("collectTreasure, score -> ", this.score)
            }
            else
                treasuresRemaining.push(treasure)
        })
        this.treasures = treasuresRemaining
        // return

        let cannonBallsRemaining = []

        // cannonball collide with player
        this.cannonBalls.forEach( (cannonBall) => {
            if (cannonBall.object && cannonBall.box.intersectsBox(this.player.box)) {
                scene.remove(cannonBall.object);
                console.log("removed")
                this.health -= cannonBall.damage;
            } else
                cannonBallsRemaining.push(cannonBall)
        })
        this.cannonBalls = []
        // return

        // cannonball collide with pirate
        cannonBallsRemaining.forEach( (cannonBall) => {
            let remove = false
            let piratesRemaining = []
            this.pirates.forEach( (pirate) => {
                if(pirate.object && pirate.box.intersectsBox(cannonBall.box)) {
                    scene.remove(pirate.object)
                    remove = true
                    console.log("removed")
                }
                else {
                    piratesRemaining.push(pirate)
                }
            })
            this.pirates = piratesRemaining

            if(remove)
                scene.remove(cannonBall)
            else
                this.cannonBalls.push(cannonBall)
        })

        let piratesRemaining = this.pirates
        this.pirates = []
        // ship collide with player
        piratesRemaining.forEach( (pirate) => {
            if(pirate.object && pirate.box.intersectsBox(this.player.box)) {
                scene.remove(pirate.object)
                // scene.remove(pirate.helper)
                console.log("collide")
                this.health = 0
            }
            else
                this.pirates.push(pirate)
        })

        // console.log("health ", this.health)
        if(this.health <= 0 ) {
            console.log("GAME OVER")
            this.gameOver = true;
            scene.remove(this.player.object)
        }
    }
}

export {Game};