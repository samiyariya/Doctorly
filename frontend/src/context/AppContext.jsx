import { createContext } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext()

//AppContextProvider component provides the doctors data to all its child components
const AppContextProvider = (props) => {
    const value = {
        doctors
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider