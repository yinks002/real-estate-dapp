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
    const createPropertyFunction = async(form)=>{

        const {propertyTitle,
            description,
            category,
            price,
            images,
            propertyAddress
        } = form;
        try {
            const data= await listProperty({
                 args:[
                    address,
                    price,
                    propertyTitle,
                    category,
                    images ,
                    propertyAddress,
                    description,

                 ],

                
        });
            console.info("contract call successfull", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

//update property function
const {mutateAsync: updateProperty, isLoading: updatePropertyLoading} = useContractWrite(
    contract, "updateProperty"
);
    const updatePropertyFunction = async(form) => {
        const {productId, propertyTitle,
            description,
            category,
            images,
            propertyAddress
        } = form;

        try {
            const data= await updateProperty({
                args: [
                    address,productId, propertyTitle,
                        description,
                        category,
                        images,
                        propertyAddress 
                ]
            });
            console.log("contract call successfull", data);

        } catch (error) {
            console.log("errot while updating", error)
        }

    
    }

//update price function
const {mutateAsync: updatePrice, isLoading: updatePriceLoading} = useContractWrite(
    contract, "updatePrice"
);
    const updatePriceFunction = async(form)=>{
        const {productId,price} = form;
        try {
            const data=await updatePrice([address, productId, price])

            console.log("transaction successful", data)
        } catch (error) {
            console.log("transaction fail",error)
        }
    }


    //get properties data section
    const getPropertiesData= async()=>{
        try {
           const properties = await contract.call("getAllProperties");
            const parsedProperties = properties.map((property, i)=> ({
                owner: property.owner,
                title: property.title,
                description: property.description,
                category: property.category,
                price: ethers.utils.formatEther(property.price.toString()),
                productId: property.productID.toNumber(),
                reviewers: property.reviews,
                image: property.images,
                address: property.propertyAddress
            }));
            console.log(properties)
            return parsedProperties;
           
        } catch (error) {
            console.log("error " , error)
        }
    }

    return (
        <StateContext.Provider value={{address , connect
        , contract, realEstate, 
        createPropertyFunction, 
        getPropertiesData, updatePropertyFunction
        ,updatePriceFunction}}>
            {children}
        </StateContext.Provider>
    )
}



export const useStateContext = ()=> useContext(StateContext);
