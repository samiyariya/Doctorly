import { createContext } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext()

//AppContextProvider component provides the doctors data to all its child components
const AppContextProvider = (props) => {

    const currencySympol = '৳'

    // we can access this currency symbol in any component
    const value = {
        doctors,
        currencySympol
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider