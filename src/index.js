//@flow
import React, {Component} from "react";
import type {ComponentType} from "react";
import type {Query, Collection, Model} from "mdlzr";

type PropsBinding = { [string]: Query | Collection | Model }
type PropsBinder = { [string]: any } => PropsBinding

export default function mdlzr(propsbinding: PropsBinder | PropsBinding): ComponentType<any> => ComponentType<any> {
    return function (Component: ComponentType<any>): ComponentType<any> {
        //$FlowFixMe
        return class Mdlzr extends Component<any>{
            static displayName = `Mdlzr(${Component.displayName || Component.name})`;
            state = {};
            _subscriptions = {};
            getPropsBinding(props):PropsBinding{
                if (typeof propsbinding === "function"){
                    return propsbinding(props)
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
                return <Component {...this.props} {...this.state}/>
            }
        }
    }
}