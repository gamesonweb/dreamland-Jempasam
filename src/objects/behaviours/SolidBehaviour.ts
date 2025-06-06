import { GameBehaviour, GameObject, GameWorld } from "../GameObject";
import { AbstractMesh, Mesh, PhysicsAggregate, PhysicsMotionType, PhysicsPrestepType, PhysicsShapeType } from "@babylonjs/core";

export class SolidBehaviour implements GameBehaviour{

    filter(object: GameObject): true | string {
        return object.target instanceof Mesh || "this solid is not a mesh"
    }

    init(world: GameWorld, objects: GameObject[]) {
        for(const object of objects) {
            const mesh = object.target as Mesh
            const restitution = object.parameters.restitution ?? 0.01
            const isStatic = object.parameters.static ?? true
            const isAnimated = object.parameters.animated ?? false
            const p = new PhysicsAggregate(mesh, PhysicsShapeType.MESH, {mass:1, restitution, mesh}, mesh.getScene())
            if(isStatic) mesh.physicsBody.setMotionType(PhysicsMotionType.STATIC)
            if(isAnimated){
                mesh.physicsBody.setMotionType(PhysicsMotionType.ANIMATED)
                mesh.physicsBody.disablePreStep = false
                mesh.physicsBody.setPrestepType(PhysicsPrestepType.ACTION)
            }
        }
    }

    dispose(world: GameWorld, objects: GameObject[]) {

    }

    tick(world: GameWorld, objects: GameObject[]) {
    }

}