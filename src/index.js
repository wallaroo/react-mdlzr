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
            getPropsBinding(props):PropsBinding{
                if (typeof propsbinding === "function"){
                    return propsbinding(props)
                }else{
                    return propsbinding;
                }
            }
            componentWillMount(){
                const propsBinding = this.getPropsBinding(this.props);
                for(const propName in propsBinding){
                    const objectToObserve = propsBinding[propName];
                    //TODO observe
                }
            }
            componentWillReceiveProps(next){
                //TODO unsubscibe eventually changed observables
            }
            componentWillUnmount(){
                //TODO unsubscribe all
            }
            render(){
                return <Component {...this.props}/>
            }
        }
    }
}