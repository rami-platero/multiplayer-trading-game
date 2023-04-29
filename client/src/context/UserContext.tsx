import * as React from 'react'
import { createContext } from 'react'

export const userContext = createContext({})

interface props {
    children: JSX.Element | JSX.Element[]
}

const userContextProvider = ({children}:props) =>{

    return <userContext.Provider value={{}}>
        {children}
    </userContext.Provider>
}