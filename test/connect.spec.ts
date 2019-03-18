import connect from "../src/connect";
import {watch} from "../src/watch";
import {LitElement, html, query, customElement} from "lit-element";
import configureStore from "redux-mock-store";
import * as render from '@skatejs/ssr'
import mount from '@skatejs/bore';
import {h} from '@skatejs/val';
const mockStore = configureStore([])();
const defaultComponentName = "custom-element";
const getComponentName = (nameBase: string) => {
    let counter = 0;
    return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);



interface DefaultTestComponent {
    myProperty: string;
    header: HTMLHeadElement;
}
const propertySelector = jest.fn(() => "Hello from redux state");
const delay = () => new Promise(resolve => setTimeout(resolve, 300));
// @ts-ignore
const createDefaultComponent: (selector?: (state) => any) => DefaultTestComponent & LitElement = (selector = propertySelector) => {
    const componentName = getDefaultComponentName();

    // @ts-ignore
    @customElement(componentName)
    class Component extends connect(mockStore)(LitElement) implements DefaultTestComponent {
        render(){
            return html `<h1 id="header">${this.myProperty}</h1>`
        }
        @watch(selector, {store: mockStore})
        myProperty: string;
        @query("#header") header: any;
    }
    return componentName;
};

describe('connect mixin test suite', () =>{
    afterEach(() => {
        //propertySelector.mockReset();
    });
    it('properties should be set when the component is created', async() =>{
        let componentName = createDefaultComponent();
        const component = mount(`<${componentName}></${componentName}>`).node;
        await delay();
        expect(propertySelector).toBeCalledTimes(1);
        await component.updateComplete;
        expect(component.header.innerText).toBe('Hello from redux state');
    });
});