import { ArcRotateCamera, Engine, FollowCamera, HavokPlugin, ImportMeshAsync, Mesh, MeshBuilder, PhysicsAggregate, PhysicsEngine, PhysicsEngineV2, PhysicsMotionType, PhysicsShapeType, Scene, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders"
import HavokPhysics from "@babylonjs/havok"
import { GameManager } from "./objects/GameManager"
import { SolidBehaviour } from "./objects/behaviours/SolidBehaviour"
import { MarbleBehaviour } from "./objects/behaviours/MarbleBehaviour"
import { html } from "sam-lib"
import { Menu } from "./menu/Menu"
import { CheckpointBehaviour } from "./objects/behaviours/CheckpointBehaviour"
import { KillerBehaviour } from "./objects/behaviours/KillerBehaviour"
import { ExitBehaviour } from "./objects/behaviours/ExitBehaviour"

let dispose = async()=>{}
let current_screen = null as any

async function setScreen<T>(screen:(v:T)=>Promise<void>, param?: T){
    await dispose()
    await screen(param)
    current_screen = screen
}

// Ask file
const levels = import.meta.glob("../levels/*.glb",{eager:true, import:"default", query:"?url"}) as Record<string, string>

async function levelMenu(){
    const buttons = [] as any

    for(const [path, url] of Object.entries(levels)){
        const name = path.split("/").pop()?.replace(".glb","") || "Unknown Level"
        buttons.push({
            label: `Start ${name}`,
            action: () => window.location.href = `?level=${name}`
        })
    }

    buttons.push({
        label: "Main Menu",
        action: () => setScreen(mainMenu)
    })

    console.log(buttons)
    const menu = new Menu({
        title: "Select a Level",
        root: document.body,
        previous: null,
        buttons
    })
    menu.show()
}

async function mainMenu(){
    const buttons = [
        { label: "Play", action: ()=>setScreen(levelMenu) },
        { label: "Quit", action: () => window.close() },
    ]

    const menu = new Menu({
        title: "Marble Dream World",
        root: document.body,
        previous: null,
        buttons
    })

    menu.show()
}

async function victoryMenu(options:{level: string, time: number}){
    const buttons = [
        { label: "Restart", action: ()=>setScreen(playLevel,options.level) },
        { label: "Change Level", action: ()=>setScreen(levelMenu) },
        { label: "Main Menu", action: ()=>setScreen(mainMenu) },
    ]

    const menu = new Menu({
        title: `You won the level ${options.level} in ${Math.floor(options.time/20)} seconds !`,
        root: document.body,
        previous: null,
        buttons
    })

    menu.show()
}

async function playLevel(level: string){
    const level_url = levels[`../levels/${level}.glb`] as string
    if(!level_url){
        document.body.replaceChildren(html`<h1>Level not found</h1>`)
        setTimeout(()=>{
            if(current_screen==playLevel) setScreen(mainMenu)
        },5000)
        return
    }


    const canvas = html.a`<canvas id="game" style="width:100%;height:100%;background-color: red;"></canvas>` as HTMLCanvasElement
    document.body.replaceChildren(canvas)
    const engine = new Engine(canvas)
    const scene = new Scene(engine)

    const havok = await HavokPhysics()
    const havokPlugin = new HavokPlugin(true, havok)
    scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin)

    const camera = new FollowCamera("camera", Vector3.Zero(), scene)
    let time = 0

    scene.createDefaultLight()

    const manager = new GameManager()
    manager.addBehaviour("solid", new SolidBehaviour())
    manager.addBehaviour("marble", new MarbleBehaviour())
    manager.addBehaviour("checkpoint", new CheckpointBehaviour("marble"))
    manager.addBehaviour("killer", new KillerBehaviour("marble"))
    manager.addBehaviour("exit", new ExitBehaviour("marble", ()=>{
        setScreen(victoryMenu,{time,level})
    }))

    const result = (await ImportMeshAsync(level_url,scene))
    const root = result.meshes.find(m=>m.name=="__root__")
    manager.loadObjects(root)

    // Lifecycle
    manager.init()

    engine.runRenderLoop(() => {
        manager.visualTick()
        scene.render()
    })

    const interval = setInterval(() => {
        manager.tick()
        time++
    },50)

    manager.dispose()

    // Dispose
    dispose = async () => {
        engine.stopRenderLoop()
        scene.dispose()
        await havokPlugin.dispose()
        engine.dispose()
        canvas.remove()
        clearInterval(interval)
    }
}

{
    const level_name = new URLSearchParams(window.location.search).get("level")
    if(level_name) setScreen(playLevel, level_name)
    else setScreen(mainMenu)
}