import { GameBehaviour, GameObject, GameWorld } from "../GameObject";
import { AbstractMesh, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsPrestepType, PhysicsShapeType, TransformNode, VertexBuffer } from "@babylonjs/core";
import { MarbleBehaviour } from "./MarbleBehaviour";

export class KillerBehaviour implements GameBehaviour{

    constructor(
        private players: string
    ){}

    filter(object: GameObject): true | string {
        return object.target instanceof Mesh || "this solid is not a mesh"
    }

    init(world: GameWorld, objects: GameObject[]) { }

    dispose(world: GameWorld, objects: GameObject[]) { }

    tick(world: GameWorld, objects: GameObject[]) {
        for(const killer of objects) {
            const {objects,behaviour} = world.getObjects(this.players)
            if(!(behaviour instanceof MarbleBehaviour))return
            for(const player of objects){
                const p_transform = player.target as TransformNode
                const ch_transform = killer.target as Mesh
                if(ch_transform.getBoundingInfo().intersectsPoint(p_transform.absolutePosition)){
                    behaviour.kill(player)
                }
                
            }
        }
    }

}