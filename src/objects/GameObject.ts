import { Node, TransformNode } from "@babylonjs/core"


export interface GameObject{
    name: string
    parameters: any
    data: any
    target: Node
}

export interface GameWorld{
    getTypes(): string[]
    getObjects(type: string): {behaviour: GameBehaviour, objects: GameObject[]}
    getObject(id:string) : {behaviour: GameBehaviour, object: GameObject}
}


export interface GameBehaviour{
    filter(object: GameObject): true|string
    init(world: GameWorld, objects: GameObject[]): void
    dispose(world: GameWorld, objects: GameObject[]): void
    tick(world: GameWorld, objects: GameObject[]): void
}