import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAddress, useContract, useMetamask, useContractWrite
    , useContractRead, useContractEvents
} from "@thirdweb-dev/react"
import {ethers} from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({children}) =>{
    const {contract} = useContract("");
    const address = useAddress();
    const connect = useMetamask();
    const realEstate= "Real estate dapp"

    //function------

    //list property function
    const {mutateAsync: listProperty, isLoading, error} = useContractWrite(
        contract, "listProperty"
    );
    const createPropertyFunction = async()=>{
        try {
            const data= await listProperty([
                 
                    address,
                    price,
                    _propertyTitle,
                    _category,
                    _images,
                    _propertyAddress,
                    _description,

                
            ]);
            console.info("contract call successfull", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    return (
        <StateContext.Provider value={{address , connect
        , contract, realEstate, createPropertyFunction}}>
            {children}
        </StateContext.Provider>
    )
}



export const useStateContext = ()=> useContext(StateContext);
