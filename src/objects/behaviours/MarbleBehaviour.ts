import { ArcRotateCamera, Camera, FollowCamera, PhysicsAggregate, PhysicsShapeType, TransformNode, Vector3 } from "@babylonjs/core";
import { GameBehaviour, GameObject, GameWorld } from "../GameObject";

export class MarbleBehaviour implements GameBehaviour{

    filter(object: GameObject): true | string {
        return object.target instanceof TransformNode || "this marble is not a transform node"
    }

    private force = new Vector3(0, 0, 0)

    private cameraTarget = Vector3.Zero()
    private cameraHeight = 0
    declare camera: FollowCamera

    init(world: GameWorld, objects: GameObject[]): void {
        if(objects.length == 0) return

        this.camera = objects[0].target.getScene().activeCamera as FollowCamera



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
        const force = this.force.normalizeToNew().scaleInPlace(100)
        const center = Vector3.Zero()
        let height = 0
        height = 0
        for(const {target} of objects)if(target instanceof TransformNode){
            target.physicsBody.applyForce(force, target.getAbsolutePosition())
            center.addInPlace(target.getAbsolutePosition())
            height += Math.max(target.scaling.x, target.scaling.y, target.scaling.z)
        }
        center.scaleInPlace(1/objects.length)
        height *= 10/objects.length
        this.cameraTarget.copyFrom(center)
        this.cameraHeight = height
    }

    visualTick(world: GameWorld, objects: GameObject[]): void {
        if(this.camera){
            const center = this.cameraTarget.add(this.camera.position).scaleInPlace(0.5)
            this.camera.position.copyFrom(center).addInPlaceFromFloats(0, this.cameraHeight*2, -this.cameraHeight)
            this.camera.rotation.set(Math.PI/3, 0, 0)
        }
    }
    
}