import { PhysicsAggregate, PhysicsShapeType, TransformNode, Vector3 } from "@babylonjs/core";
import { GameBehaviour, GameObject, GameWorld } from "../GameObject";

export class MarbleBehaviour implements GameBehaviour{

    filter(object: GameObject): true | string {
        return object.target instanceof TransformNode || "this marble is not a transform node"
    }

    private force = new Vector3(0, 0, 0)

    init(world: GameWorld, objects: GameObject[]): void {
        for(const object of objects){
            const node = object.target as TransformNode
            new PhysicsAggregate(node, PhysicsShapeType.SPHERE, {mass:1, restitution:0}, node.getScene())
        }

        window.addEventListener("keydown", (e)=>{
            if(e.repeat) return
            switch (e.key) {
                case "z": this.force.addInPlaceFromFloats(0, 0, -1); break
                case "s": this.force.addInPlaceFromFloats(0, 0, 1); break
                case "q": this.force.addInPlaceFromFloats(1, 0, 0); break
                case "d": this.force.addInPlaceFromFloats(-1, 0, 0); break
                case "x":
                    const 
            }
        })

        window.addEventListener("keyup", (e)=>{
            switch (e.key) {
                case "z": this.force.addInPlaceFromFloats(0, 0, 1); break
                case "s": this.force.addInPlaceFromFloats(0, 0, -1); break
                case "q": this.force.addInPlaceFromFloats(-1, 0, 0); break
                case "d": this.force.addInPlaceFromFloats(1, 0, 0); break
            }
        })
    }

    dispose(world: GameWorld, objects: GameObject[]): void {
    }

    tick(world: GameWorld, objects: GameObject[]): void {
        console.log(this.force)
        const force = this.force.normalizeToNew().scaleInPlace(100)
        for(const {target} of objects)if(target instanceof TransformNode){
            target.physicsBody.applyForce(force, target.getAbsolutePosition())
        }
    }
    
}