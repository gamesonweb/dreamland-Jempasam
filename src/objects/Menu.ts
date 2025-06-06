import { html } from "sam-lib";


class Menu{

    constructor(private options:{
        title: string,
        root: HTMLElement,
        previous: Menu,
        buttons: {label:string, action:()=>void}[],
    }){

    }

    show(){
        const {title, buttons, root, previous} = this.options
        root.replaceChildren(html`
        
        `)
    }
}