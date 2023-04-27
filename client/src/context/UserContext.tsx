import * as React from 'react'

export const userContext = React.createContext({})

interface props {
    children: JSX.Element | JSX.Element[]
}

const userContextProvider = ({children}:props) =>{

    return <userContext.Provider value={{}}>
        {children}
    </userContext.Provider>
}