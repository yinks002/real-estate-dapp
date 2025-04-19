import React, {useState, useEffect, useContext, createContext} from 'react';
import {useAddress, useContract, useMetamask, useContractWrite
    , useContractRead, useContractEvents, getContract,
} from "@thirdweb-dev/react"
import  RealEstateABI  from "./RealEstateABI.json";
// import { defineChain } from "thirdweb/chains";

import {ethers} from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({children}) =>{

    

   
    const { contract } = useContract(
        "0xBC13A93A5EEc494b0fC047323bDe6638C00FC49F", 
        RealEstateABI.abi 
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


//buy property
    const {mutateAsync: buyProperty, isLoading: buyPropertyLoading} = useContractWrite(
    contract, "buyProperty"
    );
    const buyPropertyFunction = async (form) =>{
        const {id} = form;
        try {
            const data = await buyProperty({args: [id, address]})
            console.log("bought property successfully", data);
        } catch (error) {
            console.log("buying propery failed", error);
        }
    }
    


    //review section
    //add review
    const {mutateAsync: addReview, isLoading: addReviewLoading} = useContractWrite(
        contract, "addReview"
        );
        const addReviewFunction  = async(form)=>{
          const {productId, rating, comment}  = form;
          try {
            const data =await addReview({
                args: [productId, rating, comment, address],
            });
            console.log("review successfully added", data);
          } catch (error) {
            console.log("error adding review", error);
          }
        }

        //like review
        const {mutateAsync: likeReview, isLoading: likeReviewLoading} = useContractWrite(
            contract, "likeReview"
            );

            const likeReviewFunction = async(form)=>{
                const {productId, reviewIndex} = form;
                try {
                    const data = await likeReview({
                        args: [productId, reviewIndex]
                    })
                    console.log(
                        "successfully liked review", data
                    )
                } catch (error) {
                    console.log("failed to like", error)
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

    //getHighestratedProduct function
    const {data: getHighestratedProduct, isLoading: getHighestratedProductLoading}= useContractRead(
        contract, "getHighestratedProduct"
    );

    //getProductReviews function
        const getProductReviewsFunction = (productId) =>{
            try {
                const {data:getProductReviews, isLoading: getProductReviewsLoading} = useContract(
                     "getProductReviews", [productId]
                );
                return (getProductReviews, getProductReviewsLoading)

            } catch (error) {
                console.log("error fetching data", error)
            }
        }

      //get property function
      
      const getPropertyFunction = (id)=>{
        try {
            const {data: getProperty, isLoading: getPropertyLoading} = useContractRead(
                 'getProperty', [id]
            );
            return (getProperty, getPropertyLoading)
        } catch (error) {
            console.log('error while getting property data', error)
        }
      }

      //get user property function
      const getUserPropertiesFunction = ()=>{
        try {
             const {data: getUserProperties, isLoading: getUserPropertiesLoading} = 
             useContractRead("getUserProperties",[address]);
             return getUserProperties, getUserPropertiesLoading
        } catch (error) {
            console.log("error while getting user property", error)
        }
      }

      //get user review function
      const getUserReviewFunction= ()=>{
          try {
            const {data: getUserReviews, isLoading: getUserReviewsLoading} = useContractRead(
                "getUserReviews", [address]
            );
            return getUserReviews, getUserReviewsLoading;

          } catch (error) {
            console.log("error getting user reviews", error)
          }
      }

      //total property function
      const totalPropertyFunction = ()=>{
        try {
            const {data: totalProperty, isLoading: totalPropertyLoading} = useContractRead(
                contract, 'propertyIndex' 
            )
            return totalProperty, totalPropertyLoading;
        } catch (error) {
            console.log("error fetching total property", error)
        }
      }

      //total reviews
      const totalReviewFunction =()=>{
        try {
            const {data: totalReviewsCount, isLoading: totalReviewsCountLoading} = useContractRead(
                contract, 'reviewsCounter'
            );
            return( totalReviewsCount, totalReviewsCountLoading);

        } catch (error) {
            console.log("error", error)
        }
      }

      //read events data
      const {data: event} = useContractEvents(
        contract, "propertyListed"
      );

      //get all events
      const {data: allEvents} = useContractEvents(contract);
      //set default
      const  {data: eventWithoutListener}= useContractEvents(contract
        , undefined,{
            subscribe: false,
        }
      )
      console.log("events", event)



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
        getPropertiesData, 
        updatePropertyFunction, 
        getUserPropertiesFunction, buyPropertyFunction
        ,updatePriceFunction, 
        getPropertyFunction,
        totalPropertyFunction,
        getUserReviewFunction,
        totalReviewFunction,
        addReviewFunction,
        getProductReviewsFunction,
        likeReviewFunction}}>
            {children}
        </StateContext.Provider>
    )
}



export const useStateContext = ()=> useContext(StateContext);
