import React,{ PropsWithChildren } from "react"
import { View ,Text} from "react-native"


export const CustomText = ({children}:PropsWithChildren)=>{
    return(
      <Text style={{fontSize:20}}>
        {children}
      </Text>
    )
  }