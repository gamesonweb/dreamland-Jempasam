import { ArcRotateCamera, Engine, FollowCamera, HavokPlugin, ImportMeshAsync, Mesh, MeshBuilder, PhysicsAggregate, PhysicsEngine, PhysicsEngineV2, PhysicsMotionType, PhysicsShapeType, Scene, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders"
import HavokPhysics from "@babylonjs/havok"
import { GameManager } from "./objects/GameManager"
import { SolidBehaviour } from "./objects/behaviours/SolidBehaviour"
import { MarbleBehaviour } from "./objects/behaviours/MarbleBehaviour"
import { html } from "sam-lib"


// Ask file
const fileInput = html.a`<input id="file" type="file" accept=".glb" />` as HTMLInputElement

document.body.replaceChildren(fileInput)

const file = await new Promise<File>(resolve=>{
    fileInput.oninput = (e) => {
        resolve(fileInput.files!!.item(0))
    }
})

// Init everything
const canvas = html.a`<canvas id="game" style="width:100%;height:100%;background-color: red;"></canvas>` as HTMLCanvasElement
document.body.replaceChildren(canvas)
const engine = new Engine(canvas)
const scene = new Scene(engine)

const havok = await HavokPhysics()
const havokPlugin = new HavokPlugin(true, havok)
scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin)

const camera = new FollowCamera("camera", Vector3.Zero(), scene)

scene.createDefaultLight()

const manager = new GameManager()
manager.addBehaviour("solid", new SolidBehaviour())
manager.addBehaviour("marble", new MarbleBehaviour())    

const result = (await ImportMeshAsync(file,scene))
const root = result.meshes.find(m=>m.name=="__root__")
//for(const node of result.meshes) manager.loadObjects(node)
//for(const node of result.transformNodes) manager.loadObjects(node)
console.log(root)
manager.loadObjects(root)

// Lifecycle
manager.init()

engine.runRenderLoop(() => {
    manager.visualTick()
    scene.render()
})

setInterval(() => {
    manager.tick()
},50)

manager.dispose()