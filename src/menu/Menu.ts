import { html } from "sam-lib";


export class Menu{

    constructor(private options:{
        title: string,
        root: HTMLElement,
        previous: Menu|null,
        buttons: {label:string, action:()=>void}[],
    }){

    }

    show(){
        const {title, buttons, root, previous} = this.options
        root.replaceChildren(html`
            <div class="menu">
                <h2>${title}</h2>
                <ul>
                ${(function*(){
                    for(const {label, action} of buttons){
                        yield html`<li><button @${{click: ()=>action()}}>${label}</button></li>`
                    }
                    if(previous)yield html`<li><button @${{click: ()=>previous.show()}}>Back</button></li>`
                })()}
                </ul>
            </div>
        `)
    }
}