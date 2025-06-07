import { GameBehaviour, GameObject, GameWorld } from "../GameObject";
import { AbstractMesh, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsPrestepType, PhysicsShapeType, TransformNode, VertexBuffer } from "@babylonjs/core";
import { MarbleBehaviour } from "./MarbleBehaviour";

export class ExitBehaviour implements GameBehaviour{

    time = 0

    constructor(
        private players: string,
        private on_end: ()=>void,
    ){}

    filter(object: GameObject): true | string {
        return object.target instanceof Mesh || "this solid is not a mesh"
    }

    init(world: GameWorld, objects: GameObject[]) { }

    dispose(world: GameWorld, objects: GameObject[]) { }

    tick(world: GameWorld, objects: GameObject[]) {
        if(this.time>0){
            this.time++
            if(this.time>40){
                this.on_end()
                this.on_end = ()=>{}
            }
        }
        for(const killer of objects) {
            const {objects,behaviour} = world.getObjects(this.players)
            if(!(behaviour instanceof MarbleBehaviour))return
            for(const player of objects){
                const p_transform = player.target as Mesh
                const ch_transform = killer.target as Mesh
                if(ch_transform.getBoundingInfo().intersects(p_transform.getBoundingInfo(),true)){
                    this.time++
                }
                
            }
        }
    }

}