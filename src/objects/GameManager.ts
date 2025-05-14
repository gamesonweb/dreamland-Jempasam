import { Node, TransformNode } from "@babylonjs/core";
import { GameBehaviour, GameObject, GameWorld } from "./GameObject";


export class GameManager implements GameWorld{

    private behaviours = new Map<string, GameBehaviour>()

    private objects = new Map<GameBehaviour, GameObject[]>()

    private id_to_object = new Map<string, {behaviour: GameBehaviour, object: GameObject}>()

    constructor(
        private error: (msg: string)=>void = msg=>console.error(msg)
    ){

    }

    getTypes(): string[] {
        return Array.from(this.behaviours.keys())
    }

    getObjects(type: string): { behaviour: GameBehaviour; objects: GameObject[]; } {
        const behaviour = this.behaviours.get(type)
        if(!behaviour){ this.error(`Behaviour ${type} not found`); return { behaviour, objects: [] } }
        const objects = this.objects.get(behaviour)
        if(!objects){ this.error(`Behaviour ${type} has no objects`); return { behaviour, objects: [] } }
        return { behaviour, objects }
        
    }

    getObject(id: string): { behaviour: GameBehaviour; object: GameObject; } {
        const object = this.id_to_object.get(id)
        if(!object){ this.error(`Object ${id} not found`); return { behaviour: null, object: null } }
        return object
    }

    addBehaviour(name:string, behaviour: GameBehaviour){
        this.behaviours.set(name, behaviour)
        this.objects.set(behaviour, [])
    }

    private addObject(target: Node){
        const infos = target.name.split(".",3)
        if(infos.length!=3)return
        const [name, type, parameters_string] = infos
        if(this.id_to_object[name]){ this.error(`Object ${name} already exists, duplicate name`); return }

        const parameters = JSON.parse(parameters_string)
        const object = {name,parameters,target,data:{}} as GameObject

        const behaviour = this.behaviours.get(type)
        if(!behaviour){ this.error(`Behaviour ${type} not found`); return }

        const isOk = behaviour.filter(object)
        if(isOk!==true){ this.error(`Object ${name} of type ${type} is not valid: ${isOk}`); return }

        this.id_to_object.set(name, {behaviour, object})
        this.objects.get(behaviour).push(object)
    }

    loadObjects(roots: Node){
        this.addObject(roots)
        for(const child of roots.getChildren()){
            this.loadObjects(child)
        }
    }

    init(){
        for(const [behaviour, objects] of this.objects.entries()){
            behaviour.init(this, objects)
        }
    }

    tick(){
        for(const [behaviour, objects] of this.objects.entries()){
            behaviour.tick(this, objects)
        }
    }

    visualTick(){
        for(const [behaviour, objects] of this.objects.entries()){
            if(behaviour.visualTick) behaviour.visualTick(this, objects)
        }
    }

    dispose(){
        for(const [behaviour, objects] of this.objects.entries()){
            behaviour.dispose(this, objects)
        }
    }
}