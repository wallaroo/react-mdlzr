//@flow
import React from "react";
import type {ComponentType} from "react";
import type {Query, Collection, Model} from "mdlzr";
import pick from "lodash.pick";

type PropsBinding = { [string]: Query | Collection | Model }
type PropsBinder = { [string]: any } => PropsBinding

export default function mdlzr <Props:{}>(propsbinding: PropsBinder | PropsBinding | string[]): ComponentType<Props> => ComponentType<Props> {
    return function (InputComponent: ComponentType<Props>): ComponentType<Props> {
        return class Mdlzr extends React.Component<Props,*>{
            static displayName = `Mdlzr(${InputComponent.displayName || InputComponent.name})`;
            state = {};
            _subscriptions = {};
            getPropsBinding(props):PropsBinding{
                if (typeof propsbinding === "function"){
                    return propsbinding(props)
                }else if (Array.isArray(propsbinding)){
                    return pick(props, propsbinding);
                }else{
                    return propsbinding;
                }
            }
            _subscribe(propName:string, propValue){
                this._subscriptions[propName] = propValue.observe((obj)=>{
                    if (obj !== this.state[propName]){
                        this.setState({[propName]:obj});
                    }
                })
            }
            componentWillMount(){
                const propsBinding = this.getPropsBinding(this.props);
                for(const propName of Object.keys(propsBinding)){
                    this._subscribe(propName, propsBinding[propName])
                }
            }
            componentWillReceiveProps(nextProps){
                const propsBinding = this.getPropsBinding(this.props);
                nextProps = this.getPropsBinding(nextProps);
                for(const propName of Object.keys(propsBinding)){
                    if (this.props[propName] !== nextProps[propName]) {
                        this._subscriptions[propName] && this._subscriptions[propName].unsubscribe();
                        this._subscribe(propName, propsBinding[propName]);
                    }
                }
            }
            componentWillUnmount(){
                for(const propName of Object.keys(this._subscriptions)){
                    this._subscriptions[propName].unsubscribe();
                }
            }
            render(){
                return <InputComponent {...this.props} {...this.state}/>
            }
        }
    }
}