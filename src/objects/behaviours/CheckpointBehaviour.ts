import { GameBehaviour, GameObject, GameWorld } from "../GameObject";
import { AbstractMesh, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsPrestepType, PhysicsShapeType, TransformNode, VertexBuffer } from "@babylonjs/core";

export class CheckpointBehaviour implements GameBehaviour{

    constructor(
        private players: string
    ){}

    filter(object: GameObject): true | string {
        return object.target instanceof Mesh || "this solid is not a mesh"
    }

    init(world: GameWorld, objects: GameObject[]) { }

    dispose(world: GameWorld, objects: GameObject[]) { }

    tick(world: GameWorld, objects: GameObject[]) {
        for(const checkpoint of objects) {
            for(const player of world.getObjects(this.players).objects){
                const p_transform = player.target as Mesh
                const ch_transform = checkpoint.target as Mesh
                if(ch_transform.getBoundingInfo().intersects(p_transform.getBoundingInfo(),false)){
                    player.data.spawn_point = ch_transform.absolutePosition.clone()
                }
            }
        }
    }

}