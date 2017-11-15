//@flow
import React from "react";
import type {ComponentType} from "react";

export default function mdlzr():(ComponentType<any>) => ComponentType<any>  {
    return function(Component:ComponentType<any>):ComponentType<any>{
        return (props:any)=> <div></div>
    }
}