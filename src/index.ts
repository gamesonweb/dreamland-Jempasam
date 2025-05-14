import { ArcRotateCamera, Engine, HavokPlugin, ImportMeshAsync, Mesh, MeshBuilder, PhysicsAggregate, PhysicsEngine, PhysicsEngineV2, PhysicsMotionType, PhysicsShapeType, Scene, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders"
import test_model from "../asset/model/testi.glb?url"
import HavokPhysics from "@babylonjs/havok"
import { GameManager } from "./objects/GameManager"
import { SolidBehaviour } from "./objects/behaviours/SolidBehaviour"
import { MarbleBehaviour } from "./objects/behaviours/MarbleBehaviour"

// Init everything
const canvas = document.getElementById('game') as HTMLCanvasElement
const engine = new Engine(canvas)
const scene = new Scene(engine)

const havok = await HavokPhysics()
const havokPlugin = new HavokPlugin(true, havok)
scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin)

const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 50, new Vector3(0, 0, 0), scene)
camera.attachControl(canvas, true)

scene.createDefaultLight()

const manager = new GameManager()
manager.addBehaviour("solid", new SolidBehaviour())
manager.addBehaviour("marble", new MarbleBehaviour())    

const result = (await ImportMeshAsync(test_model,scene))
const root = result.meshes.find(m=>m.name=="__root__")
//for(const node of result.meshes) manager.loadObjects(node)
//for(const node of result.transformNodes) manager.loadObjects(node)
console.log(root)
manager.loadObjects(root)

// Lifecycle
manager.init()

engine.runRenderLoop(() => {
    scene.render()
})

setInterval(() => {
    manager.tick()
},50)

manager.dispose()