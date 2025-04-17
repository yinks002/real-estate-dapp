import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAddress, useContract, useMetamask, useContractWrite
    , useContractRead, useContractEvents, getContract,
} from "@thirdweb-dev/react"
import  RealEstateABI  from "./RealEstateABI.json";
// import { defineChain } from "thirdweb/chains";

import {ethers} from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({children}) =>{

    
// const client = createThirdwebClient({
//     // use clientId for client side usage
//     clientId: "9c3aeddf2491d88c58b283f931a63aa1",
//     // use secretKey for server side usage
//     secretKey: "nuo...wmzg", // replace this with full secret key
//   });
    // const client = createThirdwebClient({
    // clientId: "9c3aeddf2491d88c58b283f931a63aa1",
    // });
    //  const contract = getContract({
    //     client,
    //     chain: defineChain(11155111),
    //     address: "0xBC13A93A5EEc494b0fC047323bDe6638C00FC49F",
    //   });
   
    const { contract } = useContract(
        "0xBC13A93A5EEc494b0fC047323bDe6638C00FC49F", 
        RealEstateABI.abi // The pasted ABI array
      );
      
        
    
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
            const data = await updatePrice([address, productId, price])

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
            console.log("parser",parsedProperties)
            return parsedProperties;
           
        } catch (error) {
            console.log("error " , error)
        }
    }

    useEffect(()=>{
        const fetchCont= async()=>{
            const cont= await contract;
           
            getPropertiesData();
            console.log("es", RealEstateABI)
            console.log(Array.isArray(RealEstateABI.abi));
            console.log("contract", cont)
        }
       fetchCont();
    })

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
